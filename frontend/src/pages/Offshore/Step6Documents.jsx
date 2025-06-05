import React, { useState } from 'react';

export default function Step6Documents({ formData, updateField, onNext, onBack }) {
  const [uploading, setUploading] = useState(false);
  const isValid = formData.passport && formData.addressProof;

  const handleFileChange = (field, e) => {
    updateField(field, e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isValid) return;
    setUploading(true);
    setTimeout(() => {
      setUploading(false);
      onNext();
    }, 1500);
  };

  return (
    <>
      <h1 className="form-title">Document Upload</h1>
      <p className="form-subtitle">Upload required documents for verification</p>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="section-title">Passport Copy*</label>
          <input
            type="file"
            className="form-input"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={(e) => handleFileChange('passport', e)}
            required
          />
          {formData.passport && (
            <p className="file-info">Selected: {formData.passport.name}</p>
          )}
        </div>

        <div className="form-group">
          <label className="section-title">Proof of Address*</label>
          <input
            type="file"
            className="form-input"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={(e) => handleFileChange('addressProof', e)}
            required
          />
          {formData.addressProof && (
            <p className="file-info">Selected: {formData.addressProof.name}</p>
          )}
        </div>

        <div className="form-group">
          <label className="section-title">Bank Reference (Optional)</label>
          <input
            type="file"
            className="form-input"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={(e) => handleFileChange('bankRef', e)}
          />
          {formData.bankRef && (
            <p className="file-info">Selected: {formData.bankRef.name}</p>
          )}
        </div>

        <div className="buttons-stack">
          <button 
            type="button"
            className="form-btn" 
            onClick={onBack}
            disabled={uploading}
          >
            Back
          </button>
          <button 
            type="submit"
            className="form-btn" 
            disabled={uploading || !isValid}
          >
            {uploading ? 'Uploading...' : 'Continue'}
          </button>
        </div>
      </form>
    </>
  );
}