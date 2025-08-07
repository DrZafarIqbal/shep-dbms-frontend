import React, { useState } from 'react';

const BrandingForm = ({ onSubmit, initialData = {}, buttonLabel = "Add Branding" }) => {
  const [formData, setFormData] = useState({
    tag_number: initialData.tag_number || '',
    branding_id: initialData.branding_id || '',
    branding_date: initialData.branding_date || '',
    gender: initialData.gender || '',
    breed_id: initialData.breed_id || '',
    farm_id: initialData.farm_id || '',
    dob: initialData.dob || '',
    sire_branding_id: initialData.sire_branding_id || '',
    dam_branding_id: initialData.dam_branding_id || '',
    notes: initialData.notes || '',
    current_status: initialData.current_status || ''
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
      branding_date: '',
      gender: '',
      breed_id: '',
      farm_id: '',
      dob: '',
      sire_branding_id: '',
      dam_branding_id: '',
      notes: '',
      current_status: ''
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>{buttonLabel}</h3>
      <input type="text" name="tag_number" value={formData.tag_number} onChange={handleChange} placeholder="Tag Number" required />
      <input type="text" name="branding_id" value={formData.branding_id} onChange={handleChange} placeholder="Branding ID" />
      <input type="date" name="branding_date" value={formData.branding_date} onChange={handleChange} />
      <input type="text" name="gender" value={formData.gender} onChange={handleChange} placeholder="Gender" />
      <input type="number" name="breed_id" value={formData.breed_id} onChange={handleChange} placeholder="Breed ID" />
      <input type="number" name="farm_id" value={formData.farm_id} onChange={handleChange} placeholder="Farm ID" />
      <input type="date" name="dob" value={formData.dob} onChange={handleChange} placeholder="DOB" required />
      <input type="text" name="sire_branding_id" value={formData.sire_branding_id} onChange={handleChange} placeholder="Sire Branding ID" />
      <input type="text" name="dam_branding_id" value={formData.dam_branding_id} onChange={handleChange} placeholder="Dam Branding ID" />
      <input type="text" name="notes" value={formData.notes} onChange={handleChange} placeholder="Notes" />
      <input type="text" name="current_status" value={formData.current_status} onChange={handleChange} placeholder="Status" />
      <button type="submit">{buttonLabel}</button>
    </form>
  );
};

export default BrandingForm;
