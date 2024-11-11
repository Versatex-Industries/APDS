import { useState, useEffect } from 'react';
import api from '../api';
import './Payments.css';

function Payments({ token, onSubmit }) {
    const [amount, setAmount] = useState('');
    const [currency, setCurrency] = useState('');
    const [recipient, setRecipient] = useState('');
    const [payments, setPayments] = useState([]);
    const username = localStorage.getItem('username');
    const role = localStorage.getItem('role'); // Retrieve role to determine if user is an employee

    useEffect(() => {
        const fetchPayments = async () => {
            try {
                const endpoint = role === 'employee' ? '/payments' : `/payments/${username}`;

                const response = await api.get(endpoint, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                setPayments(response.data);
            } catch (error) {
                console.error('Error fetching payments:', error);
            }
        };
        fetchPayments();
    }, [token, username, role]);

    const handlePayment = async () => {
        const sender = username || 'unknown sender';

        try {
            await api.post('/payment', { amount, currency, sender, recipient }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            alert('Payment successful');
            setAmount('');
            setCurrency('');
            setRecipient('');

            // Refresh payments after successful payment
            const endpoint = role === 'employee' ? '/payments' : `/payments/${username}`;
            const response = await api.get(endpoint, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setPayments(response.data);
        } catch (error) {
            alert(error.response?.data?.message || 'Payment failed');
        }
    };

    const submitPayment = () => {
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
                <h2>{role === 'employee' ? 'All Payments' : 'Your Payments'}</h2>
                {payments.length ? (
                    <ul>
                        {payments.map((payment) => (
                            <li key={payment._id}>
                                <span>{payment.amount} {payment.currency} from {payment.sender} to {payment.recipient} on {new Date(payment.createdAt).toLocaleString()}</span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No payments available.</p>
                )}
            </div>
        </div>
    );
}

export default Payments;
