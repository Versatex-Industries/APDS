import { useState } from 'react';
import Auth from './components/Auth';
import EmployeeLogin from './components/EmployeeLogin';
import Payments from './components/Payments';
import './App.css';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isEmployeeLogin, setIsEmployeeLogin] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('role')
    setToken(null);
  };

  return (
      <div className="app">
        {!token ? (
            isEmployeeLogin ? (
                <EmployeeLogin setToken={setToken} />
            ) : (
                <Auth setToken={setToken} />
            )
        ) : (
            <Payments token={token} />
        )}

        {!token && (
            <button onClick={() => setIsEmployeeLogin(!isEmployeeLogin)}>
              {isEmployeeLogin ? 'User Login' : 'Employee Login'}
            </button>
        )}

        {token && (
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
        )}
      </div>
  );
}

export default App;
