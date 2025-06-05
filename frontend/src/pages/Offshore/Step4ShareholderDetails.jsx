import React from 'react';

export default function Step4ShareholderDetails({ formData, updateField, onNext, onBack }) {
  const isValid = Number(formData.shareholders) >= 1;

  return (
    <>
      <h1 className="form-title">Shareholder Details</h1>
      <p className="form-subtitle">Specify the number of shareholders</p>

      <div className="form-group">
        <label className="section-title">Number of Shareholders</label>
        <input
          type="number"
          className="form-input"
          min="1"
          value={formData.shareholders}
          onChange={(e) => updateField('shareholders', e.target.value)}
          placeholder="Minimum 1"
        />
      </div>

      <div className="buttons-stack">
        <button className="form-btn" onClick={onBack}>
          Back
        </button>
        <button 
          className="form-btn" 
          onClick={onNext}
          disabled={!isValid}
        >
          Continue
        </button>
      </div>
    </>
  );
}