import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function Step11ShareCapital({ onNext, onPrev, stakeholders = [], onboardingId, initialEquity, initialShareCapital }) {
  const [shareCapital, setShareCapital] = useState(initialShareCapital || 5000);
  const [equity, setEquity] = useState(
    initialEquity && initialEquity.length === stakeholders.length
      ? initialEquity
      : stakeholders.length > 0
        ? stakeholders.map(() => Math.floor(100 / stakeholders.length))
        : [100]
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialShareCapital) setShareCapital(initialShareCapital);
    if (initialEquity && initialEquity.length === stakeholders.length) setEquity(initialEquity);
  }, [initialShareCapital, initialEquity, stakeholders.length]);

  // Ensure total equity is always 100%
  const handleEquityChange = (idx, value) => {
    let updated = [...equity];
    updated[idx] = Number(value);
    setEquity(updated);
  };

  const totalEquity = equity.reduce((a, b) => a + b, 0);
  const isValid = shareCapital >= 5000 && totalEquity === 100;

  const handleContinue = async () => {
    if (!isValid || !onboardingId) return;
    setSaving(true);
    setError('');
    try {
      // Fetch stakeholders from DB to get correct shareholder_id
      const { data: dbStakeholders, error: fetchError } = await supabase
        .from('Shareholder')
        .select('shareholder_id, name, email')
        .eq('onboarding_id', onboardingId);
      if (fetchError) {
        setError('Failed to fetch stakeholders: ' + fetchError.message);
        setSaving(false);
        return;
      }
      // Map equity to correct stakeholders by order (assumes order is preserved)
      for (let idx = 0; idx < dbStakeholders.length; idx++) {
        const s = dbStakeholders[idx];
        const { error: updateError } = await supabase
          .from('Shareholder')
          .update({ share_capital: shareCapital, percentage: equity[idx] })
          .eq('shareholder_id', s.shareholder_id)
          .eq('onboarding_id', onboardingId);
        if (updateError) {
          setError('Failed to save equity distribution for ' + (s.name || `Stakeholder ${idx + 1}`) + ': ' + updateError.message);
          setSaving(false);
          return;
        }
      }
      setSaving(false);
      onNext({ shareCapital, equity });
    } catch (e) {
      setError('Unexpected error: ' + e.message);
      setSaving(false);
    }
  };

  return (
    <div className="step11-sharecapital d-flex vh-100 bg-dark text-white">
      <div className="form-container">
        <div className="card-container" style={{ maxHeight: '90vh', minHeight: '400px', overflowY: 'auto' }}>
          <h2 className="title">Share Capital & Equity Distribution</h2>
          <p className="subtitle">Define your company's share capital and ownership percentages.</p>
          <div className="mb-3">
            <label className="form-label text-white" style={{ fontSize: '0.9rem' }}>Share Capital (AED)</label>
            <input
              type="number"
              className="form-control form-control-sm"
              min={5000}
              value={shareCapital}
              onChange={e => setShareCapital(Number(e.target.value))}
              style={{ fontSize: '0.9rem', padding: '4px 8px', maxWidth: 200 }}
            />
          </div>
          <div className="mb-3">
            <label className="form-label text-white" style={{ fontSize: '0.9rem' }}>Equity Distribution (%)</label>
            {stakeholders.length > 0 ? (
              stakeholders.map((s, idx) => (
                <div key={idx} className="d-flex align-items-center mb-2">
                  <span style={{ minWidth: 100, color: '#fff' }}>{s.name || `Stakeholder ${idx + 1}`}</span>
                  <input
                    type="number"
                    className="form-control form-control-sm ms-2"
                    min={0}
                    max={100}
                    value={equity[idx]}
                    onChange={e => handleEquityChange(idx, e.target.value)}
                    style={{ width: 80, fontSize: '0.9rem', padding: '4px 8px' }}
                  />
                  <span className="ms-1" style={{ color: '#fff' }}>%</span>
                </div>
              ))
            ) : (
              <div>No stakeholders found.</div>
            )}
            <div className="text-end small mt-1">
              <span className={totalEquity === 100 ? 'text-success' : 'text-danger'} style={{ color: '#fff' }}>
                Total: {totalEquity}%
              </span>
            </div>
          </div>
          {error && <div className="text-danger mt-2">{error}</div>}
          <div className="button-group">
            <button className="btn btn-secondary" onClick={onPrev} disabled={saving}>
              Back
            </button>
            <button
              className="btn btn-outline-light fw-semibold"
              disabled={!isValid || saving}
              onClick={handleContinue}
            >
              {saving ? 'Saving...' : 'Continue'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
