import React from 'react';
import LoginPage from './pages/LoginPage';
import SmartIdPage from './pages/SmartIdPage';
import EparakstsLoginPage from './pages/EparakstsLoginPage';
import BasicLoginPage from './pages/BasicLoginPage';
import InternetBankingPage from './pages/InternetBankingPage';
import OrganizeElectionPage from './pages/OrganizeElectionPage';
import AdminHomePage from './pages/AdminHomePage';
import VoterHomePage from './pages/VoterHomePage';
import VotingPage from './pages/VotingPage';
import VotingDetailPage from './pages/VotingDetailPage';
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
        <Route path="/election/prep" element={<OrganizeElectionPage />} />
        <Route path="/admin/home" element={<AdminHomePage />} />
        <Route path="/voter/home" element={<VoterHomePage />} />
        <Route path="/voter/voting" element={<VotingPage />} />
        <Route path="/voter/vote/:id" element={<VotingDetailPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
