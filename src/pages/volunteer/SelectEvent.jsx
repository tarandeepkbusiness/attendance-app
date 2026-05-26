import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, ChevronRight } from 'lucide-react';

const MAJOR_EVENTS = [
  'Summer Camp',
  'Meditation Camp',
  'Gurmat Camp',
  'Youth Program'
];

function SelectEvent() {
  const navigate = useNavigate();
  const [selectedEvent, setSelectedEvent] = useState(localStorage.getItem('volunteer_event') || 'Summer Camp');

  const handleSelect = (event) => {
    setSelectedEvent(event);
    localStorage.setItem('volunteer_event', event);
    navigate('/volunteer/select-activity');
  };

  return (
    <div className="app-container animate-fade-in" style={{ padding: '1.5rem', paddingBottom: '80px' }}>
      <div className="header" style={{ marginBottom: '2rem', borderBottom: 'none' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <img onError={(e) => { e.target.onerror = null; e.target.src='/favicon.svg'; }} src="/logo.png" alt="App Logo" style={{ height: '32px', width: 'auto' }} />
          <h1 style={{ color: 'var(--secondary-color)', margin: 0 }}>Select Event</h1>
        </div>
      </div>

      <p style={{ color: 'rgba(128, 90, 64, 0.7)', marginBottom: '1.5rem' }}>
        Which camp or program is this for?
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {MAJOR_EVENTS.map((event) => (
          <button 
            key={event}
            onClick={() => handleSelect(event)}
            className="card"
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              padding: '1.25rem',
              border: selectedEvent === event ? '2px solid var(--secondary-color)' : '1px solid rgba(212, 175, 55, 0.2)',
              width: '100%',
              textAlign: 'left',
              cursor: 'pointer',
              backgroundColor: selectedEvent === event ? 'rgba(212, 175, 55, 0.05)' : 'white'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Calendar size={20} color={selectedEvent === event ? 'var(--secondary-color)' : 'rgba(128, 90, 64, 0.5)'} />
              <span style={{ fontWeight: '500', color: 'var(--text-color)' }}>{event}</span>
            </div>
            <ChevronRight size={20} color="rgba(128, 90, 64, 0.3)" />
          </button>
        ))}
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

export default SelectEvent;
