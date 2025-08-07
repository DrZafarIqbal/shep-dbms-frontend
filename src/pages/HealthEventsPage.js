import React from 'react';
import HealthEventForm from '../components/HealthEventForm';
import HealthEventList from '../components/HealthEventList';

function HealthEventsPage() {
  return (
    <div>
      <h2>Health Events</h2>
      <HealthEventForm />
      <HealthEventList />
    </div>
  );
}

export default HealthEventsPage;
