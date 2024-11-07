import { useState } from 'react';
import api from '../api';

function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const validateUsername = (username) => /^[a-zA-Z0-9_]{3,16}$/.test(username);
    const validatePassword = (password) => /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password);

    const handleRegister = async () => {
        if (!validateUsername(username) || !validatePassword(password)) {
            return alert('Invalid input');
        }
        try {
            await api.post('/register', { username, password });
            alert('Registration successful');
        } catch (error) {
            alert(error.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div>
            <h2>Register</h2>
            <input type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
            <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
            <button onClick={handleRegister}>Register</button>
        </div>
    );
}

export default Register;
