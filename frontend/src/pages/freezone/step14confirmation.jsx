import React from 'react';

export default function Step14Confirmation({ onDashboard }) {
  return (
    <div className="step14-confirmation d-flex vh-100 bg-dark text-white">
      <div className="form-container d-flex flex-column align-items-center justify-content-center w-100">
        <div className="card-container p-4 text-center" style={{ minWidth: 350, maxWidth: 500, background: '#181c24', borderRadius: 16, boxShadow: '0 2px 16px #0002' }}>
          <h2 className="title mb-3" style={{ color: '#4caf50' }}>Success!</h2>
          <p className="mb-4" style={{ fontSize: '1.1rem' }}>Your application has been submitted successfully.</p>
          <div className="mb-4" style={{ background: '#23272f', borderRadius: 12, padding: '1.25rem 1rem', color: '#fff', fontWeight: 500 }}>
            <span style={{ fontSize: '1.05rem' }}>Timeline: <span style={{ color: '#0f0' }}>License issued in 2–5 working days</span></span>
          </div>
          <button className="btn btn-success w-100 fw-semibold" style={{ fontSize: '1.1rem' }} onClick={onDashboard}>
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
