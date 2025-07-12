import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useParams, useNavigate } from 'react-router-dom';

export default function UserDetails() {
  const { onboardingId } = useParams();
  const [summary, setSummary] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [shareholders, setShareholders] = useState([]);
  const [mainlandInfo, setMainlandInfo] = useState(null);
  const [offshoreInfo, setOffshoreInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      // Try to fetch onboarding row
      const { data: onboarding } = await supabase
        .from('Onboarding')
        .select('*')
        .eq('id', onboardingId)
        .single();
      if (onboarding) {
        // Freezone user
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
        // Fetch shareholder equity
        const { data: shareholders } = await supabase
          .from('Shareholder')
          .select('name, email, nationality, shares, percentage, share_capital')
          .eq('onboarding_id', onboardingId);
        setShareholders(shareholders || []);
      } else {
        // Try Mainland
        const { data: mainland } = await supabase
          .from('MainlandUserInfo')
          .select('*')
          .eq('id', onboardingId)
          .single();
        if (mainland) setMainlandInfo(mainland);
        // Try Offshore
        const { data: offshore } = await supabase
          .from('OffshoreUserInfo')
          .select('*')
          .eq('id', onboardingId)
          .single();
        if (offshore) setOffshoreInfo(offshore);
      }
      setLoading(false);
    };
    fetchDetails();
  }, [onboardingId, saving]);

  const getPublicUrl = (filePath) => {
    return `https://sumolzzumompsruijhfo.supabase.co/storage/v1/object/public/documents/${filePath}`;
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/signin';
  };

  const handleToggle = async (field) => {
    if (!summary) return;
    setSaving(true);
    const { error } = await supabase
      .from('Onboarding')
      .update({ [field]: !summary[field] })
      .eq('id', onboardingId);
    setSaving(false);
    if (!error) {
      setSummary((prev) => ({ ...prev, [field]: !prev[field] }));
    }
  };

  if (loading) return <div className="d-flex vh-100 bg-dark text-white align-items-center justify-content-center">Loading...</div>;
  if (!summary && !mainlandInfo && !offshoreInfo) return <div className="d-flex vh-100 bg-dark text-white align-items-center justify-content-center">No data found.</div>;

  return (
    <div className="d-flex vh-100 bg-dark text-white align-items-center justify-content-center">
      <div className="card-container p-4 shadow w-100" style={{ maxWidth: 950, background: '#181c24', borderRadius: 16, boxShadow: '0 2px 16px #0002' }}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <button className="btn btn-secondary" onClick={() => navigate('/admin')}>&larr; Back to Dashboard</button>
          <button className="btn btn-danger btn-sm fw-semibold" onClick={handleLogout}>Logout</button>
        </div>
        <h2 className="mb-4 text-center title" style={{ color: 'var(--color-primary)' }}>User Journey Details</h2>
        {/* Freezone user details */}
        {summary && (
          <>
            <div className="mb-4" style={{ background: '#23272f', borderRadius: 12, padding: '1.25rem 1rem', color: '#fff', boxShadow: '0 2px 8px #0002' }}>
              <div className="mb-2"><strong>Industry:</strong> <span>{summary.industryName || ''}</span></div>
              <div className="mb-2"><strong>Activity:</strong> <span>{summary.activityName || ''}</span></div>
              <div className="mb-2"><strong>Freezone:</strong> <span>{summary.freezoneName || ''}</span></div>
              <div className="mb-2"><strong>Visa Requirement:</strong> <span>{summary.visa_requirement || ''}</span></div>
              <div className="mb-2"><strong>Office Type:</strong> <span>{(summary.office_type || '').replace(/[_-]/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</span></div>
              <div className="mb-2"><strong>Trade Name:</strong> <span>{summary.trade_name || ''}</span></div>
              <div className="mb-2"><strong>Trade Name 2:</strong> <span>{summary.trade_name2 || ''}</span></div>
              <div className="mb-2"><strong>Trade Name 3:</strong> <span>{summary.trade_name3 || ''}</span></div>
              <div className="mb-2"><strong>Total Share Capital:</strong> <span>{summary.total_share_capital || ''}</span></div>
              <div className="mb-2"><strong>Value per Share:</strong> <span>{summary.value_per_share || ''}</span></div>
              <div className="mb-2"><strong>Total Shares:</strong> <span>{summary.total_shares || ''}</span></div>
            </div>
            {/* Shareholder Equity Section */}
            <div className="mb-4" style={{ background: '#23272f', borderRadius: 12, padding: '1.25rem 1rem', color: '#fff', boxShadow: '0 2px 8px #0002' }}>
              <h5 className="mb-2">Shareholder Equity & Capital</h5>
              <div className="table-responsive">
                <table className="table table-dark table-hover align-middle" style={{ borderRadius: 12, overflow: 'hidden' }}>
                  <thead style={{ background: '#23272f' }}>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Nationality</th>
                      <th>Shares</th>
                      <th>Percentage</th>
                      <th>Share Capital (AED)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {shareholders.map(s => (
                      <tr key={s.name + s.email} style={{ background: '#23272f' }}>
                        <td>{s.name}</td>
                        <td>{s.email}</td>
                        <td>{s.nationality}</td>
                        <td>{s.shares}</td>
                        <td>{s.percentage}%</td>
                        <td>{s.share_capital}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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
          </>
        )}
        {/* Mainland user details */}
        {mainlandInfo && (
          <div className="mb-4" style={{ background: '#23272f', borderRadius: 12, padding: '1.25rem 1rem', color: '#fff', boxShadow: '0 2px 8px #0002' }}>
            <h5 className="mb-2">Mainland User Info</h5>
            <div className="mb-2"><strong>Business Name:</strong> <span>{mainlandInfo.business_name}</span></div>
            <div className="mb-2"><strong>Legal Structure:</strong> <span>{mainlandInfo.legal_structure}</span></div>
            <div className="mb-2"><strong>Full Name:</strong> <span>{mainlandInfo.full_name}</span></div>
            <div className="mb-2"><strong>Phone Number:</strong> <span>{mainlandInfo.phone_number}</span></div>
            <div className="mb-2"><strong>Email Address:</strong> <span>{mainlandInfo.email_address}</span></div>
            <div className="mb-2"><strong>Estimated Employees Range:</strong> <span>{mainlandInfo.estimated_employees_range}</span></div>
            <div className="mb-2"><strong>Business Proposal:</strong> <span>{mainlandInfo.business_proposal}</span></div>
            <div className="mb-2"><strong>Notes:</strong> <span>{mainlandInfo.notes}</span></div>
            </div>
        )}
        {/* Offshore user details */}
        {offshoreInfo && (
          <div className="mb-4" style={{ background: '#23272f', borderRadius: 12, padding: '1.25rem 1rem', color: '#fff', boxShadow: '0 2px 8px #0002' }}>
            <h5 className="mb-2">Offshore User Info</h5>
            <div className="mb-2"><strong>Business Name:</strong> <span>{offshoreInfo.business_name}</span></div>
            <div className="mb-2"><strong>Jurisdiction:</strong> <span>{offshoreInfo.jurisdiction}</span></div>
            <div className="mb-2"><strong>Contact Name:</strong> <span>{offshoreInfo.contact_name}</span></div>
            <div className="mb-2"><strong>Contact Phone:</strong> <span>{offshoreInfo.contact_phone}</span></div>
            <div className="mb-2"><strong>Contact Email:</strong> <span>{offshoreInfo.contact_email}</span></div>
            <div className="mb-2"><strong>Estimated Share Capital:</strong> <span>{offshoreInfo.estimated_share_capital}</span></div>
            <div className="mb-2"><strong>Preferred Language:</strong> <span>{offshoreInfo.preferred_language}</span></div>
            <div className="mb-2"><strong>Business Proposal:</strong> <span>{offshoreInfo.business_proposal}</span></div>
            <div className="mb-2"><strong>Notes:</strong> <span>{offshoreInfo.notes}</span></div>
            </div>
        )}
        {/* Admin Approval Buttons Section: Only show for Freezone users */}
        {summary && !mainlandInfo && !offshoreInfo && (
          <div className="mb-2 d-flex gap-3 align-items-center mt-4" style={{ color: '#fff' }}>
            <strong>Visa Approved:</strong>
            {typeof summary.visa_approved !== 'undefined' && (
              <button
                type="button"
                className={`btn btn-xs ${summary.visa_approved ? 'btn-success' : 'btn-outline-success'}`}
                style={summary.visa_approved
                  ? { minWidth: 90, fontSize: '0.85rem', padding: '2px 10px', color: '#fff', backgroundColor: '#198754', borderColor: '#198754',
                      boxShadow: 'none',
                      outline: 'none',
                      background: '#198754 !important',
                      color: '#fff !important',
                      borderColor: '#198754 !important',
                    }
                  : { minWidth: 90, fontSize: '0.85rem', padding: '2px 10px' }}
                disabled={saving}
                onClick={() => handleToggle('visa_approved')}
              >
                {summary.visa_approved ? 'Approved' : 'Mark Approved'}
              </button>
            )}
            <strong>License Approved:</strong>
            {typeof summary.license_approved !== 'undefined' && (
              <button
                type="button"
                className={`btn btn-xs ${summary.license_approved ? 'btn-success' : 'btn-outline-success'}`}
                style={summary.license_approved
                  ? { minWidth: 90, fontSize: '0.85rem', padding: '2px 10px', color: '#fff', backgroundColor: '#198754', borderColor: '#198754',
                      boxShadow: 'none',
                      outline: 'none',
                      background: '#198754 !important',
                      color: '#fff !important',
                      borderColor: '#198754 !important',
                    }
                  : { minWidth: 90, fontSize: '0.85rem', padding: '2px 10px' }}
                disabled={saving}
                onClick={() => handleToggle('license_approved')}
              >
                {summary.license_approved ? 'Approved' : 'Mark Approved'}
              </button>
            )}
            <strong>Trade Name Approved:</strong>
            {typeof summary.tradename_approved !== 'undefined' && (
              <button
                type="button"
                className={`btn btn-xs ${summary.tradename_approved ? 'btn-success' : 'btn-outline-success'}`}
                style={summary.tradename_approved
                  ? { minWidth: 90, fontSize: '0.85rem', padding: '2px 10px', color: '#fff', backgroundColor: '#198754', borderColor: '#198754',
                      boxShadow: 'none',
                      outline: 'none',
                      background: '#198754 !important',
                      color: '#fff !important',
                      borderColor: '#198754 !important',
                    }
                  : { minWidth: 90, fontSize: '0.85rem', padding: '2px 10px' }}
                disabled={saving}
                onClick={() => handleToggle('tradename_approved')}
              >
                {summary.tradename_approved ? 'Approved' : 'Mark Approved'}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
