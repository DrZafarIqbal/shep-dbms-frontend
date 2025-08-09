// src/pages/FarmsPage.js
import React, { useEffect, useState, useCallback } from 'react';
import FarmForm from '../components/FarmForm';
import FarmList from '../components/FarmList';

export default function FarmsPage() {
  const [editingFarm, setEditingFarm] = useState(null);
  const [farms, setFarms] = useState([]);
  const API = process.env.REACT_APP_API_BASE_URL;

  // Memoize to satisfy react-hooks/exhaustive-deps in CI
  const loadFarms = useCallback(async () => {
    const res = await fetch(`${API}/api/farms`);
    const data = await res.json();
    setFarms(data);
  }, [API]);

  useEffect(() => {
    loadFarms(); // runs once in production
  }, [loadFarms]);

  const handleCreate = async (payload) => {
    await fetch(`${API}/api/farms`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    setEditingFarm(null);
    await loadFarms();
  };

  const handleUpdate = async (id, payload) => {
    await fetch(`${API}/api/farms/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    setEditingFarm(null);
    await loadFarms();
  };

  const handleDelete = async (id) => {
    await fetch(`${API}/api/farms/${id}`, { method: 'DELETE' });
    if (editingFarm?.id === id) setEditingFarm(null);
    await loadFarms();
  };

  return (
    <div>
      <h2>Farms</h2>
      <FarmForm
        initialData={editingFarm || { name: '', location: '', manager_name: '', contact_info: '' }}
        buttonLabel={editingFarm ? 'Update Farm' : 'Add Farm'}
        onSubmit={(form) => (editingFarm ? handleUpdate(editingFarm.id, form) : handleCreate(form))}
        onCancel={() => setEditingFarm(null)}
      />
      <FarmList
        farms={farms}
        onEdit={(farm) => setEditingFarm(farm)}
        onDelete={handleDelete}
      />
    </div>
  );
}
