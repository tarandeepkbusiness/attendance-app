import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Home, List, User } from 'lucide-react';

function VolunteerLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: '/volunteer', icon: <Home size={24} />, label: 'Home' },
    { path: '/volunteer/queue', icon: <List size={24} />, label: 'Queue' },
    { path: '/volunteer/me', icon: <User size={24} />, label: 'Me' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: 'var(--bg-color)' }}>
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <Outlet />
      </div>
      
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-around', 
        padding: '0.75rem 0', 
        backgroundColor: 'white', 
        borderTop: '1px solid rgba(212, 175, 55, 0.2)',
        boxShadow: '0 -2px 10px rgba(0,0,0,0.05)',
        zIndex: 10
      }}>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || 
                          (item.path === '/volunteer' && location.pathname.startsWith('/volunteer') && !location.pathname.includes('/queue') && !location.pathname.includes('/me'));
          
          return (
            <button 
              key={item.path}
              onClick={() => navigate(item.path)}
              style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                gap: '0.25rem',
                color: isActive ? 'var(--secondary-color)' : 'rgba(128, 90, 64, 0.5)',
                background: 'none',
                border: 'none',
                padding: '0.5rem',
                flex: 1
              }}
            >
              {item.icon}
              <span style={{ fontSize: '0.75rem', fontWeight: isActive ? '600' : '400' }}>{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default VolunteerLayout;
