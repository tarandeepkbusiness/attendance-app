import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Splash from './pages/Splash';
import Login from './pages/Login';
import VolunteerLayout from './components/VolunteerLayout';
import SelectCity from './pages/volunteer/SelectCity';
import SelectEvent from './pages/volunteer/SelectEvent';
import SelectActivity from './pages/volunteer/SelectActivity';
import VolunteerHome from './pages/volunteer/VolunteerHome';
import ScanQR from './pages/volunteer/ScanQR';
import SearchStudent from './pages/volunteer/SearchStudent';
import Confirmation from './pages/volunteer/Confirmation';
import Success from './pages/volunteer/Success';
import Duplicate from './pages/volunteer/Duplicate';
import OfflineQueue from './pages/volunteer/OfflineQueue';
import Me from './pages/volunteer/Me';
import AdminLayout from './components/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminMe from './pages/admin/AdminMe';
import CreateEvent from './pages/admin/CreateEvent';
import Settings from './pages/Settings';
import PWAInstallPrompt from './components/PWAInstallPrompt';

export const AuthContext = React.createContext(null);

function App() {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('attendance_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      console.error('Failed to parse saved session', e);
      return null;
    }
  }); 
  const [language, setLanguage] = useState('en'); 

  useEffect(() => {
    if (user) {
      localStorage.setItem('attendance_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('attendance_user');
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, setUser, language, setLanguage }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Splash />} />
          <Route path="/login" element={<Login />} />
          
          {/* Volunteer Routes */}
          <Route path="/volunteer" element={user?.role === 'volunteer' ? <VolunteerLayout /> : <Navigate to="/login" />}>
            <Route index element={<Navigate to="/volunteer/select-city" replace />} />
            <Route path="select-city" element={<SelectCity />} />
            <Route path="select-event" element={<SelectEvent />} />
            <Route path="select-activity" element={<SelectActivity />} />
            <Route path="home" element={<VolunteerHome />} />
            <Route path="scan" element={<ScanQR />} />
            <Route path="search" element={<SearchStudent />} />
            <Route path="confirm" element={<Confirmation />} />
            <Route path="success" element={<Success />} />
            <Route path="duplicate" element={<Duplicate />} />
            <Route path="queue" element={<OfflineQueue />} />
            <Route path="me" element={<Me />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin" element={user?.role === 'admin' ? <AdminLayout /> : <Navigate to="/login" />}>
            <Route index element={<AdminDashboard />} />
            <Route path="me" element={<AdminMe />} />
          </Route>
          <Route path="/admin/create-event" element={user?.role === 'admin' ? <CreateEvent /> : <Navigate to="/login" />} />
          
          {/* Shared */}
          <Route path="/settings" element={user ? <Settings /> : <Navigate to="/login" />} />
        </Routes>
        <PWAInstallPrompt />
      </BrowserRouter>
    </AuthContext.Provider>
  );
}

export default App;
