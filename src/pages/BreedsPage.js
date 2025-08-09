import React, { useCallback, useEffect, useState } from 'react';
import BreedForm from '../components/BreedForm';
import BreedList from '../components/BreedList';

export default function BreedsPage() {
  const API = process.env.REACT_APP_API_BASE_URL;
  const [breeds, setBreeds] = useState([]);
  const [editing, setEditing] = useState(null);

  const load = useCallback(async () => {
    const res = await fetch(`${API}/api/breeds`);
    const data = await res.json();
    setBreeds(Array.isArray(data) ? data : []);
  }, [API]);

  useEffect(() => { load(); }, [load]);

  const handleCreate = async (payload) => {
    await fetch(`${API}/api/breeds`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    setEditing(null);
    await load();
  };

  const handleUpdate = async (id, payload) => {
    await fetch(`${API}/api/breeds/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    setEditing(null);
    await load();
  };

  const handleDelete = async (id) => {
    await fetch(`${API}/api/breeds/${id}`, { method: 'DELETE' });
    if (editing?.id === id) setEditing(null);
    await load();
  };

  return (
    <div>
      <h2>Breeds</h2>
      <BreedForm
        initialData={editing || { name: '', description: '' }}
        buttonLabel={editing ? 'Update Breed' : 'Add Breed'}
        onSubmit={(form) => (editing ? handleUpdate(editing.id, form) : handleCreate(form))}
        onCancel={() => setEditing(null)}
      />
      <BreedList
        breeds={breeds}
        onEdit={(b) => setEditing(b)}
        onDelete={handleDelete}
      />
    </div>
  );
}
