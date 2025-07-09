import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function Step9TradeName({ onNext, onPrev, onboardingId, initialTradeName }) {
  const [tradeName, setTradeName] = useState(initialTradeName || '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialTradeName) setTradeName(initialTradeName);
  }, [initialTradeName]);

  const isValid = tradeName.trim() !== '';

  const handleContinue = async () => {
    if (!tradeName.trim() || !onboardingId) return;
    setSaving(true);
    setError('');
    // Check if trade name already exists (case-insensitive), but ignore current onboardingId
    const { data: existing, error: checkError } = await supabase
      .from('Onboarding')
      .select('id')
      .ilike('trade_name', tradeName.trim())
      .neq('id', onboardingId);
    if (checkError) {
      setSaving(false);
      setError('Failed to check trade name: ' + checkError.message);
      return;
    }
    if (existing && existing.length > 0) {
      setSaving(false);
      setError('This trade name is already taken. Please choose another.');
      return;
    }
    const { error: updateError } = await supabase
      .from('Onboarding')
      .update({ trade_name: tradeName.trim() })
      .eq('id', onboardingId);
    setSaving(false);
    if (updateError) {
      setError('Failed to save trade name: ' + updateError.message);
      return;
    }
    onNext({ trade_name: tradeName });
  };

  return (
    <div className="step9-tradename d-flex vh-100 bg-dark text-white">
      <div className="form-container">
        <div className="card-container">
          <h2 className="title">Trade Name</h2>
          <p className="subtitle">Enter your preferred trade name for your company.</p>
          <div className="options-container">
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Trade Name"
                value={tradeName}
                onChange={e => setTradeName(e.target.value)}
                maxLength={100}
              />
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

// UAE Freezone Trade Name Guidelines:
// - Must not duplicate an existing company name in the UAE.
// - Should not violate public morals or order.
// - Must not contain religious, political, or military terms.
// - Should reflect the business activity (if possible).
// - Must not include names of countries or governments.
// - Should not use abbreviations or initials (unless allowed by the authority).
// - Must not include “bank,” “insurance,” or similar regulated terms unless licensed.
