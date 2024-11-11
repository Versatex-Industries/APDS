import { useState } from 'react';
import api from '../api';
import './Auth.css';

function Auth({ setToken }) {
    const [isLogin, setIsLogin] = useState(true);
    const [isEmployeeLogin, setIsEmployeeLogin] = useState(false); // State to toggle employee login
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const validateUsername = (username) => /^[a-zA-Z0-9_]{3,16}$/.test(username);
    const validatePassword = (password) => /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password);

    const handleAuth = async () => {
        try {

            if(!validateUsername(username)) {
                alert('Please enter a valid username');
                return;
            }

            if(!validatePassword(password)) {
                alert('Please enter a valid password');
                return;
            }

            const endpoint = isEmployeeLogin ? '/employee-login' : (isLogin ? '/login' : '/register')
            const payload = { username, password };

            // Add role to payload if it's an employee login
            if (isEmployeeLogin) payload.role = 'employee';

            const response = await api.post(endpoint, payload);

            if (isLogin) {
                setToken(response.data.token);
                localStorage.setItem('token', response.data.token);
                if(isEmployeeLogin){
                    localStorage.setItem('role', payload.role);
                }
                localStorage.setItem('username', username);
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
                    <button onClick={() => { setIsLogin(true); setIsEmployeeLogin(false); }} className={isLogin && !isEmployeeLogin ? 'active' : ''}>User Login</button>
                    <button onClick={() => setIsLogin(false)} className={!isLogin ? 'active' : ''}>Register</button>
                    <button onClick={() => { setIsEmployeeLogin(true); setIsLogin(true); }} className={isEmployeeLogin ? 'active' : ''}>Employee Login</button>
                </div>
                <div className="auth-form">
                    <input type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
                    <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
                    <button onClick={handleAuth}>{isEmployeeLogin ? 'Employee Login' : (isLogin ? 'Login' : 'Register')}</button>
                </div>
            </div>
        </div>
    );
}

export default Auth;
