import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Campaign Dashboard heading', () => {
  render(<App />);
  const heading = screen.getByText(/Campaign Dashboard/i);
  expect(heading).toBeInTheDocument();
});
