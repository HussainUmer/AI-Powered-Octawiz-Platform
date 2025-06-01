import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/style.css';

import SignupPage from './pages/signup';
import SignInPage from './pages/signin';
import OnboardingContainer from './pages/maincontainer';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/signin" replace />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/onboarding" element={<OnboardingContainer />} />
        {/* Add more routes as needed */}
      </Routes>
    </Router>
  );
}


export default App;
