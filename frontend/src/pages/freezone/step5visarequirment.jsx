import React, { useState } from 'react';

const visaOptions = [
  { id: '0', label: '0 (No visa needed)' },
  { id: '1', label: '1' },
  { id: '2-5', label: '2–5' },
  { id: '6+', label: '6+' },
];

export default function Step5VisaRequirement({ onNext, onPrev }) {
  const [selectedVisa, setSelectedVisa] = useState('');

  const handleVisaSelection = (visa) => {
    setSelectedVisa(visa);
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

          <div className="button-group">
            <button className="btn btn-secondary" onClick={onPrev}>
              Back
            </button>
            <button
              className="btn btn-outline-light fw-semibold"
              disabled={!selectedVisa}
              onClick={() => onNext({ visaRequirement: selectedVisa })}
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
