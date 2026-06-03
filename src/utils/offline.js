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

  const API_ENDPOINT = 'https://script.google.com/macros/s/AKfycbxgprYuk5ICscp_mm6vNx65RnB2j_uMO2Y6qTp7f0qCl7BQsucUjPxem_40I39XHbRn/exec';

  let syncedCount = 0;
  for (const record of pending) {
    try {
      // Real API POST call to Google Apps Script
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8' 
        },
          body: JSON.stringify({
            // Column order required by the sheet
            TimeStamp: new Date().toISOString(),
            RollNo_Name: `${record.student?.rollNo || record.qrData || "Unknown"}-${record.student?.name || "Scan Result"}`,
            Activity_Attendance: `${record.activity || ""}-${record.status || "Present"}`,
            Volunteer_ID_Name: `${record.volunteerId || localStorage.getItem('volunteer_id') || "V001"}-${record.volunteerName || localStorage.getItem('volunteer_name') || ""}`,
            Roll_No: record.student?.rollNo || record.qrData || "Unknown"
          })
      });
      
      // Google Apps Script responses may return redirect, check response ok or opaque type
      if (response.ok || response.type === 'opaque') {
        let responseData = null;
        try {
           responseData = await response.clone().json();
        } catch(e) {}
        
        updateRecordStatus(record.id, 'synced');
        syncedCount++;
        
        if (responseData && (responseData.status === 'already_marked' || responseData.result === 'already_marked' || responseData.already_marked)) {
            // Optional: handled by the caller if needed
            return { success: true, count: syncedCount, already_marked: true };
        }
      } else {
        console.error('Server rejected sync:', response.status);
      }
    } catch (e) {
      console.error('Failed to sync record:', record.id, e);
    }
  }
  
  return { success: true, count: syncedCount };
};
