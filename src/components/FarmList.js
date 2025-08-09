import React from 'react';

export default function FarmList({ farms = [], onEdit, onDelete }) {
  if (!farms.length) return <p>No farms yet.</p>;

  return (
    <table border="1" cellPadding="8" style={{ borderCollapse: 'collapse', minWidth: 600 }}>
      <thead>
        <tr>
          <th>Name</th>
          <th>Location</th>
          <th>Manager</th>
          <th>Contact</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {farms.map((f) => (
          <tr key={f.id}>
            <td>{f.name}</td>
            <td>{f.location}</td>
            <td>{f.manager_name}</td>
            <td>{f.contact_info}</td>
            <td>
              <button onClick={() => onEdit?.(f)}>Edit</button>{' '}
              <button onClick={() => onDelete?.(f.id)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
