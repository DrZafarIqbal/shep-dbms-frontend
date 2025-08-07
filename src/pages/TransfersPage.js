import React from 'react';
import TransferForm from '../components/TransferForm';
import TransferList from '../components/TransferList';

function TransfersPage() {
  return (
    <div>
      <h2>Transfers</h2>
      <TransferForm />
      <TransferList />
    </div>
  );
}

export default TransfersPage;
