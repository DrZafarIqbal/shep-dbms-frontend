import React, { useState } from 'react';

const LambForm = ({ onSubmit, initialData = {}, buttonLabel = "Add Lamb" }) => {
  const [formData, setFormData] = useState({
    tag_number: initialData.tag_number || '',
    lambing_id: initialData.lambing_id || '',
    birth_weight: initialData.birth_weight || '',
    birth_type: initialData.birth_type || '',
    vigor_score: initialData.vigor_score || '',
    notes: initialData.notes || ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      tag_number: '',
      lambing_id: '',
      birth_weight: '',
      birth_type: '',
      vigor_score: '',
      notes: ''
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>{buttonLabel}</h3>
      <input name="tag_number" value={formData.tag_number} onChange={handleChange} placeholder="Tag Number" required />
      <input type="number" name="lambing_id" value={formData.lambing_id} onChange={handleChange} placeholder="Lambing ID" />
      <input type="number" name="birth_weight" value={formData.birth_weight} onChange={handleChange} placeholder="Birth Weight" />
      <input name="birth_type" value={formData.birth_type} onChange={handleChange} placeholder="Birth Type" />
      <input type="number" name="vigor_score" value={formData.vigor_score} onChange={handleChange} placeholder="Vigor Score" />
      <textarea name="notes" value={formData.notes} onChange={handleChange} placeholder="Notes" />
      <button type="submit">{buttonLabel}</button>
    </form>
  );
};

export default LambForm;
