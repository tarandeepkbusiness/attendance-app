import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Scanner } from '@yudiel/react-qr-scanner';
import { ArrowLeft, Search } from 'lucide-react';

function ScanQR() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const handleScan = (text, result) => {
    if (text) {
      // Mock logic: validate QR and go to confirmation
      // Data format expected: maybe just ID or JSON string
      navigate('/volunteer/confirm', { state: { qrData: text } });
    }
  };

  const handleError = (error) => {
    console.error(error);
    setError(error?.message || 'Error accessing camera');
  };

  return (
    <div className="app-container animate-fade-in" style={{ padding: 0, backgroundColor: 'black', color: 'white' }}>
      <div style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 10, position: 'absolute', top: 0, width: '100%', boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <img onError={(e) => { e.target.onerror = null; e.target.src='/favicon.svg'; }} src="/logo.png" alt="App Logo" style={{ height: '32px', width: 'auto' }} />
          <button onClick={() => navigate(-1)} style={{ color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ArrowLeft size={24} />
            <span>Back</span>
          </button>
        </div>
        <button onClick={() => navigate('/volunteer/search')} style={{ color: 'white' }}>
          <Search size={24} />
        </button>
      </div>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', position: 'relative' }}>
        <div style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
          <Scanner 
            onResult={(text, result) => handleScan(text, result)}
            onError={handleError}
            options={{
              delayBetweenScanAttempts: 1000,
            }}
          />
        </div>
        
        {/* Overlay frame */}
        <div style={{
          position: 'absolute',
          width: '250px',
          height: '250px',
          border: '3px solid var(--secondary-color)',
          borderRadius: '16px',
          boxShadow: '0 0 0 4000px rgba(0, 0, 0, 0.5)',
          zIndex: 5,
          pointerEvents: 'none'
        }}>
          {/* Corner accents */}
          <div style={{ position: 'absolute', top: -1, left: -1, width: '20px', height: '20px', borderTop: '4px solid white', borderLeft: '4px solid white', borderRadius: '16px 0 0 0' }} />
          <div style={{ position: 'absolute', top: -1, right: -1, width: '20px', height: '20px', borderTop: '4px solid white', borderRight: '4px solid white', borderRadius: '0 16px 0 0' }} />
          <div style={{ position: 'absolute', bottom: -1, left: -1, width: '20px', height: '20px', borderBottom: '4px solid white', borderLeft: '4px solid white', borderRadius: '0 0 0 16px' }} />
          <div style={{ position: 'absolute', bottom: -1, right: -1, width: '20px', height: '20px', borderBottom: '4px solid white', borderRight: '4px solid white', borderRadius: '0 0 16px 0' }} />
        </div>
        
        <div style={{ position: 'absolute', bottom: '15%', width: '100%', textAlign: 'center', zIndex: 10 }}>
          <p style={{ margin: 0, fontSize: '1rem', fontWeight: '500' }}>Position QR code within frame</p>
          {error && <p style={{ color: 'var(--error-color)', fontSize: '0.875rem', marginTop: '0.5rem' }}>{error}</p>}
        </div>
      </div>
    </div>
  );
}

export default ScanQR;
