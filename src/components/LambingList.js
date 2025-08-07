import React, { useState, useEffect } from 'react';
import LambingForm from './LambingForm';

const LambingList = () => {
  const [lambings, setLambings] = useState([]);
  const [editing, setEditing] = useState(null);

  const fetchLambings = async () => {
    const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/lambings`);
    const data = await res.json();
    setLambings(data);
  };

  const addLambing = async (record) => {
    await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/lambings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(record)
    });
    fetchLambings();
  };

  const updateLambing = async (record) => {
    await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/lambings/${editing.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(record)
    });
    setEditing(null);
    fetchLambings();
  };

  const deleteLambing = async (id) => {
    await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/lambings/${id}`, {
      method: 'DELETE'
    });
    fetchLambings();
  };

  useEffect(() => {
    fetchLambings();
  }, []);

  return (
    <div>
      <h2>Lambings</h2>
      <LambingForm
        onSubmit={editing ? updateLambing : addLambing}
        initialData={editing || {}}
        buttonLabel={editing ? "Update Lambing" : "Add Lambing"}
      />
      <ul>
        {lambings.map((item) => (
          <li key={item.id}>
            Dam: {item.dam_branding_id}, Sire: {item.sire_branding_id || 'Unknown'}, Date: {item.lambing_date}
            <button onClick={() => setEditing(item)}>Edit</button>
            <button onClick={() => deleteLambing(item.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LambingList;
