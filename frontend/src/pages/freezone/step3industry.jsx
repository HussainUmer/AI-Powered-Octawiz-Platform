import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function Step3Industry({ onNext, onPrev, onboardingId, selectedIndustryId }) {
  const [industries, setIndustries] = useState([]);
  const [selectedIndustry, setSelectedIndustry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchIndustries = async () => {
      // Use correct table name 'Industry' (case-sensitive)
      const { data, error } = await supabase.from('Industry').select('*');
      if (error) {
        setIndustries([]);
        setLoading(false);
        return;
      }
      setIndustries(data);
      setLoading(false);
      // If user has a previous choice, set it as selected
      if (selectedIndustryId) {
        const found = data.find((ind) => ind.id === selectedIndustryId);
        if (found) setSelectedIndustry(found);
      }
    };
    fetchIndustries();
  }, [selectedIndustryId]);

  const handleContinue = async () => {
    if (!selectedIndustry || !onboardingId) return;
    setSaving(true);
    setError('');
    // Save industry selection to Onboarding table (store industry id)
    const { error: updateError } = await supabase
      .from('Onboarding')
      .update({ industry: selectedIndustry.id })
      .eq('id', onboardingId);
    setSaving(false);
    if (updateError) {
      setError('Failed to save industry selection: ' + updateError.message);
      return;
    }
    onNext({ industryId: selectedIndustry.id });
  };

  return (
    <div className="step3-industry d-flex vh-100 bg-dark text-white">
      <div className="progress-sidebar"></div>
      <div className="form-container">
        <div className="card-container">
          <h2 className="title">Industry Selection</h2>
          <p className="subtitle">
            Select the industry that best fits your business.
          </p>
          <div className="options-container">
            {loading ? (
              <div>Loading industries...</div>
            ) : industries.length === 0 ? (
              <div>No industries found.</div>
            ) : (
              industries.map((industry) => {
                return (
                  <div
                    key={industry.id}
                    className={`option-card ${selectedIndustry && selectedIndustry.id === industry.id ? 'selected' : ''}`}
                    onClick={() => setSelectedIndustry(industry)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && setSelectedIndustry(industry)}
                  >
                    {industry.name}
                  </div>
                );
              })
            )}
          </div>
          {error && <div className="text-danger mt-2">{error}</div>}
          <div className="button-group">
            <button className="btn btn-secondary" onClick={onPrev} disabled={saving}>
              Back
            </button>
            <button
              className="btn btn-outline-light fw-semibold"
              disabled={!selectedIndustry || saving}
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
