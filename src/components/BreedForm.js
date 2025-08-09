import React, { useEffect, useState } from 'react';

const empty = { name: '', description: '' };

export default function BreedForm({ editing, onSubmit, onCancel }) {
  const [form, setForm] = useState(empty);
  const isEdit = Boolean(editing);

  useEffect(() => {
    if (isEdit) {
      setForm({
        name: editing?.name ?? '',
        description: editing?.description ?? '',
        id: editing?.id,
      });
    } else {
      setForm(empty);
    }
  }, [isEdit, editing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 8, maxWidth: 520 }}>
      <h2 style={{ margin: 0 }}>{isEdit ? 'Update Breed' : 'Add Breed'}</h2>

      <label>
        Name
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          style={{ width: '100%', padding: 8, marginTop: 4 }}
        />
      </label>

      <label>
        Description
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows={3}
          style={{ width: '100%', padding: 8, marginTop: 4 }}
        />
      </label>

      <div style={{ display: 'flex', gap: 8 }}>
        <button type="submit">{isEdit ? 'Save Changes' : 'Add Breed'}</button>
        {isEdit && (
          <button type="button" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
