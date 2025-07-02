import React, { useState } from 'react';

const docs = [
  { type: 'passport', label: 'Passport Copy', enabled: true },
  { type: 'visa', label: 'Visa Copy (if applicable)', enabled: false },
  { type: 'emirates_id', label: 'Emirates ID (if available)', enabled: false },
  { type: 'photo', label: 'Passport Size Photo', enabled: false },
  { type: 'business_plan', label: 'Business Plan (if required)', enabled: false },
];

export default function Step12UploadDocuments({ onNext, onPrev }) {
  const [files, setFiles] = useState({});

  const handleFileChange = (type, file) => {
    setFiles(prev => ({ ...prev, [type]: file }));
  };

  return (
    <div className="step12-uploaddocuments d-flex vh-100 bg-dark text-white">
      <div className="form-container">
        <div className="card-container" style={{ maxHeight: '90vh', minHeight: '400px', overflowY: 'auto' }}>
          <h2 className="title">Upload Documents</h2>
          <p className="subtitle">Upload required documents for your company registration.</p>
          {docs.map((doc, idx) => (
            <div key={doc.type} className="mb-3 p-2 border rounded bg-secondary bg-opacity-10 d-flex align-items-center justify-content-between">
              <div>
                <label className="form-label text-white" style={{ fontSize: '0.9rem' }}>{doc.label}</label>
                <input
                  type="file"
                  className="form-control form-control-sm mt-1"
                  accept="application/pdf,image/*"
                  disabled={!doc.enabled}
                  onChange={e => doc.enabled && handleFileChange(doc.type, e.target.files[0])}
                  style={{ fontSize: '0.9rem', padding: '4px 8px', maxWidth: 250 }}
                />
              </div>
              <div>
                <span className={`badge ${files[doc.type] ? 'bg-success' : 'bg-warning text-dark'}`}
                  style={{ fontSize: '0.85rem' }}>
                  {files[doc.type] ? 'Uploaded' : 'Pending'}
                </span>
              </div>
            </div>
          ))}
          <div className="button-group">
            <button className="btn btn-secondary" onClick={onPrev}>
              Back
            </button>
            <button
              className="btn btn-outline-light fw-semibold"
              disabled={false}
              onClick={() => onNext({ documents: files })}
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
