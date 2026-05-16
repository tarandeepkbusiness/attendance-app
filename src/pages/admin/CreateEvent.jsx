import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

function CreateEvent() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    city: '',
    date: '',
    time: '',
    volunteerType: 'global',
    workbookMapping: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Logic to save event
    navigate('/admin');
  };

  return (
    <div className="app-container animate-fade-in">
      <div className="header" style={{ marginBottom: '1.5rem', borderBottom: 'none' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <img onError={(e) => { e.target.onerror = null; e.target.src='/favicon.svg'; }} src="/logo.png" alt="App Logo" style={{ height: '32px', width: 'auto' }} />
          <button onClick={() => navigate(-1)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-color)' }}>
            <ArrowLeft size={24} />
            <h1 style={{ margin: 0 }}>Create Event</h1>
          </button>
        </div>
      </div>

      <div className="card" style={{ flex: 1, overflowY: 'auto' }}>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label className="input-label">Event Name</label>
            <input 
              type="text" 
              className="input-field" 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
          </div>

          <div className="input-group">
            <label className="input-label">City</label>
            <input 
              type="text" 
              className="input-field" 
              value={formData.city}
              onChange={(e) => setFormData({...formData, city: e.target.value})}
              required
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <div className="input-group" style={{ flex: 1 }}>
              <label className="input-label">Date</label>
              <input 
                type="date" 
                className="input-field" 
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
                required
              />
            </div>
            <div className="input-group" style={{ flex: 1 }}>
              <label className="input-label">Time</label>
              <input 
                type="time" 
                className="input-field" 
                value={formData.time}
                onChange={(e) => setFormData({...formData, time: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Allowed Volunteer Type</label>
            <select 
              className="input-field" 
              value={formData.volunteerType}
              onChange={(e) => setFormData({...formData, volunteerType: e.target.value})}
            >
              <option value="global">Global Only</option>
              <option value="local">Local & Global</option>
            </select>
          </div>

          <div className="input-group">
            <label className="input-label">Workbook/Tab Mapping (URL or ID)</label>
            <input 
              type="text" 
              className="input-field" 
              placeholder="e.g. Sheet1"
              value={formData.workbookMapping}
              onChange={(e) => setFormData({...formData, workbookMapping: e.target.value})}
              required
            />
          </div>

          <button type="submit" className="btn-primary" style={{ marginTop: '1rem' }}>
            Save Event
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateEvent;
