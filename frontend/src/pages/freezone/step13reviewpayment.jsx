import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

export default function Step13ReviewPayment({ onboardingId, onPrev, onPayment }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [summary, setSummary] = useState({});

  useEffect(() => {
    const fetchSummary = async () => {
      setLoading(true);
      setError('');
      try {
        // Fetch onboarding row
        const { data: onboarding, error: onboardingError } = await supabase
          .from('Onboarding')
          .select('*')
          .eq('id', onboardingId)
          .single();
        if (onboardingError || !onboarding) throw onboardingError || new Error('No onboarding found');

        // Fetch related names
        let industryName = '-';
        let activityName = '-';
        let freezoneName = '-';
        // Industry
        if (onboarding.industry) {
          const { data } = await supabase.from('Industry').select('name').eq('id', onboarding.industry).single();
          industryName = data?.name || '-';
        }
        // Activity or custom_activity
        if (onboarding.custom_activity) {
          activityName = onboarding.custom_activity;
        } else if (onboarding.activity) {
          const { data } = await supabase.from('Activities').select('name').eq('id', onboarding.activity).single();
          activityName = data?.name || '-';
        }
        // Freezone
        if (onboarding.freezone) {
          // Try to fetch by id or name
          let freezoneData = null;
          // Try by id first
          const { data: byId } = await supabase.from('Freezones').select('name').eq('id', onboarding.freezone).single();
          if (byId && byId.name) {
            freezoneData = byId;
          } else {
            // Try by name
            const { data: byName } = await supabase.from('Freezones').select('name').eq('name', onboarding.freezone).single();
            if (byName && byName.name) freezoneData = byName;
          }
          freezoneName = freezoneData?.name || onboarding.freezone || '-';
        }
        // Format office type
        let officeType = onboarding.office_type || '-';
        if (officeType && officeType !== '-') {
          officeType = officeType.replace(/-/g, ' ');
          officeType = officeType.charAt(0).toUpperCase() + officeType.slice(1);
        }
        setSummary({
          industry: industryName,
          activity: activityName,
          freezone: freezoneName,
          visaRequirement: onboarding.visa_requirement || '-',
          officeType: officeType,
          tradeName: onboarding.trade_name || '-',
        });
      } catch (e) {
        setError('Failed to load summary: ' + (e.message || e));
      }
      setLoading(false);
    };
    if (onboardingId) fetchSummary();
  }, [onboardingId]);

  // Example price calculation (replace with real logic as needed)
  const totalPrice = 5000 + (summary.visaRequirement === '6+' ? 2000 : 1000);

  return (
    <div className="step13-review-payment d-flex vh-100 bg-dark text-white">
      <div className="form-container">
        <div className="card-container">
          <h2 className="title mb-3">Review & Confirm</h2>
          <div className="mb-3" style={{ fontWeight: 700, fontSize: '1.25rem', color: '#fff', letterSpacing: 0.5, borderBottom: '1px solid #444', paddingBottom: 6 }}>
            Summary
          </div>
          {loading ? (
            <div className="text-white">Loading summary...</div>
          ) : error ? (
            <div className="alert alert-danger">{error}</div>
          ) : (
            <div className="options-container mb-4" style={{ background: '#23272f', borderRadius: 12, padding: '1.25rem 1rem', color: '#fff', boxShadow: '0 2px 8px #0002' }}>
              <div className="mb-2"><strong>Industry:</strong> <span>{summary.industry}</span></div>
              <div className="mb-2"><strong>Activity:</strong> <span>{summary.activity}</span></div>
              <div className="mb-2"><strong>Freezone:</strong> <span>{summary.freezone}</span></div>
              <div className="mb-2"><strong>Visa Requirement:</strong> <span>{summary.visaRequirement}</span></div>
              <div className="mb-2"><strong>Office Type:</strong> <span>{summary.officeType}</span></div>
              <div className="mb-2"><strong>Trade Name:</strong> <span>{summary.tradeName}</span></div>
              <div className="mb-2"><strong>Total Price:</strong> <span style={{ color: '#0f0' }}>AED {totalPrice}</span></div>
            </div>
          )}
          <div className="button-group">
            <button className="btn btn-secondary" onClick={onPrev} disabled={loading}>Change</button>
            <button className="btn btn-success" onClick={onPayment} disabled={loading || !!error}>Proceed to Payment</button>
          </div>
        </div>
      </div>
    </div>
  );
}
