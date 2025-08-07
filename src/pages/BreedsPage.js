import React from 'react';
import BreedForm from '../components/BreedForm';
import BreedList from '../components/BreedList';

function BreedsPage() {
  return (
    <div>
      <h2>Breeds</h2>
      <BreedForm />
      <BreedList />
    </div>
  );
}

export default BreedsPage;
