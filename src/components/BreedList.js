import React, { useEffect, useState } from 'react';
import BreedForm from './BreedForm';

const API = process.env.REACT_APP_API_BASE_URL;

export default function BreedList() {
  const [breeds, setBreeds] = useState([]);
  const [editing, setEditing] = useState(null);

  const fetchBreeds = async () => {
    const res = await fetch(`${API}/api/breeds`);
    if (!res.ok) throw new Error('Failed to fetch breeds');
    const data = await res.json();
    setBreeds(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    fetchBreeds().catch(console.error);
  }, []);

  const addBreed = async (record) => {
    const res = await fetch(`${API}/api/breeds`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(record),
    });
    if (!res.ok) throw new Error('Failed to add breed');
    await fetchBreeds();
  };

  const updateBreed = async (record) => {
    const res = await fetch(`${API}/api/breeds/${record.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(record),
    });
    if (!res.ok) throw new Error('Failed to update breed');
    setEditing(null);
    await fetchBreeds();
  };

  const deleteBreed = async (id) => {
    if (!window.confirm('Delete this breed?')) return;
    const res = await fetch(`${API}/api/breeds/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete breed');
    await fetchBreeds();
  };

  const onSubmit = (payload) => (editing ? updateBreed(payload) : addBreed(payload));
  const onCancel = () => setEditing(null);

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <BreedForm editing={editing} onSubmit={onSubmit} onCancel={onCancel} />

      <section>
        <h3 style={{ marginBottom: 8 }}>Breeds</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', borderBottom: '1px solid #e5e7eb', padding: 8 }}>ID</th>
                <th style={{ textAlign: 'left', borderBottom: '1px solid #e5e7eb', padding: 8 }}>Name</th>
                <th style={{ textAlign: 'left', borderBottom: '1px solid #e5e7eb', padding: 8 }}>Description</th>
                <th style={{ borderBottom: '1px solid #e5e7eb', padding: 8 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {breeds.map((b) => (
                <tr key={b.id}>
                  <td style={{ padding: 8, borderBottom: '1px solid #f3f4f6' }}>{b.id}</td>
                  <td style={{ padding: 8, borderBottom: '1px solid #f3f4f6' }}>{b.name}</td>
                  <td style={{ padding: 8, borderBottom: '1px solid #f3f4f6' }}>{b.description}</td>
                  <td style={{ padding: 8, borderBottom: '1px solid #f3f4f6', whiteSpace: 'nowrap' }}>
                    <button onClick={() => setEditing(b)} style={{ marginRight: 8 }}>Edit</button>
                    <button onClick={() => deleteBreed(b.id)}>Delete</button>
                  </td>
                </tr>
              ))}
              {breeds.length === 0 && (
                <tr>
                  <td colSpan="4" style={{ padding: 12, color: '#6b7280' }}>
                    No breeds yet. Add the first one above.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
