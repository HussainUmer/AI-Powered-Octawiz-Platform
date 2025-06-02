import React, { useState } from 'react';

export default function MainlandBusinessName({ onNext }) {
  const [businessName, setBusinessName] = useState("");
  const [error, setError] = useState("");

  const handleContinue = () => {
    if (!businessName.trim()) {
      setError("Business name is required");
      return;
    }
    setError("");
    onNext({ businessName });
  };

  return (
    <div className="d-flex vh-100 bg-dark text-white">
      <div className="form-container">
        <div className="card-container">
          <h2 className="title">Business Name</h2>
          <p className="subtitle mb-4">
            Enter your proposed business name. This will be used for your trade license application.
          </p>
          <input
            className="form-control mb-2"
            placeholder="Enter business name"
            value={businessName}
            onChange={e => setBusinessName(e.target.value)}
            maxLength={100}
            autoFocus
          />
          {error && <div className="text-danger mb-2">{error}</div>}
          <div className="button-group mt-3">
            <button className="btn btn-secondary" onClick={() => onNext({ backToCategory: true })}>Back</button>
            <button
              className="btn btn-outline-light fw-semibold"
              disabled={!businessName.trim()}
              onClick={handleContinue}
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
