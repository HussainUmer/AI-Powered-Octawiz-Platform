import React, { useState } from 'react';
import StepsSidebar from './StepsSidebar';
import Step1BusinessName from './Step1BusinessName';
import Step2LegalStructure from './Step2LegalStructure';
import Step3BusinessActivities from './Step3BusinessActivities';
import Step4ShareholderDetails from './Step4ShareholderDetails';
import Step5OfficeSpace from './Step5OfficeSpace';
import Step6Documents from './Step6Documents';
import Step7ReviewConfirm from './Step7ReviewConfirm';
import './OffshoreOnboarding.css';

export default function OffshoreOnboardingWizard() {
  const [formData, setFormData] = useState({
    jurisdiction: '',
    structure: '',
    companyName: '',
    businessActivities: '',
    shareholders: '',
    officeAddress: '',
    officeSize: '',
    capital: '',
    passport: null,
    addressProof: null,
    bankRef: null,
  });

  const [currentStep, setCurrentStep] = useState(1);

  const updateField = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const goNext = () => setCurrentStep(prev => prev + 1);
  const goBack = () => setCurrentStep(prev => prev - 1);

  const renderStep = () => {
    switch(currentStep) {
      case 1: return <Step1BusinessName formData={formData} updateField={updateField} onNext={goNext} />;
      case 2: return <Step2LegalStructure formData={formData} updateField={updateField} onNext={goNext} onBack={goBack} />;
      case 3: return <Step3BusinessActivities formData={formData} updateField={updateField} onNext={goNext} onBack={goBack} />;
      case 4: return <Step4ShareholderDetails formData={formData} updateField={updateField} onNext={goNext} onBack={goBack} />;
      case 5: return <Step5OfficeSpace formData={formData} updateField={updateField} onNext={goNext} onBack={goBack} />;
      case 6: return <Step6Documents formData={formData} updateField={updateField} onNext={goNext} onBack={goBack} />;
      case 7: return <Step7ReviewConfirm formData={formData} onBack={goBack} onSubmit={() => alert('Submitted!')} />;
      default: return null;
    }
  };

  return (
    <div className="offshore-root">
      <div className="wizard-container">
        <StepsSidebar currentStep={currentStep} formData={formData} />
        <main className="wizard-content">
          <div className="form-card">
            {renderStep()}
          </div>
        </main>
      </div>
    </div>
  );
}