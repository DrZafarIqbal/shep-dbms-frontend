import React from 'react';

const cardStyle = {
  border: '1px solid #ccc',
  borderRadius: '10px',
  padding: '1rem',
  width: '200px',
  boxShadow: '2px 2px 5px rgba(0,0,0,0.1)',
};

const DashboardCard = ({ title, value }) => {
  return (
    <div style={cardStyle}>
      <h4>{title}</h4>
      <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{value}</p>
    </div>
  );
};

export default DashboardCard;
