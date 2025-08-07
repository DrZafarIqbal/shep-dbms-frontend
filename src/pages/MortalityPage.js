import React from 'react';
import MortalityForm from '../components/MortalityForm';
import MortalityList from '../components/MortalityList';

function MortalityPage() {
  return (
    <div>
      <h2>Mortality Records</h2>
      <MortalityForm />
      <MortalityList />
    </div>
  );
}

export default MortalityPage;
