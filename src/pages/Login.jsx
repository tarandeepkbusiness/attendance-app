// Updated Login with dynamic volunteer list and backend validation
import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';

const API_BASE = 'https://script.google.com/macros/s/AKfycbxgprYuk5ICscp_mm6vNx65RnB2j_uMO2Y6qTp7f0qCl7BQsucUjPxem_40I39XHbRn/exec';

function Login() {
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);
  const [volunteers, setVolunteers] = useState([]);
  const [selectedName, setSelectedName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Load volunteer names on mount
  useEffect(() => {
    const fetchVolunteers = async () => {
      try {
        const resp = await fetch(`${API_BASE}?action=volunteers`);
        if (!resp.ok) throw new Error('Failed to load volunteers');
        const data = await resp.json();
        // Expect data.volunteers to be an array of names (strings)
        setVolunteers(data.volunteers || []);
        if (data.volunteers && data.volunteers.length > 0) {
          setSelectedName(data.volunteers[0]);
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchVolunteers();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    if (!selectedName || !password) {
      setError('Please select a volunteer and enter password');
      return;
    }
    try {
      const resp = await fetch(`${API_BASE}?action=validateLogin&name=${encodeURIComponent(selectedName)}&password=${encodeURIComponent(password)}`);
      const result = await resp.json();
      if (resp.ok && result.valid) {
        // Backend should return volunteer details (role, id, etc.)
        setUser({ role: result.role || 'volunteer', name: selectedName, id: result.id, type: result.type || 'Global', assignedCities: result.assignedCities || [] });
        navigate('/volunteer');
      } else {
        setError(result.message || 'Invalid credentials');
      }
    } catch (err) {
      setError('Login error: ' + err.message);
    }
  };

  const handleTestConnection = async () => {
    try {
      const response = await fetch(`${API_BASE}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify({
          studentName: "Test Student",
          rollNumber: "999",
          city: "Test City",
          event: "Test Event",
          volunteerId: "V001"
        })
      });
      const result = await response.json();
      if (response.ok) {
        alert('Connection Working!');
      } else {
        alert('Failed: ' + JSON.stringify(result));
      }
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  return (
    <div className="app-container animate-fade-in" style={{ justifyContent: 'center', position: 'relative' }}>
      <div className="header" style={{ position: 'absolute', top: '1.5rem', left: '1.5rem', right: '1.5rem', borderBottom: 'none' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <img onError={(e) => { e.target.onerror = null; e.target.src='/favicon.svg'; }} src="/logo.png" alt="App Logo" style={{ height: '32px', width: 'auto' }} />
        </div>
      </div>
      <div className="card">
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ color: 'var(--secondary-color)', fontSize: '1.75rem' }}>Welcome</h2>
          <p style={{ color: 'rgba(128, 90, 64, 0.7)' }}>Sign in to continue</p>
        </div>
        <form onSubmit={handleLogin}>
          {error && (
            <div style={{ color: 'var(--error-color)', backgroundColor: 'rgba(239, 68, 68, 0.1)', padding: '0.75rem', borderRadius: 'var(--border-radius-sm)', marginBottom: '1rem', textAlign: 'center', fontSize: '0.9rem' }}>
              {error}
            </div>
          )}

          <div className="input-group">
            <label className="input-label">Volunteer Name</label>
            <select className="input-field" value={selectedName} onChange={(e) => setSelectedName(e.target.value)} required>
              {volunteers.map((v) => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
          </div>

          <div className="input-group">
            <label className="input-label">Password</label>
            <input
              type="password"
              className="input-field"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div style={{ textAlign: 'right', marginBottom: '1.5rem' }}>
            <button type="button" style={{ color: 'var(--secondary-color)', fontSize: '0.9rem', fontWeight: '500' }}>
              Forgot password?
            </button>
          </div>

          <button type="submit" className="btn-primary">
            Sign In
          </button>

          <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: 'rgba(212, 175, 55, 0.05)', borderRadius: 'var(--border-radius-md)', border: '1px dashed rgba(212, 175, 55, 0.4)' }}>
            <p style={{ fontSize: '0.75rem', margin: '0 0 0.5rem 0', fontWeight: '600', color: 'var(--secondary-color)', textTransform: 'uppercase' }}>Demo Credentials</p>
            <p style={{ fontSize: '0.8rem', margin: '0 0 0.25rem 0' }}><strong>Admin:</strong> admin / admin123</p>
            <p style={{ fontSize: '0.8rem', margin: '0 0 0.25rem 0' }}><strong>Volunteer:</strong> volunteer / vol123</p>
          </div>

          <div style={{ marginTop: '1rem', textAlign: 'center' }}>
            <button
              type="button"
              onClick={handleTestConnection}
              style={{
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '5px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              Test Google Sheets Connection
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';

function Login() {
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors

    // Demo account logic
    if (phone === '9999900001' && password === 'admin123') {
      setUser({ role: 'admin', name: 'Admin Singh' });
      navigate('/admin');
    } else if (phone === '9999900002' && password === 'vol123') {
      setUser({ role: 'volunteer', name: 'Global Volunteer', type: 'Global', id: 'VOL-9002', assignedCities: [] });
      navigate('/volunteer');
    } else if (phone === '9999900003' && password === 'local123') {
      setUser({ role: 'volunteer', name: 'Local Volunteer', type: 'Local', id: 'VOL-9003', assignedCities: ['Delhi - Ramesh Nagar'] });
      navigate('/volunteer');
    } else {
      setError('Invalid phone number or password');
    }
  };

  const handleTestConnection = async () => {
    try {
      const response = await fetch('https://script.google.com/macros/s/AKfycbxgprYuk5ICscp_mm6vNx65RnB2j_uMO2Y6qTp7f0qCl7BQsucUjPxem_40I39XHbRn/exec', {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify({
          studentName: "Test Student",
          rollNumber: "999",
          city: "Test City",
          event: "Test Event",
          volunteerId: "V001"
        })
      });
      
      const result = await response.json();
      if (response.ok) {
        alert('Connection Working!');
      } else {
        alert('Failed: ' + JSON.stringify(result));
      }
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  return (
    <div className="app-container animate-fade-in" style={{ justifyContent: 'center', position: 'relative' }}>
      <div className="header" style={{ position: 'absolute', top: '1.5rem', left: '1.5rem', right: '1.5rem', borderBottom: 'none' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <img onError={(e) => { e.target.onerror = null; e.target.src='/favicon.svg'; }} src="/logo.png" alt="App Logo" style={{ height: '32px', width: 'auto' }} />
        </div>
      </div>
      <div className="card">
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ color: 'var(--secondary-color)', fontSize: '1.75rem' }}>Welcome</h2>
          <p style={{ color: 'rgba(128, 90, 64, 0.7)' }}>Sign in to continue</p>
        </div>

        <form onSubmit={handleLogin}>
          {error && (
            <div style={{ color: 'var(--error-color)', backgroundColor: 'rgba(239, 68, 68, 0.1)', padding: '0.75rem', borderRadius: 'var(--border-radius-sm)', marginBottom: '1rem', textAlign: 'center', fontSize: '0.9rem' }}>
              {error}
            </div>
          )}

          <div className="input-group">
            <label className="input-label">Phone Number</label>
            <input 
              type="text" 
              className="input-field" 
              placeholder="Enter phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label className="input-label">Password</label>
            <input 
              type="password" 
              className="input-field" 
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div style={{ textAlign: 'right', marginBottom: '1.5rem' }}>
            <button type="button" style={{ color: 'var(--secondary-color)', fontSize: '0.9rem', fontWeight: '500' }}>
              Forgot password?
            </button>
          </div>

          <button type="submit" className="btn-primary">
            Sign In
          </button>

          <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: 'rgba(212, 175, 55, 0.05)', borderRadius: 'var(--border-radius-md)', border: '1px dashed rgba(212, 175, 55, 0.4)' }}>
            <p style={{ fontSize: '0.75rem', margin: '0 0 0.5rem 0', fontWeight: '600', color: 'var(--secondary-color)', textTransform: 'uppercase' }}>Demo Credentials</p>
            <p style={{ fontSize: '0.8rem', margin: '0 0 0.25rem 0' }}><strong>Admin:</strong> 9999900001 / admin123</p>
            <p style={{ fontSize: '0.8rem', margin: '0 0 0.25rem 0' }}><strong>Global Vol:</strong> 9999900002 / vol123</p>
            <p style={{ fontSize: '0.8rem', margin: 0 }}><strong>Local Vol:</strong> 9999900003 / local123</p>
          </div>

          <div style={{ marginTop: '1rem', textAlign: 'center' }}>
            <button 
              type="button" 
              onClick={handleTestConnection}
              style={{
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '5px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              Test Google Sheets Connection
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
