import React from 'react';

export default function Step3BusinessActivities({ formData, updateField, onNext, onBack }) {
  const isValid = formData.businessActivities.trim().length > 0;

  return (
    <>
      <h1 className="form-title">Business Activities</h1>
      <p className="form-subtitle">Describe your company's main business activities</p>

      <div className="form-group">
        <label className="section-title">Activities Description</label>
        <textarea
          className="form-input"
          rows={5}
          value={formData.businessActivities}
          onChange={(e) => updateField('businessActivities', e.target.value)}
          placeholder="e.g., International trading, investment holding, consultancy services"
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