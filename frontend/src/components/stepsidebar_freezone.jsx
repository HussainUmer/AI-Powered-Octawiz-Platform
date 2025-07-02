import React from 'react';

const steps = [
  { id: 1, label: 'Industry' },
  { id: 2, label: 'Business Activity' },
  { id: 3, label: 'Ownership Structure' },
  { id: 4, label: 'Free Zone Recommendation' },
  { id: 5, label: 'Visa Requirement' },
  { id: 6, label: 'Office Preference' },
  { id: 7, label: 'Trade Name' },
  { id: 8, label: 'Shareholder Details' },
  { id: 9, label: 'Share Capital & Equity' },
  { id: 10, label: 'Upload Documents' },
  { id: 11, label: 'Review' },
  { id: 12, label: 'Confirmation' },
  // Add more steps if implemented
];

export default function StepsSidebar_freezone({ currentStep }) {
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
