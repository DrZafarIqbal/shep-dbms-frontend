import React from 'react';
import FarmForm from '../components/FarmForm';
import FarmList from '../components/FarmList';

function FarmsPage() {
  return (
    <div>
      <h2>Farms</h2>
      <FarmForm />
      <FarmList />
    </div>
  );
}

export default FarmsPage;
