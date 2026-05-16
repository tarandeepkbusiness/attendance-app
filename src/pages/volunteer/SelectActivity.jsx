import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tag, ChevronRight } from 'lucide-react';

const SAMPLE_ACTIVITIES = [
  'Tabla classes',
  'Punjabi learning class',
  'Sports classes',
  'Kirtan practice',
  'Yoga / meditation session',
  'Reading / study session'
];

function SelectActivity() {
  const navigate = useNavigate();
  const [selectedActivity, setSelectedActivity] = useState(localStorage.getItem('volunteer_activity') || '');

  const handleSelect = (activity) => {
    setSelectedActivity(activity);
    localStorage.setItem('volunteer_activity', activity);
    navigate('/volunteer/home');
  };

  return (
    <div className="app-container animate-fade-in" style={{ padding: '1.5rem', paddingBottom: '80px' }}>
      <div className="header" style={{ marginBottom: '2rem', borderBottom: 'none' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <img onError={(e) => { e.target.onerror = null; e.target.src='/favicon.svg'; }} src="/logo.png" alt="App Logo" style={{ height: '32px', width: 'auto' }} />
          <h1 style={{ color: 'var(--secondary-color)', margin: 0 }}>Select Activity</h1>
        </div>
      </div>

      <p style={{ color: 'rgba(128, 90, 64, 0.7)', marginBottom: '1.5rem' }}>
        Which activity are you marking?
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {SAMPLE_ACTIVITIES.map((activity) => (
          <button 
            key={activity}
            onClick={() => handleSelect(activity)}
            className="card"
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              padding: '1.25rem',
              border: selectedActivity === activity ? '2px solid var(--secondary-color)' : '1px solid rgba(212, 175, 55, 0.2)',
              width: '100%',
              textAlign: 'left',
              cursor: 'pointer',
              backgroundColor: selectedActivity === activity ? 'rgba(212, 175, 55, 0.05)' : 'white'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Tag size={20} color={selectedActivity === activity ? 'var(--secondary-color)' : 'rgba(128, 90, 64, 0.5)'} />
              <span style={{ fontWeight: '500', color: 'var(--text-color)' }}>{activity}</span>
            </div>
            <ChevronRight size={20} color="rgba(128, 90, 64, 0.3)" />
          </button>
        ))}
      </div>

      <button 
        onClick={() => navigate('/volunteer/select-event')}
        style={{ marginTop: '2rem', color: 'rgba(128, 90, 64, 0.6)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
      >
        Go back to change event
      </button>
    </div>
  );
}

export default SelectActivity;
