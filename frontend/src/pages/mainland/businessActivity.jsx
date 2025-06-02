import React, { useState } from 'react';

// Example activities by industry
const activitiesByIndustry = {
  'Health & Wellness': [
    { name: 'Clinic Operation', info: 'Requires DHA approval' },
    { name: 'Fitness Center', info: 'Requires municipality approval' },
    { name: 'Wellness Consultancy', info: 'Professional license' },
    { name: 'Nutrition Center', info: 'Requires health authority approval' },
    { name: 'Physiotherapy Center', info: 'Special licensing required' },
  ],
  'Retail / E-commerce': [
    { name: 'Online Store', info: 'E-commerce license' },
    { name: 'Retail Shop', info: 'Physical office required' },
    { name: 'Marketplace Platform', info: 'DED approval needed' },
    { name: 'Dropshipping', info: 'Import/export compliance' },
    { name: 'Electronics Store', info: 'Commercial license' },
  ],
  'Technology': [
    { name: 'Software Development', info: 'Professional license' },
    { name: 'IT Consultancy', info: 'Requires LSA' },
    { name: 'Cybersecurity Services', info: 'External approval may apply' },
    { name: 'Tech Support Services', info: 'Professional license' },
    { name: 'Web Hosting', info: 'Telecom approval may apply' },
    { name: 'Mobile App Development', info: 'Professional license' },
  ],
  'Trading': [
    { name: 'General Trading', info: 'Commercial license' },
    { name: 'Import/Export', info: 'Customs registration required' },
    { name: 'Wholesale', info: 'Commercial license' },
    { name: 'Textile Trading', info: 'DED approval needed' },
    { name: 'Foodstuff Trading', info: 'Food safety approval' },
  ],
  'Services': [
    { name: 'Business Consultancy', info: 'Professional license' },
    { name: 'Marketing Agency', info: 'DED approval needed' },
    { name: 'Event Management', info: 'May require external approvals' },
    { name: 'HR Consultancy', info: 'Professional license' },
    { name: 'Translation Services', info: 'DED approval needed' },
  ],
};

export default function MainlandBusinessActivity({ industry, onNext, onPrev }) {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState([]);

  const activities = activitiesByIndustry[industry] || [];
  const filtered = activities.filter(a =>
    a.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (activity) => {
    if (selected.includes(activity)) {
      setSelected(selected.filter(a => a !== activity));
    } else if (selected.length < 3) {
      setSelected([...selected, activity]);
    }
  };

  return (
    <div className="step3-industry d-flex vh-100 bg-dark text-white">
      <div className="form-container">
        <div className="card-container">
          <h2 className="title">Choose your licensed business activity</h2>
          <p className="subtitle">
            Select the activity that best matches your operations. You can add up to 3.
          </p>
          <input
            className="form-control mb-3"
            placeholder="Search activities..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <div className="options-container">
            {filtered.map((activity, idx) => (
              <div
                key={activity.name}
                className={`option-card d-flex align-items-center ${selected.includes(activity.name) ? 'selected' : ''}`}
                style={{ cursor: 'pointer' }}
                onClick={() => handleSelect(activity.name)}
              >
                <input
                  type="checkbox"
                  checked={selected.includes(activity.name)}
                  readOnly
                  className="me-2"
                />
                <div>
                  <span className="option-label">{activity.name}</span>
                  {/* No icon shown here */}
                </div>
              </div>
            ))}
            {filtered.length === 0 && <div className="text-muted">No activities found.</div>}
          </div>
          <div className="button-group mt-3">
            <button className="btn btn-secondary" onClick={onPrev}>Back</button>
            <button
              className="btn btn-outline-light fw-semibold"
              disabled={selected.length === 0}
              onClick={() => onNext({ activities: selected })}
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
