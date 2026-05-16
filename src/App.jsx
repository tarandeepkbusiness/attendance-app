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
import AdminDashboard from './pages/admin/AdminDashboard';
import CreateEvent from './pages/admin/CreateEvent';
import Settings from './pages/Settings';

export const AuthContext = React.createContext(null);

function App() {
  const [user, setUser] = useState(null); 
  const [language, setLanguage] = useState('en'); 

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
          <Route path="/admin" element={user?.role === 'admin' ? <AdminDashboard /> : <Navigate to="/login" />} />
          <Route path="/admin/create-event" element={user?.role === 'admin' ? <CreateEvent /> : <Navigate to="/login" />} />
          
          {/* Shared */}
          <Route path="/settings" element={user ? <Settings /> : <Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}

export default App;
