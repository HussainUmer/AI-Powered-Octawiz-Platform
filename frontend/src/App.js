// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/style.css';

import SignInPage from './pages/userlogin/signin';
import SignupPage from './pages/userlogin/signup';
import OnboardingContainer from './pages/maincontainer';

// <<< NEW: import the Offshore wizard
import OffshoreOnboardingWizard from './pages/Offshore/OffshoreOnboardingWizard';

import Dashboard from './pages/freezone/dashboard';



export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/signin" replace />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* Offshore is now its own top‐level route */}
        <Route path="/offshore" element={<OffshoreOnboardingWizard />} />

        {/* Mainland & Freezone share this container */}
        <Route path="/onboarding" element={<OnboardingContainer />} />
        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="*" element={<Navigate to="/signin" replace />} />
      </Routes>
    </Router>
  );
}
