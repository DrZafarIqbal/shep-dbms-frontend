import React from 'react';
import LambingForm from '../components/LambingForm';
import LambingList from '../components/LambingList';

function LambingsPage() {
  return (
    <div>
      <h2>Lambings</h2>
      <LambingForm />
      <LambingList />
    </div>
  );
}

export default LambingsPage;
