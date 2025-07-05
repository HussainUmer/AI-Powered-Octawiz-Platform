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
      if (data && data.length > 0) {
        setRecommendedFreezone(data[0].name);
        if (!selected) setSelected(data[0].id);
      }
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
          <h2 className="title">Free Zone Recommendation</h2>
          <p className="subtitle">
            Based on your business details, we recommend the following free zone for your company:
          </p>
          <div className="options-container">
            {freezones.map((fz) => (
              <div
                key={fz.id}
                className={`option-card ${selected === fz.id ? 'selected' : ''}`}
                onClick={() => handleFreezoneSelect(fz.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && handleFreezoneSelect(fz.id)}
                style={{ marginBottom: '1rem' }}
              >
                <input
                  type="radio"
                  checked={selected === fz.id}
                  onChange={() => handleFreezoneSelect(fz.id)}
                  id={fz.id}
                  name="freezone"
                  className="option-radio"
                />
                <label htmlFor={fz.id} className="ms-2">{fz.name}</label>
              </div>
            ))}
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
