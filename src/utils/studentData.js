// Shared student database and QR payload parser

export const mockStudents = [
  { id: '1', name: 'Aman Singh', rollNo: 'CS-101', city: 'City A' },
  { id: '2', name: 'Priya Kaur', rollNo: 'EE-204', city: 'City A' },
  { id: '3', name: 'Gurpreet Singh', rollNo: 'ME-302', city: 'City B' },
  { id: '4', name: 'Harpreet Kaur', rollNo: 'CE-401', city: 'City B' },
  { id: '5', name: 'Rajesh Kumar', rollNo: 'CS-102', city: 'City A' },
  { id: '6', name: 'Sandeep Kaur', rollNo: 'EE-205', city: 'City A' }
];

export const findStudentByRollNo = (rollNo) => {
  if (!rollNo) return null;
  const normalized = rollNo.trim().toUpperCase();
  return mockStudents.find(s => s.rollNo.toUpperCase() === normalized) || null;
};

export const parseQRPayload = (rawText) => {
  if (!rawText) return null;
  const trimmed = rawText.trim();

  // 1. Check if it is JSON
  if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
    try {
      const data = JSON.parse(trimmed);
      const rollNo = data.rollNo || data.rollNumber || data.studentId || data.id || '';
      const name = data.name || data.studentName || '';
      const city = data.city || data.cityName || '';
      
      const matched = findStudentByRollNo(rollNo);
      return matched || { id: rollNo, name: name || `Student (${rollNo})`, rollNo, city };
    } catch (e) {
      console.error('Failed to parse QR JSON:', e);
    }
  }

  // 2. Check for pipe, comma, or semicolon delimited values
  const delimiters = ['|', ',', ';'];
  for (const delimiter of delimiters) {
    if (trimmed.includes(delimiter)) {
      const parts = trimmed.split(delimiter).map(p => p.trim());
      if (parts.length >= 3) {
        const containsDigits = (str) => /\d/.test(str);
        let rollNo = '';
        let name = '';
        let city = '';
        
        if (containsDigits(parts[0]) && !containsDigits(parts[1])) {
          rollNo = parts[0];
          name = parts[1];
          city = parts[2];
        } else if (containsDigits(parts[1]) && !containsDigits(parts[0])) {
          name = parts[0];
          rollNo = parts[1];
          city = parts[2];
        } else {
          rollNo = parts[0];
          name = parts[1];
          city = parts[2];
        }
        
        const matched = findStudentByRollNo(rollNo);
        return matched || { id: rollNo, name, rollNo, city };
      }
      if (parts.length === 2) {
        const containsDigits = (str) => /\d/.test(str);
        const rollNo = containsDigits(parts[0]) ? parts[0] : parts[1];
        const name = containsDigits(parts[0]) ? parts[1] : parts[0];
        const matched = findStudentByRollNo(rollNo);
        return matched || { id: rollNo, name, rollNo, city: '' };
      }
    }
  }

  // 3. Fallback: Simple plain text string (treated as Roll Number / Student ID)
  const matched = findStudentByRollNo(trimmed);
  return matched || { id: trimmed, name: `Student (${trimmed})`, rollNo: trimmed, city: '' };
};
