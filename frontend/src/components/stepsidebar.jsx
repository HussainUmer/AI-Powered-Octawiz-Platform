import React from 'react';

// Updated company structure steps to new order after industry selection
const steps = [
  { id: 1, label: 'Business Name' },
  { id: 2, label: 'Industry Selection' },
  { id: 3, label: 'Contact Information' },
  { id: 4, label: 'Estimated no of Employees' },
  { id: 5, label: 'Business Proposal' },
  { id: 6, label: 'Notes' },
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
