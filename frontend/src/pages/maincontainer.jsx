// import React, { useEffect, useState } from 'react';
// import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
// import { supabase } from './supabaseClient';

// // Freezone Steps
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
// import Step14Payment from './freezone/step14payment';
// import Step14Confirmation from './freezone/step14confirmation';
// import Dashboard from './freezone/dashboard';

// // Mainland Steps
// import MainlandBusinessName from './mainland/businessName';
// import MainlandLegalStructure from './mainland/legalStructure';
// import MainlandBusinessActivity from './mainland/businessActivity';

// // Shared
// import CategorySelection from './CategorySelection';
// import NotAvailable from './notavailiable';
// import StepsSidebar from '../components/stepsidebar';
// import StepsSidebar_freezone from '../components/stepsidebar_freezone';
// import ChatBot from '../components/chatbot';

// export default function OnboardingContainer() {
//   const [category, setCategory] = useState(null);
//   const [onboardingId, setOnboardingId] = useState(null);
//   const [onboardingData, setOnboardingData] = useState({});
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchOrCreateOnboarding = async () => {
//       const user = JSON.parse(localStorage.getItem('user'));
//       const user_id = user?.user_id;
//       if (!user_id) return;

//       const { data } = await supabase.from('Onboarding').select('*').eq('user_id', user_id).single();
//       if (data && data.id) {
//         setOnboardingId(data.id);
//         let prefill = {};
//         if (data.industry) prefill.industryId = data.industry;
//         if (data.activity) {
//           const { data: act } = await supabase.from('Activities').select('name').eq('id', data.activity).single();
//           prefill.activities = act?.name ? [act.name] : [];
//         }
//         if (data.custom_activity) prefill.customActivity = data.custom_activity;
//         if (data.ownership) prefill.ownership = data.ownership;
//         if (data.freezone) prefill.freezone = data.freezone;
//         if (data.visa_requirement) prefill.visa_requirement = data.visa_requirement;
//         if (data.office_type) prefill.office_type = data.office_type;
//         if (data.trade_name) prefill.trade_name = data.trade_name;
//         setOnboardingData(prefill);
//       } else {
//         const { data: newData } = await supabase.from('Onboarding').insert([{ user_id }]).select('id').single();
//         if (newData?.id) setOnboardingId(newData.id);
//       }
//     };
//     fetchOrCreateOnboarding();
//   }, []);

//   const handleNext = (data, path) => {
//     if (data && typeof data === 'object') {
//       setOnboardingData(prev => ({ ...prev, ...data }));
//     }
//     navigate(path);
//   };

//   const handleBack = (fallbackPath = '/onboarding') => {
//     navigate(-1, { replace: false });
//   };

//   const handleCategorySelect = (cat) => {
//     setCategory(cat);
//     setOnboardingData({ category: cat });
//     navigate(`/onboarding/${cat}/industry`);
//   };

//   return (
//     <div className="d-flex vh-100 bg-dark text-white">
//       {category === 'freezone' && <StepsSidebar_freezone />}
//       {category === 'mainland' && <StepsSidebar />}
//       <main className="flex-grow-1 overflow-auto p-5">
//         <Routes>
//           <Route index element={<CategorySelection onSelect={handleCategorySelect} />} />

//           {/* Mainland Routes */}
//           <Route path="mainland/name" element={<MainlandBusinessName onNext={(data) => handleNext(data, '/onboarding/mainland/legal')} />} />
//           <Route path="mainland/legal" element={<MainlandLegalStructure onNext={(data) => handleNext(data, '/onboarding/mainland/activity')} onPrev={handleBack} />} />
//           <Route path="mainland/activity" element={<MainlandBusinessActivity onNext={(data) => handleNext(data, '/onboarding/mainland/complete')} onPrev={handleBack} />} />

//           {/* Freezone Routes */}
//           <Route path="freezone/company-structure" element={<Step2CompanyStructure onboardingId={onboardingId} onNext={(data) => handleNext(data, '/onboarding/freezone/industry')} onPrev={handleBack} onboardingData={onboardingData} />} />
//           <Route path="freezone/industry" element={<Step3Industry onboardingId={onboardingId} onNext={(data) => handleNext(data, '/onboarding/freezone/activities')} onPrev={handleBack} onboardingData={onboardingData} />} />
//           <Route path="freezone/activities" element={<Step4ActivitySelection onboardingId={onboardingId} onNext={(data) => handleNext(data, '/onboarding/freezone/ownership')} onPrev={handleBack} onboardingData={onboardingData} />} />
//           <Route path="freezone/ownership" element={<Step7Ownership onboardingId={onboardingId} onNext={(data) => handleNext(data, '/onboarding/freezone/recommend-zone')} onPrev={handleBack} onboardingData={onboardingData} />} />
//           <Route path="freezone/recommend-zone" element={<Step8ZoneRecommendation onboardingId={onboardingId} onNext={(data) => handleNext(data, '/onboarding/freezone/visa')} onPrev={handleBack} onboardingData={onboardingData} />} />
//           <Route path="freezone/visa" element={<Step5VisaRequirement onboardingId={onboardingId} onNext={(data) => handleNext(data, '/onboarding/freezone/office')} onPrev={handleBack} onboardingData={onboardingData} />} />
//           <Route path="freezone/office" element={<Step6OfficePreference onboardingId={onboardingId} onNext={(data) => handleNext(data, '/onboarding/freezone/tradename')} onPrev={handleBack} onboardingData={onboardingData} />} />
//           <Route path="freezone/tradename" element={<Step9TradeName onboardingId={onboardingId} onNext={(data) => handleNext(data, '/onboarding/freezone/stakeholders')} onPrev={handleBack} onboardingData={onboardingData} />} />
//           <Route path="freezone/stakeholders" element={<Step10Stakeholders onboardingId={onboardingId} onNext={(data) => handleNext(data, '/onboarding/freezone/sharecapital')} onPrev={handleBack} onboardingData={onboardingData} />} />
//           <Route path="freezone/sharecapital" element={<Step11ShareCapital onboardingId={onboardingId} onNext={(data) => handleNext(data, '/onboarding/freezone/documents')} onPrev={handleBack} onboardingData={onboardingData} />} />
//           <Route path="freezone/documents" element={<Step12UploadDocuments onboardingId={onboardingId} onNext={(data) => handleNext(data, '/onboarding/freezone/review')} onPrev={handleBack} onboardingData={onboardingData} />} />
//           <Route path="freezone/review" element={<Step13ReviewPayment onboardingId={onboardingId} onPayment={() => navigate('/onboarding/freezone/payment')} onPrev={handleBack} onboardingData={onboardingData} />} />
//           <Route path="freezone/payment" element={<Step14Payment onboardingId={onboardingId} onPayment={() => navigate('/onboarding/freezone/confirmation')} onPrev={handleBack} onboardingData={onboardingData} />} />
//           <Route path="freezone/confirmation" element={<Step14Confirmation onboardingId={onboardingId} onDashboard={() => navigate('/onboarding/freezone/dashboard')} onPrev={handleBack} onboardingData={onboardingData} />} />
//           <Route path="freezone/dashboard" element={<Dashboard onboardingId={onboardingId} />} />

//           <Route path="*" element={<NotAvailable onBack={() => navigate('/onboarding')} />} />
//         </Routes>
//       </main>
//       <ChatBot />
//     </div>
//   );
// }


import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import CategorySelection from './CategorySelection';
import MainlandLegalStructure from './mainland/legalStructure';
import MainlandBusinessName from './mainland/businessName';
import Dashboard from './freezone/dashboard';
import MainlandContactInformation from './mainland/ContactInformation';
import MainlandEmployeeCount from './mainland/EmployeeCount';
import MainlandBusinessProposal from './mainland/BusinessProposal';
import MainlandNotes from './mainland/Notes';

// Freezone Screens
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
  const [onboardingId, setOnboardingId] = useState(null);

  const handleSubmitMainland = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const user_id = user?.user_id;
      
      if (!onboardingId) {
        console.error('No onboarding ID found');
        return;
      }

      const { error } = await supabase
        .from('Onboarding')
        .update({
          business_name: onboardingData.businessName,
          legal_structure: onboardingData.legalStructure,
          contact_name: onboardingData.contactName,
          contact_phone: onboardingData.contactPhone,
          contact_email: onboardingData.contactEmail,
          employee_count: onboardingData.employeeCount,
          business_proposal: onboardingData.businessProposal,
          notes: onboardingData.notes,
          status: 'submitted',
          updated_at: new Date().toISOString()
        })
        .eq('id', onboardingId);

      if (error) throw error;

      setCurrentStep(8); // Navigate to confirmation step
    } catch (error) {
      console.error('Error submitting mainland application:', error);
      // Handle error (show toast, etc.)
    }
  };

  useEffect(() => {
    // Fetch or create onboarding row for the logged-in user
    const fetchOrCreateOnboarding = async () => {
      const user = JSON.parse(localStorage.getItem('user'));
      const user_id = user?.user_id;
      if (!user_id) return;
      // Try to fetch existing onboarding row
      let { data, error } = await supabase
        .from('Onboarding')
        .select('*')
        .eq('user_id', user_id)
        .single();
      if (data && data.id) {
        setOnboardingId(data.id);
        // Always start from the first step, but prefill previous choices
        let onboardingData = {};
        if (data.industry) onboardingData.industryId = data.industry;
        // --- ACTIVITY PREFILL LOGIC ---
        if (data.activity || data.custom_activity) {
          if (data.activity) {
            // Fetch activity name from Activities table
            const { data: act } = await supabase
              .from('Activities')
              .select('name')
              .eq('id', data.activity)
              .single();
            onboardingData.activities = act && act.name ? [act.name] : [];
          } else {
            onboardingData.activities = [];
          }
          onboardingData.customActivity = data.custom_activity || '';
        }
        if (data.ownership) onboardingData.ownership = data.ownership;
        if (data.freezone) onboardingData.freezone = data.freezone;
        if (data.visa_requirement) onboardingData.visa_requirement = data.visa_requirement;
        if (data.office_type) onboardingData.office_type = data.office_type;
        if (data.trade_name) onboardingData.trade_name = data.trade_name;
        // --- FETCH STAKEHOLDERS ---
        const { data: stakeholders } = await supabase
          .from('Shareholder')
          .select('name, nationality, passport_no, email, share_capital, percentage')
          .eq('onboarding_id', data.id);
        if (stakeholders && stakeholders.length > 0) {
          onboardingData.stakeholders = stakeholders.map(s => ({
            name: s.name,
            nationality: s.nationality,
            passport: s.passport_no,
            email: s.email
          }));
          onboardingData.equity = stakeholders.map(s => s.percentage);
          onboardingData.shareCapital = stakeholders[0].share_capital;
        }
        // --- FETCH DOCUMENTS ---
        const { data: documents } = await supabase
          .from('Documents')
          .select('*')
          .eq('onboarding_id', data.id);
        if (documents && documents.length > 0) {
          onboardingData.documents = documents;
        }
        // ...add more fields as needed for prefill (e.g. documents)...
        setCurrentStep(1); // Always start from first screen
        setOnboardingData(onboardingData);
      } else {
        // Create onboarding row if not found
        const { data: newData, error: insertError } = await supabase
          .from('Onboarding')
          .insert([{ user_id }])
          .select('id')
          .single();
        if (insertError) {
          console.error('Error creating onboarding row:', insertError);
          setOnboardingId(null);
          return;
        }
        setOnboardingId(newData?.id);
      }
    };
    fetchOrCreateOnboarding();
  }, []);

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
          return <MainlandBusinessName onNext={(data) => data?.backToCategory ? setCategory(null) : nextStep(data)} />;
        case 2:
          return <MainlandLegalStructure onNext={nextStep} onPrev={() => setCurrentStep(1)} recommended={null} />;
        case 3:
          return (
            <MainlandContactInformation
              formData={onboardingData}
              setFormData={(data) => setOnboardingData(prev => ({ ...prev, ...data }))}
              onNext={() => nextStep()}
              onPrev={() => setCurrentStep(2)}
            />
          );
        case 4:  // Now this is EmployeeCount (previously was step 5)
          return (
            <MainlandEmployeeCount
              formData={onboardingData}
              setFormData={(data) => setOnboardingData(prev => ({ ...prev, ...data }))}
              onNext={() => nextStep()}
              onPrev={() => setCurrentStep(3)}  // Goes back to ContactInformation now
            />
          );
        case 5:  // Now this is BusinessProposal (previously was step 6)
          return (
            <MainlandBusinessProposal
              formData={onboardingData}
              setFormData={(data) => setOnboardingData(prev => ({ ...prev, ...data }))}
              onNext={() => nextStep()}
              onPrev={() => setCurrentStep(4)}  // Goes back to EmployeeCount now
            />
          );
        case 6:  // Now this is Notes (previously was step 7)
          return (
            <MainlandNotes
              formData={onboardingData}
              setFormData={(data) => setOnboardingData(prev => ({ ...prev, ...data }))}
              onSubmit={handleSubmitMainland}
              onPrev={() => setCurrentStep(5)}  // Goes back to BusinessProposal now
            />
          );
        default:
          return <div className="p-5 text-white">Mainland step not implemented yet.</div>;
      }
    }
    if (category === 'freezone') {
      // Wait for onboardingId before rendering steps that require it
      if (!onboardingId && currentStep > 0) {
        return <div className="p-5 text-white">Loading onboarding...</div>;
      }
      switch (currentStep) {
        case 0:
          return <Step2CompanyStructure onNext={nextStep} onPrev={prevStep} onboardingId={onboardingId} />;
        case 1:
          return (
            <Step3Industry
              onNext={nextStep}
              onPrev={prevStep}
              onboardingId={onboardingId}
              selectedIndustryId={onboardingData.industryId}
            />
          );
        case 2:
          return (
            <Step4ActivitySelection
              onNext={nextStep}
              onPrev={prevStep}
              selectedIndustryId={onboardingData.industryId}
              onboardingId={onboardingId}
              selectedActivities={onboardingData.activities}
              customActivity={onboardingData.customActivity}
            />
          );
        case 3:
          return <Step7Ownership onNext={nextStep} onPrev={prevStep} onboardingId={onboardingId} selectedOwnershipId={onboardingData.ownership} />;
        case 4:
          return <Step8ZoneRecommendation onNext={nextStep} onPrev={prevStep} onboardingId={onboardingId} selectedFreezoneId={onboardingData.freezone} />;
        case 5:
          return <Step5VisaRequirement onNext={nextStep} onPrev={prevStep} onboardingId={onboardingId} selectedVisaRequirement={onboardingData.visa_requirement} />;
        case 6:
          return <Step6OfficePreference onNext={nextStep} onPrev={prevStep} onboardingId={onboardingId} selectedOfficeType={onboardingData.office_type} />;
        case 7:
          return <Step9TradeName onNext={nextStep} onPrev={prevStep} onboardingId={onboardingId} initialTradeName={onboardingData.trade_name} />;
        case 8:
          return <Step10Stakeholders onNext={nextStep} onPrev={prevStep} onboardingId={onboardingId} initialStakeholders={onboardingData.stakeholders} />;
        case 9:
          return <Step11ShareCapital onNext={nextStep} onPrev={prevStep} stakeholders={onboardingData.stakeholders || []} onboardingId={onboardingId} initialEquity={onboardingData.equity} initialShareCapital={onboardingData.shareCapital} />;
        case 10:
          return <Step12UploadDocuments onNext={nextStep} onPrev={prevStep} onboardingId={onboardingId} previousDocuments={onboardingData.documents || []} />;
        case 11:
          return <Step13ReviewPayment onboardingData={onboardingData} onPrev={prevStep} onPayment={() => setCurrentStep(12)} onboardingId={onboardingId} />;
        case 12:
          return <Step14Payment onboardingData={onboardingData} onPrev={() => setCurrentStep(11)} onPayment={() => setCurrentStep(13)} onboardingId={onboardingId} />;
        case 13:
          return <Step14Confirmation onDashboard={() => setCurrentStep(14)} onboardingId={onboardingId} />;
        case 14:
          return <Dashboard onboardingId={onboardingId} />;
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
      {category === 'freezone' && currentStep !== 15 && <StepsSidebar_freezone currentStep={currentStep} />}
      {category === 'mainland' && <StepsSidebar currentStep={currentStep} />}
      <main className="flex-grow-1 overflow-auto p-5">{renderStep()}</main>
      <ChatBot />
    </div>
  );
}




