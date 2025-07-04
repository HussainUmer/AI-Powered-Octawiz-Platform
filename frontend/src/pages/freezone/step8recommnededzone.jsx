import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function Step8ZoneRecommendation({ onNext, onPrev }) {
  const [freezones, setFreezones] = useState([]);
  const [selectedFreezone, setSelectedFreezone] = useState('');
  const [recommendedFreezone, setRecommendedFreezone] = useState('');
  const [popupVisible, setPopupVisible] = useState(false);

  useEffect(() => {
    const fetchFreezones = async () => {
      const { data, error } = await supabase.from('Freezones').select('*');
      if (error) {
        setFreezones([]);
        setRecommendedFreezone('');
        return;
      }
      setFreezones(data);
      // Optionally, set a recommended freezone (e.g., first in list)
      if (data && data.length > 0) {
        setRecommendedFreezone(data[0].name);
        setSelectedFreezone(data[0].name);
      }
    };
    fetchFreezones();
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
          <button
            className="btn btn-sm btn-outline-light mb-3"
            onClick={togglePopup}
          >
            Why is this recommended?
          </button>
          <div className="freezone-list">
            {freezones.map((freezone) => (
              <div
                key={freezone.id}
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
                    {freezone.details || ''}
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
      {popupVisible && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h3>Why is this freezone recommended?</h3>
            <p>
              {recommendedFreezone
                ? `This freezone is recommended based on your business needs and activities.`
                : ''}
            </p>
            <button onClick={togglePopup} className="btn btn-primary">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
