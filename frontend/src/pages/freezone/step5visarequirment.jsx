import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const visaOptions = [
  { id: '0', label: '0 (No visa needed)' },
  { id: '1', label: '1' },
  { id: '2-5', label: '2–5' },
  { id: '6+', label: '6+' },
];

export default function Step5VisaRequirement({ onNext, onPrev, onboardingId, selectedVisaRequirement }) {
  const [selectedVisa, setSelectedVisa] = useState(selectedVisaRequirement || '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (selectedVisaRequirement) setSelectedVisa(selectedVisaRequirement);
  }, [selectedVisaRequirement]);

  const handleVisaSelection = (visa) => {
    setSelectedVisa(visa);
  };

  const handleContinue = async () => {
    if (!selectedVisa || !onboardingId) return;
    setSaving(true);
    setError('');
    const { error: updateError } = await supabase
      .from('Onboarding')
      .update({ visa_requirement: selectedVisa })
      .eq('id', onboardingId);
    setSaving(false);
    if (updateError) {
      setError('Failed to save visa requirement: ' + updateError.message);
      return;
    }
    onNext({ visa_requirement: selectedVisa });
  };

  return (
    <div className="step5-visa-requirement d-flex vh-100 bg-dark text-white">
      <div className="form-container">
        <div className="card-container">
          <h2 className="title">Visa Requirement</h2>
          <p className="subtitle">
            Select the number of visas required for your business.
          </p>
          <div className="options-container">
            {visaOptions.map((option) => (
              <div
                key={option.id}
                className={`option-card ${selectedVisa === option.id ? 'selected' : ''}`}
                onClick={() => handleVisaSelection(option.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && handleVisaSelection(option.id)}
              >
                <input
                  type="radio"
                  checked={selectedVisa === option.id}
                  onChange={() => handleVisaSelection(option.id)}
                  id={option.id}
                  name="visa"
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
              disabled={!selectedVisa || saving}
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
