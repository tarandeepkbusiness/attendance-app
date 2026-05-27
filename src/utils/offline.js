export const getOfflineQueue = () => {
  const data = localStorage.getItem('attendance_offline_queue');
  return data ? JSON.parse(data) : [];
};

export const saveToOfflineQueue = (record) => {
  const queue = getOfflineQueue();
  const newRecord = { 
    ...record, 
    id: Date.now().toString(), 
    status: 'pending', 
    timestamp: new Date().toISOString() 
  };
  queue.push(newRecord);
  localStorage.setItem('attendance_offline_queue', JSON.stringify(queue));
  return newRecord;
};

export const updateRecordStatus = (id, status) => {
  const queue = getOfflineQueue();
  const updated = queue.map(item => item.id === id ? { ...item, status } : item);
  localStorage.setItem('attendance_offline_queue', JSON.stringify(updated));
};

export const clearSyncedRecords = () => {
  const queue = getOfflineQueue();
  const pending = queue.filter(item => item.status === 'pending');
  localStorage.setItem('attendance_offline_queue', JSON.stringify(pending));
};

export const syncOfflineQueue = async () => {
  if (!navigator.onLine) return { success: false, message: 'Offline' };
  
  const queue = getOfflineQueue();
  const pending = queue.filter(item => item.status === 'pending');
  
  if (pending.length === 0) return { success: true, count: 0 };

  const API_ENDPOINT = 'https://script.google.com/macros/s/AKfycbxCNRPi8VzffFG49HMXeQYKgkJPG2BzBPbqm9mvjFG-WdCXeLrDWjgQUnXKoTRp650O/exec';

  let syncedCount = 0;
  for (const record of pending) {
    try {
      // Real API POST call to Google Apps Script
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8' // Simple content type avoids CORS preflight OPTIONS block
        },
        body: JSON.stringify({
          studentName: record.student?.name || "Scan Result",
          rollNumber: record.student?.rollNo || record.qrData || "Unknown",
          city: record.city || "Unknown",
          event: 'Summer Camp',
          activity: record.activity,
          volunteerId: record.volunteerId || 'V001',
          status: "Present"
        })
      });
      
      // Google Apps Script responses may return redirect, check response ok or opaque type
      if (response.ok || response.type === 'opaque') {
        updateRecordStatus(record.id, 'synced');
        syncedCount++;
      } else {
        console.error('Server rejected sync:', response.status);
      }
    } catch (e) {
      console.error('Failed to sync record:', record.id, e);
    }
  }
  
  return { success: true, count: syncedCount };
};
