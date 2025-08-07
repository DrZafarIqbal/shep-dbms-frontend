import React, { useState } from 'react';

const GrowthForm = ({ onSubmit, initialData = {}, buttonLabel = "Add Growth Record" }) => {
  const [formData, setFormData] = useState({
    tag_number: initialData.tag_number || '',
    branding_id: initialData.branding_id || '',
    age_days: initialData.age_days || '',
    body_weight: initialData.body_weight || '',
    recorded_on: initialData.recorded_on || ''
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
      age_days: '',
      body_weight: '',
      recorded_on: ''
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>{buttonLabel}</h3>
      <input name="tag_number" value={formData.tag_number} onChange={handleChange} placeholder="Tag Number (Lamb)" />
      <input name="branding_id" value={formData.branding_id} onChange={handleChange} placeholder="Branding ID (Adult)" />
      <input type="number" name="age_days" value={formData.age_days} onChange={handleChange} placeholder="Age in Days" required />
      <input type="number" name="body_weight" value={formData.body_weight} onChange={handleChange} placeholder="Body Weight" required />
      <input type="date" name="recorded_on" value={formData.recorded_on} onChange={handleChange} />
      <button type="submit">{buttonLabel}</button>
    </form>
  );
};

export default GrowthForm;
