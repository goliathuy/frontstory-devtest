import { useState } from 'react';

function CampaignForm({ onAdd }) {
  const [formData, setFormData] = useState({
    name: '',
    startDate: '',
    endDate: '',
    clicks: '',
    cost: '',
    revenue: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Create campaign object
    const newCampaign = {
      id: Date.now().toString(),
      name: formData.name,
      startDate: formData.startDate,
      endDate: formData.endDate,
      clicks: parseInt(formData.clicks) || 0,
      cost: parseFloat(formData.cost) || 0,
      revenue: parseFloat(formData.revenue) || 0
    };
    
    // Call parent's add function
    onAdd(newCampaign);
    
    // Reset form
    setFormData({name: '',  startDate: '', endDate: '', clicks: '', cost: '', revenue: ''});
  };

  return (
    <div className="campaign-form">
      <h2>Add New Campaign</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Campaign Name"
            required
          />
          
          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleInputChange}
            placeholder="Start Date"
            required
          />
          
          <input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleInputChange}
            placeholder="End Date"
            required
          />
        </div>
        
        <div className="form-row">
          <input
            type="number"
            name="clicks"
            value={formData.clicks}
            onChange={handleInputChange}
            placeholder="Clicks"
            min="0"
            required
          />
          
          <input
            type="number"
            name="cost"
            value={formData.cost}
            onChange={handleInputChange}
            placeholder="Cost"
            step="0.01"
            min="0"
            required
          />
          
          <input
            type="number"
            name="revenue"
            value={formData.revenue}
            onChange={handleInputChange}
            placeholder="Revenue"
            step="0.01"
            min="0"
            required
          />
        </div>
        
        <button type="submit" className="submit-button">Add Campaign</button>
      </form>
    </div>
  );
}

export default CampaignForm;
