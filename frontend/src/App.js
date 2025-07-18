import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/style.css';

import SignInPage from './pages/userlogin/signin';
import SignupPage from './pages/userlogin/signup';
import OnboardingContainer from './pages/maincontainer';
import Dashboard from './pages/freezone/dashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import UserDetails from './pages/admin/UserDetails';
import ChatBot from './components/chatbot'; // Import ChatBot

import Homepage from './pages/Homepage';


// Component to conditionally render ChatBot
function ChatBotWrapper() {
  const location = useLocation();
  const hideChatBot = ['/signin', '/signup'].includes(location.pathname);

  return !hideChatBot ? <ChatBot /> : null;
}

export default function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Homepage />} />
          {/* <Route path="/" element={<Navigate to="/signin" replace />} /> */}
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/onboarding" element={<OnboardingContainer />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/user/:onboardingId" element={<UserDetails />} />
          <Route path="*" element={<Navigate to="/signin" replace />} />
        </Routes>
        <ChatBotWrapper /> {/* Render ChatBot conditionally */}
      </div>
    </Router>
  );
}










// // src/App.js
// import React from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import './css/style.css';

// import SignInPage from './pages/userlogin/signin';
// import SignupPage from './pages/userlogin/signup';
// import OnboardingContainer from './pages/maincontainer';

// // <<< NEW: import the Offshore wizard
// import OffshoreOnboardingWizard from './pages/Offshore/OffshoreOnboarding';

// import Dashboard from './pages/freezone/dashboard';

// import AdminDashboard from './pages/admin/AdminDashboard';
// import UserDetails from './pages/admin/UserDetails';



// export default function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<Navigate to="/signin" replace />} />
//         <Route path="/signin" element={<SignInPage />} />
//         <Route path="/signup" element={<SignupPage />} />

//         {/* Offshore is now its own top‐level route */}
//         <Route path="/offshore" element={<OffshoreOnboardingWizard />} />

//         {/* Mainland & Freezone share this container */}
//         <Route path="/onboarding" element={<OnboardingContainer />} />
//         <Route path="/dashboard" element={<Dashboard />} />

//         <Route path="/admin" element={<AdminDashboard />} />
//         <Route path="/admin/user/:onboardingId" element={<UserDetails />} />

//         <Route path="*" element={<Navigate to="/signin" replace />} />
//       </Routes>
//     </Router>
//   );
// }
