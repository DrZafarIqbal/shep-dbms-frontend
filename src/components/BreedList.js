import React from 'react';

export default function BreedList({ breeds = [], onEdit, onDelete }) {
  if (!breeds.length) return <p>No breeds yet.</p>;

  return (
    <table border="1" cellPadding="8" style={{ borderCollapse: 'collapse', minWidth: 600 }}>
      <thead>
        <tr>
          <th>Name</th>
          <th>Description</th>
          <th style={{ width: 160 }}>Actions</th>
        </tr>
      </thead>
      <tbody>
        {breeds.map((b) => (
          <tr key={b.id}>
            <td>{b.name}</td>
            <td>{b.description}</td>
            <td>
              <button onClick={() => onEdit?.(b)}>Edit</button>{' '}
              <button onClick={() => onDelete?.(b.id)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
