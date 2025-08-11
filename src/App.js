// src/App.js
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';

import FarmsPage from './pages/FarmsPage';
import BreedsPage from './pages/BreedsPage';

// NEW: Branding (using component directly)
import BrandingList from './components/BrandingList';

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

          {/* (optional) catch-all → Farms */}
          <Route path="*" element={<Navigate to="/farms" replace />} />
        </Routes>
      </div>
    </div>
  );
}
