import React from 'react';

const OffshoreStep5 = ({ formData, setFormData, onSubmit, onBack }) => (
  <div className="step5-notes d-flex vh-100 bg-dark text-white">
    <div className="form-container">
      <div className="card-container">
        <h2 className="title">Preferred Language & Notes</h2>
        <p className="subtitle">Provide any additional information</p>

        <input
          type="text"
          className="form-control mb-3"
          placeholder="Preferred Language"
          value={formData.language}
          onChange={(e) => setFormData({ ...formData, language: e.target.value })}
        />
        <textarea
          className="form-control mb-4"
          placeholder="Additional Notes"
          rows={4}
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
        />

        <div className="button-group">
          <button className="btn btn-secondary" onClick={onBack}>
            Back
          </button>
          <button
            className="btn btn-outline-light fw-semibold"
            onClick={onSubmit}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  </div>
);

export default OffshoreStep5;
