import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, ChevronRight, Star } from 'lucide-react';
import { AuthContext } from '../../App';

const ALL_CITIES = [
  'Punjab - Shri Bhaini Sahib',
  'Delhi - Ramesh Nagar',
  'Delhi - Sahibpura',
  'Delhi - Sahibabad',
  'Punjab - Ludhiana',
  'Punjab - Amritsar',
  'Haryana - Sirsa',
  'Haryana - Jiwan Nagar',
  'UP - Lucknow',
  'Rajasthan - Sri Ganganagar'
];

function SelectCity() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [selectedCity, setSelectedCity] = useState(localStorage.getItem('volunteer_city') || '');
  const [isDefault, setIsDefault] = useState(localStorage.getItem('volunteer_city_is_default') === 'true');

  useEffect(() => {
    // If it's default and already set, we might want to skip or just pre-select
    // For now, let's just pre-select and let the user click "Next"
  }, []);

  const citiesToShow = user?.type === 'Global' 
    ? ALL_CITIES 
    : ALL_CITIES.filter(c => user?.assignedCities?.includes(c));

  // Sort: Shri Bhaini Sahib always at top
  const sortedCities = [...citiesToShow].sort((a, b) => {
    if (a.includes('Shri Bhaini Sahib')) return -1;
    if (b.includes('Shri Bhaini Sahib')) return 1;
    return a.localeCompare(b);
  });

  const handleSelect = (city) => {
    setSelectedCity(city);
    localStorage.setItem('volunteer_city', city);
    if (user?.type === 'Global') {
      localStorage.setItem('volunteer_city_is_default', isDefault.toString());
    }
    navigate('/volunteer/select-event');
  };

  return (
    <div className="app-container animate-fade-in" style={{ padding: '1.5rem', paddingBottom: '80px' }}>
      <div className="header" style={{ marginBottom: '2rem', borderBottom: 'none' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <img onError={(e) => { e.target.onerror = null; e.target.src='/favicon.svg'; }} src="/logo.png" alt="App Logo" style={{ height: '32px', width: 'auto' }} />
          <h1 style={{ color: 'var(--secondary-color)', margin: 0 }}>Select City</h1>
        </div>
      </div>

      <p style={{ color: 'rgba(128, 90, 64, 0.7)', marginBottom: '1.5rem' }}>
        Where are you marking attendance today?
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {sortedCities.map((city) => (
          <button 
            key={city}
            onClick={() => handleSelect(city)}
            className="card"
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              padding: '1.25rem',
              border: selectedCity === city ? '2px solid var(--secondary-color)' : '1px solid rgba(212, 175, 55, 0.2)',
              width: '100%',
              textAlign: 'left',
              cursor: 'pointer',
              backgroundColor: selectedCity === city ? 'rgba(212, 175, 55, 0.05)' : 'white'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <MapPin size={20} color={selectedCity === city ? 'var(--secondary-color)' : 'rgba(128, 90, 64, 0.5)'} />
              <span style={{ fontWeight: '500', color: 'var(--text-color)' }}>{city}</span>
            </div>
            <ChevronRight size={20} color="rgba(128, 90, 64, 0.3)" />
          </button>
        ))}
      </div>

      {user?.type === 'Global' && (
        <div style={{ 
          marginTop: '2rem', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.75rem', 
          padding: '1rem',
          backgroundColor: 'rgba(128, 90, 64, 0.03)',
          borderRadius: 'var(--border-radius-md)'
        }}>
          <input 
            type="checkbox" 
            id="defaultCity"
            checked={isDefault}
            onChange={(e) => setIsDefault(e.target.checked)}
            style={{ width: '18px', height: '18px', accentColor: 'var(--secondary-color)' }}
          />
          <label htmlFor="defaultCity" style={{ fontSize: '0.9rem', color: 'var(--text-color)', cursor: 'pointer' }}>
            Remember this city as my default
          </label>
        </div>
      )}
    </div>
  );
}

export default SelectCity;
