// src/pages/maincontainer.jsx
import React, { useState } from 'react';
import CategorySelection from './CategorySelection';
import MainlandBusinessName from './mainland/businessName';
import MainlandLegalStructure from './mainland/legalStructure';
import MainlandBusinessActivity from './mainland/businessActivity';
import Step2CompanyStructure from './step2companystructure';
import Step3Industry from './freezone/step3industry';
import Step4ActivitySelection from './freezone/step4ActivitySelection';
import NotAvailable from './notavailiable';
import StepsSidebar from '../components/stepsidebar';

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
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const renderStep = () => {
    // 1) No category yet → show the three-way chooser
    if (!category) {
      return <CategorySelection onSelect={handleCategorySelect} />;
    }

    // 2) Mainland flow
    if (category === 'mainland') {
      switch (currentStep) {
        case 1:
          return (
            <MainlandBusinessName
              onNext={(data) => {
                if (data.backToCategory) {
                  setCategory(null);
                } else {
                  nextStep(data);
                }
              }}
            />
          );
        case 2:
          return <MainlandLegalStructure onNext={nextStep} onPrev={() => setCurrentStep(1)} />;
        case 3:
          return <MainlandBusinessActivity onNext={nextStep} onPrev={() => setCurrentStep(2)} />;
        default:
          return <div className="p-5 text-white">Mainland step not implemented yet.</div>;
      }
    }

    // 3) Freezone flow
    if (category === 'freezone') {
      switch (currentStep) {
        case 1:
          return <Step2CompanyStructure onNext={nextStep} onPrev={prevStep} />;
        case 2:
          return <Step3Industry onNext={nextStep} onPrev={prevStep} />;
        case 3:
          return (
            <Step4ActivitySelection
              onNext={nextStep}
              onPrev={prevStep}
              selectedIndustry={onboardingData.industry}
            />
          );
        default:
          return <NotAvailable onBack={() => setCurrentStep(1)} />;
      }
    }

    return null;
  };

  return (
    <div className="d-flex vh-100 bg-dark text-white">
      {/* show sidebar only for Mainland & Freezone */}
      {category && <StepsSidebar currentStep={currentStep} />}
      <main className="flex-grow-1 overflow-auto p-5">
        {renderStep()}
      </main>
    </div>
  );
}
