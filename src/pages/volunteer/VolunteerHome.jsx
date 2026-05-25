import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Search, WifiOff, MapPin, Calendar, Tag, Edit3 } from 'lucide-react';

function VolunteerHome() {
  const navigate = useNavigate();
  const [city, setCity] = useState(localStorage.getItem('volunteer_city') || '');
  const [event, setEvent] = useState(localStorage.getItem('volunteer_event') || '');
  const [activity, setActivity] = useState(localStorage.getItem('volunteer_activity') || '');
  
  // Refresh queue count
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    // If selections are missing, redirect back to the wizard
    if (!city) {
      navigate('/volunteer/select-city', { replace: true });
    } else if (!event) {
      navigate('/volunteer/select-event', { replace: true });
    } else if (!activity) {
      navigate('/volunteer/select-activity', { replace: true });
    }

    const loadQueueCount = () => {
      const q = JSON.parse(localStorage.getItem('attendance_offline_queue') || '[]');
      setPendingCount(q.filter(i => i.status === 'pending').length);
    };

    loadQueueCount();
    window.addEventListener('storage', loadQueueCount);
    return () => window.removeEventListener('storage', loadQueueCount);
  }, [city, event, activity, navigate]);

  const handleScanClick = () => {
    navigate('/volunteer/scan');
  };

  return (
    <div className="app-container animate-fade-in" style={{ padding: '1.5rem', paddingBottom: '80px' }}>
      <div className="header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <img onError={(e) => { e.target.onerror = null; e.target.src='/favicon.svg'; }} src="/logo.png" alt="App Logo" style={{ height: '32px', width: 'auto' }} />
          <div>
            <h1 style={{ color: 'var(--secondary-color)', margin: 0 }}>Attendance</h1>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {pendingCount > 0 && (
            <button onClick={() => navigate('/volunteer/queue')} className="badge badge-warning" style={{ display: 'flex', alignItems: 'center', gap: '4px', border: 'none', cursor: 'pointer' }}>
              <WifiOff size={12} /> {pendingCount} Pending
            </button>
          )}
        </div>
      </div>

      <div className="card" style={{ marginBottom: '2rem', padding: '1rem', position: 'relative' }}>
        <button 
          onClick={() => navigate('/volunteer/select-city')}
          style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', background: 'none', border: 'none', color: 'var(--secondary-color)', cursor: 'pointer' }}
          title="Change selections"
        >
          <Edit3 size={18} />
        </button>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'rgba(128, 90, 64, 0.7)', fontSize: '0.9rem' }}>
            <MapPin size={16} color="var(--secondary-color)" />
            <span style={{ fontWeight: '600' }}>{city}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'rgba(128, 90, 64, 0.7)', fontSize: '0.9rem' }}>
            <Calendar size={16} color="var(--secondary-color)" />
            <span>{event}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'rgba(128, 90, 64, 0.7)', fontSize: '0.9rem' }}>
            <Tag size={16} color="var(--secondary-color)" />
            <span>{activity}</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1, justifyContent: 'center' }}>
        <button 
          className="btn-primary" 
          onClick={handleScanClick}
          style={{ padding: '1.5rem', fontSize: '1.25rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}
        >
          <Camera size={32} color="var(--secondary-color)" />
          Scan QR Code
        </button>

        <button 
          className="btn-secondary" 
          onClick={() => navigate('/volunteer/search')}
          style={{ padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
        >
          <Search size={20} />
          Manual Search
        </button>
      </div>
    </div>
  );
}

export default VolunteerHome;
