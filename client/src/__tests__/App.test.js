import { render, screen } from '@testing-library/react';
import App from '../App';


test('renders login form', () => {
  render(<App />);
  expect(screen.getByPlaceholderText(/username/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();

  // Use getAllByRole and select the second "Login" button for form submission
  const loginButtons = screen.getAllByRole('button', { name: /login/i });
  expect(loginButtons[1]).toBeInTheDocument(); // Assuming the second "Login" button is for submission
});
