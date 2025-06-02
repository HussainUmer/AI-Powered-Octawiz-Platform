import React, { useState } from 'react';
<<<<<<< Updated upstream
import CategorySelection from './CategorySelection';
import MainlandLegalStructure from './mainland/legalStructure';
import MainlandBusinessActivity from './mainland/businessActivity';
import MainlandBusinessName from './mainland/businessName';
import NotAvailable from './notavailiable';
import StepsSidebar from '../components/stepsidebar';

=======

import Step2CompanyStructure from './step2companystructure';
import Step3Industry from './freezone/step3industry';
import Step4ActivitySelection from './freezone/step4ActivitySelection';

import NotAvailable from './notavailiable';
import StepsSidebar from '../components/stepsidebar';



>>>>>>> Stashed changes
export default function OnboardingContainer() {
  const [category, setCategory] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [onboardingData, setOnboardingData] = useState({});

  const handleCategorySelect = (cat) => {
    setCategory(cat);
    setCurrentStep(1);
    setOnboardingData({ category: cat });
  };

  const nextStep = (data = {}) => {
    setOnboardingData(prev => ({ ...prev, ...data }));
    setCurrentStep(prev => prev + 1);
    console.log('Onboarding Data:', { ...onboardingData, ...data });
  };

  const prevStep = (type) => {
    if (type === 'category') {
      setCategory(null);
    } else {
      setCurrentStep(prev => (prev > 1 ? prev - 1 : 1));
    }
  };

  const renderStep = () => {
    if (!category) {
      return <CategorySelection onSelect={handleCategorySelect} />;
    }
    if (category === 'mainland') {
      switch (currentStep) {
        case 1:
          return <MainlandBusinessName onNext={data => {
            if (data && data.backToCategory) {
              setCategory(null);
            } else {
              nextStep(data);
            }
          }} />;
        case 2:
          return <MainlandLegalStructure onNext={nextStep} onPrev={() => setCurrentStep(1)} recommended={null} />;
        case 3:
          return <MainlandBusinessActivity industry={null} onNext={nextStep} onPrev={() => setCurrentStep(2)} />;
        default:
          return <div className="p-5 text-white">Step not implemented yet.</div>;
      }
    }
    // All other categories use the same industry step for now
    switch (currentStep) {
      case 1:
<<<<<<< Updated upstream
        return <div className="p-5 text-white">Step not implemented yet.</div>;
=======
        return <Step2CompanyStructure onNext={nextStep} onPrev={prevStep} />;
      case 2:
        return <Step3Industry onNext={nextStep} onPrev={prevStep} />;
      case 3:
        return <Step4ActivitySelection onNext={nextStep} onPrev={prevStep} selectedIndustry={onboardingData.industry} />;
      case 99:
        return <NotAvailable onBack={() => setCurrentStep(1)} />;
>>>>>>> Stashed changes
      default:
        return <div className="p-5 text-white">Step not implemented yet.</div>;
    }
  };

  return (
    <div className="d-flex vh-100 bg-dark text-white">
      {category && <StepsSidebar currentStep={currentStep} />}
      <main className="flex-grow-1 overflow-auto p-5">{renderStep()}</main>
    </div>
  );
}
