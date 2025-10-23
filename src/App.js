import { useState, useEffect } from 'react';
import './App.css';
import CampaignTable from './CampaignTable';
import CampaignForm from './CampaignForm';

// Sample campaigns(only if localStorage is empty)
const sampleCampaigns = [
  {
    id: '1',
    name: 'Summer Sale 2024',
    startDate: '2024-06-01',
    endDate: '2024-08-31',
    clicks: 15420,
    cost: 2500.00,
    revenue: 8750.00
  },
  {
    id: '2',
    name: 'Black Friday Campaign',
    startDate: '2024-11-20',
    endDate: '2024-11-30',
    clicks: 32100,
    cost: 4200.00,
    revenue: 15600.00
  },
  {
    id: '3',
    name: 'New Year Promo',
    startDate: '2024-12-26',
    endDate: '2025-01-10',
    clicks: 18900,
    cost: 3100.00,
    revenue: 9800.00
  }
];

function App() {
  const [campaigns, setCampaigns] = useState([]);
  const [editingCampaign, setEditingCampaign] = useState(null);

  useEffect(() => {
    const savedCampaigns = localStorage.getItem('campaigns');
    if (savedCampaigns) {
      setCampaigns(JSON.parse(savedCampaigns));
    } else {
      setCampaigns(sampleCampaigns);
    }
  }, []);

  useEffect(() => {
    if (campaigns.length > 0) {
      localStorage.setItem('campaigns', JSON.stringify(campaigns));
    }
  }, [campaigns]);

  const addCampaign = (campaign) => {
    setCampaigns((prevCampaigns) => [...prevCampaigns, campaign]);
  };

  const handleEdit = (campaign) => {
    setEditingCampaign(campaign);
  };

  const handleUpdate = (updatedCampaign) => {
    setCampaigns(campaigns.map(c => c.id === updatedCampaign.id ? updatedCampaign : c));
    setEditingCampaign(null);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this campaign?')) {
      setCampaigns(campaigns.filter(campaign => campaign.id !== id));
      if (editingCampaign && editingCampaign.id === id) {
        setEditingCampaign(null);
      }
    }
  };

  return (
    <div className="App">
      <h1>Campaign Dashboard</h1>
      <CampaignForm
        onAdd={addCampaign}
        onUpdate={handleUpdate}
        editingCampaign={editingCampaign}
        onCancelEditing={() => setEditingCampaign(null)}
      />
      <CampaignTable
        campaigns={campaigns}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}

export default App;
