// src/pages/mainland/contactInformation.jsx
import React from 'react';

export default function MainlandContactInformation({ formData, setFormData, onNext, onPrev }) {
  const [errors, setErrors] = React.useState({
    contactName: false,
    contactPhone: false,
    contactEmail: false
  });

  const validateAndContinue = () => {
    const newErrors = {
      contactName: !formData.contactName,
      contactPhone: !formData.contactPhone,
      contactEmail: !formData.contactEmail
    };
    
    setErrors(newErrors);
    
    if (!Object.values(newErrors).some(Boolean)) {
      onNext();
    }
  };

  return (
    <div className="d-flex vh-100 bg-dark text-white">
      <div className="form-container">
        <div className="card-container">
          <h2 className="title">Contact Information</h2>
          <p className="subtitle mb-4">
            Please provide your primary contact details for your business application.
          </p>

          <input
            type="text"
            className={`form-control mb-3 ${errors.contactName ? 'is-invalid' : ''}`}
            placeholder="Full Name"
            value={formData.contactName || ''}
            onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
          />
          {errors.contactName && <div className="text-danger mb-2">Name is required</div>}

          <input
            type="tel"
            className={`form-control mb-3 ${errors.contactPhone ? 'is-invalid' : ''}`}
            placeholder="Phone Number"
            value={formData.contactPhone || ''}
            onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
          />
          {errors.contactPhone && <div className="text-danger mb-2">Phone is required</div>}

          <input
            type="email"
            className={`form-control mb-4 ${errors.contactEmail ? 'is-invalid' : ''}`}
            placeholder="Email Address"
            value={formData.contactEmail || ''}
            onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
          />
          {errors.contactEmail && <div className="text-danger mb-2">Email is required</div>}

          <div className="button-group mt-3">
            <button className="btn btn-secondary" onClick={onPrev}>Back</button>
            <button
              className="btn btn-outline-light fw-semibold"
              onClick={validateAndContinue}
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}