// src/App.js
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';

import FarmsPage from './pages/FarmsPage';
// (Import other pages later, but don’t render them twice.)

function App() {
  return (
    <div className="App">
      <Navbar />
      <div style={{ padding: '1rem' }}>
        <Routes>
          <Route path="/" element={<Navigate to="/farms" replace />} />
          <Route path="/farms" element={<FarmsPage />} />
          {/* Add other single routes later, one per path */}
        </Routes>
      </div>
    </div>
  );
}

export default App;

