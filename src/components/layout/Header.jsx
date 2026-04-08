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

  const [notifications, setNotifications] = React.useState([
    {
      id: 1,
      title: 'New Appointment',
      message: `${doctors.find((d) => d.id === 'd2')?.name || 'Dr. Paul Niyonzima'} has a new appointment with ${patients.find((p) => p.id === 'p1')?.name || 'Jean Baptiste Uwimana'}`,
      time: '5 mins ago',
      read: false,
      type: 'appointment',
    },
    {
      id: 2,
      title: 'Patient Registered',
      message: `New patient ${patients.find((p) => p.id === 'p2')?.name || 'Marie Mukamana'} has registered in the system`,
      time: '1 hour ago',
      read: false,
      type: 'patient',
    },
    {
      id: 3,
      title: 'Doctor Available',
      message: `${doctors.find((d) => d.id === 'd4')?.name || 'Dr. Joseph Bizimana'} is now available for consultations`,
      time: '2 hours ago',
      read: true,
      type: 'doctor',
    },
  ]);

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
    showNotification(notification.message, 'info');
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
          <MenuItem>
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
