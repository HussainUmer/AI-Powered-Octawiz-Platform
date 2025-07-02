import React from 'react';

export default function Step13ReviewPayment({ onboardingData = {}, onPrev, onPayment }) {
  // Example price calculation (replace with real logic as needed)
  const totalPrice = 5000 + (onboardingData.visaRequirement === '6+' ? 2000 : 1000);

  return (
    <div className="step13-review-payment d-flex vh-100 bg-dark text-white">
      <div className="form-container">
        <div className="card-container">
          <h2 className="title mb-3">Review & Confirm</h2>
          <div className="mb-3" style={{ fontWeight: 700, fontSize: '1.25rem', color: '#fff', letterSpacing: 0.5, borderBottom: '1px solid #444', paddingBottom: 6 }}>
            Summary
          </div>
          <div className="options-container mb-4" style={{ background: '#23272f', borderRadius: 12, padding: '1.25rem 1rem', color: '#fff', boxShadow: '0 2px 8px #0002' }}>
            <div className="mb-2"><strong style={{ color: '#fff' }}>Business Type:</strong> <span style={{ color: '#fff' }}>{onboardingData.category || '-'}</span></div>
            <div className="mb-2"><strong style={{ color: '#fff' }}>Visa Count:</strong> <span style={{ color: '#fff' }}>{onboardingData.visaRequirement || '-'}</span></div>
            <div className="mb-2"><strong style={{ color: '#fff' }}>Zone:</strong> <span style={{ color: '#fff' }}>{onboardingData.industryName || '-'}</span></div>
            <div className="mb-2"><strong style={{ color: '#fff' }}>Office Type:</strong> <span style={{ color: '#fff' }}>{onboardingData.officePreference || '-'}</span></div>
            <div className="mb-2"><strong style={{ color: '#fff' }}>Total Price:</strong> <span style={{ color: '#0f0' }}>AED {totalPrice}</span></div>
          </div>
          <div className="button-group">
            <button className="btn btn-secondary" onClick={onPrev}>Change</button>
            <button className="btn btn-success" onClick={onPayment}>Proceed to Payment</button>
          </div>
        </div>
      </div>
    </div>
  );
}
