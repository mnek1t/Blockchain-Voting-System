import React from 'react';
import LoginPage from './pages/LoginPage';
import SmartIdPage from './pages/SmartIdPage';
import EparakstsLoginPage from './pages/EparakstsLoginPage';
import BasicLoginPage from './pages/BasicLoginPage';
import InternetBankingPage from './pages/InternetBankingPage';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/smartid" element={<SmartIdPage />} />
        <Route path="/eparaksts" element={<EparakstsLoginPage />} />
        <Route path="/basic" element={<BasicLoginPage />} />
        <Route path="/inbank" element={<InternetBankingPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
