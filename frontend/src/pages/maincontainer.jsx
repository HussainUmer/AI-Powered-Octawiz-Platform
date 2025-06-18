import React, { useState } from 'react';
import CategorySelection from './CategorySelection';
import MainlandLegalStructure from './mainland/legalStructure';
import MainlandBusinessActivity from './mainland/businessActivity';
import MainlandBusinessName from './mainland/businessName';


//freezone Screens
import Step2CompanyStructure from './step2companystructure';
import Step3Industry from './freezone/step3industry';
import Step4ActivitySelection from './freezone/step4ActivitySelection';
import Step5VisaRequirement from './freezone/step5visarequirment';
import Step6OfficePreference from './freezone/step6officepref';
import Step7Ownership from './freezone/step7ownership';
import Step8ZoneRecommendation from './freezone/step8recommnededzone';

import NotAvailable from './notavailiable';
import StepsSidebar from '../components/stepsidebar';
import StepsSidebar_freezone from '../components/stepsidebar_freezone';

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
          return (
            <MainlandBusinessName
              onNext={(data) => {
                if (data?.backToCategory) {
                  setCategory(null);
                } else {
                  nextStep(data);
                }
              }}
            />
          );
        case 2:
          return (
            <MainlandLegalStructure
              onNext={nextStep}
              onPrev={() => setCurrentStep(1)}
              recommended={null}
            />
          );
        case 3:
          return (
            <MainlandBusinessActivity
              industry={null}
              onNext={nextStep}
              onPrev={() => setCurrentStep(2)}
            />
          );
        default:
          return <div className="p-5 text-white">Step not implemented yet.</div>;
      }
    }

    if (category === 'freezone') {
      switch (currentStep) {
        case 0:
          return <Step2CompanyStructure onNext={nextStep} onPrev={prevStep} />;
        case 1:
          return <Step3Industry onNext={nextStep} onPrev={prevStep} />;
        case 2:
          return (
            <Step4ActivitySelection
              onNext={nextStep}
              onPrev={prevStep}
              selectedIndustry={onboardingData.industry}
            />
          );
        case 3:
            return <Step5VisaRequirement onNext={nextStep} onPrev={prevStep} />;
        case 4:
          return <Step6OfficePreference onNext={nextStep} onPrev={prevStep} />;
        case 5:
          return <Step7Ownership onNext={nextStep} onPrev={prevStep} />;
        case 6:
          return <Step8ZoneRecommendation onNext={nextStep} onPrev={prevStep} />; 
        case 99:
          return <NotAvailable onBack={() => setCurrentStep(1)} />;
        default:
          return <div className="p-5 text-white">Step not implemented yet.</div>;
      }
    }

    return <NotAvailable onBack={() => setCategory(null)} />;
  };

  return (
    <div className="d-flex vh-100 bg-dark text-white">
      {category === 'freezone' && <StepsSidebar_freezone currentStep={currentStep} />}
      {category === 'mainland' && <StepsSidebar currentStep={currentStep} />}

      {/* {category && <StepsSidebar currentStep={currentStep} />} */}
      <main className="flex-grow-1 overflow-auto p-5">{renderStep()}</main>
    </div>
  );
}
























// // src/pages/maincontainer.jsx
// import React, { useState } from 'react';
// import CategorySelection from './CategorySelection';
// import MainlandBusinessName from './mainland/businessName';
// import MainlandLegalStructure from './mainland/legalStructure';
// import MainlandBusinessActivity from './mainland/businessActivity';
// <<<<<<< Updated upstream
// import Step2CompanyStructure from './step2companystructure';
// import Step3Industry from './freezone/step3industry';
// import Step4ActivitySelection from './freezone/step4ActivitySelection';
// =======
// import MainlandBusinessName from './mainland/businessName';


// //freezone Screens
// import Step2CompanyStructure from './step2companystructure';
// import Step3Industry from './freezone/step3industry';
// import Step4ActivitySelection from './freezone/step4ActivitySelection';
// import Step5VisaRequirement from './freezone/step5visarequirment';
// import Step6OfficePreference from './freezone/step6officepref';
// import Step7Ownership from './freezone/step7ownership';
// import Step8ZoneRecommendation from './freezone/step8recommnededzone';

// >>>>>>> Stashed changes
// import NotAvailable from './notavailiable';
// import StepsSidebar from '../components/stepsidebar';
// import StepsSidebar_freezone from '../components/stepsidebar_freezone';

// export default function OnboardingContainer() {
//   const [category, setCategory] = useState(null);
//   const [currentStep, setCurrentStep] = useState(1);
//   const [onboardingData, setOnboardingData] = useState({});

//   const handleCategorySelect = (cat) => {
//     setCategory(cat);
//     setCurrentStep(1);
//     setOnboardingData({ category: cat });
//   };

//   const nextStep = (data = {}) => {
//     setOnboardingData(prev => ({ ...prev, ...data }));
//     setCurrentStep(prev => prev + 1);
//   };

//   const prevStep = () => {
//     setCurrentStep(prev => Math.max(prev - 1, 1));
//   };

//   const renderStep = () => {
//     // 1) No category yet → show the three-way chooser
//     if (!category) {
//       return <CategorySelection onSelect={handleCategorySelect} />;
//     }

// <<<<<<< Updated upstream
//     // 2) Mainland flow
// =======
// >>>>>>> Stashed changes
//     if (category === 'mainland') {
//       switch (currentStep) {
//         case 1:
//           return (
//             <MainlandBusinessName
//               onNext={(data) => {
// <<<<<<< Updated upstream
//                 if (data.backToCategory) {
// =======
//                 if (data?.backToCategory) {
// >>>>>>> Stashed changes
//                   setCategory(null);
//                 } else {
//                   nextStep(data);
//                 }
//               }}
//             />
//           );
//         case 2:
// <<<<<<< Updated upstream
//           return <MainlandLegalStructure onNext={nextStep} onPrev={() => setCurrentStep(1)} />;
//         case 3:
//           return <MainlandBusinessActivity onNext={nextStep} onPrev={() => setCurrentStep(2)} />;
// =======
//           return (
//             <MainlandLegalStructure
//               onNext={nextStep}
//               onPrev={() => setCurrentStep(1)}
//               recommended={null}
//             />
//           );
//         case 3:
//           return (
//             <MainlandBusinessActivity
//               industry={null}
//               onNext={nextStep}
//               onPrev={() => setCurrentStep(2)}
//             />
//           );
// >>>>>>> Stashed changes
//         default:
//           return <div className="p-5 text-white">Mainland step not implemented yet.</div>;
//       }
//     }

// <<<<<<< Updated upstream
//     // 3) Freezone flow
//     if (category === 'freezone') {
//       switch (currentStep) {
//         case 1:
//           return <Step2CompanyStructure onNext={nextStep} onPrev={prevStep} />;
//         case 2:
//           return <Step3Industry onNext={nextStep} onPrev={prevStep} />;
//         case 3:
// =======
//     if (category === 'freezone') {
//       switch (currentStep) {
//         case 0:
//           return <Step2CompanyStructure onNext={nextStep} onPrev={prevStep} />;
//         case 1:
//           return <Step3Industry onNext={nextStep} onPrev={prevStep} />;
//         case 2:
// >>>>>>> Stashed changes
//           return (
//             <Step4ActivitySelection
//               onNext={nextStep}
//               onPrev={prevStep}
//               selectedIndustry={onboardingData.industry}
//             />
//           );
// <<<<<<< Updated upstream
//         default:
//           return <NotAvailable onBack={() => setCurrentStep(1)} />;
//       }
//     }

//     return null;
// =======
//         case 3:
//             return <Step5VisaRequirement onNext={nextStep} onPrev={prevStep} />;
//         case 4:
//           return <Step6OfficePreference onNext={nextStep} onPrev={prevStep} />;
//         case 5:
//           return <Step7Ownership onNext={nextStep} onPrev={prevStep} />;
//         case 6:
//           return <Step8ZoneRecommendation onNext={nextStep} onPrev={prevStep} />; 
//         case 99:
//           return <NotAvailable onBack={() => setCurrentStep(1)} />;
//         default:
//           return <div className="p-5 text-white">Step not implemented yet.</div>;
//       }
//     }

//     return <NotAvailable onBack={() => setCategory(null)} />;
// >>>>>>> Stashed changes
//   };

//   return (
//     <div className="d-flex vh-100 bg-dark text-white">
// <<<<<<< Updated upstream
//       {/* show sidebar only for Mainland & Freezone */}
//       {category && <StepsSidebar currentStep={currentStep} />}
//       <main className="flex-grow-1 overflow-auto p-5">
//         {renderStep()}
//       </main>
// =======
//       {category === 'freezone' && <StepsSidebar_freezone currentStep={currentStep} />}
//       {category === 'mainland' && <StepsSidebar currentStep={currentStep} />}

//       {/* {category && <StepsSidebar currentStep={currentStep} />} */}
//       <main className="flex-grow-1 overflow-auto p-5">{renderStep()}</main>
// >>>>>>> Stashed changes
//     </div>
//   );
// }




