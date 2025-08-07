import React, { useState } from 'react';

const HealthEventForm = ({ onSubmit, initialData = {}, buttonLabel = "Add Health Event" }) => {
  const [formData, setFormData] = useState({
    tag_number: initialData.tag_number || '',
    branding_id: initialData.branding_id || '',
    event_date: initialData.event_date || '',
    event_type: initialData.event_type || '',
    description: initialData.description || ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      tag_number: '',
      branding_id: '',
      event_date: '',
      event_type: '',
      description: ''
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>{buttonLabel}</h3>
      <input name="tag_number" value={formData.tag_number} onChange={handleChange} placeholder="Tag Number (Lamb)" />
      <input name="branding_id" value={formData.branding_id} onChange={handleChange} placeholder="Branding ID (Adult)" />
      <input type="date" name="event_date" value={formData.event_date} onChange={handleChange} required />
      <input name="event_type" value={formData.event_type} onChange={handleChange} placeholder="Event Type" required />
      <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" />
      <button type="submit">{buttonLabel}</button>
    </form>
  );
};

export default HealthEventForm;
