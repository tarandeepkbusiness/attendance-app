import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';

function LanguageSelect() {
  const navigate = useNavigate();
  const { setLanguage } = useContext(AuthContext);

  const handleSelect = (lang) => {
    setLanguage(lang);
    navigate('/login');
  };

  return (
    <div className="app-container animate-fade-in" style={{ justifyContent: 'center' }}>
      <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
        <h2 style={{ marginBottom: '2rem', fontSize: '1.5rem' }}>Select Language</h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <button 
            className="btn-primary" 
            onClick={() => handleSelect('en')}
            style={{ fontSize: '1.25rem' }}
          >
            English
          </button>
          
          <button 
            className="btn-secondary punjabi-text" 
            onClick={() => handleSelect('pa')}
            style={{ fontSize: '1.25rem' }}
          >
            ਪੰਜਾਬੀ
          </button>
        </div>
      </div>
    </div>
  );
}

export default LanguageSelect;
