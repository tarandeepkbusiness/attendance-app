import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Globe, Shield, Fingerprint } from 'lucide-react';
import { AuthContext } from '../../App';

function Me() {
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
    <div className="app-container animate-fade-in" style={{ padding: '1.5rem', paddingBottom: '80px' }}>
      <div className="header" style={{ marginBottom: '2rem', borderBottom: 'none' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <img onError={(e) => { e.target.onerror = null; e.target.src='/favicon.svg'; }} src="/logo.png" alt="App Logo" style={{ height: '32px', width: 'auto' }} />
          <h1 style={{ color: 'var(--secondary-color)', margin: 0 }}>Me</h1>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '2rem', padding: '1.5rem', textAlign: 'center' }}>
        <div style={{ 
          width: '80px', 
          height: '80px', 
          borderRadius: '50%', 
          backgroundColor: 'rgba(212, 175, 55, 0.1)', 
          margin: '0 auto 1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--secondary-color)'
        }}>
          <UserIcon />
        </div>
        <h2 style={{ fontSize: '1.5rem', margin: '0 0 0.5rem 0' }}>{user?.name || 'Volunteer User'}</h2>
        
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'rgba(128, 90, 64, 0.7)', fontSize: '0.85rem' }}>
            <Fingerprint size={16} />
            <span>{user?.id || 'VOL-0000'}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'rgba(128, 90, 64, 0.7)', fontSize: '0.85rem' }}>
            <Shield size={16} />
            <span>{user?.type || 'Global'} Volunteer</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <button className="card" onClick={toggleLanguage} style={{ padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: 'none', width: '100%', cursor: 'pointer' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Globe color="var(--secondary-color)" />
            <span style={{ fontSize: '1rem', fontWeight: '500', color: 'var(--text-color)' }}>Language</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ color: 'rgba(128, 90, 64, 0.6)', fontSize: '0.9rem' }}>{language === 'en' ? 'English' : 'ਪੰਜਾਬੀ'}</span>
          </div>
        </button>

        <button className="card" onClick={handleLogout} style={{ padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', border: 'none', width: '100%', cursor: 'pointer', color: 'var(--error-color)' }}>
          <LogOut color="var(--error-color)" />
          <span style={{ fontSize: '1rem', fontWeight: '500' }}>Log Out</span>
        </button>
      </div>
    </div>
  );
}

const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

export default Me;
