import { useState, useEffect } from 'react';

function CampaignForm({ onAdd, onUpdate, editingCampaign, onCancelEditing }) {
  const [formData, setFormData] = useState({
    name: '',
    startDate: '',
    endDate: '',
    clicks: '',
    cost: '',
    revenue: ''
  });

  useEffect(() => {
    if (editingCampaign) {
      setFormData({
        name: editingCampaign.name || '',
        startDate: editingCampaign.startDate || '',
        endDate: editingCampaign.endDate || '',
        clicks: editingCampaign.clicks?.toString() || '',
        cost: editingCampaign.cost?.toString() || '',
        revenue: editingCampaign.revenue?.toString() || ''
      });
    } else {
      setFormData({
        name: '',
        startDate: '',
        endDate: '',
        clicks: '',
        cost: '',
        revenue: ''
      });
    }
  }, [editingCampaign]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingCampaign) {
      // Update existing campaign
      const updatedCampaign = {
        ...editingCampaign,
        name: formData.name,
        startDate: formData.startDate,
        endDate: formData.endDate,
        clicks: parseInt(formData.clicks) || 0,
        cost: parseFloat(formData.cost) || 0,
        revenue: parseFloat(formData.revenue) || 0
      };
      onUpdate(updatedCampaign);
    } else {
      // Add new campaign
      const newCampaign = {
        id: Date.now().toString(),
        name: formData.name,
        startDate: formData.startDate,
        endDate: formData.endDate,
        clicks: parseInt(formData.clicks) || 0,
        cost: parseFloat(formData.cost) || 0,
        revenue: parseFloat(formData.revenue) || 0
      };
      onAdd(newCampaign);
    }
    setFormData({name: '',  startDate: '', endDate: '', clicks: '', cost: '', revenue: ''});
  };

  return (
    <div className="campaign-form">
      <h2>{editingCampaign ? 'Edit Campaign' : 'Add New Campaign'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-field">
            <label htmlFor="name">Campaign Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Campaign Name"
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="startDate">Start Date</label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={formData.startDate}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="endDate">End Date</label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={formData.endDate}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-field">
            <label htmlFor="clicks">Clicks</label>
            <input
              type="number"
              id="clicks"
              name="clicks"
              value={formData.clicks}
              onChange={handleInputChange}
              placeholder="0"
              min="0"
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="cost">Cost ($)</label>
            <input
              type="number"
              id="cost"
              name="cost"
              value={formData.cost}
              onChange={handleInputChange}
              placeholder="0.00"
              step="0.01"
              min="0"
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="revenue">Revenue ($)</label>
            <input
              type="number"
              id="revenue"
              name="revenue"
              value={formData.revenue}
              onChange={handleInputChange}
              placeholder="0.00"
              step="0.01"
              min="0"
              required
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-button">
            {editingCampaign ? 'Update Campaign' : 'Add Campaign'}
          </button>
          {editingCampaign ? (
            <button
              type="button"
              className="cancel-button"
              onClick={onCancelEditing}
            >
              Cancel
            </button>
          ) : null}
        </div>
      </form>
    </div>
  );
}

export default CampaignForm;
