import React, { useState } from 'react';

const ownershipOptions = [
  { id: 'fze', label: 'Single Owner (FZE)' },
  { id: 'fzco', label: 'Multiple Owners (FZCO)' },
  { id: 'branch', label: 'Branch of foreign company' },
];

export default function Step7Ownership({ onNext, onPrev }) {
  const [selectedOwnership, setSelectedOwnership] = useState('');

  const handleOwnershipSelection = (ownership) => {
    setSelectedOwnership(ownership);
  };

  return (
    <div className="step7-ownership d-flex vh-100 bg-dark text-white">
      <div className="form-container">
        <div className="card-container">
          <h2 className="title">Ownership Structure</h2>
          <p className="subtitle">
            Select the type of ownership for your business.
          </p>
          <div className="options-container">
            {ownershipOptions.map((option) => (
              <div
                key={option.id}
                className={`option-card ${selectedOwnership === option.id ? 'selected' : ''}`}
                onClick={() => handleOwnershipSelection(option.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && handleOwnershipSelection(option.id)}
                style={{ marginBottom: '1rem' }}
              >
                <input
                  type="radio"
                  checked={selectedOwnership === option.id}
                  onChange={() => handleOwnershipSelection(option.id)}
                  id={option.id}
                  name="ownership"
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
              disabled={!selectedOwnership}
              onClick={() => onNext({ ownership: selectedOwnership })}
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
