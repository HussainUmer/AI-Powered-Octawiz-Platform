import React from 'react';

const steps = [
  { id: 1, label: 'Company Structure' },
  { id: 2, label: 'Industry' },
  { id: 3, label: 'Business Activity' },
  { id: 4, label: 'Visa Requirement' },
  { id: 5, label: 'Office Preference' },
  { id: 6, label: 'Ownership' },
  { id: 7, label: 'Free Zone Recommendation' },
  { id: 8, label: 'Trade Name' },
  { id: 9, label: 'Shareholder Details' },
  { id: 10, label: 'Manager' },
  { id: 11, label: 'Capital & Shares' },
  { id: 12, label: 'Upload Documents' },
  { id: 13, label: 'Review & Payment' },
  { id: 14, label: 'Confirmation' },
  { id: 15, label: 'Dashboard' },
];

export default function StepsSidebar({ currentStep }) {
  return (
    <nav className="steps-sidebar-wrapper">
      <div className="container h-100 d-flex flex-column justify-content-start align-items-start">
        <h3 className="sidebar-title">Progress</h3>
        {steps.map((step) => {
          const isActive = step.id === currentStep;
          const isCompleted = step.id < currentStep;

          const stepClass = isActive
            ? 'step-item active'
            : isCompleted
            ? 'step-item completed'
            : 'step-item';

          return (
            <div key={step.id} className={stepClass}>
              <div className="step-number">{step.id}</div>
              <div className="step-label">{step.label}</div>
            </div>
          );
        })}
      </div>
    </nav>
  );
}
