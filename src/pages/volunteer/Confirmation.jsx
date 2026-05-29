import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Calendar, MapPin, Tag } from 'lucide-react';

function Confirmation() {
  const navigate = useNavigate();
  const location = useLocation();
  const { student, qrData } = location.state || {};
  
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]); // Default to today
  const city = localStorage.getItem('volunteer_city') || student?.city || "City A";
  const event = localStorage.getItem('volunteer_event') || "Morning Session";

  const handleSubmit = async () => {
    const activity = localStorage.getItem('volunteer_activity') || "";
    const currentRoll = student?.rollNo || qrData;
    
    // Local Duplicate Check: Same student, same date, same activity
    try {
      const queue = JSON.parse(localStorage.getItem('attendance_offline_queue') || '[]');
      const isDuplicateLocally = queue.some(record => {
        const recordRoll = record.student?.rollNo || record.qrData;
        return recordRoll === currentRoll && record.date === date && record.activity === activity;
      });
      if (isDuplicateLocally) {
        navigate('/volunteer/duplicate');
        return;
      }
    } catch (e) {
      console.error("Local duplicate check failed", e);
    }

    if (navigator.onLine) {
      try {
        const API_ENDPOINT = 'https://script.google.com/macros/s/AKfycbxRL6ZILuXNm_uKN8jxMBXjXs_p0WHeAugCTuT756i3utrS70mnFJspljI2jTLolO4q/exec';
        const res = await fetch(API_ENDPOINT, {
          method: 'POST',
          mode: 'cors',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify({
            studentName: student?.name || "Scan Result",
            rollNumber: student?.rollNo || qrData || "Unknown",
            city: city || "Unknown",
            event: 'Summer Camp',
            activity: activity,
            volunteerId: 'V001'
          })
        });
        if (res.ok) {
          try {
            const data = await res.json();
            if (data && (data.status === 'already_marked' || data.result === 'already_marked' || data.already_marked)) {
               navigate('/volunteer/duplicate');
               return;
            }
          } catch(e) {}
        }
      } catch(e) {
        console.error('Immediate online submission failed, falling back to offline queue', e);
      }
    }
    
    import('../../utils/offline').then(({ saveToOfflineQueue, syncOfflineQueue }) => {
      saveToOfflineQueue({ student, qrData, date, event: 'Summer Camp', city, activity });
      if (navigator.onLine) {
        syncOfflineQueue();
      }
      navigate('/volunteer/success');
    });
  };

  return (
    <div className="app-container animate-fade-in">
      <div className="header" style={{ marginBottom: '1.5rem', borderBottom: 'none' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <img onError={(e) => { e.target.onerror = null; e.target.src='/favicon.svg'; }} src="/logo.png" alt="App Logo" style={{ height: '32px', width: 'auto' }} />
          <button onClick={() => navigate(-1)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-color)' }}>
            <ArrowLeft size={24} />
            <h1 style={{ margin: 0 }}>Confirm</h1>
          </button>
        </div>
      </div>

      <div className="card" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '2rem 1.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'rgba(212, 175, 55, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
            <CheckCircle size={40} color="var(--secondary-color)" />
          </div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>{student?.name || `Student (${student?.rollNo || qrData})`}</h2>
          <p style={{ fontSize: '1.1rem', color: 'rgba(128, 90, 64, 0.7)', margin: 0 }}>{student?.rollNo || qrData || "Unknown ID"}</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem', flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', backgroundColor: 'rgba(128, 90, 64, 0.03)', borderRadius: '12px' }}>
            <MapPin size={20} color="var(--secondary-color)" />
            <div>
              <p style={{ margin: 0, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'rgba(128, 90, 64, 0.6)' }}>City</p>
              <p style={{ margin: 0, fontWeight: '500' }}>{city}</p>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', backgroundColor: 'rgba(128, 90, 64, 0.03)', borderRadius: '12px' }}>
            <Tag size={20} color="var(--secondary-color)" />
            <div>
              <p style={{ margin: 0, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'rgba(128, 90, 64, 0.6)' }}>Event</p>
              <p style={{ margin: 0, fontWeight: '500' }}>{event}</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', backgroundColor: 'rgba(128, 90, 64, 0.03)', borderRadius: '12px' }}>
            <Calendar size={20} color="var(--secondary-color)" />
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'rgba(128, 90, 64, 0.6)' }}>Date</p>
              <input 
                type="date" 
                value={date} 
                onChange={(e) => setDate(e.target.value)}
                style={{ 
                  width: '100%', 
                  border: 'none', 
                  backgroundColor: 'transparent', 
                  padding: 0, 
                  margin: 0, 
                  fontWeight: '500', 
                  color: 'var(--text-color)',
                  outline: 'none'
                }} 
              />
            </div>
          </div>
        </div>

        <button className="btn-primary" onClick={handleSubmit} style={{ fontSize: '1.125rem', padding: '1rem' }}>
          Submit Attendance
        </button>
      </div>
    </div>
  );
}

export default Confirmation;
