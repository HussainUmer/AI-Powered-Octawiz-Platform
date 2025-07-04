import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function Step7Ownership({ onNext, onPrev }) {
  const [ownershipOptions, setOwnershipOptions] = useState([]);
  const [selectedOwnership, setSelectedOwnership] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOwnershipStructures = async () => {
      const { data, error } = await supabase.from('Owner_structure').select('*');
      if (error) {
        setOwnershipOptions([]);
      } else {
        setOwnershipOptions(data);
      }
      setLoading(false);
    };
    fetchOwnershipStructures();
  }, []);

  const handleOwnershipSelection = (ownershipId) => {
    setSelectedOwnership(ownershipId);
  };

  return (
    <div className="step7-ownership d-flex vh-100 bg-dark text-white">
      <div className="form-container">
        <div className="card-container">
          <h2 className="title">Ownership Structure</h2>
          <p className="subtitle">
            Select the type of ownership for your business.
          </p>
          <div className="options-container">
            {loading ? (
              <div>Loading ownership structures...</div>
            ) : ownershipOptions.length === 0 ? (
              <div>No ownership structures found.</div>
            ) : (
              ownershipOptions.map((option) => (
                <div
                  key={option.id}
                  className={`option-card ${selectedOwnership === option.id ? 'selected' : ''}`}
                  onClick={() => handleOwnershipSelection(option.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && handleOwnershipSelection(option.id)}
                  style={{ marginBottom: '1rem' }}
                >
                  <input
                    type="radio"
                    checked={selectedOwnership === option.id}
                    onChange={() => handleOwnershipSelection(option.id)}
                    id={option.id}
                    name="ownership"
                    className="option-radio"
                  />
                  <label htmlFor={option.id} className="ms-2">{option.struture_name}</label>
                </div>
              ))
            )}
          </div>
          <div className="button-group">
            <button className="btn btn-secondary" onClick={onPrev}>
              Back
            </button>
            <button
              className="btn btn-outline-light fw-semibold"
              disabled={!selectedOwnership}
              onClick={() => onNext({ ownership: selectedOwnership })}
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
