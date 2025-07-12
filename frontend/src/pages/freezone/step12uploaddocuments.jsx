import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function Step12UploadDocuments({ onNext, onPrev, onboardingId, previousDocuments = [], ownerStructureId }) {
  const [ownerStructureName, setOwnerStructureName] = useState('');

  useEffect(() => {
    async function fetchOwnerStructureName() {
      if (ownerStructureId === 3) {
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

const personalDocs = [
  { type: 'passport', label: 'Passport Copy', enabled: true },
  { type: 'visa', label: 'Visa Copy (if applicable)', enabled: true },
  { type: 'emirates_id', label: 'Emirates ID', enabled: true },
  { type: 'photo', label: 'Passport Size Photo', enabled: true },
];

  const [stakeholders, setStakeholders] = useState([]);
  const [personalFiles, setPersonalFiles] = useState({}); // { shareholder_id: { docType: File } }
  const [otherDocs, setOtherDocs] = useState([]);
  const [otherFiles, setOtherFiles] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [previousDocs, setPreviousDocs] = useState({ personal: {}, business: {} });

  useEffect(() => {
    // Fetch stakeholders for this onboarding
    const fetchStakeholders = async () => {
      const { data, error } = await supabase
        .from('Shareholder')
        .select('shareholder_id, name')
        .eq('onboarding_id', onboardingId);
      if (!error && data) setStakeholders(data);
    };
    fetchStakeholders();
  }, [onboardingId]);

  // Set previousDocs from previousDocuments prop on first mount after login
  useEffect(() => {
    if (previousDocuments && previousDocuments.length > 0) {
      const personal = {};
      previousDocuments.forEach(doc => {
        if (doc.type === 'personal' && doc.shareholder_id) {
          if (!personal[doc.shareholder_id]) personal[doc.shareholder_id] = {};
          const docType = personalDocs.find(d => d.label === doc.name)?.type;
          if (docType) personal[doc.shareholder_id][docType] = doc;
        }
      });
      setPreviousDocs({ personal });
    }
  }, [previousDocuments]);

  // Always fetch latest documents from DB when onboardingId changes (but only if not just set from props)
  useEffect(() => {
    if (onboardingId) {
      const fetchPreviousDocs = async () => {
        const { data, error } = await supabase
          .from('Documents')
          .select('*')
          .eq('onboarding_id', onboardingId);
        if (!error && data && data.length > 0) {
          const personal = {};
          data.forEach(doc => {
            if (doc.type === 'personal' && doc.shareholder_id) {
              if (!personal[doc.shareholder_id]) personal[doc.shareholder_id] = {};
              const docType = personalDocs.find(d => d.label === doc.name)?.type;
              if (docType) personal[doc.shareholder_id][docType] = doc;
            }
          });
          setPreviousDocs({ personal });
        }
      };
      fetchPreviousDocs();
    }
  }, [onboardingId]);

  const handlePersonalFileChange = (shareholder_id, docType, file) => {
    setPersonalFiles(prev => ({
      ...prev,
      [shareholder_id]: { ...prev[shareholder_id], [docType]: file }
    }));
  };
  const handleAddOtherDoc = () => {
    setOtherDocs(prev => [...prev, { name: '', file: null }]);
  };
  const handleOtherDocNameChange = (idx, name) => {
    setOtherDocs(prev => prev.map((doc, i) => i === idx ? { ...doc, name } : doc));
  };
  const handleOtherDocFileChange = (idx, file) => {
    setOtherDocs(prev => prev.map((doc, i) => i === idx ? { ...doc, file } : doc));
  };

  const handleContinue = async () => {
    setSaving(true);
    setError('');
    try {
      // Delete all existing documents for this onboardingId
      const { error: deleteError } = await supabase
        .from('Documents')
        .delete()
        .eq('onboarding_id', onboardingId);
      if (deleteError) {
        setError('Failed to clear previous documents: ' + deleteError.message);
        setSaving(false);
        return;
      }
      // Upload personal documents for each stakeholder
      for (const s of stakeholders) {
        for (const doc of personalDocs) {
          const file = personalFiles[s.shareholder_id]?.[doc.type];
          if (!file) continue;
          const filePath = `${onboardingId}/stakeholder_${s.shareholder_id}_${doc.type}_${Date.now()}_${file.name}`;
          const { error: uploadError } = await supabase.storage.from('documents').upload(filePath, file);
          if (uploadError) {
            setError('Failed to upload ' + doc.label + ' for ' + s.name + ': ' + uploadError.message);
            setSaving(false);
            return;
          }
          const { error: insertError } = await supabase.from('Documents').insert({
            onboarding_id: onboardingId,
            shareholder_id: s.shareholder_id,
            name: doc.label,
            type: 'personal',
            url: filePath,
            status: 'uploaded',
          });
          if (insertError) {
            setError('Failed to save document record for ' + doc.label + ' for ' + s.name + ': ' + insertError.message);
            setSaving(false);
            return;
          }
        }
      }
      // Upload other documents
      for (const doc of otherDocs) {
        if (!doc.file || !doc.name) continue;
        const filePath = `${onboardingId}/other_${Date.now()}_${doc.file.name}`;
        const { error: uploadError } = await supabase.storage.from('documents').upload(filePath, doc.file);
        if (uploadError) {
          setError('Failed to upload ' + doc.name + ': ' + uploadError.message);
          setSaving(false);
          return;
        }
        const { error: insertError } = await supabase.from('Documents').insert({
          onboarding_id: onboardingId,
          shareholder_id: null,
          name: doc.name,
          type: 'other',
          url: filePath,
          status: 'uploaded',
        });
        if (insertError) {
          setError('Failed to save document record for ' + doc.name + ': ' + insertError.message);
          setSaving(false);
          return;
        }
      }
      setSaving(false);
      onNext();
    } catch (e) {
      setError('Unexpected error: ' + e.message);
      setSaving(false);
    }
  };

  // Helper to get public URL for a file in Supabase Storage
  const getPublicUrl = (filePath) => {
    const { publicURL } = supabase.storage.from('documents').getPublicUrl(filePath);
    return publicURL;
  };

  const isEmiratesIdMandatory = stakeholders.length === 1
    ? !!personalFiles[stakeholders[0]?.shareholder_id]?.emirates_id
    : stakeholders.some(s => !!personalFiles[s.shareholder_id]?.emirates_id);

  const canContinue = isEmiratesIdMandatory;

  return (
    <div className="step12-uploaddocuments d-flex vh-100 bg-dark text-white">
      <div className="form-container">
        <div className="card-container" style={{ maxHeight: '90vh', minHeight: '400px', overflowY: 'auto' }}>
          <h2 className="title">Upload Documents</h2>
          <p className="subtitle">Upload required documents for your company registration.</p>
          {ownerStructureId === 3 && (
            <div className="alert alert-info" style={{ fontSize: '1rem', color: '#fff', background: '#23272f', border: '1px solid #0ff', marginBottom: '1rem' }}>
              As you have selected <b>{ownerStructureName || 'Branch of a Foreign Company'}</b>, please upload parent company documents in the <b>Other Documents</b> section below.
            </div>
          )}
          <h4 className="mt-4" style={{ color: 'white' }}>Stakeholder Documents</h4>
          {stakeholders.map(s => (
            <div key={s.shareholder_id} className="mb-4 p-2 border rounded bg-secondary bg-opacity-10">
              <div className="fw-bold mb-2" style={{ color: 'white' }}>{s.name}</div>
              {personalDocs.map(doc => {
                const prevDoc = previousDocs.personal[s.shareholder_id]?.[doc.type];
                const hasPrev = !!prevDoc;
                const hasNew = !!personalFiles[s.shareholder_id]?.[doc.type];
                return (
                  <div key={doc.type} className="mb-2 d-flex align-items-center justify-content-between">
                    <div>
                      <label className="form-label text-white" style={{ fontSize: '0.9rem' }}>{doc.label}</label>
                      <input
                        type="file"
                        className="form-control form-control-sm mt-1"
                        accept="application/pdf,image/*"
                        disabled={!doc.enabled}
                        onChange={e => doc.enabled && handlePersonalFileChange(s.shareholder_id, doc.type, e.target.files[0])}
                        style={{ fontSize: '0.9rem', padding: '4px 8px', maxWidth: 250 }}
                      />
                      {hasPrev && !hasNew && (
                        <div style={{ fontSize: '0.8rem', color: '#0ff', marginTop: 2 }}>
                          <a href={getPublicUrl(prevDoc.url)} target="_blank" rel="noopener noreferrer" style={{ color: '#0ff', textDecoration: 'underline' }}>
                            View previously uploaded
                          </a>
                          <span style={{ marginLeft: 8, color: '#aaa' }}>({prevDoc.url.split('_').pop()})</span>
                        </div>
                      )}
                    </div>
                    <div>
                      <span className={`badge ${hasNew || hasPrev ? 'bg-success' : 'bg-warning text-dark'}`}
                        style={{ fontSize: '0.85rem' }}>
                        {hasNew ? 'Uploaded' : hasPrev ? 'Previously Uploaded' : 'Pending'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
          <h4 className="mt-4" style={{ color: 'white' }}>Other Documents</h4>
          <button className="btn btn-outline-info mb-2" type="button" onClick={handleAddOtherDoc}>
            + Add Other Document
          </button>
          {otherDocs.map((doc, idx) => (
            <div key={idx} className="mb-2 d-flex align-items-center">
              <input
                type="text"
                className="form-control me-2"
                placeholder="Document Name"
                value={doc.name}
                onChange={e => handleOtherDocNameChange(idx, e.target.value)}
                style={{ maxWidth: 200 }}
              />
              <input
                type="file"
                className="form-control"
                onChange={e => handleOtherDocFileChange(idx, e.target.files[0])}
                style={{ maxWidth: 250 }}
              />
            </div>
          ))}
          {error && <div className="text-danger mt-2">{error}</div>}
          <div className="button-group">
            <button className="btn btn-secondary" onClick={onPrev} disabled={saving}>
              Back
            </button>
            <button
              className="btn btn-outline-light fw-semibold"
              disabled={saving || !canContinue}
              onClick={handleContinue}
            >
              {saving ? 'Saving...' : 'Continue'}
            </button>
          </div>
          {!canContinue && (
            <div className="text-danger mt-2">
              {stakeholders.length === 1
                ? 'Emirates ID is mandatory for the single stakeholder.'
                : 'At least one Emirates ID is mandatory for multiple stakeholders.'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
