import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function Step4ActivitySelection({ onNext, onPrev, selectedIndustryId, onboardingId, selectedActivities: initialSelectedActivities = [], customActivity: initialCustomActivity = '' }) {
  // Only set from props on mount
  const [selectedActivities, setSelectedActivities] = useState(initialSelectedActivities);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [customActivity, setCustomActivity] = useState(initialCustomActivity);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Only set from props on mount
  useEffect(() => {
    setSelectedActivities(initialSelectedActivities || []);
    setCustomActivity(initialCustomActivity || '');
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (!selectedIndustryId) return;
    const fetchActivities = async () => {
      // Use correct table name 'Activities' (case-sensitive)
      const { data, error } = await supabase
        .from('Activities')
        .select('*')
        .eq('industry_id', selectedIndustryId);
      if (error) {
        console.error('Error fetching activities:', error);
        setActivities([]);
      } else {
        setActivities(data);
        // Defensive: convert selectedActivities from IDs to names only if needed
        if (initialSelectedActivities && initialSelectedActivities.length > 0) {
          const names = data
            .filter(a => initialSelectedActivities.includes(a.id) || initialSelectedActivities.includes(a.name))
            .map(a => a.name);
          // Only update if different
          if (
            names.length > 0 &&
            (names.length !== selectedActivities.length || names.some((n) => !selectedActivities.includes(n)))
          ) {
            setSelectedActivities(names);
          }
        }
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

  const handleCustomActivityChange = (e) => {
    setCustomActivity(e.target.value);
  };

  const handleContinue = async () => {
    setSaving(true);
    setError('');
    let updateObj = {};
    if (customActivity.trim()) {
      updateObj = { custom_activity: customActivity.trim(), activity: null };
    } else {
      // Find selected activity IDs from the activities list
      const selectedIds = activities
        .filter((a) => selectedActivities.includes(a.name))
        .map((a) => a.id);
      updateObj = { activity: selectedIds.length > 0 ? selectedIds[0] : null, custom_activity: null };
    }
    const { error: updateError } = await supabase
      .from('Onboarding')
      .update(updateObj)
      .eq('id', onboardingId);
    setSaving(false);
    if (updateError) {
      setError('Failed to save activity selection: ' + updateError.message);
      return;
    }
    onNext({ activities: selectedActivities, customActivity });
  };

  return (
    <div className="step4-activity-selection d-flex vh-100 bg-dark text-white">
      <div className="form-container">
        <div className="card-container">
          <h2 className="title" style={{ color: 'white' }}>Business Activity</h2>
          <p className="subtitle">
            Select the business activities that apply to your company or enter your own.
          </p>

          <div className="options-container">
            {loading ? (
              <div style={{ color: 'white' }}>Loading activities...</div>
            ) : activities.length === 0 ? (
              <div style={{ color: 'white' }}>No activities found for this industry.</div>
            ) : (
              activities.map((activity) => (
                <div
                  key={activity.id}
                  className={`option-card ${selectedActivities.includes(activity.name) ? 'selected' : ''}`}
                  onClick={() => handleActivityChange(activity.name)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && handleActivityChange(activity.name)}
                  style={{ color: 'white' }}
                >
                  <input
                    type="checkbox"
                    checked={selectedActivities.includes(activity.name)}
                    onChange={() => handleActivityChange(activity.name)}
                    id={activity.id}
                    className="option-checkbox"
                  />
                  <label htmlFor={activity.id} className="ms-2" style={{ color: 'white' }}>{activity.name}</label>
                </div>
              ))
            )}
          </div>

          <div className="mb-3 mt-3">
            <label htmlFor="customActivity" className="form-label" style={{ color: 'white' }}>Or enter a custom activity</label>
            <input
              type="text"
              id="customActivity"
              className="form-control white-placeholder"
              value={customActivity}
              onChange={handleCustomActivityChange}
              placeholder="Enter your own activity"
              style={{ color: '#222', backgroundColor: '#fff' }}
            />
          </div>

          {error && <div className="alert alert-danger">{error}</div>}

          <div className="button-group">
            <button className="btn btn-secondary" onClick={onPrev}>
              Back
            </button>
            <button
              className="btn btn-outline-light fw-semibold"
              disabled={(selectedActivities.length === 0 && !customActivity.trim()) || saving}
              onClick={handleContinue}
            >
              {saving ? 'Saving...' : 'Continue'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
