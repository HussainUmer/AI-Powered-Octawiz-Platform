import React from 'react';

const steps = [
  { id: 1, label: 'Contact Information' },
  { id: 2, label: 'Business Details' },
  { id: 3, label: 'Business Proposal' },
  { id: 4, label: 'Estimated Share Capital' },
  { id: 5, label: 'Preferred Langauage and notes' },
  
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
