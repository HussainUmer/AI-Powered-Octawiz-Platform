import React from 'react';

const steps = [
  { id: 1, label: 'Business Name' },
  { id: 2, label: 'Legal Structure' },
  { id: 3, label: 'Business Activities' },
  { id: 4, label: 'Shareholder Details' },
  { id: 5, label: 'Office Space' },
  { id: 6, label: 'Document Upload' },
  { id: 7, label: 'Review & Confirm' }
];

export default function StepsSidebar({ currentStep, formData }) {
  const isStepCompleted = (stepId) => {
    switch(stepId) {
      case 1: return !!formData.jurisdiction && !!formData.companyName;
      case 2: return !!formData.structure;
      case 3: return formData.businessActivities?.trim().length > 0;
      case 4: return Number(formData.shareholders) >= 1;
      case 5: return !!formData.officeAddress && !!formData.officeSize;
      case 6: return !!formData.passport && !!formData.addressProof;
      default: return false;
    }
  };

  return (
    <nav className="steps-sidebar-wrapper">
      <h3 className="sidebar-title">Progress</h3>
      {steps.map((step) => {
        const isActive = step.id === currentStep;
        const isCompleted = isStepCompleted(step.id);
        
        return (
          <div 
            key={step.id} 
            className={`step-item ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
          >
            <div className="step-number">{step.id}</div>
            <div className="step-label">{step.label}</div>
            {isCompleted && (
              <svg className="step-status" width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </div>
        );
      })}
    </nav>
  );
}