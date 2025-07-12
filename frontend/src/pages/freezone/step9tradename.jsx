import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function Step9TradeName({ onNext, onPrev, onboardingId, initialTradeName, initialTradeName2 = '', initialTradeName3 = '' }) {
  const [tradeName, setTradeName] = useState(initialTradeName || '');
  const [tradeName2, setTradeName2] = useState(initialTradeName2 || '');
  const [tradeName3, setTradeName3] = useState(initialTradeName3 || '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [error2, setError2] = useState('');
  const [error3, setError3] = useState('');

  useEffect(() => {
    if (initialTradeName) setTradeName(initialTradeName);
    if (initialTradeName2) setTradeName2(initialTradeName2);
    if (initialTradeName3) setTradeName3(initialTradeName3);
  }, [initialTradeName, initialTradeName2, initialTradeName3]);

  const isValid = tradeName.trim() !== '' && tradeName2.trim() !== '' && tradeName3.trim() !== '';

  // Helper to check trade name uniqueness
  async function checkTradeNameUnique(field, value) {
    const { data: existing, error: checkError } = await supabase
      .from('Onboarding')
      .select('id')
      .ilike(field, value.trim())
      .neq('id', onboardingId);
    if (checkError) return { error: 'Failed to check trade name: ' + checkError.message };
    if (existing && existing.length > 0) return { error: 'This trade name is already taken. Please choose another.' };
    return { error: '' };
  }

  const handleContinue = async () => {
    if (!isValid || !onboardingId) return;
    setSaving(true);
    setError('');
    setError2('');
    setError3('');
    // Check uniqueness for all trade names
    const res1 = await checkTradeNameUnique('trade_name', tradeName);
    const res2 = await checkTradeNameUnique('trade_name2', tradeName2);
    const res3 = await checkTradeNameUnique('trade_name3', tradeName3);
    if (res1.error) { setError(res1.error); setSaving(false); return; }
    if (res2.error) { setError2(res2.error); setSaving(false); return; }
    if (res3.error) { setError3(res3.error); setSaving(false); return; }
    // Update all trade names
    const { error: updateError } = await supabase
      .from('Onboarding')
      .update({ trade_name: tradeName.trim(), trade_name2: tradeName2.trim(), trade_name3: tradeName3.trim() })
      .eq('id', onboardingId);
    setSaving(false);
    if (updateError) {
      setError('Failed to save trade names: ' + updateError.message);
      return;
    }
    onNext({ trade_name: tradeName, trade_name2: tradeName2, trade_name3: tradeName3 });
  };

  return (
    <div className="step9-tradename d-flex vh-100 bg-dark text-white">
      <div className="form-container">
        <div className="card-container">
          <h2 className="title">Trade Names</h2>
          <p className="subtitle">Enter up to three preferred trade names for your company.</p>
          <div className="options-container">
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Trade Name 1"
                value={tradeName}
                onChange={e => setTradeName(e.target.value)}
                maxLength={100}
              />
              {error && <div className="text-danger mt-2">{error}</div>}
            </div>
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Trade Name 2"
                value={tradeName2}
                onChange={e => setTradeName2(e.target.value)}
                maxLength={100}
              />
              {error2 && <div className="text-danger mt-2">{error2}</div>}
            </div>
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Trade Name 3"
                value={tradeName3}
                onChange={e => setTradeName3(e.target.value)}
                maxLength={100}
              />
              {error3 && <div className="text-danger mt-2">{error3}</div>}
            </div>
          </div>
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
