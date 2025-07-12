import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

// Accept ownerStructureId as a prop
export default function Step10Stakeholders({ onNext, onPrev, onboardingId, initialStakeholders, ownerStructureId }) {
  const [ownerStructureName, setOwnerStructureName] = useState('');

  useEffect(() => {
    async function fetchOwnerStructureName() {
      if (ownerStructureId) {
        const { data, error } = await supabase
          .from('Ownership_structure')
          .select('struture_name')
          .eq('id', ownerStructureId)
          .single();
        if (data && data.struture_name) setOwnerStructureName(data.struture_name);
      }
    }
    fetchOwnerStructureName();
  }, [ownerStructureId]);
  // Accept ownerStructureId prop
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

  const removeStakeholder = async (idx) => {
    if (stakeholders.length === 1) return;
    const s = stakeholders[idx];
    setStakeholders(stakeholders.filter((_, i) => i !== idx));
    // Remove from DB if exists
    if (s.passport && onboardingId) {
      await supabase.from('Shareholder')
        .delete()
        .eq('passport_no', s.passport)
        .eq('onboarding_id', onboardingId);
    }
  };

  const isValid = stakeholders.every(s => s.name && s.nationality && s.passport && s.email);

  const handleContinue = async () => {
    setLoading(true);
    setError('');
    // Fetch existing stakeholders for this onboarding
    let { data: existingStakeholders, error: fetchError } = await supabase
      .from('Shareholder')
      .select('*')
      .eq('onboarding_id', onboardingId);
    if (fetchError) {
      setLoading(false);
      setError('Failed to check existing stakeholders. Please try again.');
      return;
    }
    const toInsert = [];
    const toUpdate = [];
    // Special case: single stakeholder, passport changed
    if (existingStakeholders.length === 1 && stakeholders.length === 1) {
      const old = existingStakeholders[0];
      const current = stakeholders[0];
      if (old.passport_no !== current.passport) {
        // Delete old
        await supabase.from('Shareholder')
          .delete()
          .eq('passport_no', old.passport_no)
          .eq('onboarding_id', onboardingId);
        // Insert new
        toInsert.push({
          name: current.name,
          nationality: current.nationality,
          passport_no: current.passport,
          email: current.email,
          onboarding_id: onboardingId,
        });
      } else {
        // Just update as usual
        toUpdate.push({
          passport_no: current.passport,
          onboarding_id: onboardingId,
          name: current.name,
          nationality: current.nationality,
          email: current.email
        });
      }
    } else {
      // Normal multi-stakeholder logic
      for (const s of stakeholders) {
        const match = existingStakeholders.find(e =>
          e.passport_no === s.passport
        );
        if (!match) {
          toInsert.push({
            name: s.name,
            nationality: s.nationality,
            passport_no: s.passport,
            email: s.email,
            onboarding_id: onboardingId,
          });
        } else {
          toUpdate.push({
            passport_no: s.passport,
            onboarding_id: onboardingId,
            name: s.name,
            nationality: s.nationality,
            email: s.email
          });
        }
      }
    }
    // Insert new stakeholders
    if (toInsert.length > 0) {
      const { error: insertError } = await supabase.from('Shareholder').insert(toInsert);
      if (insertError) {
        setLoading(false);
        setError('Failed to save new stakeholders. Please try again.');
        return;
      }
    }
    // Update all matching passport rows
    if (toUpdate.length > 0) {
      const updatePromises = toUpdate.map(async upd => {
        const result = await supabase.from('Shareholder')
          .update({ name: upd.name, nationality: upd.nationality, email: upd.email })
          .eq('passport_no', upd.passport_no)
          .eq('onboarding_id', upd.onboarding_id);
        return result;
      });
      const updateResults = await Promise.all(updatePromises);
      const updateError = updateResults.find(r => r.error);
      if (updateError) {
        setLoading(false);
        setError('Failed to update one or more stakeholders. ' + (updateError.error?.message || 'Please try again.'));
        return;
      }
    }
    setLoading(false);
    onNext({ stakeholders });
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
          <button className="btn btn-outline-light mb-3" onClick={addStakeholder} disabled={ownerStructureId === 1}>
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
