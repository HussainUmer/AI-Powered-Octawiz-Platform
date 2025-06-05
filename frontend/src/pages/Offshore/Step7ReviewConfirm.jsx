import React from 'react';

export default function Step7ReviewConfirm({ formData, onBack, onSubmit }) {
  return (
    <>
      <h1 className="form-title">Review & Confirm</h1>
      <p className="form-subtitle">Please review all information before submission</p>

      <div className="review-section">
        <h2 className="section-title">Company Details</h2>
        <ul className="review-list">
          <li><strong>Jurisdiction:</strong> {formData.jurisdiction}</li>
          <li><strong>Company Name:</strong> {formData.companyName}</li>
          <li><strong>Legal Structure:</strong> {formData.structure}</li>
          <li><strong>Business Activities:</strong> {formData.businessActivities}</li>
          <li><strong>Shareholders:</strong> {formData.shareholders}</li>
          <li><strong>Office Address:</strong> {formData.officeAddress}</li>
          <li><strong>Office Size:</strong> {formData.officeSize} sq ft</li>
        </ul>
      </div>

      <div className="review-section">
        <h2 className="section-title">Documents</h2>
        <ul className="review-list">
          <li><strong>Passport:</strong> {formData.passport?.name || 'Not uploaded'}</li>
          <li><strong>Address Proof:</strong> {formData.addressProof?.name || 'Not uploaded'}</li>
          <li><strong>Bank Reference:</strong> {formData.bankRef?.name || 'Not provided'}</li>
        </ul>
      </div>

      <div className="buttons-stack">
        <button className="form-btn" onClick={onBack}>
          Back
        </button>
        <button className="form-btn" onClick={onSubmit}>
          Submit Application
        </button>
      </div>
    </>
  );
}