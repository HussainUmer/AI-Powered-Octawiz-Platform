import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function Step10Stakeholders({ onNext, onPrev, onboardingId, initialStakeholders }) {
  const [stakeholders, setStakeholders] = useState(initialStakeholders && initialStakeholders.length > 0 ? initialStakeholders : [
    { name: '', nationality: '', passport: '', email: '' }
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialStakeholders && initialStakeholders.length > 0) {
      setStakeholders(initialStakeholders);
    }
  }, [initialStakeholders]);

  const handleChange = (idx, field, value) => {
    const updated = [...stakeholders];
    updated[idx][field] = value;
    setStakeholders(updated);
  };

  const addStakeholder = () => {
    setStakeholders([...stakeholders, { name: '', nationality: '', passport: '', email: '' }]);
  };

  const removeStakeholder = (idx) => {
    if (stakeholders.length === 1) return;
    setStakeholders(stakeholders.filter((_, i) => i !== idx));
  };

  const isValid = stakeholders.every(s => s.name && s.nationality && s.passport && s.email);

  const handleContinue = async () => {
    setLoading(true);
    setError('');
    try {
      // First, delete all related documents for this onboardingId
      const { error: docDeleteError } = await supabase
        .from('Documents')
        .delete()
        .eq('onboarding_id', onboardingId);
      if (docDeleteError) {
        setError('Failed to clear previous stakeholder documents: ' + docDeleteError.message);
        setLoading(false);
        return;
      }
      // Then, delete all existing stakeholders for this onboardingId
      const { error: deleteError } = await supabase
        .from('Shareholder')
        .delete()
        .eq('onboarding_id', onboardingId);
      if (deleteError) {
        setError('Failed to clear previous stakeholders: ' + deleteError.message);
        setLoading(false);
        return;
      }
      // Insert new stakeholders
      const rows = stakeholders.map(s => ({
        name: s.name,
        nationality: s.nationality,
        passport_no: s.passport,
        email: s.email,
        onboarding_id: onboardingId,
      }));
      const { error } = await supabase.from('Shareholder').insert(rows);
      setLoading(false);
      if (error) {
        setError('Failed to save stakeholders. ' + (error.message || 'Please try again.'));
        console.error('Supabase insert error:', error);
        return;
      }
      onNext({ stakeholders });
    } catch (e) {
      setError('Unexpected error: ' + e.message);
      setLoading(false);
    }
  };

  return (
    <div className="step10-stakeholders d-flex vh-100 bg-dark text-white">
      <div className="form-container">
        <div className="card-container" style={{ maxHeight: '90vh', minHeight: '600px', overflowY: 'auto' }}>
          <h2 className="title">Stakeholder Details</h2>
          <p className="subtitle">Enter details for each stakeholder.</p>
          {error && <div className="alert alert-danger">{error}</div>}
          {stakeholders.map((s, idx) => (
            <div key={idx} className="mb-3 p-2 border rounded bg-secondary bg-opacity-10">
              <div className="mb-2">
                <label className="form-label text-white" style={{ fontSize: '0.9rem' }}>Full Name</label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  placeholder="Full Name"
                  value={s.name}
                  onChange={e => handleChange(idx, 'name', e.target.value)}
                  style={{ fontSize: '0.9rem', padding: '4px 8px' }}
                />
              </div>
              <div className="mb-2">
                <label className="form-label text-white" style={{ fontSize: '0.9rem' }}>Nationality</label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  placeholder="Nationality"
                  value={s.nationality}
                  onChange={e => handleChange(idx, 'nationality', e.target.value)}
                  style={{ fontSize: '0.9rem', padding: '4px 8px' }}
                />
              </div>
              <div className="mb-2">
                <label className="form-label text-white" style={{ fontSize: '0.9rem' }}>Passport Number</label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  placeholder="Passport Number"
                  value={s.passport}
                  onChange={e => handleChange(idx, 'passport', e.target.value)}
                  style={{ fontSize: '0.9rem', padding: '4px 8px' }}
                />
              </div>
              <div className="mb-2">
                <label className="form-label text-white" style={{ fontSize: '0.9rem' }}>Email</label>
                <input
                  type="email"
                  className="form-control form-control-sm"
                  placeholder="Email"
                  value={s.email}
                  onChange={e => handleChange(idx, 'email', e.target.value)}
                  style={{ fontSize: '0.9rem', padding: '4px 8px' }}
                />
              </div>
              <div className="mt-1 text-end">
                {stakeholders.length > 1 && (
                  <button className="btn btn-danger btn-sm" onClick={() => removeStakeholder(idx)}>
                    Remove
                  </button>
                )}
              </div>
            </div>
          ))}
          <button className="btn btn-outline-light mb-3" onClick={addStakeholder}>
            + Add Stakeholder
          </button>
          <div className="button-group">
            <button className="btn btn-secondary" onClick={onPrev}>
              Back
            </button>
            <button
              className="btn btn-outline-light fw-semibold"
              disabled={!isValid || loading}
              onClick={handleContinue}
            >
              {loading ? 'Saving...' : 'Continue'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
