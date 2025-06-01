import React, { useState } from 'react';
import Step2CompanyStructure from './step2companystructure';
import Step3Industry from './step3industry';
import NotAvailable from './notavailiable';
import StepsSidebar from './stepsidebar';


export default function OnboardingContainer() {
  // Start at company structure selection
  const [currentStep, setCurrentStep] = useState(1);
  const [onboardingData, setOnboardingData] = useState({});

  const nextStep = (data = {}) => {
    setOnboardingData(prev => ({ ...prev, ...data }));

    if (currentStep === 1) {
      if (data.companyStructure === 'freezone') {
        setCurrentStep(2); // proceed to industry selection
      } else {
        setCurrentStep(99); // show not available for Mainland/Offshore
      }
      return;
    }

    setCurrentStep(prev => prev + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(prev => prev - 1);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step2CompanyStructure onNext={nextStep} onPrev={prevStep} />;
      case 2:
        return <Step3Industry onNext={nextStep} onPrev={prevStep} />;
      case 99:
        return <NotAvailable onBack={() => setCurrentStep(1)} />;
      default:
        return <div className="p-5 text-white">Step not implemented yet.</div>;
    }
  };

  return (
    <div className="d-flex vh-100 bg-dark text-white">
      <StepsSidebar currentStep={currentStep} />
      <main className="flex-grow-1 overflow-auto p-5">{renderStep()}</main>
    </div>
  );
}
