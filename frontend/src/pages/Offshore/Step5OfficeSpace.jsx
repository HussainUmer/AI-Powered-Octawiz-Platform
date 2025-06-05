import React from 'react';

export default function Step5OfficeSpace({ formData, updateField, onNext, onBack }) {
  const isValid = formData.officeAddress && formData.officeSize;

  return (
    <>
      <h1 className="form-title">Office Space</h1>
      <p className="form-subtitle">Provide your registered office details</p>

      <div className="form-group">
        <label className="section-title">Office Address</label>
        <input
          type="text"
          className="form-input"
          value={formData.officeAddress}
          onChange={(e) => updateField('officeAddress', e.target.value)}
          placeholder="e.g., Office 101, Business Tower, Dubai"
        />
      </div>

      <div className="form-group">
        <label className="section-title">Office Size (sq ft)</label>
        <input
          type="text"
          className="form-input"
          value={formData.officeSize}
          onChange={(e) => updateField('officeSize', e.target.value)}
          placeholder="e.g., 800"
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