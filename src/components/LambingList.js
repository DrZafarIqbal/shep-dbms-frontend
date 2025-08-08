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

      <table border="1" cellPadding="8" style={{ marginTop: '20px', width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Dam Branding ID</th>
            <th>Sire Branding ID</th>
            <th>Lambing Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {lambings.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.dam_branding_id}</td>
              <td>{item.sire_branding_id || 'Unknown'}</td>
              <td>{item.lambing_date}</td>
              <td>
                <button onClick={() => setEditing(item)}>Edit</button>{' '}
                <button onClick={() => deleteLambing(item.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LambingList;
