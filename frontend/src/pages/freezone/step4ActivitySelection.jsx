import React, { useState, useEffect } from 'react';

const activitiesData = {
  'Health & Wellness': [
    'Personal Training',
    'Health Coaching',
    'Nutritional Products',
  ],
  'Retail / E-commerce': ['E-commerce', 'Online Retail via Amazon', 'Dropshipping'],
  'Technology': ['Software Development', 'Tech Consultancy'],
  'Trading': ['Wholesale Trading', 'Import/Export'],
  'Services': ['Online Coaching', 'Consulting', 'Freelancing'],
};

export default function Step4ActivitySelection({ onNext, onPrev, selectedIndustry }) {
  const [selectedActivities, setSelectedActivities] = useState([]);

  const handleActivityChange = (activity) => {
    setSelectedActivities((prevSelected) =>
      prevSelected.includes(activity)
        ? prevSelected.filter((item) => item !== activity)
        : [...prevSelected, activity]
    );
  };

  // Filter the activities based on the selected industry
  const availableActivities = activitiesData[selectedIndustry] || [];

  return (
    <div className="step4-activity-selection d-flex vh-100 bg-dark text-white">

      <div className="form-container">
        <div className="card-container">
          <h2 className="title">Business Activity</h2>
          <p className="subtitle">
            Select the business activities that apply to your company.
          </p>

          <div className="options-container">
            {availableActivities.map((activity) => (
              <div
                key={activity}
                className={`option-card ${selectedActivities.includes(activity) ? 'selected' : ''}`}
                onClick={() => handleActivityChange(activity)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && handleActivityChange(activity)}
              >
                <input
                  type="checkbox"
                  checked={selectedActivities.includes(activity)}
                  onChange={() => handleActivityChange(activity)}
                  id={activity}
                  className="option-checkbox"
                />
                <label htmlFor={activity} className="ms-2">{activity}</label>
              </div>
            ))}
          </div>

          <div className="button-group">
            <button className="btn btn-secondary" onClick={onPrev}>
              Back
            </button>
            <button
              className="btn btn-outline-light fw-semibold"
              disabled={selectedActivities.length === 0}
              onClick={() => onNext({ activities: selectedActivities })}
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
