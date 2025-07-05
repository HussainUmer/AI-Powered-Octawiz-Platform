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
