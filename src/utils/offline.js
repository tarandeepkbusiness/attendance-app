import { SCRIPT_URL } from '../config';

// 1. Get the list of scans waiting to be sent from the phone's memory
export const getOfflineQueue = () => {
  const data = localStorage.getItem('attendance_offline_queue');
  return data ? JSON.parse(data) : [];
};

// 2. Save a new scan to the phone's memory (Queue)
export const saveToOfflineQueue = (record) => {
  const queue = getOfflineQueue();

  const newRecord = {
    ...record,
    id: Date.now().toString(),
    status: 'pending',
    timestamp: new Date().toISOString(),
    // Pulls the logged-in info from session
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

  for (const item of pendingItems) {
    try {
      const rollNo = item.student?.rollNo || item.rollNo || item.qrData || "Unknown";
      const studentName = item.student?.name || item.studentName || "Unknown";

      const payload = {
        action: "markAttendance",
        scannedRollNo: rollNo,
        activity: item.activity || "General",
        volunteerName: item.volunteerName || "Unknown",
        
        // Include legacy/column-mapped properties just in case:
        TimeStamp: item.timestamp || new Date().toISOString(),
        RollNo_Name: `${rollNo}-${studentName}`,
        Activity_Attendance: item.activity || "Present",
        Volunteer_ID_Name: `${item.volunteerId || "V"}-${item.volunteerName || "Unknown"}`,
        Roll_No: rollNo
      };

      // Uses the SCRIPT_URL from your new config file
      await fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload)
      });

      // Mark as sent in the phone's memory
      updateRecordStatus(item.id, 'sent');
      console.log(`Success: Sent Roll No ${rollNo}`);

    } catch (error) {
      console.error("Sync failed for this item.", error);
    }
  }

  // REQUIREMENT #5: Automatically clean up the list once sync is done
  clearSyncedRecords();
};

// 5. THE MISSING FUNCTION: Clears records that have already been sent
export const clearSyncedRecords = () => {
  const queue = getOfflineQueue();
  // Filter out the ones that are 'sent', keep only 'pending' or 'failed'
  const filteredQueue = queue.filter(item => item.status !== 'sent');
  localStorage.setItem('attendance_offline_queue', JSON.stringify(filteredQueue));
  return filteredQueue;
};