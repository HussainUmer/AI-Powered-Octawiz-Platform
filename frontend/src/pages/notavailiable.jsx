import React from 'react';

export default function NotAvailable({ onBack }) {
  return (
    <div className="d-flex flex-column justify-content-center align-items-center text-center p-5" style={{ color: 'var(--color-white)', height: '100%' }}>
      <h2 className="mb-4">Coming Soon</h2>
      <p className="mb-5 text-muted">
        Currently, only Freezone company setup is supported. Mainland and Offshore options will be available soon.
      </p>
      <button className="btn btn-outline-light" onClick={onBack}>
        Back to Company Structure
      </button>
    </div>
  );
}
