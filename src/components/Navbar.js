// src/components/Navbar.js
import React from 'react';
import { NavLink } from 'react-router-dom';

const linkStyle = ({ isActive }) => ({
  padding: '8px 12px',
  textDecoration: 'none',
  borderRadius: '8px',
  fontSize: '0.95rem',
  fontWeight: 500,
  background: isActive ? '#f0f4ff' : 'transparent',
  color: isActive ? '#1f3a8a' : '#111827',
  border: isActive ? '1px solid #c7d2fe' : '1px solid transparent',
});

export default function Navbar() {
  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: '#fff',
        borderBottom: '1px solid #e5e7eb'
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          maxWidth: 1200,
          margin: '0 auto',
          padding: '10px 16px'
        }}
      >
        <div style={{ fontWeight: 700 }}>Sheep DBMS</div>

        <nav style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <NavLink to="/farms" style={linkStyle}>Farms</NavLink>
          <NavLink to="/breeds" style={linkStyle}>Breeds</NavLink>
          <NavLink to="/branding" style={linkStyle}>Branding</NavLink>
          <NavLink to="/lambings" style={linkStyle}>Lambings</NavLink>
          <NavLink to="/lambs" style={linkStyle}>Lambs</NavLink>
          <NavLink to="/growth" style={linkStyle}>Growth</NavLink>
          <NavLink to="/healthevents" style={linkStyle}>Health</NavLink>
          <NavLink to="/woolrecords" style={linkStyle}>Wool</NavLink>
          <NavLink to="/mortality" style={linkStyle}>Mortality</NavLink>
          <NavLink to="/transfers" style={linkStyle}>Transfers</NavLink>
          <NavLink to="/dashboard" style={linkStyle}>Dashboard</NavLink>
        </nav>
      </div>
    </header>
  );
}


