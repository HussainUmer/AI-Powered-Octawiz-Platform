import React from 'react';

const jurisdictions = ['RAK ICC', 'JAFZA Offshore', 'Ajman Offshore'];

export default function Step1BusinessName({ formData, updateField, onNext }) {
  const isValid = formData.jurisdiction && formData.companyName.trim();

  return (
    <>
      <h1 className="form-title">Business Name</h1>
      <p className="form-subtitle">Enter your proposed business name and select jurisdiction</p>
      
      <div className="form-group">
        <label className="section-title">Select Jurisdiction</label>
        <div className="options-grid">
          {jurisdictions.map((jur) => (
            <div 
              key={jur}
              className={`option-card ${formData.jurisdiction === jur ? 'option-card--selected' : ''}`}
              onClick={() => updateField('jurisdiction', jur)}
            >
              <div className="option-content">
                {jur}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="form-group">
        <label className="section-title">Company Name</label>
        <input
          type="text"
          className="form-input"
          value={formData.companyName}
          onChange={(e) => updateField('companyName', e.target.value)}
          placeholder="e.g., Global Holdings Ltd"
        />
      </div>

      <div className="buttons-stack">
        <button 
          className="form-btn continue-btn" 
          onClick={onNext}
          disabled={!isValid}
        >
          Continue
        </button>
      </div>
    </>
  );
}