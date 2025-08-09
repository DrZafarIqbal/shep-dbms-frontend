import React, { useEffect, useState } from 'react';

export default function FarmForm({
  initialData = { name: '', location: '', manager_name: '', contact_info: '' },
  buttonLabel = 'Add Farm',
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
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: 16 }}>
      <div style={{ display: 'grid', gap: 8, maxWidth: 520 }}>
        <input
          name="name"
          placeholder="Farm name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          name="location"
          placeholder="Location"
          value={form.location}
          onChange={handleChange}
        />
        <input
          name="manager_name"
          placeholder="Manager name"
          value={form.manager_name}
          onChange={handleChange}
        />
        <input
          name="contact_info"
          placeholder="Contact info"
          value={form.contact_info}
          onChange={handleChange}
        />
        <div style={{ display: 'flex', gap: 8 }}>
          <button type="submit">{buttonLabel}</button>
          {onCancel && (
            <button type="button" onClick={onCancel}>Cancel</button>
          )}
        </div>
      </div>
    </form>
  );
}
