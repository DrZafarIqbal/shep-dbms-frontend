import React from 'react';
import LambForm from '../components/LambForm';
import LambList from '../components/LambList';

function LambsPage() {
  return (
    <div>
      <h2>Lambs</h2>
      <LambForm />
      <LambList />
    </div>
  );
}

export default LambsPage;
