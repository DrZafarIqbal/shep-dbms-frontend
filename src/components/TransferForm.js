import React, { useState } from 'react';

const TransferForm = ({ onSubmit, initialData = {}, buttonLabel = "Add Transfer" }) => {
  const [formData, setFormData] = useState({
    branding_id: initialData.branding_id || '',
    transfer_date: initialData.transfer_date || '',
    from_farm_id: initialData.from_farm_id || '',
    to_farm_id: initialData.to_farm_id || '',
    reason: initialData.reason || ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      branding_id: '',
      transfer_date: '',
      from_farm_id: '',
      to_farm_id: '',
      reason: ''
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>{buttonLabel}</h3>
      <input name="branding_id" value={formData.branding_id} onChange={handleChange} placeholder="Branding ID" required />
      <input type="date" name="transfer_date" value={formData.transfer_date} onChange={handleChange} required />
      <input type="number" name="from_farm_id" value={formData.from_farm_id} onChange={handleChange} placeholder="From Farm ID" required />
      <input type="number" name="to_farm_id" value={formData.to_farm_id} onChange={handleChange} placeholder="To Farm ID" required />
      <input name="reason" value={formData.reason} onChange={handleChange} placeholder="Reason" />
      <button type="submit">{buttonLabel}</button>
    </form>
  );
};

export default TransferForm;
