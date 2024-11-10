import { useState } from 'react';
import api from '../api';
import './Auth.css';

function Auth({ setToken }) {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleAuth = async () => {
        try {
            const endpoint = isLogin ? '/login' : '/register';
            const response = await api.post(endpoint, { username, password });
            if (isLogin) {
                setToken(response.data.token);
                localStorage.setItem('token', response.data.token);
            } else {
                alert('Registration successful. Please log in.');
                setIsLogin(true);
            }
        } catch (error) {
            alert(error.response?.data?.message || 'An error occurred');
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-box">
                <div className="auth-tabs">
                    <button onClick={() => setIsLogin(true)} className={isLogin ? 'active' : ''}>Login</button>
                    <button onClick={() => setIsLogin(false)} className={!isLogin ? 'active' : ''}>Register</button>
                </div>
                <div className="auth-form">
                    <input type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
                    <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
                    <button onClick={handleAuth}>{isLogin ? 'Login' : 'Register'}</button>
                </div>
            </div>
        </div>
    );
}

export default Auth;
