import { useState, useEffect } from 'react';
import Auth from './components/Auth';
import Payments from './components/Payments';
import './App.css';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  return (
      <div className="app">
        {!token ? <Auth setToken={setToken} /> : <Payments token={token} />}
        {token && <button className="logout-btn" onClick={handleLogout}>Logout</button>}
      </div>
  );
}

export default App;
