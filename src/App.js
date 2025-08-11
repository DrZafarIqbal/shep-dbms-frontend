// src/App.js
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';

import FarmsPage from './pages/FarmsPage';
import BreedsPage from './pages/BreedsPage';
import BrandingList from './components/BrandingList';
import LambingList from './components/LambingList';
import LambsList from './components/LambList';
import GrowthList from './components/GrowthList';
export default function App() {
  return (
    <div className="App">
      <Navbar />
      <div style={{ padding: '1rem' }}>
        <Routes>
          {/* Default → Farms */}
          <Route path="/" element={<Navigate to="/farms" replace />} />

          {/* Pages */}
          <Route path="/farms" element={<FarmsPage />} />
          <Route path="/breeds" element={<BreedsPage />} />
          <Route path="/branding" element={<BrandingList />} />
          <Route path="/lambings" element={<LambingList />} />
          <Route path="/lambs" element={<LambsList />} />
          <Route path="/growth" element={<GrowthList />} />

          {/* (optional) catch-all → Farms */}
          <Route path="*" element={<Navigate to="/farms" replace />} />
        </Routes>
      </div>
    </div>
  );
}


