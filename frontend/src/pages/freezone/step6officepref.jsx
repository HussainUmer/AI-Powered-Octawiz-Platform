import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const officePreferences = [
  { id: 'no-office', label: 'No office needed' },
  { id: 'flexi-desk', label: 'Flexi Desk' },
  { id: 'private-office', label: 'Private Office' },
];

export default function Step6OfficePreference({ onNext, onPrev, onboardingId, selectedOfficeType }) {
  const [selectedOffice, setSelectedOffice] = useState(selectedOfficeType || '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (selectedOfficeType) setSelectedOffice(selectedOfficeType);
  }, [selectedOfficeType]);

  const handleOfficeSelection = (office) => {
    setSelectedOffice(office);
  };

  const handleContinue = async () => {
    if (!selectedOffice || !onboardingId) return;
    setSaving(true);
    setError('');
    const { error: updateError } = await supabase
      .from('Onboarding')
      .update({ office_type: selectedOffice })
      .eq('id', onboardingId);
    setSaving(false);
    if (updateError) {
      setError('Failed to save office preference: ' + updateError.message);
      return;
    }
    onNext({ office_type: selectedOffice });
  };

  return (
    <div className="step7-office-preference d-flex vh-100 bg-dark text-white">
      <div className="progress-sidebar"></div>

      <div className="form-container">
        <div className="card-container">
          <h2 className="title">Office Preference</h2>
          <p className="subtitle">
            Select your preferred office setup for the business.
          </p>

          <div className="options-container">
            {officePreferences.map((option) => (
              <div
                key={option.id}
                className={`option-card ${selectedOffice === option.id ? 'selected' : ''}`}
                onClick={() => handleOfficeSelection(option.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && handleOfficeSelection(option.id)}
              >
                <input
                  type="radio"
                  checked={selectedOffice === option.id}
                  onChange={() => handleOfficeSelection(option.id)}
                  id={option.id}
                  name="office"
                  className="option-radio"
                />
                <label htmlFor={option.id} className="ms-2">{option.label}</label>
              </div>
            ))}
          </div>
          {error && <div className="text-danger mt-2">{error}</div>}
          <div className="button-group">
            <button className="btn btn-secondary" onClick={onPrev} disabled={saving}>
              Back
            </button>
            <button
              className="btn btn-outline-light fw-semibold"
              disabled={!selectedOffice || saving}
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
