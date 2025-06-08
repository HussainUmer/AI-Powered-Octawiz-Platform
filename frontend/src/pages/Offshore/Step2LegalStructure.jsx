import React from 'react';

const structures = [
  'Holding Company',
  'Trading Company',
  'Consultancy',
  'Other'
];

export default function Step2LegalStructure({ formData, updateField, onNext, onBack }) {
  const isValid = formData.structure;

  return (
    <>
      <h1 className="form-title">Legal Structure</h1>
      <p className="form-subtitle">Select the legal structure for your offshore company</p>

      <div className="form-group">
        <label className="section-title">Company Structure</label>
        <div className="options-grid--2x2">
          {structures.map(structure => (
            <div
              key={structure}
              className={`option-card ${formData.structure === structure ? 'option-card--selected' : ''}`}
              onClick={() => updateField('structure', structure)}
            >
              {structure}
            </div>
          ))}
        </div>
      </div>


      <div className="buttons-stack">
        <button className="form-btn back-btn" onClick={onBack}>
          Back
        </button>
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