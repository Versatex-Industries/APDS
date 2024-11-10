// src/__tests__/Payment.test.js
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Payments from '../components/Payments';

describe('Payment Component', () => {
    test('renders the payment form', () => {
        render(<Payments />);

        // Check if all inputs and buttons are rendered
        expect(screen.getByPlaceholderText(/amount/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/currency/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/recipient/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /submit payment/i })).toBeInTheDocument();
    });

    test('submits payment with correct values', () => {
        const handlePayment = jest.fn();

        render(<Payments onSubmit={handlePayment} />);

        // Simulate user input
        fireEvent.change(screen.getByPlaceholderText(/amount/i), { target: { value: '100' } });
        fireEvent.change(screen.getByPlaceholderText(/currency/i), { target: { value: 'USD' } });
        fireEvent.change(screen.getByPlaceholderText(/recipient/i), { target: { value: 'recipient@example.com' } });
        fireEvent.click(screen.getByRole('button', { name: /submit payment/i }));

        // Debug log to check if handlePayment was not triggered
        console.log("handlePayment call count:", handlePayment.mock.calls.length);

        // Check if handlePayment was called with correct values
        expect(handlePayment).toHaveBeenCalledTimes(1);
        expect(handlePayment).toHaveBeenCalledWith({
            amount: '100',
            currency: 'USD',
            recipient: 'recipient@example.com',
        });
    });
});
