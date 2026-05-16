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

  let syncedCount = 0;
  for (const record of pending) {
    try {
      // Mock API call to Google App Script or your backend
      // Replace with actual fetch call
      /*
      await fetch('YOUR_API_ENDPOINT', {
        method: 'POST',
        body: JSON.stringify(record)
      });
      */
      
      // Simulate network request
      await new Promise(resolve => setTimeout(resolve, 500));
      
      updateRecordStatus(record.id, 'synced');
      syncedCount++;
    } catch (e) {
      console.error('Failed to sync record:', record.id, e);
    }
  }
  
  return { success: true, count: syncedCount };
};
