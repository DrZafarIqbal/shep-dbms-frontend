import React, { useState } from 'react';

const BreedForm = ({ onSubmit, initialData = {}, buttonLabel = "Add Breed" }) => {
  const [formData, setFormData] = useState({
    name: initialData.name || '',
    description: initialData.description || ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({ name: '', description: '' });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>{buttonLabel}</h3>
      <input
        type="text"
        name="name"
        value={formData.name}
        placeholder="Breed Name"
        onChange={handleChange}
        required
      />
      <textarea
        name="description"
        value={formData.description}
        placeholder="Description"
        onChange={handleChange}
      />
      <button type="submit">{buttonLabel}</button>
    </form>
  );
};

export default BreedForm;

