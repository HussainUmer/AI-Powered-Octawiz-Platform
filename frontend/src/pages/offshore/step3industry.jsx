import React, { useState } from 'react';

const industries = [
  'Health & Wellness',
  'Retail / E-commerce',
  'Technology',
  'Trading',
  'Services',
];

export default function Step3Industry({ onNext, onPrev }) {
  const [selectedIndustry, setSelectedIndustry] = useState('');

  return (
    <div className="step3-industry d-flex vh-100 bg-dark text-white">
      {/* <div className="progress-sidebar"></div> */}

      <div className="form-container">
        <div className="card-container">
          <h2 className="title">Industry Selection</h2>
          <p className="subtitle">
            Select the industry that best fits your business.
          </p>

          <div className="options-container">
            {industries.map((industry) => {
              const isSelected = selectedIndustry === industry;
              return (
                <div
                  key={industry}
                  role="button"
                  tabIndex={0}
                  className={`option-card ${isSelected ? 'selected' : ''}`}
                  onClick={() => setSelectedIndustry(industry)}
                  onKeyDown={e => e.key === 'Enter' && setSelectedIndustry(industry)}
                >
                  {industry}
                </div>
              );
            })}
          </div>

          <div className="button-group">
            <button className="btn btn-secondary" onClick={onPrev}>
              Back
            </button>
            <button
              className="btn btn-outline-light fw-semibold"
              disabled={!selectedIndustry}
              onClick={() => onNext({ industry: selectedIndustry })}
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
