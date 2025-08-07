import React, { useState } from 'react';

const FarmForm = ({ onSubmit, initialData = {}, buttonLabel = "Add Farm" }) => {
  const [formData, setFormData] = useState({
    name: initialData.name || '',
    location: initialData.location || '',
    manager_name: initialData.manager_name || '',
    contact_info: initialData.contact_info || ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({ name: '', location: '', manager_name: '', contact_info: '' });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>{buttonLabel}</h3>
      <input type="text" name="name" value={formData.name} placeholder="Farm Name" onChange={handleChange} required />
      <input type="text" name="location" value={formData.location} placeholder="Location" onChange={handleChange} />
      <input type="text" name="manager_name" value={formData.manager_name} placeholder="Manager Name" onChange={handleChange} />
      <input type="text" name="contact_info" value={formData.contact_info} placeholder="Contact Info" onChange={handleChange} />
      <button type="submit">{buttonLabel}</button>
    </form>
  );
};

export default FarmForm;
