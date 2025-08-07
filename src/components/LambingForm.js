import React, { useState } from 'react';

const LambingForm = ({ onSubmit, initialData = {}, buttonLabel = "Add Lambing" }) => {
  const [formData, setFormData] = useState({
    dam_branding_id: initialData.dam_branding_id || '',
    sire_branding_id: initialData.sire_branding_id || '',
    lambing_date: initialData.lambing_date || '',
    number_of_lambs: initialData.number_of_lambs || '',
    notes: initialData.notes || ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      dam_branding_id: '',
      sire_branding_id: '',
      lambing_date: '',
      number_of_lambs: '',
      notes: ''
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>{buttonLabel}</h3>
      <input name="dam_branding_id" value={formData.dam_branding_id} onChange={handleChange} placeholder="Dam Branding ID" required />
      <input name="sire_branding_id" value={formData.sire_branding_id} onChange={handleChange} placeholder="Sire Branding ID" />
      <input type="date" name="lambing_date" value={formData.lambing_date} onChange={handleChange} required />
      <input type="number" name="number_of_lambs" value={formData.number_of_lambs} onChange={handleChange} placeholder="No. of Lambs" />
      <textarea name="notes" value={formData.notes} onChange={handleChange} placeholder="Notes" />
      <button type="submit">{buttonLabel}</button>
    </form>
  );
};

export default LambingForm;
