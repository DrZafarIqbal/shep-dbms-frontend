import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';

import FarmsPage from './pages/FarmsPage';
import BreedsPage from './pages/BreedsPage';
import BrandingPage from './pages/BrandingPage';
import LambingsPage from './pages/LambingsPage';
import LambsPage from './pages/LambsPage';
import GrowthPage from './pages/GrowthPage';
import HealthEventsPage from './pages/HealthEventsPage';
import WoolRecordsPage from './pages/WoolRecordsPage';
import MortalityPage from './pages/MortalityPage';
import TransfersPage from './pages/TransfersPage';
import DashboardPage from './pages/DashboardPage';


function App() {
  return (
    <div className="App">
      <Navbar />
      <div style={{ padding: '1rem' }}>
        <Routes>
          <Route path="/" element={<FarmsPage />} />
          <Route path="/breeds" element={<BreedsPage />} />
          <Route path="/branding" element={<BrandingPage />} />
          <Route path="/lambings" element={<LambingsPage />} />
          <Route path="/lambs" element={<LambsPage />} />
          <Route path="/growth" element={<GrowthPage />} />
          <Route path="/health" element={<HealthEventsPage />} />
          <Route path="/wool" element={<WoolRecordsPage />} />
          <Route path="/mortality" element={<MortalityPage />} />
          <Route path="/transfers" element={<TransfersPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
