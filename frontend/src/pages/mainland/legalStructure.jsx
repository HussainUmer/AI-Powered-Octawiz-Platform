import React, { useState } from 'react';

const legalStructures = [
  {
    id: 'llc',
    name: 'Limited Liability Company (LLC)',
    description: 'Most common. Allows multiple shareholders. 51% local UAE sponsor required unless 100% foreign-owned (depending on activity).',
    learnMore: 'An LLC is the most popular legal form for most commercial activities in the UAE mainland.'
  },
  {
    id: 'sole',
    name: 'Sole Establishment',
    description: 'Owned 100% by a single UAE national (not available for expats).',
    learnMore: 'A sole establishment is only available to UAE nationals and is not open to expats.'
  },
  {
    id: 'civil',
    name: 'Civil Company',
    description: 'For professional services. 100% foreign ownership possible; local service agent required.',
    learnMore: 'Civil companies are for professional activities and allow 100% foreign ownership with a local service agent.'
  },
  {
    id: 'pjsc',
    name: 'Private Joint Stock Company',
    description: 'For large businesses with multiple shareholders and capital requirements.',
    learnMore: 'A PJSC is suitable for large businesses and requires significant capital and multiple shareholders.'
  },
  {
    id: 'branch',
    name: 'Branch of Foreign Company',
    description: 'For international companies wanting to open a branch in the UAE.',
    learnMore: 'A branch allows a foreign company to operate in the UAE without a separate legal entity.'
  },
  {
    id: 'rep',
    name: 'Representative Office',
    description: 'Promotional presence only; not allowed to conduct commercial activity.',
    learnMore: 'A representative office can promote but not conduct commercial activities in the UAE.'
  },
];

export default function MainlandLegalStructure({ onNext, onPrev, recommended }) {
  const [selected, setSelected] = useState('');
  const [showLearnMore, setShowLearnMore] = useState(null);

  return (
    <div className="step3-industry d-flex vh-100 bg-dark text-white">
      <div className="form-container">
        <div className="card-container">
          <h2 className="title">Choose Legal Structure</h2>
          <p className="subtitle mb-3">
            The legal structure defines your company's legal identity, liability model, ownership options, and licensing path.
            <button className="btn btn-link text-info p-0 ms-2" style={{fontSize:'1em'}} onClick={() => setShowLearnMore('intro')}>Learn More</button>
          </p>
          {showLearnMore === 'intro' && (
            <div className="alert alert-info" onClick={() => setShowLearnMore(null)} style={{cursor:'pointer'}}>
              <strong>Legal Structure:</strong> Determines liability, ownership, and licensing. Click any structure's "Learn More" for details. (Click to close)
            </div>
          )}
          {recommended && (
            <div className="alert alert-success mb-3">
              <span role="img" aria-label="ai">🧠</span> Based on your selections, we recommend: <strong>{recommended}</strong>
            </div>
          )}
          <div className="options-container" style={{gap: '1.5rem'}}>
            {legalStructures.map(structure => (
              <div
                key={structure.id}
                className={`option-card d-flex flex-row align-items-start p-3 mb-2 ${selected === structure.id ? 'selected border border-primary shadow' : 'border'}`}
                style={{ cursor: 'pointer', background: selected === structure.id ? 'rgba(107,70,193,0.10)' : 'rgba(255,255,255,0.03)', borderRadius: '12px', transition: 'background 0.2s, border 0.2s' }}
                onClick={() => setSelected(structure.id)}
              >
                <input
                  type="radio"
                  checked={selected === structure.id}
                  readOnly
                  className="me-3 mt-1"
                  style={{minWidth: '1.2em', minHeight: '1.2em'}}
                />
                <div style={{flex: 1}}>
                  <div className="option-label fw-semibold" style={{fontSize: '1.1em', color: '#fff'}}>{structure.name}</div>
                  <div style={{fontSize:'0.98em', color: '#bdbdbd', marginBottom: '0.5rem'}}>{structure.description}</div>
                  <button className="btn btn-link text-info p-0 mt-1" style={{fontSize:'0.95em'}} onClick={e => {e.stopPropagation(); setShowLearnMore(structure.id);}}>Learn More</button>
                  {showLearnMore === structure.id && (
                    <div className="alert alert-info mt-2" onClick={e => {e.stopPropagation(); setShowLearnMore(null);}} style={{cursor:'pointer'}}>
                      {structure.learnMore} (Click to close)
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="button-group mt-3">
            <button className="btn btn-secondary" onClick={onPrev}>Back</button>
            <button
              className="btn btn-outline-light fw-semibold"
              disabled={!selected}
              onClick={() => onNext({ legalStructure: selected })}
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
