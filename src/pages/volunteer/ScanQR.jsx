import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Scanner } from '@yudiel/react-qr-scanner';
import { ArrowLeft, Search, RefreshCw, Camera, CheckCircle, Calendar, MapPin, Tag, UserPlus } from 'lucide-react';
import { parseQRPayload } from '../../utils/studentData';
import { saveToOfflineQueue, syncOfflineQueue } from '../../utils/offline';

const ELECTIVE_ACTIVITIES = ['AI', 'Clay Modelling', 'Cooking', 'Dolki', 'Knitting-Crochet', 'Painting', 'Paper Craft', 'Photography', 'Resin Art', 'Tabla', 'Vocal'];

function ScanQR() {
  const navigate = useNavigate();
  const [status, setStatus] = useState('scanning'); // 'scanning', 'confirming', 'success', 'denied'
  const [error, setError] = useState(null);
  
  const [scannedStudent, setScannedStudent] = useState(null);
  const [scannedRaw, setScannedRaw] = useState('');
  
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const city = localStorage.getItem('volunteer_city') || "City A";
  const event = localStorage.getItem('volunteer_event') || "Morning Session";
  const activity = localStorage.getItem('volunteer_activity') || "";
  const [mandatoryWarning, setMandatoryWarning] = useState(null);
  
  const scanProcessedRef = useRef(false);

  useEffect(() => {
    scanProcessedRef.current = false;
  }, []);

  const handleScan = (result) => {
    if (scanProcessedRef.current) return;
    
    if (result && result[0]?.rawValue) {
      const rawText = result[0].rawValue;
      scanProcessedRef.current = true;
      setScannedRaw(rawText);
      
      const studentData = parseQRPayload(rawText);
      setScannedStudent(studentData);
      
      setStatus('confirming');
      setMandatoryWarning(null);

      if (ELECTIVE_ACTIVITIES.includes(activity)) {
        const rollNo = studentData?.rollNo || rawText;
        const API_ENDPOINT = 'https://script.google.com/macros/s/AKfycbxRL6ZILuXNm_uKN8jxMBXjXs_p0WHeAugCTuT756i3utrS70mnFJspljI2jTLolO4q/exec';
        fetch(`${API_ENDPOINT}?action=checkMandatory&rollNumber=${encodeURIComponent(rollNo)}`)
          .then(res => res.json())
          .then(data => {
            if (data && data.missed) {
              setMandatoryWarning(`⚠️ Student has not attended ${data.missed} today.`);
            }
          })
          .catch(e => console.error("Failed to check mandatory", e));
      }
    }
  };

  const handleSubmitConfirmation = () => {
    saveToOfflineQueue({ student: scannedStudent, qrData: scannedRaw, date, event, city, activity });
    if (navigator.onLine) {
      syncOfflineQueue();
    }
    setStatus('success');
  };
  
  const handleScanNext = () => {
    setStatus('scanning');
    setScannedStudent(null);
    setScannedRaw('');
    setTimeout(() => {
      scanProcessedRef.current = false;
    }, 500);
  };

  const handleError = (err) => {
    console.error('Scanner device error:', err);
    setStatus('denied');
    setError('Camera permission required for QR scan.');
    localStorage.removeItem('camera_permission_granted');
  };

  const handleRetryPermission = async () => {
    setStatus('scanning');
    setError(null);
    scanProcessedRef.current = false;
    
    try {
      // Trigger user gesture stream request to re-enable permission
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      stream.getTracks().forEach(track => track.stop());
      localStorage.setItem('camera_permission_granted', 'true');
      window.location.reload(); // Reload to remount cleaner camera container
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

        {status === 'confirming' && (
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 20, display: 'flex', flexDirection: 'column', padding: '1.5rem', paddingTop: '80px', boxSizing: 'border-box' }}>
            <div className="card" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '2rem 1.5rem', backgroundColor: 'var(--bg-color)', color: 'var(--text-color)', borderRadius: '24px', overflowY: 'auto' }}>
              <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'rgba(212, 175, 55, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                  <CheckCircle size={40} color="var(--secondary-color)" />
                </div>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>{scannedStudent?.name || `Student (${scannedStudent?.rollNo || scannedRaw})`}</h2>
                <p style={{ fontSize: '1.1rem', color: 'rgba(128, 90, 64, 0.7)', margin: 0 }}>{scannedStudent?.rollNo || scannedRaw || "Unknown ID"}</p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem', flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', backgroundColor: 'rgba(128, 90, 64, 0.03)', borderRadius: '12px' }}>
                  <MapPin size={20} color="var(--secondary-color)" />
                  <div>
                    <p style={{ margin: 0, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'rgba(128, 90, 64, 0.6)' }}>City</p>
                    <p style={{ margin: 0, fontWeight: '500' }}>{city}</p>
                  </div>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', backgroundColor: 'rgba(128, 90, 64, 0.03)', borderRadius: '12px' }}>
                  <Tag size={20} color="var(--secondary-color)" />
                  <div>
                    <p style={{ margin: 0, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'rgba(128, 90, 64, 0.6)' }}>Event</p>
                    <p style={{ margin: 0, fontWeight: '500' }}>{event}</p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', backgroundColor: 'rgba(128, 90, 64, 0.03)', borderRadius: '12px' }}>
                  <Calendar size={20} color="var(--secondary-color)" />
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'rgba(128, 90, 64, 0.6)' }}>Date</p>
                    <input 
                      type="date" 
                      value={date} 
                      onChange={(e) => setDate(e.target.value)}
                      style={{ 
                        width: '100%', 
                        border: 'none', 
                        backgroundColor: 'transparent', 
                        padding: 0, 
                        margin: 0, 
                        fontWeight: '500', 
                        color: 'var(--text-color)',
                        outline: 'none'
                      }} 
                    />
                  </div>
                </div>
              </div>

              {mandatoryWarning && (
                <div style={{ backgroundColor: '#FFBF00', color: '#000', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem', fontWeight: '600', fontSize: '0.95rem', display: 'flex', alignItems: 'center', boxShadow: '0 4px 6px rgba(255, 191, 0, 0.3)' }}>
                  {mandatoryWarning}
                </div>
              )}

              <div style={{ display: 'flex', gap: '1rem' }}>
                <button className="btn-secondary" onClick={handleScanNext} style={{ flex: 1, padding: '1rem' }}>
                  Cancel
                </button>
                <button className="btn-primary" onClick={handleSubmitConfirmation} style={{ flex: 2, padding: '1rem' }}>
                  Submit
                </button>
              </div>
            </div>
          </div>
        )}

        {status === 'success' && (
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'rgba(34, 197, 94, 0.15)', border: '2px solid var(--success-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', animation: 'scaleIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }}>
              <CheckCircle size={40} color="var(--success-color)" />
            </div>
            
            <h2 style={{ color: 'white', marginBottom: '0.5rem', fontSize: '1.75rem', textAlign: 'center' }}>Attendance Recorded!</h2>
            <p style={{ color: 'rgba(255,255,255,0.7)', textAlign: 'center', marginBottom: '2.5rem' }}>
              {scannedStudent?.name || `Student (${scannedStudent?.rollNo || scannedRaw})`} has been checked in.
            </p>
            
            <button 
              className="btn-primary" 
              onClick={handleScanNext}
              style={{ padding: '1.25rem', width: '100%', maxWidth: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', fontSize: '1.1rem' }}
            >
              <Camera size={20} />
              Scan Next Person
            </button>
            
            <button 
              onClick={() => navigate('/volunteer/search')}
              style={{ marginTop: '1.5rem', background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', textDecoration: 'underline', padding: '0.5rem' }}
            >
              Or enter manually
            </button>
          </div>
        )}

        {status === 'scanning' && (
          <div style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}>
            {/* Camera feed from Yudiel QR Scanner */}
            <Scanner 
              onScan={handleScan}
              onError={handleError}
              paused={status !== 'scanning'}
              allowMultiple={false}
              scanDelay={250}
              constraints={{ 
                facingMode: 'environment',
                width: { ideal: 1920 },
                height: { ideal: 1080 }
              }}
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
          @keyframes scaleIn {
            0% { transform: scale(0.8); opacity: 0; }
            100% { transform: scale(1); opacity: 1; }
          }
        `}
      </style>
    </div>
  );
}

export default ScanQR;
