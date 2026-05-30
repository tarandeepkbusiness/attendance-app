import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tag, ChevronRight } from 'lucide-react';

const MANDATORY_ACTIVITIES = ['Meditation & Sudh Gurbani'];
const ELECTIVE_ACTIVITIES = ['AI', 'Clay Modelling', 'Cooking', 'Dholki', 'Knitting-Crochet', 'Painting', 'Paper Craft', 'Photography', 'Resin Art', 'Tabla', 'Vocal'];

function SelectActivity() {
  const navigate = useNavigate();
  const [selectedActivity, setSelectedActivity] = useState(localStorage.getItem('volunteer_activity') || '');

  const handleSelect = (activity) => {
    setSelectedActivity(activity);
    localStorage.setItem('volunteer_activity', activity);
    navigate('/volunteer/home');
  };

  const renderActivityButton = (activity) => (
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
  );

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

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div>
          <h3 style={{ fontSize: '1rem', color: 'rgba(128, 90, 64, 0.8)', marginBottom: '0.75rem' }}>Mandatory Activities</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {MANDATORY_ACTIVITIES.map(renderActivityButton)}
          </div>
        </div>
        
        <div>
          <h3 style={{ fontSize: '1rem', color: 'rgba(128, 90, 64, 0.8)', marginBottom: '0.75rem' }}>Electives</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {ELECTIVE_ACTIVITIES.map(renderActivityButton)}
          </div>
        </div>
      </div>

      <button 
        onClick={() => navigate('/volunteer/select-city')}
        style={{ marginTop: '2rem', color: 'rgba(128, 90, 64, 0.6)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
      >
        Go back to change city
      </button>
    </div>
  );
}

export default SelectActivity;
