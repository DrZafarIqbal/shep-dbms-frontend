import React, { useEffect, useState } from 'react';

export default function BreedForm({
  initialData = { name: '', description: '' },
  buttonLabel = 'Add Breed',
  onSubmit,
  onCancel,
}) {
  const [form, setForm] = useState(initialData);

  useEffect(() => {
    setForm(initialData);
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit?.(form);
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: 16 }}>
      <div style={{ display: 'grid', gap: 8, maxWidth: 520 }}>
        <input
          name="name"
          placeholder="Breed name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          rows={3}
        />
        <div style={{ display: 'flex', gap: 8 }}>
          <button type="submit">{buttonLabel}</button>
          {onCancel && <button type="button" onClick={onCancel}>Cancel</button>}
        </div>
      </div>
    </form>
  );
}
