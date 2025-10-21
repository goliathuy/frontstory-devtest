import { useState, useEffect } from 'react';
import './App.css';
import CampaignTable from './CampaignTable';

// At the top of App.js, outside component
const createCampaign = (name, startDate, endDate, clicks, cost, revenue) => ({
  id: Date.now().toString(),
  name,
  startDate,
  endDate,
  clicks: parseInt(clicks),
  cost: parseFloat(cost),
  revenue: parseFloat(revenue),
});
  
function App() {
  //Adding sample campaigns
  const [campaigns, setCampaigns] = useState([
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
  ]);

  const addCampaign = (campaign) => {
    setCampaigns((prevCampaigns) => [...prevCampaigns, campaign]);
  };

  const handleEdit = (id) => {
    alert(`Edit campaign ${id}`);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this campaign?')) {
      setCampaigns(campaigns.filter(campaign => campaign.id !== id));
    }
  };

  return (
    <div className="App">
      <h1>Campaign Dashboard</h1>
      
      <CampaignTable 
        campaigns={campaigns}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}

export default App;
