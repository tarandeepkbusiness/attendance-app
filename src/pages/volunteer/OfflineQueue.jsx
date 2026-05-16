import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, RefreshCw, CheckCircle, Clock } from 'lucide-react';
import { getOfflineQueue, syncOfflineQueue, clearSyncedRecords } from '../../utils/offline';

function OfflineQueue() {
  const navigate = useNavigate();
  const [queue, setQueue] = useState([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    // Only keep pending items visible when we initially load (per requirement "only keep pending items visible in the main queue")
    clearSyncedRecords();
    loadQueue();

    const initialSync = async () => {
      const q = getOfflineQueue();
      if (navigator.onLine && q.some(i => i.status === 'pending')) {
        setIsSyncing(true);
        await syncOfflineQueue();
        loadQueue();
        setIsSyncing(false);
      }
    };
    initialSync();

    const handleOnline = () => {
      setIsOnline(true);
      // We can't call handleSync directly here if it's defined as a const below useEffect
      // so we duplicate the simple sync logic or just rely on the event listener closure
      setIsSyncing(true);
      syncOfflineQueue().then(() => {
        loadQueue();
        setIsSyncing(false);
      });
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const loadQueue = () => {
    setQueue(getOfflineQueue());
  };

  const handleSync = async () => {
    if (!navigator.onLine) return;
    setIsSyncing(true);
    await syncOfflineQueue();
    loadQueue();
    setIsSyncing(false);
  };

  const pendingCount = queue.filter(item => item.status === 'pending').length;

  return (
    <div className="app-container animate-fade-in">
      <div className="header" style={{ marginBottom: '1.5rem', borderBottom: 'none' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <img onError={(e) => { e.target.onerror = null; e.target.src='/favicon.svg'; }} src="/logo.png" alt="App Logo" style={{ height: '32px', width: 'auto' }} />
          <button onClick={() => navigate(-1)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-color)' }}>
            <ArrowLeft size={24} />
            <h1 style={{ margin: 0 }}>Offline Queue</h1>
          </button>
        </div>
        <button onClick={handleSync} disabled={isSyncing || !isOnline || pendingCount === 0} style={{ color: 'var(--secondary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <RefreshCw size={24} className={isSyncing ? 'spin-animation' : ''} />
        </button>
      </div>

      {!isOnline && (
        <div style={{ padding: '1rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--error-color)', borderRadius: '12px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Clock size={20} />
          <span style={{ fontWeight: '500' }}>No Wi-Fi connection. Items will be stored locally.</span>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', padding: '1rem', backgroundColor: 'white', borderRadius: '12px', boxShadow: 'var(--shadow-sm)' }}>
        <div>
          <h2 style={{ fontSize: '1rem', margin: 0 }}>Sync Status</h2>
          <p style={{ margin: 0, fontSize: '0.85rem', color: 'rgba(128, 90, 64, 0.7)' }}>{pendingCount} item{pendingCount !== 1 ? 's' : ''} pending</p>
        </div>
        <button onClick={handleSync} disabled={isSyncing || !isOnline || pendingCount === 0} className="btn-primary" style={{ width: 'auto', padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: (!isOnline || pendingCount === 0 || isSyncing) ? 0.5 : 1 }}>
          <RefreshCw size={16} className={isSyncing ? 'spin-animation' : ''} /> {isSyncing ? 'Syncing...' : 'Sync Now'}
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {queue.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'rgba(128, 90, 64, 0.5)' }}>
            No pending items in queue
          </div>
        ) : (
          queue.map(item => (
            <div key={item.id} className="card" style={{ padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1rem' }}>{item.student?.name || "Unknown Student"}</h3>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'rgba(128, 90, 64, 0.7)' }}>{item.student?.rollNo || item.qrData || "Unknown ID"} • {new Date(item.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
              </div>
              <div>
                {item.status === 'synced' ? (
                  <span className="badge badge-success" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <CheckCircle size={12} /> Synced
                  </span>
                ) : (
                  <span className="badge badge-warning" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={12} /> Pending
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
      <style>
        {`
          @keyframes spin { 100% { transform: rotate(360deg); } }
          .spin-animation { animation: spin 1s linear infinite; }
        `}
      </style>
    </div>
  );
}

export default OfflineQueue;
