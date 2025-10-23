function CampaignTable({ campaigns, onEdit, onDelete }) {
  const calculateProfit = (revenue, cost) => {
    return revenue - cost;
  };

  return (
    <table className="campaign-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Start Date</th>
          <th>End Date</th>
          <th>Clicks</th>
          <th>Cost</th>
          <th>Revenue</th>
          <th>Profit</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {campaigns.map((campaign) => (
          <tr key={campaign.id}>
            <td>{campaign.name}</td>
            <td>{campaign.startDate}</td>
            <td>{campaign.endDate}</td>
            <td>{campaign.clicks.toLocaleString()}</td>
            <td>${campaign.cost.toFixed(2)}</td>
            <td>${campaign.revenue.toFixed(2)}</td>
            <td className={calculateProfit(campaign.revenue, campaign.cost) >= 0 ? 'profit-positive' : 'profit-negative'}>
              ${calculateProfit(campaign.revenue, campaign.cost).toFixed(2)}
            </td>
            <td>
              <button onClick={() => onEdit(campaign)}>Edit</button>
              <button onClick={() => onDelete(campaign.id)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default CampaignTable;
