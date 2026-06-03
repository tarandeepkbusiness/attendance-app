import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';
import { SCRIPT_URL } from '../config';

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
        const resp = await fetch(`${SCRIPT_URL}?action=volunteers`);
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
      const resp = await fetch(`${SCRIPT_URL}?action=validateLogin&name=${encodeURIComponent(selectedName)}&password=${encodeURIComponent(password)}`);
      const result = await resp.json();
      if (result.success || result.valid) {
        setUser({ role: 'volunteer', name: selectedName, id: result.id || 'V-001' });
        localStorage.setItem('volunteer_name', selectedName);
        localStorage.setItem('volunteer_id', result.id || 'V-001');

        // Pre-fetch activities and cache them in localStorage
        try {
          const actResp = await fetch(`${SCRIPT_URL}?action=activities`);
          if (actResp.ok) {
            const actData = await actResp.json();
            const list = Array.isArray(actData) ? actData : (actData.data || actData.activities || []);
            const filtered = list.filter(item => item !== 'Meditation & Shudh Gurbani' && item !== 'Meditation & Sudh Gurbani');
            const ordered = ['Meditation & Shudh Gurbani', ...filtered];
            localStorage.setItem('cached_activities', JSON.stringify(ordered));
          }
        } catch (actErr) {
          console.error('Failed to pre-fetch activities:', actErr);
        }

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