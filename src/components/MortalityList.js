import React, { useState, useEffect } from 'react';
import MortalityForm from './MortalityForm';

const MortalityList = () => {
  const [records, setRecords] = useState([]);
  const [editing, setEditing] = useState(null);

  const fetchRecords = async () => {
    const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/mortality`);
    const data = await res.json();
    setRecords(data);
  };

  const addRecord = async (record) => {
    await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/mortality`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(record)
    });
    fetchRecords();
  };

  const updateRecord = async (record) => {
    await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/mortality/${editing.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(record)
    });
    setEditing(null);
    fetchRecords();
  };

  const deleteRecord = async (id) => {
    await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/mortality/${id}`, {
      method: 'DELETE'
    });
    fetchRecords();
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  return (
    <div>
      <h2>Mortality Records</h2>
      <MortalityForm
        onSubmit={editing ? updateRecord : addRecord}
        initialData={editing || {}}
        buttonLabel={editing ? "Update Mortality" : "Add Mortality"}
      />
      <ul>
        {records.map((item) => (
          <li key={item.id}>
            {(item.tag_number || item.branding_id)} | Died on: {item.date_of_death} | Cause: {item.cause_of_death}
            <button onClick={() => setEditing(item)}>Edit</button>
            <button onClick={() => deleteRecord(item.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MortalityList;
