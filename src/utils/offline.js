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
    // Pulls the logged-in volunteer info from your login session
    volunteerName: localStorage.getItem('volunteer_name') || "Unknown",
    volunteerId: localStorage.getItem('volunteer_id') || "V"
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
      // THE "BETTER VERSION" PAYLOAD 
      // Aligned with your 5 columns: Time-Stamp, RollNo-Name, Activity-Attendance, Volunteer, Roll No
      const payload = {
        TimeStamp: item.timestamp,
        // Requirement 3 & 4: Uses Roll No and Student Name combined
        RollNo_Name: `${item.rollNo || "Unknown"}-${item.studentName || "Unknown"}`,
        // Requirement 2: Takes the Activity Short Name from your Workshop dropdown
        Activity_Attendance: item.activity || "Present",
        // Requirement 1: Records the Volunteer Name who is logged in
        Volunteer_ID_Name: `${item.volunteerId}-${item.volunteerName}`,
        // Raw Roll Number
        Roll_No: item.rollNo || "Unknown"
      };

      await fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors', // Critical for sending data to Google Apps Script
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