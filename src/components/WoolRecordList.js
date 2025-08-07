import React, { useState, useEffect } from 'react';
import WoolRecordForm from './WoolRecordForm';

const WoolRecordList = () => {
  const [records, setRecords] = useState([]);
  const [editing, setEditing] = useState(null);

  const fetchRecords = async () => {
    const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/woolrecords`);
    const data = await res.json();
    setRecords(data);
  };

  const addRecord = async (record) => {
    await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/woolrecords`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(record)
    });
    fetchRecords();
  };

  const updateRecord = async (record) => {
    await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/woolrecords/${editing.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(record)
    });
    setEditing(null);
    fetchRecords();
  };

  const deleteRecord = async (id) => {
    await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/woolrecords/${id}`, {
      method: 'DELETE'
    });
    fetchRecords();
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  return (
    <div>
      <h2>Wool Records</h2>
      <WoolRecordForm
        onSubmit={editing ? updateRecord : addRecord}
        initialData={editing || {}}
        buttonLabel={editing ? "Update Wool Record" : "Add Wool Record"}
      />
      <ul>
        {records.map((item) => (
          <li key={item.id}>
            {item.branding_id} | {item.record_date} | Greasy: {item.greasy_fleece_yield}kg | Clean: {item.clean_fleece_yield}kg
            <button onClick={() => setEditing(item)}>Edit</button>
            <button onClick={() => deleteRecord(item.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default WoolRecordList;
