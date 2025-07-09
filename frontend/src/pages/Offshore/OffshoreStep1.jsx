// src/pages/Offshore/OffshoreStep1.jsx
import React from 'react';

const OffshoreStep1 = ({ formData, setFormData, onNext, onBack }) => (
  <div className="step1-contact bg-dark text-white d-flex flex-column" style={{ height: '100vh' }}>
    <div className="form-container flex-grow-1 d-flex justify-content-center align-items-center overflow-auto">
      <div className="card-container w-100" style={{ maxWidth: '500px' }}>
        <h2 className="title">Contact Information</h2>
        <p className="subtitle">Please provide your contact details</p>

        <input
          type="text"
          className="form-control mb-3"
          placeholder="Contact Name"
          value={formData.contactName}
          onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
        />
        <input
          type="tel"
          className="form-control mb-3"
          placeholder="Contact Phone"
          value={formData.contactPhone}
          onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
        />
        <input
          type="email"
          className="form-control mb-4"
          placeholder="Contact Email"
          value={formData.contactEmail}
          onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
        />

        <div className="button-group d-flex justify-content-between">
          <button className="btn btn-secondary" onClick={onBack}>
            Back
          </button>
          <button
            className="btn btn-outline-light fw-semibold"
            disabled={
              !formData.contactName || !formData.contactPhone || !formData.contactEmail
            }
            onClick={() => onNext()}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  </div>
);

export default OffshoreStep1;
