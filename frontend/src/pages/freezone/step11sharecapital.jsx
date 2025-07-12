import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function Step11ShareCapital({ onNext, onPrev, stakeholders = [], onboardingId, initialEquity, initialShareCapital }) {
  const MAX_SHARE_CAPITAL = 100000;
  // Use onboarding table columns for share capital, value per share, and total shares
  // Only use 5000 and 10 as defaults if DB values are null
  const [shareCapital, setShareCapital] = useState(initialShareCapital != null ? initialShareCapital : 5000);
  const [valuePerShare, setValuePerShare] = useState(stakeholders[0]?.value_per_share != null ? stakeholders[0].value_per_share : 10);
  // Always calculate totalShares dynamically
  const totalShares = Math.floor(shareCapital / valuePerShare);
  // Always calculate shares per stakeholder based on percentage and total shares
  const [percentages, setPercentages] = useState(
    stakeholders.length > 0 ? stakeholders.map(s => s.percentage || 0) : [100]
  );
  const shares = percentages.map(p => Math.round((p / 100) * totalShares));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setPercentages(stakeholders.length > 0 ? stakeholders.map(s => s.percentage || 0) : [100]);
  }, [totalShares, stakeholders.length, stakeholders]);

  // Handle shares change per stakeholder
  // Handle percentage change per stakeholder
  const handlePercentageChange = (idx, value) => {
    let updated = [...percentages];
    updated[idx] = Number(value);
    setPercentages(updated);
  };

  // Calculate percentage and share_capital per stakeholder
  const enrichedStakeholders = percentages.map((p, idx) => {
    const s = Math.round((p / 100) * totalShares);
    return {
      shares: s,
      percentage: p,
      share_capital: Number.isFinite(Number(s)) && Number.isFinite(Number(valuePerShare)) ? s * valuePerShare : 0,
      name: stakeholders[idx]?.name || `Stakeholder ${idx + 1}`,
      shareholder_id: stakeholders[idx]?.shareholder_id
    };
  });

  // Removed duplicate declaration of totalSharesSum
  const totalCapitalSum = enrichedStakeholders.reduce((a, b) => a + b.share_capital, 0);
  const totalSharesSum = enrichedStakeholders.reduce((a, b) => a + b.shares, 0);
  const isValid = shareCapital >= 5000 && valuePerShare >= 10 && totalSharesSum === totalShares && totalCapitalSum === shareCapital;
  // Validation helpers (must be after percentages and derived values)
  const totalPercentage = percentages.reduce((a, b) => a + b, 0);
  const percentageError = totalPercentage > 100;
  const sharesError = totalSharesSum > totalShares;
  const capitalError = totalCapitalSum > shareCapital;
  const shareCapitalError = shareCapital > MAX_SHARE_CAPITAL;
  const showWarning = percentageError || sharesError || capitalError || shareCapitalError;

  const handleContinue = async () => {
    if (!isValid || !onboardingId || shareCapital > MAX_SHARE_CAPITAL) {
      setError('Share Capital cannot exceed 100,000 AED.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      // Update onboarding with new fields
      const { error: onboardingError } = await supabase
        .from('Onboarding')
        .update({
          total_share_capital: shareCapital,
          value_per_share: valuePerShare,
          total_shares: totalShares
        })
        .eq('id', onboardingId);
      if (onboardingError) {
        setError('Failed to update onboarding: ' + onboardingError.message);
        setSaving(false);
        return;
      }
      // Update each stakeholder with user-entered values
      for (let idx = 0; idx < enrichedStakeholders.length; idx++) {
        const s = enrichedStakeholders[idx];
        if (!s.shareholder_id) {
          console.warn('Missing shareholder_id for:', s);
          continue;
        }
        const { data: updateData, error: updateError } = await supabase
          .from('Shareholder')
          .update({
            shares: s.shares,
            percentage: s.percentage,
            share_capital: s.share_capital
          })
          .eq('shareholder_id', s.shareholder_id)
          .eq('onboarding_id', onboardingId);
        if (updateError) {
          setError('Failed to save equity for ' + s.name + ': ' + updateError.message);
          setSaving(false);
          return;
        }
      }
      setSaving(false);
      onNext({ shareCapital, valuePerShare, totalShares, enrichedStakeholders });
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
          <p className="subtitle">Define your company's share capital, value per share, and ownership breakdown.</p>
          <div className="mb-3">
            <label className="form-label text-white" style={{ fontSize: '0.9rem' }}>Share Capital (AED)</label>
            <input
              type="number"
              className="form-control form-control-sm"
              min={5000}
              max={MAX_SHARE_CAPITAL}
              value={shareCapital}
              onChange={e => {
                let val = Number(e.target.value);
                if (val > MAX_SHARE_CAPITAL) val = MAX_SHARE_CAPITAL;
                setShareCapital(val);
              }}
              style={{ fontSize: '0.9rem', padding: '4px 8px', maxWidth: 200 }}
            />
            {shareCapital > MAX_SHARE_CAPITAL && (
              <div className="text-danger mt-1">Share Capital cannot exceed 100,000 AED.</div>
            )}
            {shareCapital === MAX_SHARE_CAPITAL && (
              <div className="text-warning mt-1">You have reached the maximum allowed share capital (100,000 AED).</div>
            )}
          </div>
          <div className="mb-3">
            <label className="form-label text-white" style={{ fontSize: '0.9rem' }}>Value per Share (AED, min 10)</label>
            <input
              type="number"
              className="form-control form-control-sm"
              min={10}
              value={valuePerShare}
              onChange={e => setValuePerShare(Number(e.target.value))}
              style={{ fontSize: '0.9rem', padding: '4px 8px', maxWidth: 200 }}
            />
          </div>
          <div className="mb-3">
            <label className="form-label text-white" style={{ fontSize: '0.9rem' }}>Total Shares</label>
            <input
              type="number"
              className="form-control form-control-sm"
              value={totalShares}
              readOnly
              style={{ fontSize: '0.9rem', padding: '4px 8px', maxWidth: 200, background: '#222', color: '#fff' }}
            />
          </div>
          <div className="mb-3">
            <label className="form-label text-white" style={{ fontSize: '0.9rem' }}>Shares per Stakeholder</label>
            {stakeholders.length > 0 ? (
              stakeholders.map((s, idx) => (
                <div key={idx} className="d-flex align-items-center mb-2">
                  <span style={{ minWidth: 100, color: '#fff' }}>{s.name || `Stakeholder ${idx + 1}`}</span>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <input
                      type="number"
                      className="form-control form-control-sm ms-2"
                      min={0}
                      max={100}
                      value={enrichedStakeholders[idx].percentage}
                      onChange={e => handlePercentageChange(idx, e.target.value)}
                      style={{ width: 80, fontSize: '0.9rem', padding: '4px 8px' }}
                    />
                    <span style={{ marginLeft: 4, color: '#fff', fontSize: '1rem' }}>%</span>
                  </div>
                  <span className="ms-2" style={{ color: '#fff' }}>
                    {enrichedStakeholders[idx].shares} shares ({enrichedStakeholders[idx].share_capital} AED)
                  </span>
                </div>
              ))
            ) : (
              <div>No stakeholders found.</div>
            )}
            {showWarning && (
              <div className="text-warning mt-2">
                {percentageError && <div>Total percentage exceeds 100%.</div>}
                {sharesError && <div>Total shares assigned ({totalSharesSum}) exceeds available shares ({totalShares}).</div>}
                {capitalError && <div>Total share capital assigned ({totalCapitalSum} AED) exceeds available capital ({shareCapital} AED).</div>}
              </div>
            )}
            <div className="text-end small mt-1">
              <span className={isValid ? 'text-success' : 'text-danger'} style={{ color: '#fff' }}>
                Total Shares Assigned: {totalSharesSum} / {totalShares} | Total Capital: {totalCapitalSum} / {shareCapital} AED
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
