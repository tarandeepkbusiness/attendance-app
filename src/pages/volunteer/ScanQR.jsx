import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Scanner } from '@yudiel/react-qr-scanner';
import { ArrowLeft, Search, RefreshCw, Camera } from 'lucide-react';

function ScanQR() {
  const navigate = useNavigate();
  const [status, setStatus] = useState('initializing'); // 'initializing', 'scanning', 'detected', 'denied'
  const [error, setError] = useState(null);
  const scanProcessedRef = useRef(false);

  useEffect(() => {
    let active = true;

    const startScanningFlow = async () => {
      setStatus('initializing');
      setError(null);
      scanProcessedRef.current = false;
      
      try {
        // Request camera permission explicitly first to ensure standard browser prompt
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        // Immediately close the permission check stream
        stream.getTracks().forEach(track => track.stop());
        
        if (active) {
          setStatus('scanning');
        }
      } catch (err) {
        console.error('Camera permission or accessibility error:', err);
        if (active) {
          setStatus('denied');
          setError('Camera permission required for QR scan.');
        }
      }
    };

    startScanningFlow();

    return () => {
      active = false;
    };
  }, []);

  const handleScan = (result) => {
    // Process only the first valid scan detect
    if (scanProcessedRef.current) return;
    
    if (result && result[0]?.rawValue) {
      const text = result[0].rawValue;
      scanProcessedRef.current = true;
      setStatus('detected');
      
      // Stop scanner instantly by unmounting, and navigate to confirmation screen
      setTimeout(() => {
        navigate('/volunteer/confirm', { state: { qrData: text } });
      }, 600);
    }
  };

  const handleError = (err) => {
    console.error('Scanner device error:', err);
    setStatus('denied');
    setError('Camera permission required for QR scan.');
  };

  const handleRetryPermission = async () => {
    setStatus('initializing');
    setError(null);
    scanProcessedRef.current = false;
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      stream.getTracks().forEach(track => track.stop());
      setStatus('scanning');
    } catch (err) {
      console.error('Permission retry failed:', err);
      setStatus('denied');
      setError('Camera permission required for QR scan.');
    }
  };

  return (
    <div className="app-container animate-fade-in" style={{ padding: 0, backgroundColor: 'black', color: 'white', display: 'flex', flexDirection: 'column' }}>
      {/* Absolute overlay Header */}
      <div style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 10, position: 'absolute', top: 0, width: '100%', boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <img onError={(e) => { e.target.onerror = null; e.target.src='/favicon.svg'; }} src="/logo.png" alt="App Logo" style={{ height: '32px', width: 'auto' }} />
          <button onClick={() => navigate(-1)} style={{ color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(0,0,0,0.5)', padding: '0.5rem 0.8rem', borderRadius: '20px', fontSize: '0.9rem' }}>
            <ArrowLeft size={18} />
            <span>Back</span>
          </button>
        </div>
        <button onClick={() => navigate('/volunteer/search')} style={{ color: 'white', background: 'rgba(0,0,0,0.5)', padding: '0.5rem', borderRadius: '50%', border: 'none', cursor: 'pointer' }}>
          <Search size={18} />
        </button>
      </div>

      {/* Main scan / state viewport */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', width: '100%', height: '100%' }}>
        
        {status === 'initializing' && (
          <div style={{ textAlign: 'center', padding: '2rem', zIndex: 5 }}>
            <RefreshCw size={44} style={{ color: 'var(--secondary-color)', marginBottom: '1rem', animation: 'spin 1.5s linear infinite' }} />
            <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.95rem' }}>Initializing camera preview...</p>
          </div>
        )}

        {status === 'denied' && (
          <div style={{ textAlign: 'center', padding: '2rem', maxWidth: '320px', zIndex: 10 }}>
            <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', border: '1px solid var(--error-color)', padding: '1.5rem', borderRadius: 'var(--border-radius-md)', marginBottom: '1.5rem' }}>
              <p style={{ color: '#ff6b6b', fontWeight: '600', marginBottom: '0.5rem', fontSize: '0.95rem' }}>
                Camera permission required for QR scan.
              </p>
              <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.4, margin: 0 }}>
                Please grant camera permissions to capture student registration identifiers.
              </p>
            </div>
            <button 
              onClick={handleRetryPermission}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                backgroundColor: 'var(--secondary-color)',
                color: 'white',
                padding: '0.8rem 1.5rem',
                borderRadius: 'var(--border-radius-lg)',
                fontWeight: '600',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 10px rgba(212, 175, 55, 0.3)'
              }}
            >
              <Camera size={18} />
              Retry Permission
            </button>
          </div>
        )}

        {status === 'detected' && (
          <div style={{ textAlign: 'center', padding: '2rem', zIndex: 10 }}>
            <div style={{ backgroundColor: 'rgba(34, 197, 94, 0.15)', border: '1px solid var(--success-color)', padding: '1.5rem', borderRadius: 'var(--border-radius-md)' }}>
              <p style={{ color: '#4ade80', fontWeight: '700', fontSize: '1.1rem', marginBottom: '0.5rem' }}>QR Code Detected!</p>
              <p style={{ fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.8)', margin: 0 }}>
                QR detected, loading student details.
              </p>
            </div>
          </div>
        )}

        {status === 'scanning' && (
          <div style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}>
            {/* Camera feed from Yudiel QR Scanner */}
            <Scanner 
              onScan={handleScan}
              onError={handleError}
              allowMultiple={false}
              scanDelay={250}
              components={{
                audio: false,
                finder: false
              }}
              styles={{
                container: { width: '100%', height: '100%' },
                video: { width: '100%', height: '100%', objectFit: 'cover' }
              }}
            />
            
            {/* Visual Scan Frame Overlay */}
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '260px',
              height: '260px',
              border: '3px solid var(--secondary-color)',
              borderRadius: '24px',
              boxShadow: '0 0 0 4000px rgba(0, 0, 0, 0.6)',
              zIndex: 5,
              pointerEvents: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {/* Corner accents for premium styling */}
              <div style={{ position: 'absolute', top: -3, left: -3, width: '24px', height: '24px', borderTop: '5px solid white', borderLeft: '5px solid white', borderRadius: '24px 0 0 0' }} />
              <div style={{ position: 'absolute', top: -3, right: -3, width: '24px', height: '24px', borderTop: '5px solid white', borderRight: '5px solid white', borderRadius: '0 24px 0 0' }} />
              <div style={{ position: 'absolute', bottom: -3, left: -3, width: '24px', height: '24px', borderBottom: '5px solid white', borderLeft: '5px solid white', borderRadius: '0 0 0 24px' }} />
              <div style={{ position: 'absolute', bottom: -3, right: -3, width: '24px', height: '24px', borderBottom: '5px solid white', borderRight: '5px solid white', borderRadius: '0 0 24px 0' }} />
              
              {/* Pulsing scanning red line */}
              <div style={{
                width: '90%',
                height: '2px',
                backgroundColor: 'rgba(239, 68, 68, 0.8)',
                boxShadow: '0 0 8px rgba(239, 68, 68, 0.8)',
                position: 'absolute',
                animation: 'scanLine 2s linear infinite'
              }} />
            </div>

            {/* Helper texts */}
            <div style={{ position: 'absolute', bottom: '15%', width: '100%', textAlign: 'center', zIndex: 10, padding: '0 1.5rem', boxSizing: 'border-box' }}>
              <p style={{ margin: '0 0 0.5rem 0', fontSize: '1.05rem', fontWeight: '600', textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
                Point camera at QR code.
              </p>
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--secondary-color)', fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}>
                <span className="scanning-dot" style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--secondary-color)', animation: 'pulse 1s infinite' }}></span>
                Scanning...
              </p>
              {error && <p style={{ color: '#ff6b6b', fontSize: '0.85rem', marginTop: '0.5rem', textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}>{error}</p>}
            </div>
          </div>
        )}
      </div>

      <style>
        {`
          @keyframes scanLine {
            0% { top: 10%; }
            50% { top: 90%; }
            100% { top: 10%; }
          }
          @keyframes pulse {
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.4); opacity: 0.5; }
          }
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
}

export default ScanQR;
