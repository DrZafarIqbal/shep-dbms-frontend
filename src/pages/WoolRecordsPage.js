import React from 'react';
import WoolRecordForm from '../components/WoolRecordForm';
import WoolRecordList from '../components/WoolRecordList';

function WoolRecordsPage() {
  return (
    <div>
      <h2>Wool Records</h2>
      <WoolRecordForm />
      <WoolRecordList />
    </div>
  );
}

export default WoolRecordsPage;
