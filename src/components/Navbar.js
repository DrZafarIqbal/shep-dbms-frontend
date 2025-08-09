// src/components/Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #eee' }}>
      <Link to="/farms" style={{ marginRight: 16 }}>Farms</Link>
      {/* Add other links later like: <Link to="/breeds">Breeds</Link> */}
    </nav>
  );
}
