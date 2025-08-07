import React, { useState, useEffect } from 'react';
import FarmForm from './FarmForm';

const FarmList = () => {
  const [farms, setFarms] = useState([]);
  const [editingFarm, setEditingFarm] = useState(null);

  const fetchFarms = async () => {
    const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/farms`);
    const data = await response.json();
    setFarms(data);
  };

  const addFarm = async (farm) => {
    await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/farms`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(farm),
    });
    fetchFarms();
  };

  const updateFarm = async (farm) => {
    await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/farms/${editingFarm.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(farm),
    });
    setEditingFarm(null);
    fetchFarms();
  };

  const deleteFarm = async (id) => {
    await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/farms/${id}`, {
      method: 'DELETE'
    });
    fetchFarms();
  };

  useEffect(() => {
    fetchFarms();
  }, []);

  return (
    <div>
      <h2>Farms</h2>
      <FarmForm
        onSubmit={editingFarm ? updateFarm : addFarm}
        initialData={editingFarm || {}}
        buttonLabel={editingFarm ? "Update Farm" : "Add Farm"}
      />
      <ul>
        {farms.map((farm) => (
          <li key={farm.id}>
            {farm.name} — {farm.location} — {farm.manager_name} — {farm.contact_info}
            <button onClick={() => setEditingFarm(farm)}>Edit</button>
            <button onClick={() => deleteFarm(farm.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FarmList;
