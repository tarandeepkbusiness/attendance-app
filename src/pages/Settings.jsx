import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Globe, Lock, LogOut } from 'lucide-react';
import { AuthContext } from '../App';

function Settings() {
  const navigate = useNavigate();
  const { user, setUser, language, setLanguage } = useContext(AuthContext);

  const handleLogout = () => {
    setUser(null);
    navigate('/login');
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'pa' : 'en');
  };

  return (
    <div className="app-container animate-fade-in">
      <div className="header" style={{ marginBottom: '1.5rem', borderBottom: 'none' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <img onError={(e) => { e.target.onerror = null; e.target.src='/favicon.svg'; }} src="/logo.png" alt="App Logo" style={{ height: '32px', width: 'auto' }} />
          <button onClick={() => navigate(-1)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-color)' }}>
            <ArrowLeft size={24} />
            <h1 style={{ margin: 0 }}>Settings</h1>
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div className="card" style={{ padding: '0' }}>
          <button 
            style={{ width: '100%', padding: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(212, 175, 55, 0.2)' }}
            onClick={toggleLanguage}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Globe size={20} color="var(--secondary-color)" />
              <span style={{ fontSize: '1.1rem', fontWeight: '500' }}>Language</span>
            </div>
            <span style={{ color: 'rgba(128, 90, 64, 0.7)' }}>{language === 'en' ? 'English' : 'ਪੰਜਾਬੀ'}</span>
          </button>

          <button style={{ width: '100%', padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', borderBottom: '1px solid rgba(212, 175, 55, 0.2)' }}>
            <Lock size={20} color="var(--secondary-color)" />
            <span style={{ fontSize: '1.1rem', fontWeight: '500' }}>Change Password</span>
          </button>

          <button 
            style={{ width: '100%', padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--error-color)' }}
            onClick={handleLogout}
          >
            <LogOut size={20} />
            <span style={{ fontSize: '1.1rem', fontWeight: '500' }}>Logout</span>
          </button>
        </div>
      </div>
      
      <div style={{ marginTop: 'auto', textAlign: 'center', color: 'rgba(128, 90, 64, 0.5)', padding: '2rem 0' }}>
        <p style={{ margin: 0, fontSize: '0.85rem' }}>Logged in as {user?.name}</p>
        <p style={{ margin: 0, fontSize: '0.75rem' }}>Version 1.0.0</p>
      </div>
    </div>
  );
}

export default Settings;
