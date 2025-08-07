import React from 'react';
import GrowthForm from '../components/GrowthForm';
import GrowthList from '../components/GrowthList';

function GrowthPage() {
  return (
    <div>
      <h2>Growth Records</h2>
      <GrowthForm />
      <GrowthList />
    </div>
  );
}

export default GrowthPage;
