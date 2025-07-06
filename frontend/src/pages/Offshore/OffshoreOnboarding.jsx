// src/pages/Offshore/OffshoreOnboarding.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StepsSidebar_offshore from '../../components/stepsidebar_offshore';
import OffshoreStep1 from './OffshoreStep1';
import OffshoreStep2 from './OffshoreStep2';
import OffshoreStep3 from './OffshoreStep3';
import OffshoreStep4 from './OffshoreStep4';
import OffshoreStep5 from './OffshoreStep5';

const OffshoreOnboarding = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    contactName: '', contactPhone: '', contactEmail: '',
    businessName: '', jurisdiction: '', proposal: '',
    shareCapital: '', language: '', notes: ''
  });
  const navigate = useNavigate();

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <OffshoreStep1
            formData={formData}
            setFormData={setFormData}
            onNext={nextStep}
            onBack={() => navigate('/category-selection')}
          />
        );
      case 2:
        return (
          <OffshoreStep2
            formData={formData}
            setFormData={setFormData}
            onNext={nextStep}
            onBack={prevStep}
          />
        );
      case 3:
        return (
          <OffshoreStep3
            formData={formData}
            setFormData={setFormData}
            onNext={nextStep}
            onBack={prevStep}
          />
        );
      case 4:
        return (
          <OffshoreStep4
            formData={formData}
            setFormData={setFormData}
            onNext={nextStep}
            onBack={prevStep}
          />
        );
      case 5:
        return (
          <OffshoreStep5
            formData={formData}
            setFormData={setFormData}
            onSubmit={() => alert('Submitted!')}
            onBack={prevStep}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="d-flex vh-100 bg-dark text-white">
      <StepsSidebar_offshore currentStep={step} />
      <div className="form-container">
        <div className="card-container">
          {renderStep()}
        </div>
      </div>
    </div>
  );
};

export default OffshoreOnboarding;
