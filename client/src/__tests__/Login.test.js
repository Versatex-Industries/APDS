// src/__tests__/Login.test.js
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Login from '../components/Login';
import * as authApi from '../authApi';

jest.mock('../authApi');

// Mock global alert function
global.alert = jest.fn();

describe('Login Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('submits form with correct values and calls the API', async () => {
        authApi.login.mockResolvedValueOnce({ token: 'test-token' });

        render(<Login setToken={jest.fn()} />);

        // Simulate user input
        fireEvent.change(screen.getByPlaceholderText(/username/i), { target: { value: 'testuser' } });
        fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: 'Test1234' } });
        fireEvent.click(screen.getByRole('button', { name: /login/i }));

        // Verify login and alert
        await waitFor(() => expect(authApi.login).toHaveBeenCalledWith('testuser', 'Test1234'));
        expect(global.alert).toHaveBeenCalledWith('Login successful');
    });

    test('shows an error message if login fails', async () => {
        authApi.login.mockRejectedValueOnce(new Error('Login failed'));

        render(<Login setToken={jest.fn()} />);

        fireEvent.change(screen.getByPlaceholderText(/username/i), { target: { value: 'testuser' } });
        fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: 'wrongpassword' } });
        fireEvent.click(screen.getByRole('button', { name: /login/i }));

        // Wait for alert to confirm the error
        await waitFor(() => expect(global.alert).toHaveBeenCalledWith('Login failed'));
    });
});
