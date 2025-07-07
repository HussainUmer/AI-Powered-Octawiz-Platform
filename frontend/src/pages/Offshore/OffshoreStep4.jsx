import React from 'react';

const OffshoreStep4 = ({ formData, setFormData, onNext, onBack }) => (
  <div className="step4-sharecapital d-flex vh-100 bg-dark text-white">
    <div className="form-container">
      <div className="card-container">
        <h2 className="title">Estimated Share Capital</h2>
        <p className="subtitle">Enter your estimated share capital</p>

        <input
          type="number"
          className="form-control mb-4"
          placeholder="Estimated Share Capital"
          value={formData.shareCapital}
          onChange={(e) => setFormData({ ...formData, shareCapital: e.target.value })}
        />

        <div className="button-group">
          <button className="btn btn-secondary" onClick={onBack}>
            Back
          </button>
          <button
            className="btn btn-outline-light fw-semibold"
            disabled={!formData.shareCapital}
            onClick={onNext}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  </div>
);

export default OffshoreStep4;
