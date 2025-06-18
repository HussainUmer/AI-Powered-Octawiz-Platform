import React, { useState, useEffect } from 'react';

// Simulated API function (for now)
const fetchFreezones = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        recommended: 'Dubai Silicon Oasis (DSO)', // Hardcoded recommended freezone
        freezones: [
          { name: 'Dubai Silicon Oasis (DSO)', details: 'Best for tech startups. Full foreign ownership.' },
          { name: 'Sharjah Publishing City', details: 'Great for publishing and content-related businesses.' },
          { name: 'Ajman Free Zone', details: 'Low cost, great for small businesses and startups.' },
          { name: 'Ras Al Khaimah Economic Zone', details: 'Ideal for trading and offshore businesses.' },
        ]
      });
    }, 1000);
  });
};

export default function Step8ZoneRecommendation({ onNext, onPrev }) {
  const [freezones, setFreezones] = useState([]);
  const [selectedFreezone, setSelectedFreezone] = useState('');
  const [recommendedFreezone, setRecommendedFreezone] = useState('');
  const [popupVisible, setPopupVisible] = useState(false);

  // Simulate an API call to fetch freezones and recommended freezone
  useEffect(() => {
    const getFreezones = async () => {
      const data = await fetchFreezones();
      setFreezones(data.freezones);
      setRecommendedFreezone(data.recommended);
      setSelectedFreezone(data.recommended); // Default to the recommended freezone
    };

    getFreezones();
  }, []);

  const handleFreezoneSelect = (name) => {
    setSelectedFreezone(name);
  };

  const togglePopup = () => {
    setPopupVisible(!popupVisible);
  };

  return (
    <div className="step8-zone-recommendation d-flex vh-100 bg-dark text-white">

      <div className="form-container">
        <div className="card-container">
          <h2 className="title">Free Zone Recommendation</h2>
          <p className="subtitle">
            Based on your business details, we recommend the following free zone for your company:
          </p>

          {/* Why is this recommended button */}
          <button
            className="btn btn-sm btn-outline-light mb-3"
            onClick={togglePopup}
          >
            Why is this recommended?
          </button>

          <div className="freezone-list">
            {freezones.map((freezone) => (
              <div
                key={freezone.name}
                className={`option-card ${selectedFreezone === freezone.name ? 'selected' : ''}`}
                onClick={() => handleFreezoneSelect(freezone.name)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && handleFreezoneSelect(freezone.name)}
              >
                <div className="option-name">
                  {freezone.name}
                  {freezone.name === recommendedFreezone && (
                    <span className="recommended-tag">Recommended</span>
                  )}
                </div>
                {selectedFreezone === freezone.name && (
                  <div className="freezone-details">
                    {freezone.details}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="button-group">
            <button className="btn btn-secondary" onClick={onPrev}>
              Back
            </button>
            <button
              className="btn btn-outline-light fw-semibold"
              disabled={!selectedFreezone}
              onClick={() => onNext({ selectedFreezone })}
            >
              Continue
            </button>
          </div>
        </div>
      </div>

      {/* Popup for "Why is this recommended?" */}
      {popupVisible && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h3>Why is this freezone recommended?</h3>
            <p>
              {recommendedFreezone === 'Dubai Silicon Oasis (DSO)'
                ? 'Dubai Silicon Oasis is ideal for tech startups due to its full foreign ownership, modern infrastructure, and easy access to the Dubai market.'
                : 'This freezone is recommended based on your business needs and activities.'}
            </p>
            <button onClick={togglePopup} className="btn btn-primary">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
