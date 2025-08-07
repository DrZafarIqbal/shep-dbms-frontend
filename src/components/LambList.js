import React, { useState, useEffect } from 'react';
import LambForm from './LambForm';

const LambList = () => {
  const [lambs, setLambs] = useState([]);
  const [editing, setEditing] = useState(null);

  const fetchLambs = async () => {
    const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/lambs`);
    const data = await res.json();
    setLambs(data);
  };

  const addLamb = async (record) => {
    await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/lambs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(record)
    });
    fetchLambs();
  };

  const updateLamb = async (record) => {
    await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/lambs/${editing.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(record)
    });
    setEditing(null);
    fetchLambs();
  };

  const deleteLamb = async (id) => {
    await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/lambs/${id}`, {
      method: 'DELETE'
    });
    fetchLambs();
  };

  useEffect(() => {
    fetchLambs();
  }, []);

  return (
    <div>
      <h2>Lambs</h2>
      <LambForm
        onSubmit={editing ? updateLamb : addLamb}
        initialData={editing || {}}
        buttonLabel={editing ? "Update Lamb" : "Add Lamb"}
      />
      <ul>
        {lambs.map((item) => (
          <li key={item.id}>
            {item.tag_number} (Birth: {item.birth_weight} kg, Type: {item.birth_type})
            <button onClick={() => setEditing(item)}>Edit</button>
            <button onClick={() => deleteLamb(item.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LambList;
