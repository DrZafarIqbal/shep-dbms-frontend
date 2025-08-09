import React from 'react';
import LambingForm from '../components/LambingForm';
import LambingList from '../components/LambingList';

export default function LambingsPage() {
  return (
    <div>
      <h1>Lambings</h1>
      <LambingForm />
      <LambingList />
    </div>
  );
}
