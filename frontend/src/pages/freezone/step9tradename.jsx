import React, { useState } from 'react';

export default function Step9TradeName({ onNext, onPrev }) {
  const [names, setNames] = useState(['', '', '']);

  const handleChange = (index, value) => {
    const updated = [...names];
    updated[index] = value;
    setNames(updated);
  };

  const isValid = names.every(name => name.trim() !== '');

  return (
    <div className="step9-tradename d-flex vh-100 bg-dark text-white">
      <div className="form-container">
        <div className="card-container">
          <h2 className="title">Trade Name Options</h2>
          <p className="subtitle">Enter three trade name options for your company.</p>
          <div className="options-container">
            {[0, 1, 2].map(i => (
              <div key={i} className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder={`Option ${i + 1}`}
                  value={names[i]}
                  onChange={e => handleChange(i, e.target.value)}
                  maxLength={100}
                />
              </div>
            ))}
          </div>
          <div className="button-group">
            <button className="btn btn-secondary" onClick={onPrev}>
              Back
            </button>
            <button
              className="btn btn-outline-light fw-semibold"
              disabled={!isValid}
              onClick={() => onNext({ tradeNameOptions: names })}
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
