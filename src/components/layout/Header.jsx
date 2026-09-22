import React from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Switch,
  FormControlLabel,
  Badge,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Menu as MenuIcon,
  DarkMode,
  LightMode,
  Notifications,
  Person,
  Settings,
  Logout,
  LocalHospital,
} from '@mui/icons-material';
import { useThemeMode } from '../../context/ThemeContext.jsx';
import { useNotification } from '../../context/NotificationContext.jsx';
import dataStore from '../../data/dataStore.jsx';
import { useLocation, useNavigate } from 'react-router-dom';

const Header = ({ onMenuClick, onLogout, user }) => {
  const { toggleTheme, isDark } = useThemeMode();
  const { showNotification } = useNotification();
  const location = useLocation();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [notificationAnchor, setNotificationAnchor] = React.useState(null);

  const doctors = dataStore.getDoctors();
  const patients = dataStore.getPatients();

  const buildNotifications = React.useCallback(() => {
    const allAppointments = dataStore.getAppointments();
    const allPatients = dataStore.getPatients();
    const allDoctors = dataStore.getDoctors();

    if (user?.role === 'admin') {
      const pendingRequests = allAppointments
        .filter((appointment) => appointment.status === 'pending')
        .sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date));

      const patientAlerts = allPatients.slice(0, 2).map((patient) => ({
        id: `patient-${patient.id}`,
        title: 'Patient Registered',
        message: `${patient.name} has registered in the system.`,
        time: 'Recently',
        read: false,
        type: 'patient',
      }));

      const doctorAlerts = allDoctors
        .filter((doctor) => doctor.status === 'available')
        .slice(0, 2)
        .map((doctor) => ({
          id: `doctor-${doctor.id}`,
          title: 'Doctor Available',
          message: `${doctor.name} is available for consultations.`,
          time: 'Available now',
          read: true,
          type: 'doctor',
        }));

      const pendingAlerts = pendingRequests.slice(0, 5).map((appointment) => {
        const patient = dataStore.getPatientById(appointment.patientId);
        const doctor = dataStore.getDoctorById(appointment.doctorId);
        return {
          id: `appointment-${appointment.id}`,
          title: 'Appointment Request',
          message: `${patient?.name || 'A patient'} requested an appointment with ${doctor?.name || 'a doctor'} on ${new Date(appointment.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}.`,
          time: 'Pending approval',
          read: false,
          type: 'appointment',
          appointmentId: appointment.id,
        };
      });

      return [...pendingAlerts, ...patientAlerts, ...doctorAlerts].slice(0, 8);
    }

    if (user?.role === 'doctor') {
      const doctorAppointments = allAppointments
        .filter((appointment) => appointment.doctorId === user.id)
        .sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date));

      return doctorAppointments.map((appointment) => {
        const patient = dataStore.getPatientById(appointment.patientId);
        const title = appointment.status === 'pending' ? 'Appointment Request' : appointment.status === 'approved' ? 'Appointment Approved' : 'Appointment Update';
        const message = appointment.status === 'pending'
          ? `${patient?.name || 'A patient'} requested an appointment for ${new Date(appointment.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} at ${appointment.time}.`
          : `${patient?.name || 'A patient'} appointment has been updated to ${appointment.status}.`;

        return {
          id: `doctor-${appointment.id}`,
          title,
          message,
          time: appointment.status === 'pending' ? 'Pending approval' : appointment.status,
          read: appointment.status !== 'pending',
          type: 'appointment',
          appointmentId: appointment.id,
        };
      });
    }

    if (user?.role === 'patient') {
      const myAppointments = allAppointments
        .filter((appointment) => appointment.patientId === user.id)
        .sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date));

      return myAppointments.map((appointment) => {
        const doctor = dataStore.getDoctorById(appointment.doctorId);
        const title = appointment.status === 'pending' ? 'Appointment Pending' : appointment.status === 'approved' ? 'Appointment Approved' : 'Appointment Update';
        const message = appointment.status === 'pending'
          ? `Your appointment request with ${doctor?.name || 'your doctor'} is waiting for approval.`
          : appointment.status === 'approved'
            ? `Your appointment with ${doctor?.name || 'your doctor'} has been approved.`
            : `Your appointment with ${doctor?.name || 'your doctor'} was updated to ${appointment.status}.`;

        return {
          id: `patient-${appointment.id}`,
          title,
          message,
          time: appointment.status,
          read: appointment.status === 'approved',
          type: 'appointment',
          appointmentId: appointment.id,
        };
      });
    }

    return [];
  }, [user]);

  const [notifications, setNotifications] = React.useState(() => buildNotifications());

  React.useEffect(() => {
    setNotifications(buildNotifications());
  }, [buildNotifications]);

  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name[0].toUpperCase();
  };

  const getPageTitle = () => {
    const path = location.pathname;
    switch (path) {
      case '/':
        return 'Dashboard';
      case '/doctors':
        return 'Doctor Management';
      case '/patients':
        return 'Patient Management';
      case '/appointments':
        return 'Appointment Scheduling';
      case '/analytics':
        return 'Analytics Dashboard';
      case '/profile':
        return 'My Profile';
      case '/settings':
        return 'System Settings';
      default:
        return 'Doctor Appointment System';
    }
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationOpen = (event) => {
    setNotificationAnchor(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchor(null);
  };

  const handleNotificationClick = (notification) => {
    setNotifications((prev) => prev.map((item) => item.id === notification.id ? { ...item, read: true } : item));
    if (notification.appointmentId && user?.role === 'doctor') {
      navigate('/appointments');
    } else {
      showNotification(notification.message, 'info');
    }
    setNotificationAnchor(null);
  };

  const isMenuOpen = Boolean(anchorEl);
  const isNotificationOpen = Boolean(notificationAnchor);

  return (
    <AppBar 
      position="fixed" 
      elevation={0}
      sx={{ 
        bgcolor: 'background.paper',
        borderBottom: 1,
        borderColor: 'divider',
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backdropFilter: 'blur(10px)',
        background: (theme) => isDark 
          ? 'rgba(18, 18, 18, 0.8)' 
          : 'rgba(255, 255, 255, 0.8)',
      }}
    >
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={onMenuClick}
          sx={{ 
            mr: 2, 
            display: { md: 'none' },
            color: 'text.primary',
            '&:hover': {
              bgcolor: 'action.hover',
              borderRadius: 2,
            },
          }}
        >
          <MenuIcon />
        </IconButton>
        
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
          onClick={() => navigate('/')}
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
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 700,
              background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              display: { xs: 'none', sm: 'block' }
            }}
          >
            Doctor Appointment System
          </Typography>
        </Box>

        <Typography 
          variant="h6" 
          sx={{ 
            flexGrow: 1, 
            ml: 3,
            color: 'text.primary',
            fontWeight: 600,
            display: { xs: 'none', lg: 'block' }
          }}
        >
          {getPageTitle()}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FormControlLabel
            control={
              <Switch
                checked={isDark}
                onChange={toggleTheme}
                color="primary"
                size="small"
                sx={{
                  '& .MuiSwitch-switchBase.Mui-checked': {
                    color: '#6366f1',
                  },
                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                    bgcolor: '#6366f1',
                  },
                }}
              />
            }
            label={isDark ? <DarkMode fontSize="small" /> : <LightMode fontSize="small" />}
            sx={{ mr: 1 }}
          />

          <IconButton 
            color="inherit" 
            sx={{ 
              color: 'text.secondary',
              '&:hover': {
                bgcolor: 'action.hover',
                borderRadius: 2,
              },
            }}
            onClick={handleNotificationOpen}
          >
            <Badge badgeContent={notifications.filter(n => !n.read).length} color="error">
              <Notifications />
            </Badge>
          </IconButton>

          <IconButton
            onClick={handleProfileMenuOpen}
            size="small"
            sx={{ 
              ml: 1,
              '&:hover': {
                bgcolor: 'action.hover',
                borderRadius: 2,
              },
            }}
          >
            <Avatar 
              sx={{ 
                width: 40, 
                height: 40, 
                background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
                fontSize: '0.875rem',
                fontWeight: 600,
              }}
            >
              {getInitials(user?.name)}
            </Avatar>
          </IconButton>
        </Box>

        <Menu
          anchorEl={anchorEl}
          open={isMenuOpen}
          onClose={handleProfileMenuClose}
          onClick={handleProfileMenuClose}
          PaperProps={{
            elevation: 3,
            sx: { minWidth: 200, mt: 1 }
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <Box sx={{ p: 1.5, borderBottom: 1, borderColor: 'divider' }}>
            <Typography variant="subtitle2" fontWeight={700}>
              {user?.name || 'User'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
            </Typography>
          </Box>
          <MenuItem onClick={() => navigate('/profile')}>
            <ListItemIcon>
              <Person fontSize="small" />
            </ListItemIcon>
            <ListItemText>Profile</ListItemText>
          </MenuItem>
          <MenuItem onClick={() => navigate('/settings')}>
            <ListItemIcon>
              <Settings fontSize="small" />
            </ListItemIcon>
            <ListItemText>Settings</ListItemText>
          </MenuItem>
          <Divider />
          <MenuItem onClick={onLogout}>
            <ListItemIcon>
              <Logout fontSize="small" />
            </ListItemIcon>
            <ListItemText>Logout</ListItemText>
          </MenuItem>
        </Menu>

        <Menu
          anchorEl={notificationAnchor}
          open={isNotificationOpen}
          onClose={handleNotificationClose}
          PaperProps={{
            elevation: 3,
            sx: { minWidth: 350, mt: 1, maxHeight: 400 }
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <Box sx={{ p: 2, fontWeight: 600, fontSize: '1rem', bgcolor: 'action.hover' }}>
            Notifications
          </Box>
          <Divider />
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <Box key={notification.id}>
                <MenuItem 
                  onClick={() => handleNotificationClick(notification)}
                  sx={{ 
                    p: 1.5,
                    bgcolor: notification.read ? 'transparent' : 'action.hover',
                    '&:hover': {
                      bgcolor: 'action.selected'
                    }
                  }}
                >
                  <Box sx={{ width: '100%' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 0.5 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {notification.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                        {notification.time}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem' }}>
                      {notification.message}
                    </Typography>
                  </Box>
                </MenuItem>
                <Divider sx={{ my: 0 }} />
              </Box>
            ))
          ) : (
            <MenuItem disabled>
              <Typography variant="body2" color="text.secondary">No notifications</Typography>
            </MenuItem>
          )}
          <Divider />
          <MenuItem sx={{ p: 1, justifyContent: 'center', color: 'primary.main' }}>
            <Typography variant="body2">View All Notifications</Typography>
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
