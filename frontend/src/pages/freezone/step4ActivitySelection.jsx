import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function Step4ActivitySelection({ onNext, onPrev, selectedIndustryId }) {
  const [selectedActivities, setSelectedActivities] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!selectedIndustryId) return;
    const fetchActivities = async () => {
      const { data, error } = await supabase
        .from('activities')
        .select('*')
        .eq('industry_id', selectedIndustryId);
      if (error) {
        console.error('Error fetching activities:', error);
        setActivities([]);
      } else {
        setActivities(data);
      }
      setLoading(false);
    };
    fetchActivities();
  }, [selectedIndustryId]);

  const handleActivityChange = (activity) => {
    setSelectedActivities((prevSelected) =>
      prevSelected.includes(activity)
        ? prevSelected.filter((item) => item !== activity)
        : [...prevSelected, activity]
    );
  };

  return (
    <div className="step4-activity-selection d-flex vh-100 bg-dark text-white">
      <div className="form-container">
        <div className="card-container">
          <h2 className="title">Business Activity</h2>
          <p className="subtitle">
            Select the business activities that apply to your company.
          </p>

          <div className="options-container">
            {loading ? (
              <div>Loading activities...</div>
            ) : activities.length === 0 ? (
              <div>No activities found for this industry.</div>
            ) : (
              activities.map((activity) => (
                <div
                  key={activity.id}
                  className={`option-card ${selectedActivities.includes(activity.name) ? 'selected' : ''}`}
                  onClick={() => handleActivityChange(activity.name)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && handleActivityChange(activity.name)}
                >
                  <input
                    type="checkbox"
                    checked={selectedActivities.includes(activity.name)}
                    onChange={() => handleActivityChange(activity.name)}
                    id={activity.id}
                    className="option-checkbox"
                  />
                  <label htmlFor={activity.id} className="ms-2">{activity.name}</label>
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
