import React from 'react';

export default function MainlandBusinessProposal({ formData, setFormData, onNext, onPrev }) {
  const [proposal, setProposal] = React.useState(formData.businessProposal || '');

  const handleContinue = () => {
    setFormData({ ...formData, businessProposal: proposal });
    onNext();
  };

  return (
    <div className="d-flex vh-100 bg-dark text-white">
      <div className="form-container">
        <div className="card-container">
          <h2 className="title">Business Proposal</h2>
          <p className="subtitle mb-4">
            Please provide a brief description of your business activities and objectives.
          </p>

          <textarea
            className="form-control mb-4"
            rows="6"
            placeholder="Describe your business activities, target market, and objectives..."
            value={proposal}
            onChange={(e) => setProposal(e.target.value)}
          />

          <div className="button-group mt-3">
            <button className="btn btn-secondary" onClick={onPrev}>Back</button>
            <button
              className="btn btn-outline-light fw-semibold"
              disabled={!proposal.trim()}
              onClick={handleContinue}
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}