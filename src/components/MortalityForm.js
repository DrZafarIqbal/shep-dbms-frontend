import React, { useState } from 'react';

const MortalityForm = ({ onSubmit, initialData = {}, buttonLabel = "Add Mortality Record" }) => {
  const [formData, setFormData] = useState({
    tag_number: initialData.tag_number || '',
    branding_id: initialData.branding_id || '',
    date_of_death: initialData.date_of_death || '',
    cause_of_death: initialData.cause_of_death || ''
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
      date_of_death: '',
      cause_of_death: ''
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>{buttonLabel}</h3>
      <input name="tag_number" value={formData.tag_number} onChange={handleChange} placeholder="Tag Number (Lamb)" />
      <input name="branding_id" value={formData.branding_id} onChange={handleChange} placeholder="Branding ID (Adult)" />
      <input type="date" name="date_of_death" value={formData.date_of_death} onChange={handleChange} required />
      <textarea name="cause_of_death" value={formData.cause_of_death} onChange={handleChange} placeholder="Cause of Death" />
      <button type="submit">{buttonLabel}</button>
    </form>
  );
};

export default MortalityForm;
