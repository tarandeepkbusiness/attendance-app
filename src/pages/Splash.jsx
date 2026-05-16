import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Splash() {
  const navigate = useNavigate();

  useEffect(() => {
    // Navigate to login after 2 seconds
    const timer = setTimeout(() => {
      navigate('/login');
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="app-container" style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div className="animate-fade-in" style={{ textAlign: 'center' }}>
        <img onError={(e) => { e.target.onerror = null; e.target.src='/favicon.svg'; }} 
          src="/logo.png" 
          alt="App Logo" 
          style={{ 
            width: '200px', 
            height: 'auto',
            marginBottom: '1rem',
            animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
          }} 
        />
        <style>
          {`
            @keyframes pulse {
              0%, 100% { opacity: 1; transform: scale(1); }
              50% { opacity: 0.8; transform: scale(0.95); }
            }
          `}
        </style>
      </div>
    </div>
  );
}

export default Splash;
