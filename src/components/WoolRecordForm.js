import React, { useState } from 'react';

const WoolRecordForm = ({ onSubmit, initialData = {}, buttonLabel = "Add Wool Record" }) => {
  const [formData, setFormData] = useState({
    branding_id: initialData.branding_id || '',
    record_date: initialData.record_date || '',
    greasy_fleece_yield: initialData.greasy_fleece_yield || '',
    clean_fleece_yield: initialData.clean_fleece_yield || '',
    staple_length: initialData.staple_length || '',
    fibre_diameter: initialData.fibre_diameter || '',
    medullation_percent: initialData.medullation_percent || '',
    crimps: initialData.crimps || ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      branding_id: '',
      record_date: '',
      greasy_fleece_yield: '',
      clean_fleece_yield: '',
      staple_length: '',
      fibre_diameter: '',
      medullation_percent: '',
      crimps: ''
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>{buttonLabel}</h3>
      <input name="branding_id" value={formData.branding_id} onChange={handleChange} placeholder="Branding ID" required />
      <input type="date" name="record_date" value={formData.record_date} onChange={handleChange} />
      <input type="number" name="greasy_fleece_yield" value={formData.greasy_fleece_yield} onChange={handleChange} placeholder="Greasy Fleece Yield" />
      <input type="number" name="clean_fleece_yield" value={formData.clean_fleece_yield} onChange={handleChange} placeholder="Clean Fleece Yield" />
      <input type="number" name="staple_length" value={formData.staple_length} onChange={handleChange} placeholder="Staple Length" />
      <input type="number" name="fibre_diameter" value={formData.fibre_diameter} onChange={handleChange} placeholder="Fibre Diameter" />
      <input type="number" name="medullation_percent" value={formData.medullation_percent} onChange={handleChange} placeholder="Medullation %" />
      <input type="number" name="crimps" value={formData.crimps} onChange={handleChange} placeholder="Crimps" />
      <button type="submit">{buttonLabel}</button>
    </form>
  );
};

export default WoolRecordForm;
