// src/pages/Offshore/Step1BusinessName.jsx
import React, { useState } from 'react';

const jurisdictions = [
  {
    id: 'RAK ICC',
    label: 'RAK ICC',
    description:
      'Cost-efficient setup for holding companies and asset protection. Zero corporate tax, minimal requirements, and strong confidentiality rules.',
    learnMoreUrl: 'https://www.rakicc.com/',
  },
  {
    id: 'JAFZA Offshore',
    label: 'JAFZA Offshore',
    description:
      'Best if you need world-class logistics infrastructure (port, airport), 100% foreign ownership, and no income tax—ideal for trading and shipping businesses.',
    learnMoreUrl: 'https://www.jafza.ae/',
  },
  {
    id: 'Ajman Offshore',
    label: 'Ajman Offshore',
    description:
      'Ultra-low setup costs and no minimum capital requirement, with robust privacy for shareholders.',
    learnMoreUrl: 'https://afz.gov.ae/en.html',
  },
];

export default function Step1BusinessName({ formData, updateField, onNext }) {
  const [hovered, setHovered] = useState(null);

  const isValid =
    formData.jurisdiction.trim() !== '' && formData.companyName.trim() !== '';

  return (
    <div className="offshore-root">
      <div className="form-card">
        <h1 className="form-title">Step 1: Business Name & Jurisdiction</h1>
        <p className="form-subtitle">
          Enter your proposed business name and select a jurisdiction.
        </p>

        <div className="form-group">
          <h2 className="section-title">Select Jurisdiction</h2>
          <div className="options-grid">
            {jurisdictions.map((jur) => (
              <div
                key={jur.id}
                className={`option-card ${
                  formData.jurisdiction === jur.id ? 'option-card--selected' : ''
                }`}
                onClick={() => updateField('jurisdiction', jur.id)}
                onMouseEnter={() => setHovered(jur.id)}
                onMouseLeave={() => setHovered(null)}
              >
                {/* Label */}
                <div>{jur.label}</div>

                {/* Learn More (clickable) */}
                <div
                  className="learn-more"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(jur.learnMoreUrl, '_blank');
                  }}
                >
                  Learn More
                </div>

                {/* Hover Tooltip */}
                {hovered === jur.id && (
                  <div className="tooltip">
                    {jur.description}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="form-group">
          <h2 className="section-title">Proposed Company Name</h2>
          <input
            type="text"
            name="companyName"
            value={formData.companyName}
            onChange={(e) => updateField('companyName', e.target.value)}
            className="form-input"
            placeholder="e.g., Clear Holdings Limited"
          />
        </div>

        <div className="form-group">
          <button
            type="button"
            className="submit-btn"
            disabled={!isValid}
            onClick={onNext}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
