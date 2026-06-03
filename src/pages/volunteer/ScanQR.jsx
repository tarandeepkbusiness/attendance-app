// ScanQR.jsx - rebuilt for zero-navigation, auto-scan toggle, and performance
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
  const [overlayInfo, setOverlayInfo] = useState(null); // { rollNo, name?, amber? }
  const [status, setStatus] = useState('scanning'); // 'scanning' | 'overlay'
  const [error, setError] = useState(null);
  const [date] = useState(new Date().toISOString().split('T')[0]);
  const city = localStorage.getItem('volunteer_city') || 'City A';
  const event = localStorage.getItem('volunteer_event') || 'Morning Session';
  const activity = localStorage.getItem('volunteer_activity') || '';

  // Prevent processing the same QR code multiple times rapidly
  const processedSet = useRef(new Set());
  useEffect(() => {
    processedSet.current.clear();
  }, []);

  const handleScan = async (result) => {
    if (!result?.[0]?.rawValue) return;
    const rawText = result[0].rawValue;
    if (processedSet.current.has(rawText)) return;
    processedSet.current.add(rawText);

    const payload = parseQRPayload(rawText);
    const rollNo = payload?.rollNo || rawText;
    const overlay = { rollNo, amber: null };

    // Amber‑Alert check for non‑compulsory activities
    const isCompulsory = activity === 'Meditation & Shudh Gurbani' || activity === 'Meditation & Sudh Gurbani';
    if (!isCompulsory && navigator.onLine) {
      try {
        const resp = await fetch(`${SCRIPT_URL}?action=checkCompulsory&rollNo=${encodeURIComponent(rollNo)}`);
        if (resp.ok) {
          const data = await resp.json();
          if (data && data.attended === false) {
            overlay.amber = `Roll No. ${rollNo} didn't attend Meditation and Shudh Gurbani today!`;
          }
        }
      } catch (e) {
        console.error('Compulsory check failed', e);
      }
    }

    // Save attendance (auto‑scan or manual later)
    const saveAttendance = async () => {
      await saveToOfflineQueue({ student: { rollNo }, qrData: rawText, date, event, city, activity });
      if (navigator.onLine) await syncOfflineQueue();
    };

    if (autoScan) {
      await saveAttendance();
      setOverlayInfo(overlay);
      setStatus('overlay');
      setTimeout(() => {
        setStatus('scanning');
        setOverlayInfo(null);
        processedSet.current.clear();
      }, overlay.amber ? 1500 : 1000);
    } else {
      // Manual mode – show overlay with submit button
      setOverlayInfo({ ...overlay, manual: true });
      setStatus('overlay');
    }
  };

  const handleManualSubmit = async () => {
    if (!overlayInfo) return;
    await saveToOfflineQueue({ student: { rollNo: overlayInfo.rollNo }, qrData: overlayInfo.rollNo, date, event, city, activity });
    if (navigator.onLine) await syncOfflineQueue();
    setStatus('scanning');
    setOverlayInfo(null);
    processedSet.current.clear();
  };

  const handleError = (err) => {
    console.error('Scanner error:', err);
    setError('Camera permission required for QR scan.');
    setStatus('scanning');
  };

  const retryPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      stream.getTracks().forEach((t) => t.stop());
      localStorage.setItem('camera_permission_granted', 'true');
      window.location.reload();
    } catch (e) {
      setError('Camera permission required for QR scan.');
    }
  };

  return (
    <div className="app-container" style={{ backgroundColor: '#000', color: '#fff', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header with back & search */}
      <div style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: '#fff' }}>
          <ArrowLeft size={20} /> Back
        </button>
        <button onClick={() => navigate('/volunteer/search')} style={{ background: 'none', border: 'none', color: '#fff' }}>
          <Search size={20} />
        </button>
      </div>

      {/* Auto‑scan toggle */}
      <div style={{ padding: '0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <input
          type="checkbox"
          id="autoScanToggle"
          checked={autoScan}
          onChange={(e) => setAutoScan(e.target.checked)}
        />
        <label htmlFor="autoScanToggle" style={{ color: '#fff' }}>Auto‑Scan</label>
      </div>

      {/* Main content */}
      <div style={{ flex: 1, position: 'relative' }}>
        {status === 'scanning' && (
          <Scanner
            onScan={handleScan}
            onError={handleError}
            paused={false}
            allowMultiple={false}
            scanDelay={250}
            constraints={{ facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } }}
            components={{ audio: false, finder: false }}
            styles={{ container: { width: '100%', height: '100%' }, video: { width: '100%', height: '100%', objectFit: 'cover' } }}
          />
        )}

        {/* Permission error UI */}
        {error && (
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', padding: '1rem', background: 'rgba(255,0,0,0.2)', color: '#fff' }}>
            <p>{error}</p>
            <button onClick={retryPermission} style={{ marginTop: '0.5rem', background: '#fff', color: '#000' }}>
              <Camera size={16} /> Retry Permission
            </button>
          </div>
        )}

        {/* Overlay after scan */}
        {status === 'overlay' && overlayInfo && (
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.85)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#fff', padding: '2rem' }}>
            {overlayInfo.amber && (
              <div style={{ background: '#FFBF00', color: '#000', padding: '0.8rem', borderRadius: '8px', marginBottom: '1rem' }}>
                {overlayInfo.amber}
              </div>
            )}
            <h2 style={{ marginBottom: '0.5rem' }}>Roll No: {overlayInfo.rollNo}</h2>
            {overlayInfo.manual && (
              <button onClick={handleManualSubmit} style={{ marginTop: '1rem', background: '#22c55e', border: 'none', padding: '0.8rem 1.2rem', borderRadius: '6px' }}>
                Submit Attendance
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ScanQR;
