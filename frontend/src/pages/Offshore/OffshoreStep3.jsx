import React from 'react';

const OffshoreStep3 = ({ formData, setFormData, onNext, onBack }) => (
  <div className="step3-proposal d-flex vh-100 bg-dark text-white">
    <div className="form-container">
      <div className="card-container">
        <h2 className="title">Business Proposal</h2>
        <p className="subtitle">Describe your business activities</p>

        <textarea
          className="form-control mb-4"
          placeholder="Business Proposal"
          rows={5}
          value={formData.proposal}
          onChange={(e) => setFormData({ ...formData, proposal: e.target.value })}
        />

        <div className="button-group">
          <button className="btn btn-secondary" onClick={onBack}>
            Back
          </button>
          <button
            className="btn btn-outline-light fw-semibold"
            disabled={!formData.proposal}
            onClick={onNext}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  </div>
);

export default OffshoreStep3;
