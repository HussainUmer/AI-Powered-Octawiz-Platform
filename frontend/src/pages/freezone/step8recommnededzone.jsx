import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function Step8ZoneRecommendation({ onNext, onPrev, onboardingId, selectedFreezoneId }) {
  const [freezones, setFreezones] = useState([]);
  const [selected, setSelected] = useState(selectedFreezoneId || '');
  const [recommendedFreezone, setRecommendedFreezone] = useState('');
  const [popupVisible, setPopupVisible] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (selectedFreezoneId) setSelected(selectedFreezoneId);
  }, [selectedFreezoneId]);

  useEffect(() => {
    const fetchFreezones = async () => {
      const { data, error } = await supabase.from('Freezones').select('*');
      if (error) {
        setFreezones([]);
        setRecommendedFreezone('');
        return;
      }
      setFreezones(data);
      setRecommendedFreezone(data && data.length > 0 ? data[0].name : '');
      // Remove auto-selection of first freezone
      // if (!selected) setSelected(data[0].id);
    };
    fetchFreezones();
  }, []);

  const handleFreezoneSelect = (id) => {
    setSelected(id);
  };

  const togglePopup = () => {
    setPopupVisible(!popupVisible);
  };

  const handleContinue = async () => {
    if (!selected || !onboardingId) return;
    setSaving(true);
    setError('');
    const { error: updateError } = await supabase
      .from('Onboarding')
      .update({ freezone: selected })
      .eq('id', onboardingId);
    setSaving(false);
    if (updateError) {
      setError('Failed to save freezone selection: ' + updateError.message);
      return;
    }
    onNext({ freezone: selected });
  };

  return (
    <div className="step8-zone-recommendation d-flex vh-100 bg-dark text-white">
      <div className="form-container">
        <div className="card-container">
          <h2 className="title">Choose a Free Zone</h2>
          <p className="subtitle">
            Please select the free zone where you want to register your company.
          </p>
          <div className="options-container">
            <div className="freezone-list">
              {freezones.map((freezone) => (
                <div
                  key={freezone.id}
                  className={`option-card ${selected === freezone.id ? 'selected' : ''}`}
                  onClick={() => handleFreezoneSelect(freezone.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && handleFreezoneSelect(freezone.id)}
                >
                  <div className="option-name">
                    {freezone.name}
                  </div>
                  {selected === freezone.id && (
                    <div className="freezone-details">
                      {freezone.details || ''}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          {error && <div className="text-danger mt-2">{error}</div>}
          <div className="button-group">
            <button className="btn btn-secondary" onClick={onPrev} disabled={saving}>
              Back
            </button>
            <button
              className="btn btn-outline-light fw-semibold"
              disabled={!selected || saving}
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