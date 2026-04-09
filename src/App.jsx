import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Box, Toolbar, Typography } from '@mui/material';
import { ThemeProvider } from './context/ThemeContext.jsx';
import { NotificationProvider } from './context/NotificationContext.jsx';
import Header from './components/layout/Header.jsx';
import Sidebar from './components/layout/Sidebar.jsx';
import Login from './components/auth/Login.jsx';
import Dashboard from './components/dashboard/Dashboard.jsx';
import DoctorList from './components/doctors/DoctorList.jsx';
import PatientList from './components/patients/PatientList.jsx';
import AppointmentList from './components/appointments/AppointmentList.jsx';
import Analytics from './components/analytics/Analytics.jsx';
import Profile from './components/profile/Profile.jsx';
import Settings from './components/settings/Settings.jsx';

const drawerWidth = 260;
const collapsedWidth = 72;

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('clinic-user');
    return saved ? JSON.parse(saved) : null;
  });

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSidebarCollapse = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('clinic-user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('clinic-user');
  };

  if (!user) {
    return (
      <ThemeProvider>
        <Login onLogin={handleLogin} />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <NotificationProvider>
        <Router>
          <Box sx={{ display: 'flex', minHeight: '100vh' }}>
            <Header onMenuClick={handleSidebarToggle} onLogout={handleLogout} user={user} />
            <Sidebar
              open={sidebarOpen}
              onClose={handleSidebarClose}
              collapsed={sidebarCollapsed}
              onToggleCollapse={handleSidebarCollapse}
              user={user}
            />
            <Box
              component="main"
              sx={{
                flexGrow: 1,
                p: 3,
                ml: { md: `${collapsedWidth}px` },
                transition: 'margin-left 225ms cubic-bezier(0.4, 0, 0.6, 1) 0ms',
                marginLeft: sidebarCollapsed ? `${collapsedWidth}px` : `${drawerWidth}px`,
                bgcolor: 'background.default',
                minHeight: '100vh',
                '@media (max-width: 899px)': {
                  ml: 0,
                },
              }}
            >
              <Toolbar />
              <Routes>
                <Route path="/" element={<Dashboard />} />
                {user.role !== 'patient' && <Route path="/doctors" element={<DoctorList user={user} />} />}
{['admin', 'doctor'].includes(user.role) && <Route path="/patients" element={<PatientList user={user} />} />}
                <Route path="/appointments" element={<AppointmentList user={user} />} />
                {user.role === 'admin' && <Route path="/analytics" element={<Analytics />} />}
                <Route path="/profile" element={<Profile user={user} />} />
                <Route path="/settings" element={<Settings user={user} onLogout={handleLogout} />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
              {/* Footer */}
              <Box
                component="footer"
                sx={{
                  mt: 4, // Margin top to separate from content
                  py: 3, // Padding top and bottom
                  px: 2, // Padding left and right
                  bgcolor: 'background.paper', // Use theme's paper background
                  borderTop: 1, // Top border
                  borderColor: 'divider', // Divider color
                  textAlign: 'center',
                  color: 'text.secondary',
                  fontSize: '0.8rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 0.5,
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  Designed by ISHIMWE Jean D'Amour &copy; {new Date().getFullYear()} All rights reserved.
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Contact me on <a href="https://wa.me/250792538516" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'underline' }}>+250 792 538 516</a> on WhatsApp.
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  My website: <a href="http://ishimwe-profile.surge.sh" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'underline' }}>ishimwe.surge.sh</a>
                </Typography>
              </Box>
            </Box>
          </Box>
        </Router>
      </NotificationProvider>
    </ThemeProvider>
  );
}

export default App;
