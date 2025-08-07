import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav style={{ padding: '1rem', background: '#f0f0f0' }}>
      <h2>Sheep DBMS Navigation</h2>
      <ul style={{ listStyle: 'none', padding: 0, display: 'flex', gap: '1rem' }}>
        <li><Link to="/">Farms</Link></li>
        <li><Link to="/breeds">Breeds</Link></li>
        <li><Link to="/branding">Branding</Link></li>
        <li><Link to="/lambings">Lambings</Link></li>
        <li><Link to="/lambs">Lambs</Link></li>
        <li><Link to="/growth">Growth</Link></li>
        <li><Link to="/health">Health Events</Link></li>
        <li><Link to="/wool">Wool Records</Link></li>
        <li><Link to="/mortality">Mortality</Link></li>
        <li><Link to="/transfers">Transfers</Link></li>
        <li><Link to="/dashboard">Dashboard</Link></li>
        <li><Link to="/dashboard">Dashboard</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;
