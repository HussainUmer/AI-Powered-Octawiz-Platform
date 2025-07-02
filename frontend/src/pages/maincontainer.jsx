import React, { useState } from 'react';
import CategorySelection from './CategorySelection';
import MainlandLegalStructure from './mainland/legalStructure';
import MainlandBusinessActivity from './mainland/businessActivity';
import MainlandBusinessName from './mainland/businessName';
import Dashboard from './freezone/dashboard';

//freezone Screens
import Step2CompanyStructure from './step2companystructure';
import Step3Industry from './freezone/step3industry';
import Step4ActivitySelection from './freezone/step4ActivitySelection';
import Step5VisaRequirement from './freezone/step5visarequirment';
import Step6OfficePreference from './freezone/step6officepref';
import Step7Ownership from './freezone/step7ownership';
import Step8ZoneRecommendation from './freezone/step8recommnededzone';
import Step9TradeName from './freezone/step9tradename';
import Step10Stakeholders from './freezone/step10stakeholders';
import Step11ShareCapital from './freezone/step11sharecapital';
import Step12UploadDocuments from './freezone/step12uploaddocuments';
import Step13ReviewPayment from './freezone/step13reviewpayment';
import Step14Confirmation from './freezone/step14confirmation';
import Step14Payment from './freezone/step14payment';

import NotAvailable from './notavailiable';
import StepsSidebar from '../components/stepsidebar';
import StepsSidebar_freezone from '../components/stepsidebar_freezone';
import ChatBot from '../components/chatbot';

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
    } else if (category === 'freezone' && currentStep === 1) {
      setCategory(null);
      setCurrentStep(1);
      setOnboardingData({});
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
          return <div className="p-5 text-white">Mainland step not implemented yet.</div>;
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
              selectedIndustryId={onboardingData.industryId}
            />
          );
        case 3:
          return <Step7Ownership onNext={nextStep} onPrev={prevStep} />;
        case 4:
          return <Step8ZoneRecommendation onNext={nextStep} onPrev={prevStep} />;
        case 5:
          return <Step5VisaRequirement onNext={nextStep} onPrev={prevStep} />;
        case 6:
          return <Step6OfficePreference onNext={nextStep} onPrev={prevStep} />;
        case 7:
          return <Step9TradeName onNext={nextStep} onPrev={prevStep} />;
        case 8:
          return <Step10Stakeholders onNext={nextStep} onPrev={prevStep} />;
        case 9:
          return <Step11ShareCapital onNext={nextStep} onPrev={prevStep} stakeholders={onboardingData.stakeholders || []} />;
        case 10:
          return <Step12UploadDocuments onNext={nextStep} onPrev={prevStep} />;
        case 11:
          return <Step13ReviewPayment onboardingData={onboardingData} onPrev={prevStep} onPayment={() => setCurrentStep(12)} />;
        case 12:
          return <Step14Payment onboardingData={onboardingData} onPrev={() => setCurrentStep(11)} onPayment={() => setCurrentStep(13)} />;
        case 13:
          return <Step14Confirmation onDashboard={() => setCurrentStep(14)} />;
        case 14:
          return <Dashboard />;
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
      {category === 'freezone' && currentStep !== 14 && <StepsSidebar_freezone currentStep={currentStep} />}
      {category === 'mainland' && <StepsSidebar currentStep={currentStep} />}

      {/* {category && <StepsSidebar currentStep={currentStep} />} */}
      <main className="flex-grow-1 overflow-auto p-5">{renderStep()}</main>
      <ChatBot />
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
// import Step9TradeName from './freezone/step9tradename';
// import Step10Stakeholders from './freezone/step10stakeholders';
// import Step11ShareCapital from './freezone/step11sharecapital';
// import Step12UploadDocuments from './freezone/step12uploaddocuments';
// import Step13ReviewPayment from './freezone/step13reviewpayment';
// import Step14Confirmation from './freezone/step14confirmation';

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

//     // 2) Mainland flow
//     if (category === 'mainland') {
//       switch (currentStep) {
//         case 1:
//           return (
//             <MainlandBusinessName
//               onNext={(data) => {
//                 if (data.backToCategory) {
//                   setCategory(null);
//                 } else {
//                   nextStep(data);
//                 }
//               }}
//             />
//           );
//         case 2:
//           return <MainlandLegalStructure onNext={nextStep} onPrev={() => setCurrentStep(1)} />;
//         case 3:
//           return <MainlandBusinessActivity onNext={nextStep} onPrev={() => setCurrentStep(2)} />;
//         default:
//           return <div className="p-5 text-white">Mainland step not implemented yet.</div>;
//       }
//     }

//     // 3) Freezone flow
//     if (category === 'freezone') {
//       switch (currentStep) {
//         case 1:
//           return <Step2CompanyStructure onNext={nextStep} onPrev={prevStep} />;
//         case 2:
//           return <Step3Industry onNext={nextStep} onPrev={prevStep} />;
//         case 3:
//           return (
//             <Step4ActivitySelection
//               onNext={nextStep}
//               onPrev={prevStep}
//               selectedIndustryId={onboardingData.industryId}
//             />
//           );
//         default:
//           return <NotAvailable onBack={() => setCurrentStep(1)} />;
//       }
//     }

//     return null;
//   };

//   return (
//     <div className="d-flex vh-100 bg-dark text-white">
//       {/* show sidebar only for Mainland & Freezone */}
//       {category && <StepsSidebar currentStep={currentStep} />}
//       <main className="flex-grow-1 overflow-auto p-5">
//         {renderStep()}
//       </main>
//     </div>
//   );
// }




