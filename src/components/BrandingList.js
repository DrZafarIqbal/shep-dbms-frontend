import React, { useState, useEffect } from 'react';
import BrandingForm from './BrandingForm';

const BrandingList = () => {
  const [branding, setBranding] = useState([]);
  const [editing, setEditing] = useState(null);

  const fetchBranding = async () => {
    const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/branding`);
    const data = await res.json();
    setBranding(data);
  };

  const addBranding = async (record) => {
    await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/branding`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(record),
    });
    fetchBranding();
  };

  const updateBranding = async (record) => {
    await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/branding/${editing.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(record),
    });
    setEditing(null);
    fetchBranding();
  };

  const deleteBranding = async (id) => {
    await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/branding/${id}`, {
      method: 'DELETE'
    });
    fetchBranding();
  };

  useEffect(() => {
    fetchBranding();
  }, []);

  return (
    <div>
      <h2>Branding</h2>
      <BrandingForm
        onSubmit={editing ? updateBranding : addBranding}
        initialData={editing || {}}
        buttonLabel={editing ? "Update Branding" : "Add Branding"}
      />
      <ul>
        {branding.map((item) => (
          <li key={item.id}>
            <strong>{item.tag_number}</strong> → {item.branding_id} ({item.gender})
            <button onClick={() => setEditing(item)}>Edit</button>
            <button onClick={() => deleteBranding(item.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BrandingList;
