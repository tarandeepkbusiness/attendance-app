import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, User } from 'lucide-react';
import { mockStudents } from '../../utils/studentData';

function SearchStudent() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  
  // Clean query and search matching records
  const searchResults = query.trim() 
    ? mockStudents.filter(s => 
        s.name.toLowerCase().includes(query.toLowerCase()) || 
        s.rollNo.toLowerCase().includes(query.toLowerCase()) ||
        s.city.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  return (
    <div className="app-container animate-fade-in">
      <div className="header" style={{ marginBottom: '1rem', borderBottom: 'none' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <img onError={(e) => { e.target.onerror = null; e.target.src='/favicon.svg'; }} src="/logo.png" alt="App Logo" style={{ height: '32px', width: 'auto' }} />
          <button onClick={() => navigate(-1)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-color)' }}>
            <ArrowLeft size={24} />
            <h1 style={{ margin: 0 }}>Search Student</h1>
          </button>
        </div>
      </div>

      <div className="input-group" style={{ position: 'relative' }}>
        <input 
          type="text" 
          className="input-field" 
          placeholder="Name, Roll No, or City"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ paddingLeft: '2.5rem' }}
        />
        <Search size={20} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(128, 90, 64, 0.5)' }} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem' }}>
        {query && searchResults.map(student => (
          <div 
            key={student.id} 
            className="card" 
            style={{ padding: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '1rem', transition: 'border-color 0.2s' }}
            onClick={() => navigate('/volunteer/confirm', { state: { student } })}
            onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--secondary-color)'}
            onMouseOut={(e) => e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.2)'}
          >
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'rgba(212, 175, 55, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--secondary-color)' }}>
              <User size={20} />
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ margin: 0, fontSize: '1rem' }}>{student.name}</h3>
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'rgba(128, 90, 64, 0.7)' }}>{student.rollNo} • {student.city}</p>
            </div>
          </div>
        ))}
        {query && searchResults.length === 0 && (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'rgba(128, 90, 64, 0.6)' }}>
            No students found matching "{query}"
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchStudent;
