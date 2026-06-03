// ScanQR.jsx - rebuilt for Event Mode with centered square scanner, HUD status, amber floating alert, and cooldown buffer
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Scanner } from '@yudiel/react-qr-scanner';
import { ArrowLeft, Search, Camera, CheckCircle } from 'lucide-react';
import { parseQRPayload } from '../../utils/studentData';
import { saveToOfflineQueue, syncOfflineQueue } from '../../utils/offline';
import { SCRIPT_URL } from '../../config';

function ScanQR() {
  const navigate = useNavigate();

  // UI state
  const [autoScan, setAutoScan] = useState(true); // toggle for auto‑scan mode
  const [statusMsg, setStatusMsg] = useState(''); // HUD message
  const [amberAlert, setAmberAlert] = useState(null); // {msg}
  const [error, setError] = useState(null);
  const [date] = useState(new Date().toISOString().split('T')[0]);
  const city = localStorage.getItem('volunteer_city') || 'City A';
  const event = localStorage.getItem('volunteer_event') || 'Morning Session';
  const activity = localStorage.getItem('volunteer_activity') || '';

  // Cool‑down buffer for roll numbers (3 s)
  const cooldownRef = useRef(new Map()); // rollNo -> timeoutId

  // Reset on mount
  useEffect(() => {
    cooldownRef.current.clear();
  }, []);

  const isCompulsory = activity === 'Meditation & Shudh Gurbani' || activity === 'Meditation & Sudh Gurbani';

  const handleScan = async (result) => {
    if (!result?.[0]?.rawValue) return;
    const rawText = result[0].rawValue;
    const payload = parseQRPayload(rawText);
    const rollNo = payload?.rollNo || rawText;

    // Cool‑down check
    if (cooldownRef.current.has(rollNo)) return;
    // Add to buffer
    const timeoutId = setTimeout(() => {
      cooldownRef.current.delete(rollNo);
    }, 3000);
    cooldownRef.current.set(rollNo, timeoutId);

    // Immediate UI feedback (≤100 ms)
    setStatusMsg(`Marked: Roll ${rollNo}`);
    // Reset HUD after 2 s
    setTimeout(() => setStatusMsg(''), 2000);

    // Save attendance async (does not block UI)
    (async () => {
      await saveToOfflineQueue({ student: { rollNo }, qrData: rawText, date, event, city, activity });
      if (navigator.onLine) await syncOfflineQueue();
    })();

    // Amber alert check (background)
    if (!isCompulsory && navigator.onLine) {
      try {
        const resp = await fetch(`${SCRIPT_URL}?action=checkCompulsory&rollNo=${encodeURIComponent(rollNo)}`);
        if (resp.ok) {
          const data = await resp.json();
          if (data && data.attended === false) {
            setAmberAlert({ msg: `Roll No. ${rollNo} didn't attend Meditation and Shudh Gurbani today!` });
            setTimeout(() => setAmberAlert(null), 1500);
          }
        }
      } catch (e) {
        console.error('Compulsory check failed', e);
      }
    }
  };

  const handleError = (err) => {
    console.error('Scanner error:', err);
    setError('Camera permission required for QR scan.');
  };

  const retryPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      stream.getTracks().forEach(t => t.stop());
      localStorage.setItem('camera_permission_granted', 'true');
      window.location.reload();
    } catch (e) {
      setError('Camera permission required for QR scan.');
    }
  };

  return (
    <div className="app-container" style={{ height: '100vh', backgroundColor: '#000', color: '#fff', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ padding: '0.75rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: '#fff' }}>
          <ArrowLeft size={20} /> Back
        </button>
        <button onClick={() => navigate('/volunteer/search')} style={{ background: 'none', border: 'none', color: '#fff' }}>
          <Search size={20} />
        </button>
      </div>

      {/* Auto‑scan toggle and HUD */}
      <div style={{ padding: '0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <input type="checkbox" id="autoScanToggle" checked={autoScan} onChange={e => setAutoScan(e.target.checked)} />
        <label htmlFor="autoScanToggle" style={{ color: '#fff' }}>Auto‑Scan</label>
        {statusMsg && <span style={{ marginLeft: 'auto', color: '#22c55e', fontWeight: '600' }}>{statusMsg}</span>}
      </div>
{amberAlert && (
        <div style={{ width: '90%', background: '#ba3906', color: '#fff', padding: '12px 16px', borderRadius: '8px', textAlign: 'center', marginBottom: '12px', pointerEvents: 'none' }}>
    {amberAlert.msg}
  </div>
)}

      {/* Main scanning area */}
      <div style={{ flex: 1, position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        {/* Dark overlay */}
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', pointerEvents: 'none' }} />
        {/* Centered square scanner */}
        <div style={{ width: 250, height: 250, background: '#111', position: 'relative', zIndex: 1, overflow: 'hidden' }}>
          <Scanner
            onScan={handleScan}
            onError={handleError}
            paused={false}
            allowMultiple={false}
            scanDelay={250}
            constraints={{ facingMode: 'environment', width: { ideal: 640 }, height: { ideal: 640 } }}
            components={{ audio: false, finder: false }}
            styles={{ container: { width: '100%', height: '100%' }, video: { width: '100%', height: '100%', objectFit: 'cover' } }}
          />
        </div>
        {/* Error UI */}
        {error && (
            <div style={{ position: 'absolute', top: '10%', left: '50%', transform: 'translateX(-50%)', background: 'rgba(255,0,0,0.3)', padding: '0.75rem 1rem', borderRadius: '8px' }}>            <p>{error}</p>
            <button onClick={retryPermission} style={{ marginTop: '0.5rem', background: '#fff', color: '#000', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '4px' }}>
              <Camera size={16} /> Retry Permission
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ScanQR;
