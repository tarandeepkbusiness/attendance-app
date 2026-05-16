import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Camera } from 'lucide-react';

function Success() {
  const navigate = useNavigate();
  const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const event = "Morning Session";

  return (
    <div className="app-container animate-fade-in" style={{ backgroundColor: 'var(--success-color)' }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'white', textAlign: 'center' }}>
        <CheckCircle size={80} style={{ marginBottom: '2rem' }} />
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', fontWeight: '700' }}>Marked</h1>
        <p style={{ fontSize: '1.25rem', opacity: 0.9 }}>{event} • {time}</p>
      </div>

      <div style={{ padding: '2rem 0' }}>
        <button 
          className="btn-primary" 
          onClick={() => navigate('/volunteer/scan')}
          style={{ 
            backgroundColor: 'white', 
            color: 'var(--success-color)', 
            border: 'none', 
            fontSize: '1.25rem', 
            padding: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem'
          }}
        >
          <Camera size={24} />
          Scan Next Student
        </button>
        <button 
          onClick={() => navigate('/volunteer')}
          style={{ width: '100%', padding: '1rem', color: 'white', marginTop: '1rem', fontSize: '1rem', opacity: 0.9 }}
        >
          Return to Home
        </button>
      </div>
    </div>
  );
}

export default Success;
