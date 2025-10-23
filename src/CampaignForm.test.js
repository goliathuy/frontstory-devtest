import { render, screen, fireEvent } from '@testing-library/react';
import CampaignForm from './CampaignForm';

describe('CampaignForm', () => {
  test('calls onCancelEditing when Cancel is clicked in edit mode', () => {
    const onCancelEditing = jest.fn();
    const onAdd = jest.fn();
    const onUpdate = jest.fn();

    const editingCampaign = {
      id: '123',
      name: 'Edit Me',
      startDate: '2024-01-01',
      endDate: '2024-02-01',
      clicks: 100,
      cost: 10,
      revenue: 20,
    };

    render(
      <CampaignForm
        onAdd={onAdd}
        onUpdate={onUpdate}
        editingCampaign={editingCampaign}
        onCancelEditing={onCancelEditing}
      />
    );

    // Ensure we are in edit mode
    expect(screen.getByText(/Edit Campaign/i)).toBeInTheDocument();

    // Click Cancel and assert callback invoked
    fireEvent.click(screen.getByText(/Cancel/i));
    expect(onCancelEditing).toHaveBeenCalledTimes(1);
  });
});
