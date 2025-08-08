import React, { useEffect, useState } from 'react';
import DashboardCard from '../components/DashboardCard';

const Dashboard = () => {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/api/dashboard/summary`)
      .then(res => res.json())
      .then(data => setSummary(data))
      .catch(err => console.error("Error fetching dashboard data:", err));
  }, []);

  if (!summary) return <p>Loading dashboard...</p>;

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Sheep Breeding Kashmir Dashboard</h2>
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <DashboardCard title="Total Lambs" value={summary.lambs} />
        <DashboardCard title="Weaners" value={summary.weaners} />
        <DashboardCard title="Hoggets" value={summary.hoggets} />
        <DashboardCard title="Adults" value={summary.adults} />
        <DashboardCard title="Deaths This Month" value={summary.deathsThisMonth} />
        <DashboardCard title="Total Deaths" value={summary.totalDeaths} />
        <DashboardCard title="Transfers This Month" value={summary.transfersThisMonth} />
      </div>
    </div>
  );
};

export default Dashboard;
