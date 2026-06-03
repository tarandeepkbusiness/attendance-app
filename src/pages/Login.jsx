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

  useEffect(() => {
    const fetchVolunteers = async () => {
      try {
        const resp = await fetch(`${API_BASE}?action=volunteers`);
        const data = await resp.json();
        const names = Array.isArray(data) ? data : (data.data || data.volunteers || []);
        if (names.length > 0) {
          setVolunteers(names);
          setSelectedName(names[0]);
        } else {
          // Fallback if array is empty
          throw new Error('No names returned');
        }
      } catch (e) {
        console.error(e);
        // Fallback demo names so the application remains usable offline / during API issues
        const fallbacks = ['V-001_Demo Volunteer', 'V-002_Balbir Singh', 'V-003_Basant singh', 'V-010_Dr. Kamaldeep Kaur'];
        setVolunteers(fallbacks);
        setSelectedName(fallbacks[0]);
      }
    };
    fetchVolunteers();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const resp = await fetch(`${API_BASE}?action=validateLogin&name=${encodeURIComponent(selectedName)}&password=${encodeURIComponent(password)}`);
      const result = await resp.json();
      if (result.success || result.valid) {
        setUser({ role: 'volunteer', name: selectedName, id: result.id || 'V-001' });
        localStorage.setItem('volunteer_name', selectedName);
        localStorage.setItem('volunteer_id', result.id || 'V-001');
        navigate('/volunteer');
      } else { setError('Invalid Password'); }
    } catch (err) { setError('Login error'); }
  };

  return (
    <div className="app-container" style={{ justifyContent: 'center', padding: '1.5rem' }}>
      <div className="card">
        <h2 style={{ textAlign: 'center', color: 'var(--secondary-color)' }}>Volunteer Login</h2>
        <form onSubmit={handleLogin}>
          {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
          <div className="input-group">
            <label className="input-label">Select Name</label>
            <select className="input-field" value={selectedName} onChange={(e) => setSelectedName(e.target.value)}>
              {volunteers.map(v => <option key={v} value={v}>{v}</option>)}
            </select>
          </div>
          <div className="input-group">
            <label className="input-label">Password</label>
            <input type="password" className="input-field" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="btn-primary" style={{ width: '100%' }}>Sign In</button>
        </form>
      </div>
    </div>
  );
}

export default Login;