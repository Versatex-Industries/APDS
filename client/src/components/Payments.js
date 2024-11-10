import { useState, useEffect } from 'react';
import api from '../api';
import './Payments.css';

function Payments({ token, onSubmit }) {
    const [amount, setAmount] = useState('');
    const [currency, setCurrency] = useState('');
    const [recipient, setRecipient] = useState('');
    const [payments, setPayments] = useState([]);

    useEffect(() => {
        const fetchPayments = async () => {
            try {
                const response = await api.get('/payments', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setPayments(response.data);
            } catch (error) {
                console.error('Error fetching payments:', error);
            }
        };
        fetchPayments();
    }, [token]);

    const handlePayment = async () => {
        try {
            await api.post('/payment', { amount, currency, recipient }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            alert('Payment successful');
            setAmount('');
            setCurrency('');
            setRecipient('');

            // Refresh payments
            const response = await api.get('/payments', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPayments(response.data);
        } catch (error) {
            alert(error.response?.data?.message || 'Payment failed');
        }
    };

    const submitPayment = () => {
        // Use provided onSubmit for testing, or fallback to handlePayment
        if (onSubmit) {
            onSubmit({ amount, currency, recipient });
        } else {
            handlePayment();
        }
    };

    return (
        <div className="payments-container">
            <div className="payment-form">
                <h2>Make a Payment</h2>
                <input
                    type="number"
                    placeholder="Amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Currency"
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Recipient"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                />
                <button onClick={submitPayment}>Submit Payment</button>
            </div>
            <div className="payments-history">
                <h2>Payment History</h2>
                {payments.length ? (
                    <ul>
                        {payments.map((payment) => (
                            <li key={payment._id}>
                                <span>{payment.amount} {payment.currency}</span> to <span>{payment.recipient}</span> on <span>{new Date(payment.createdAt).toLocaleString()}</span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No previous payments.</p>
                )}
            </div>
        </div>
    );
}

export default Payments;
