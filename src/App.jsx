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
import { LocalHospital } from '@mui/icons-material';

const drawerWidth = 260;
const collapsedWidth = 72;

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('clinic-user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
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
    localStorage.removeItem('clinic-credentials');
    // Redirect to login implicitly via !user check
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
                pb: '140px', // Extra for fixed footer (~64px + padding)
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
            </Box>

            {/* Fixed Footer - Mirroring Header style */}
            <Box
              component="footer"
              sx={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                zIndex: (theme) => theme.zIndex.appBar - 1,
                bgcolor: 'background.paper',
                borderTop: 1,
                borderColor: 'divider',
                backdropFilter: 'blur(10px)',
                background: (theme) => theme.palette.mode === 'dark' 
                  ? 'rgba(18, 18, 18, 0.8)' 
                  : 'rgba(255, 255, 255, 0.8)',
                pb: 3,
              }}
            >
              <Box
                component="Toolbar"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 2,
                  flexWrap: 'wrap',
                  px: 3,
                  py: 1.5,
                }}
              >
                {/* Icon matching Header */}
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    cursor: 'pointer',
                    px: 1,
                    py: 0.5,
                    borderRadius: 2,
                    transition: 'all 0.2s',
                    '&:hover': {
                      bgcolor: 'action.hover',
                    },
                  }}
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                >
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: 2,
                      background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <LocalHospital sx={{ fontSize: 24, color: 'white' }} />
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.25 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                    Designed by ISHIMWE Jean D'Amour © {new Date().getFullYear()}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Contact: <a href="https://wa.me/250792538516" target="_blank" rel="noopener noreferrer" style={{ color: 'primary.main', textDecoration: 'none', fontWeight: 500 }}>WhatsApp</a> |{' '}
                    <a href="http://ishimwe-profile.surge.sh" target="_blank" rel="noopener noreferrer" style={{ color: 'primary.main', textDecoration: 'none', fontWeight: 500 }}>Portfolio</a>
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Router>
      </NotificationProvider>
    </ThemeProvider>
  );
}

export default App;
