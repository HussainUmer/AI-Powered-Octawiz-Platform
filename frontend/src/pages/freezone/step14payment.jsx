import React, { useState } from 'react';

export default function Step14Payment({ onboardingData = {}, onPrev, onPayment }) {
  const totalPrice = 5000 + (onboardingData.visaRequirement === '6+' ? 2000 : 1000);
  const [card, setCard] = useState({ number: '', name: '', expiry: '', cvv: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCard((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="step14-payment d-flex vh-100 bg-dark text-white">
      <div className="form-container">
        <div className="card-container">
          <h2 className="title mb-3">Payment</h2>
          <div className="mb-4" style={{ background: '#23272f', borderRadius: 12, padding: '1.25rem 1rem', color: '#fff', fontWeight: 500 }}>
            <div className="mb-2"><strong>Total Amount Due:</strong> <span style={{ color: '#0f0', fontSize: '1.1rem' }}>AED {totalPrice}</span></div>
            <div className="mb-2"><strong>Payment Method:</strong> Credit/Debit Card, Bank Transfer</div>
            <div className="mb-2"><strong>Reference:</strong> #OCTA-{Math.floor(100000 + Math.random() * 900000)}</div>
          </div>
          <div className="mb-4">
            <label className="form-label text-white">Card Number</label>
            <input
              type="text"
              className="form-control mb-2"
              name="number"
              maxLength={16}
              value={card.number}
              onChange={handleChange}
              placeholder="1234 5678 9012 3456"
              style={{ background: '#23272f', color: '#fff', border: '1px solid #444' }}
            />
            <label className="form-label text-white">Name on Card</label>
            <input
              type="text"
              className="form-control mb-2"
              name="name"
              value={card.name}
              onChange={handleChange}
              placeholder="Full Name"
              style={{ background: '#23272f', color: '#fff', border: '1px solid #444' }}
            />
            <div className="d-flex gap-2">
              <div className="flex-grow-1">
                <label className="form-label text-white">Expiry</label>
                <input
                  type="text"
                  className="form-control mb-2"
                  name="expiry"
                  maxLength={5}
                  value={card.expiry}
                  onChange={handleChange}
                  placeholder="MM/YY"
                  style={{ background: '#23272f', color: '#fff', border: '1px solid #444' }}
                />
              </div>
              <div style={{ width: 90 }}>
                <label className="form-label text-white">CVV</label>
                <input
                  type="password"
                  className="form-control mb-2"
                  name="cvv"
                  maxLength={3}
                  value={card.cvv}
                  onChange={handleChange}
                  placeholder="123"
                  style={{ background: '#23272f', color: '#fff', border: '1px solid #444' }}
                />
              </div>
            </div>
          </div>
          <div className="button-group">
            <button className="btn btn-secondary" onClick={onPrev}>Back</button>
            <button className="btn btn-success" onClick={onPayment}>Pay Now</button>
          </div>
        </div>
      </div>
    </div>
  );
}
