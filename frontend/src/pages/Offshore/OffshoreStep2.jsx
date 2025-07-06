import React from 'react';

const OffshoreStep2 = ({ formData, setFormData, onNext, onBack }) => (
  <div className="step2-business d-flex vh-100 bg-dark text-white">
    <div className="form-container">
      <div className="card-container">
        <h2 className="title">Business Details</h2>
        <p className="subtitle">Provide information about your business</p>

        <input
          type="text"
          className="form-control mb-3"
          placeholder="Business Name"
          value={formData.businessName}
          onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
        />
        <select
          className="form-control mb-4"
          value={formData.jurisdiction}
          onChange={(e) => setFormData({ ...formData, jurisdiction: e.target.value })}
        >
          <option value="">Select Jurisdiction</option>
          <option value="RAK ICC">RAK ICC</option>
          <option value="JAFZA Offshore">JAFZA Offshore</option>
          <option value="Ajman Offshore">Ajman Offshore</option>
        </select>

        <div className="button-group">
          <button className="btn btn-secondary" onClick={onBack}>
            Back
          </button>
          <button
            className="btn btn-outline-light fw-semibold"
            disabled={!formData.businessName || !formData.jurisdiction}
            onClick={onNext}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  </div>
);

export default OffshoreStep2;
