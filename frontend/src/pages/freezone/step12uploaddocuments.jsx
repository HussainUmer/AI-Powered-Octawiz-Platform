import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const personalDocs = [
  { type: 'passport', label: 'Passport Copy', enabled: true },
  { type: 'visa', label: 'Visa Copy (if applicable)', enabled: false },
  { type: 'emirates_id', label: 'Emirates ID (if available)', enabled: false },
  { type: 'photo', label: 'Passport Size Photo', enabled: false },
];
const businessDocs = [
  { type: 'business_plan', label: 'Business Plan (if required)', enabled: true },
  // Add more business doc types as needed
];

export default function Step12UploadDocuments({ onNext, onPrev, onboardingId, previousDocuments = [] }) {
  const [stakeholders, setStakeholders] = useState([]);
  const [personalFiles, setPersonalFiles] = useState({}); // { shareholder_id: { docType: File } }
  const [businessFiles, setBusinessFiles] = useState({}); // { docType: File }
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
      const business = {};
      previousDocuments.forEach(doc => {
        if (doc.type === 'personal' && doc.shareholder_id) {
          if (!personal[doc.shareholder_id]) personal[doc.shareholder_id] = {};
          const docType = personalDocs.find(d => d.label === doc.name)?.type;
          if (docType) personal[doc.shareholder_id][docType] = doc;
        } else if (doc.type === 'business') {
          const docType = businessDocs.find(d => d.label === doc.name)?.type;
          if (docType) business[docType] = doc;
        }
      });
      setPreviousDocs({ personal, business });
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
          const business = {};
          data.forEach(doc => {
            if (doc.type === 'personal' && doc.shareholder_id) {
              if (!personal[doc.shareholder_id]) personal[doc.shareholder_id] = {};
              const docType = personalDocs.find(d => d.label === doc.name)?.type;
              if (docType) personal[doc.shareholder_id][docType] = doc;
            } else if (doc.type === 'business') {
              const docType = businessDocs.find(d => d.label === doc.name)?.type;
              if (docType) business[docType] = doc;
            }
          });
          setPreviousDocs({ personal, business });
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
  const handleBusinessFileChange = (docType, file) => {
    setBusinessFiles(prev => ({ ...prev, [docType]: file }));
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
      // Upload business documents
      for (const doc of businessDocs) {
        const file = businessFiles[doc.type];
        if (!file) continue;
        const filePath = `${onboardingId}/business_${doc.type}_${Date.now()}_${file.name}`;
        const { error: uploadError } = await supabase.storage.from('documents').upload(filePath, file);
        if (uploadError) {
          setError('Failed to upload ' + doc.label + ': ' + uploadError.message);
          setSaving(false);
          return;
        }
        const { error: insertError } = await supabase.from('Documents').insert({
          onboarding_id: onboardingId,
          shareholder_id: null,
          name: doc.label,
          type: 'business',
          url: filePath,
          status: 'uploaded',
        });
        if (insertError) {
          setError('Failed to save document record for ' + doc.label + ': ' + insertError.message);
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

  return (
    <div className="step12-uploaddocuments d-flex vh-100 bg-dark text-white">
      <div className="form-container">
        <div className="card-container" style={{ maxHeight: '90vh', minHeight: '400px', overflowY: 'auto' }}>
          <h2 className="title">Upload Documents</h2>
          <p className="subtitle">Upload required documents for your company registration.</p>
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
          <h4 className="mt-4" style={{ color: 'white' }}>Business Documents</h4>
          {businessDocs.map(doc => {
            const prevDoc = previousDocs.business[doc.type];
            const hasPrev = !!prevDoc;
            const hasNew = !!businessFiles[doc.type];
            return (
              <div key={doc.type} className="mb-2 d-flex align-items-center justify-content-between">
                <div>
                  <label className="form-label text-white" style={{ fontSize: '0.9rem' }}>{doc.label}</label>
                  <input
                    type="file"
                    className="form-control form-control-sm mt-1"
                    accept="application/pdf,image/*"
                    disabled={!doc.enabled}
                    onChange={e => doc.enabled && handleBusinessFileChange(doc.type, e.target.files[0])}
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
          {error && <div className="text-danger mt-2">{error}</div>}
          <div className="button-group">
            <button className="btn btn-secondary" onClick={onPrev} disabled={saving}>
              Back
            </button>
            <button
              className="btn btn-outline-light fw-semibold"
              disabled={saving}
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
