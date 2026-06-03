import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tag, ChevronRight } from 'lucide-react';

const API_BASE = 'https://script.google.com/macros/s/AKfycbxgprYuk5ICscp_mm6vNx65RnB2j_uMO2Y6qTp7f0qCl7BQsucUjPxem_40I39XHbRn/exec';

function SelectActivity() {
  const navigate = useNavigate();
  const [activities, setActivities] = useState([]);
  const [selectedActivity, setSelectedActivity] = useState(localStorage.getItem('volunteer_activity') || '');

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const resp = await fetch(`${API_BASE}?action=activities`);
        if (!resp.ok) throw new Error('Failed to load activities');
        const data = await resp.json();
        setActivities(Array.isArray(data) ? data : (data.activities || []));
      } catch (e) {
        console.error(e);
        setActivities(['Meditation & Sudh Gurbani', 'AI', 'Clay Modelling', 'Cooking', 'Dholki', 'Knitting-Crochet', 'Painting', 'Paper Craft', 'Photography', 'Resin Art', 'Tabla', 'Vocal']);
      }
    };
    fetchActivities();
  }, []);

  const handleSelect = (activity) => {
    setSelectedActivity(activity);
    localStorage.setItem('volunteer_activity', activity);
    navigate('/volunteer/home');
  };

  return (
    <div className="app-container animate-fade-in" style={{ padding: '1.5rem', paddingBottom: '80px' }}>
      <div className="header" style={{ marginBottom: '2rem', borderBottom: 'none' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <img src="/logo.png" alt="App Logo" style={{ height: '32px', width: 'auto' }} />
          <h1 style={{ color: 'var(--secondary-color)', margin: 0 }}>Select Activity</h1>
        </div>
      </div>
      <p style={{ color: 'rgba(128, 90, 64, 0.7)', marginBottom: '1.5rem' }}>Which activity are you marking?</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {activities.map((activity) => (
          <button key={activity} onClick={() => handleSelect(activity)} className="card"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem', border: selectedActivity === activity ? '2px solid var(--secondary-color)' : '1px solid rgba(212, 175, 55, 0.2)', width: '100%', backgroundColor: selectedActivity === activity ? 'rgba(212, 175, 55, 0.05)' : 'white' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Tag size={20} color={selectedActivity === activity ? 'var(--secondary-color)' : 'rgba(128, 90, 64, 0.5)'} />
              <span style={{ fontWeight: '500' }}>{activity}</span>
            </div>
            <ChevronRight size={20} color="rgba(128, 90, 64, 0.3)" />
          </button>
        ))}
      </div>
    </div>
  );
}

export default SelectActivity;
