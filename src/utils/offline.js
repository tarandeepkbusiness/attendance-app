// 1. Get the list of scans waiting to be sent from the phone's memory
export const getOfflineQueue = () => {
  const data = localStorage.getItem('attendance_offline_queue');
  return data ? JSON.parse(data) : [];
};

// 2. Save a new scan to the phone's memory (Queue)
export const saveToOfflineQueue = (record) => {
  const queue = getOfflineQueue();

  // Prepare the data to match your Sheet requirements
  const newRecord = {
    ...record,
    id: Date.now().toString(),
    status: 'pending',
    timestamp: new Date().toISOString(),
    // Pulls the logged-in volunteer info and selected activity from session
    volunteerName: localStorage.getItem('volunteer_name') || "Unknown",
    volunteerId: localStorage.getItem('volunteer_id') || "V",
    activity: localStorage.getItem('volunteer_activity') || "General"
  };

  queue.push(newRecord);
  localStorage.setItem('attendance_offline_queue', JSON.stringify(queue));
  return newRecord;
};

// 3. Update the status of a scan (from pending to sent)
export const updateRecordStatus = (id, status) => {
  const queue = getOfflineQueue();
  const updated = queue.map(item => item.id === id ? { ...item, status } : item);
  localStorage.setItem('attendance_offline_queue', JSON.stringify(updated));
};

// 4. THE MASTER SYNC FUNCTION: Sends the data to Google Sheets
export const syncOfflineQueue = async () => {
  const queue = getOfflineQueue();
  const pendingItems = queue.filter(item => item.status === 'pending');

  if (pendingItems.length === 0) return;

  // Your specific Google Apps Script Web App URL
  const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxgprYuk5ICscp_mm6vNx65RnB2j_uMO2Y6qTp7f0qCl7BQsucUjPxem_40I39XHbRn/exec";

  for (const item of pendingItems) {
    try {
      // Payload aligned with your 5 columns
      const payload = {
        TimeStamp: item.timestamp,
        RollNo_Name: `${item.rollNo || "Unknown"}-${item.studentName || "Unknown"}`,
        Activity_Attendance: item.activity || "Present",
        Volunteer_ID_Name: `${item.volunteerId}-${item.volunteerName}`,
        Roll_No: item.rollNo || "Unknown"
      };

      await fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors', // Used for Google Apps Script to avoid CORS blocks
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload)
      });

      // Mark as sent in the phone's memory
      updateRecordStatus(item.id, 'sent');
      console.log(`Success: Sent Roll No ${item.rollNo}`);

    } catch (error) {
      console.error("Sync failed for this item. Check internet connection.", error);
    }
  }
};

// 5. THE MISSING FUNCTION: Clears records that have already been sent
// This fixes the [MISSING_EXPORT] error you received.
export const clearSyncedRecords = () => {
  const queue = getOfflineQueue();
  // Filter out the ones that are 'sent', keep only 'pending' or 'failed'
  const filteredQueue = queue.filter(item => item.status !== 'sent');
  localStorage.setItem('attendance_offline_queue', JSON.stringify(filteredQueue));
  return filteredQueue;
};