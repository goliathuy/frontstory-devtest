import { render, screen, fireEvent, within } from '@testing-library/react';
import App from './App';

// Utility to reset localStorage between tests to avoid persistence side-effects
beforeEach(() => {
  localStorage.clear();
});

const fillAndSubmitNewCampaign = ({
  name = 'New Test Campaign',
  startDate = '2025-01-01',
  endDate = '2025-01-31',
  clicks = '1234',
  cost = '100.50',
  revenue = '300.75',
} = {}) => {
  fireEvent.change(screen.getByLabelText(/Campaign Name/i), { target: { value: name } });
  fireEvent.change(screen.getByLabelText(/Start Date/i), { target: { value: startDate } });
  fireEvent.change(screen.getByLabelText(/End Date/i), { target: { value: endDate } });
  fireEvent.change(screen.getByLabelText(/Clicks/i), { target: { value: clicks } });
  fireEvent.change(screen.getByLabelText(/Cost/i), { target: { value: cost } });
  fireEvent.change(screen.getByLabelText(/Revenue/i), { target: { value: revenue } });
  fireEvent.click(screen.getByRole('button', { name: /Add Campaign/i }));
  return { name, clicks, cost, revenue };
};

const getRowByName = (name) => {
  const rows = screen.getAllByRole('row');
  return rows.find((r) => within(r).queryByText(name));
};

const getProfitCellFromRow = (row) => {
  const cells = within(row).getAllByRole('cell');
  return cells[6];
};

describe('App integration - CRUD and presentation', () => {
  test('Add a new campaign and verify calculated profit and formatting', () => {
    render(<App />);

    const { name, clicks, cost, revenue } = fillAndSubmitNewCampaign();

    const row = getRowByName(name);
    expect(row).toBeInTheDocument();

    // Clicks should be formatted with thousands separator
    const expectedClicks = Number(clicks).toLocaleString('en-US');
    expect(row).toHaveTextContent(expectedClicks);

    // Profit = revenue - cost, 2 decimals, should be positive
    const profit = (parseFloat(revenue) - parseFloat(cost)).toFixed(2);
    const profitCell = getProfitCellFromRow(row);
    expect(profitCell).toHaveTextContent(profit);
    expect(profitCell.className).toMatch(/profit-positive/);
  });

  test('Delete a campaign removes it from the table', () => {
    // Seed by adding a campaign we can confidently remove
    render(<App />);
    const { name } = fillAndSubmitNewCampaign({ name: 'Delete Me' });

    const row = getRowByName(name);
    expect(row).toBeInTheDocument();

    // Confirm deletion dialog
    const confirmSpy = jest.spyOn(window, 'confirm').mockImplementation(() => true);

    // Click Delete in that row
    const deleteBtn = within(row).getByRole('button', { name: /Delete/i });
    fireEvent.click(deleteBtn);

    expect(screen.queryByText(name)).not.toBeInTheDocument();
    confirmSpy.mockRestore();
  });

  test('Edit a campaign updates values and recalculates profit', () => {
    render(<App />);
    const { name } = fillAndSubmitNewCampaign({ name: 'Edit Me', cost: '50.00', revenue: '100.00' });

    let row = getRowByName(name);
    expect(row).toBeInTheDocument();

    // Click Edit on the row
    const editBtn = within(row).getByRole('button', { name: /Edit/i });
    fireEvent.click(editBtn);

    // Change cost and revenue, submit Update
    fireEvent.change(screen.getByLabelText(/Cost/i), { target: { value: '75.25' } });
    fireEvent.change(screen.getByLabelText(/Revenue/i), { target: { value: '120.00' } });
    fireEvent.click(screen.getByRole('button', { name: /Update Campaign/i }));

    // Re-query the row (content updated)
    row = getRowByName(name);
    const profitCell = getProfitCellFromRow(row);
    const expectedProfit = (120.0 - 75.25).toFixed(2);
    expect(profitCell).toHaveTextContent(expectedProfit);
    expect(profitCell.className).toMatch(/profit-positive/);
  });
});
