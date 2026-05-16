import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarPlus, Users, FileSpreadsheet, Download, Settings as SettingsIcon, LogOut } from 'lucide-react';

function AdminDashboard() {
  const navigate = useNavigate();

  const adminCards = [
    { title: 'Create Event', icon: <CalendarPlus size={24} />, path: '/admin/create-event', color: 'var(--secondary-color)' },
    { title: 'Manage Volunteers', icon: <Users size={24} />, path: '/admin/volunteers', color: '#805A40' },
    { title: 'Review Attendance', icon: <FileSpreadsheet size={24} />, path: '/admin/review', color: '#2563eb' },
    { title: 'Export Reports', icon: <Download size={24} />, path: '/admin/export', color: '#16a34a' },
    { title: 'Sheet Mapping', icon: <SettingsIcon size={24} />, path: '/admin/mapping', color: '#64748b' },
  ];

  return (
    <div className="app-container animate-fade-in">
      <div className="header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <img onError={(e) => { e.target.onerror = null; e.target.src='/favicon.svg'; }} src="/logo.png" alt="App Logo" style={{ height: '32px', width: 'auto' }} />
          <div>
            <h1 style={{ color: 'var(--secondary-color)' }}>Admin Singh</h1>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'rgba(128, 90, 64, 0.7)' }}>Master Control</p>
          </div>
        </div>
        <button onClick={() => navigate('/settings')} style={{ color: 'var(--text-color)' }}>
          <LogOut size={20} />
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        {adminCards.map((card, idx) => (
          <div 
            key={idx} 
            className="card" 
            style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center', 
              textAlign: 'center', 
              gap: '1rem', 
              padding: '1.5rem 1rem',
              cursor: 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s'
            }}
            onClick={() => navigate(card.path)}
            onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }}
            onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; }}
          >
            <div style={{ color: card.color }}>
              {card.icon}
            </div>
            <h3 style={{ margin: 0, fontSize: '0.9rem', fontWeight: '600' }}>{card.title}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminDashboard;
