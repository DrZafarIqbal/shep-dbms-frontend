import React, { useState, useEffect } from 'react';
import TransferForm from './TransferForm';

const TransferList = () => {
  const [records, setRecords] = useState([]);
  const [editing, setEditing] = useState(null);

  const fetchRecords = async () => {
    const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/transfers`);
    const data = await res.json();
    setRecords(data);
  };

  const addRecord = async (record) => {
    await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/transfers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(record)
    });
    fetchRecords();
  };

  const updateRecord = async (record) => {
    await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/transfers/${editing.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(record)
    });
    setEditing(null);
    fetchRecords();
  };

  const deleteRecord = async (id) => {
    await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/transfers/${id}`, {
      method: 'DELETE'
    });
    fetchRecords();
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  return (
    <div>
      <h2>Transfers</h2>
      <TransferForm
        onSubmit={editing ? updateRecord : addRecord}
        initialData={editing || {}}
        buttonLabel={editing ? "Update Transfer" : "Add Transfer"}
      />
      <ul>
        {records.map((item) => (
          <li key={item.id}>
            {item.branding_id} | {item.transfer_date} | From: {item.from_farm_id} ➡ To: {item.to_farm_id}
            <button onClick={() => setEditing(item)}>Edit</button>
            <button onClick={() => deleteRecord(item.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TransferList;
