// src/pages/CategorySelection.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const categories = [
  { id: 'mainland', label: 'Mainland', description: 'Operate anywhere in the UAE with flexible office options.' },
  { id: 'freezone', label: 'Freezone',   description: 'Full ownership, tax benefits & business incentives.' },
  { id: 'offshore', label: 'Offshore',   description: 'Ideal for international business & asset protection.' },
];

export default function CategorySelection({ onSelect }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    window.location.href = '/signin';
  };

  const handleClick = (id) => {
    if (id === 'offshore') {
      // go to the standalone Offshore wizard
      navigate('/offshore');
    } else {
      // mainland or freezone
      onSelect(id);
    }
  };

  return (
    <div className="step2-company-structure d-flex vh-100 bg-dark text-white">
      <div className="form-container">
        <div className="card-container">
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              className="btn btn-outline-light mb-3"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
          <h2 className="title">Choose a Category</h2>
          <p className="subtitle">Select the type of company you want to set up.</p>

          <div className="options-container">
            {categories.map(({ id, label, description }) => (
              <div
                key={id}
                role="button"
                tabIndex={0}
                className="option-card"
                onClick={() => handleClick(id)}
                onKeyDown={e => e.key === 'Enter' && handleClick(id)}
              >
                <div className="option-label">{label}</div>
                <small className="option-description">{description}</small>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
