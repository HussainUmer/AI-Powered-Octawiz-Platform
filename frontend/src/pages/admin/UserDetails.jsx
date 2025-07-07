import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useParams, useNavigate } from 'react-router-dom';

export default function UserDetails() {
  const { onboardingId } = useParams();
  const [summary, setSummary] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      // Fetch onboarding row
      const { data: onboarding } = await supabase
        .from('Onboarding')
        .select('*')
        .eq('id', onboardingId)
        .single();
      // Fetch related names
      let industryName = '-';
      let activityName = '-';
      let freezoneName = '-';
      if (onboarding?.industry) {
        const { data } = await supabase.from('Industry').select('name').eq('id', onboarding.industry).single();
        industryName = data?.name || '-';
      }
      if (onboarding?.custom_activity) {
        activityName = onboarding.custom_activity;
      } else if (onboarding?.activity) {
        const { data } = await supabase.from('Activities').select('name').eq('id', onboarding.activity).single();
        activityName = data?.name || '-';
      }
      if (onboarding?.freezone) {
        const { data } = await supabase.from('Freezones').select('name').eq('id', onboarding.freezone).single();
        freezoneName = data?.name || '-';
      }
      setSummary({
        ...onboarding,
        industryName,
        activityName,
        freezoneName
      });
      const { data: docs } = await supabase
        .from('Documents')
        .select('*')
        .eq('onboarding_id', onboardingId);
      setDocuments(docs || []);
      setLoading(false);
    };
    fetchDetails();
  }, [onboardingId]);

  const getPublicUrl = (filePath) => {
    return `https://sumolzzumompsruijhfo.supabase.co/storage/v1/object/public/documents/${filePath}`;
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/signin';
  };

  if (loading) return <div className="d-flex vh-100 bg-dark text-white align-items-center justify-content-center">Loading...</div>;
  if (!summary) return <div className="d-flex vh-100 bg-dark text-white align-items-center justify-content-center">No data found.</div>;

  return (
    <div className="d-flex vh-100 bg-dark text-white align-items-center justify-content-center">
      <div className="card-container p-4 shadow w-100" style={{ maxWidth: 950, background: '#181c24', borderRadius: 16, boxShadow: '0 2px 16px #0002' }}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <button className="btn btn-secondary" onClick={() => navigate('/admin')}>&larr; Back to Dashboard</button>
          <button className="btn btn-danger btn-sm fw-semibold" onClick={handleLogout}>Logout</button>
        </div>
        <h2 className="mb-4 text-center title" style={{ color: 'var(--color-primary)' }}>User Journey Details</h2>
        <div className="mb-4" style={{ background: '#23272f', borderRadius: 12, padding: '1.25rem 1rem', color: '#fff', boxShadow: '0 2px 8px #0002' }}>
          <div className="mb-2"><strong>Industry:</strong> <span>{summary.industryName}</span></div>
          <div className="mb-2"><strong>Activity:</strong> <span>{summary.activityName}</span></div>
          <div className="mb-2"><strong>Freezone:</strong> <span>{summary.freezoneName}</span></div>
          <div className="mb-2"><strong>Visa Requirement:</strong> <span>{summary.visa_requirement}</span></div>
          <div className="mb-2"><strong>Office Type:</strong> <span>{summary.office_type}</span></div>
          <div className="mb-2"><strong>Trade Name:</strong> <span>{summary.trade_name}</span></div>
        </div>
        <div>
          <h5 className="mb-2">Uploaded Documents</h5>
          <div className="table-responsive">
            <table className="table table-dark table-hover align-middle" style={{ borderRadius: 12, overflow: 'hidden' }}>
              <thead style={{ background: '#23272f' }}>
                <tr>
                  <th>Document Name</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Download</th>
                </tr>
              </thead>
              <tbody>
                {documents.map(doc => (
                  <tr key={doc.id} style={{ background: '#23272f' }}>
                    <td>{doc.name}</td>
                    <td>{doc.type}</td>
                    <td><span className={`badge ${doc.status === 'uploaded' ? 'bg-success' : 'bg-warning text-dark'}`}>{doc.status}</span></td>
                    <td>
                      <a href={getPublicUrl(doc.url)} target="_blank" rel="noopener noreferrer" className="btn btn-outline-info btn-sm fw-semibold">
                        Download
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
