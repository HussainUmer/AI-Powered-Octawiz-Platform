import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function Step3Industry({ onNext, onPrev }) {
  const [industries, setIndustries] = useState([]);
  const [selectedIndustry, setSelectedIndustry] = useState(null);
  const [loading, setLoading] = useState(true);

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
    };
    fetchIndustries();
  }, []);

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
              industries.map((industry) => (
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
              ))
            )}
          </div>
          <div className="button-group">
            <button className="btn btn-secondary" onClick={onPrev}>
              Back
            </button>
            <button
              className="btn btn-outline-light fw-semibold"
              disabled={!selectedIndustry}
              onClick={() => onNext({ industryId: selectedIndustry?.id, industryName: selectedIndustry?.name })}
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
