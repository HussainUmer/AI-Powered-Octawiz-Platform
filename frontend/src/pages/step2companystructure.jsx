// src/pages/step2companystructure.jsx

import React, { useState } from 'react';

const companyStructures = [
  { id: 'freezone-standard', label: 'Standard Freezone', description: 'Full ownership, tax benefits & business incentives.' },
  { id: 'freezone-premium',  label: 'Premium Freezone',  description: 'Enhanced incentives & additional services.' },
];

export default function Step2CompanyStructure({ onNext, onPrev }) {
  const [selected, setSelected] = useState('');

  return (
    <div className="step2-company-structure d-flex vh-100 bg-dark text-white">
      <div className="form-container">
        <div className="card-container">
          <h2 className="title">Company Structure</h2>
          <p className="subtitle">
            Choose the Freezone entity type that’s right for your business.
          </p>

          <div className="options-container">
            {companyStructures.map(({ id, label, description }) => (
              <div
                key={id}
                role="button"
                tabIndex={0}
                className={`option-card ${selected === id ? 'selected' : ''}`}
                onClick={() => setSelected(id)}
                onKeyDown={e => e.key === 'Enter' && setSelected(id)}
              >
                <div className="option-label">{label}</div>
                <small className="option-description">{description}</small>
              </div>
            ))}
          </div>

          <div className="button-group">
            <button className="btn btn-secondary" onClick={onPrev}>
              Back
            </button>
            <button
              className="btn btn-outline-light fw-semibold"
              disabled={!selected}
              onClick={() => onNext({ companyStructure: selected })}
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
