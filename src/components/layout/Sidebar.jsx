import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Toolbar,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Dashboard,
  LocalHospital,
  People,
  CalendarMonth,
  BarChart,
  ChevronLeft,
  ChevronRight,
  Person,
  Home,
} from '@mui/icons-material';

const drawerWidth = 260;
const collapsedWidth = 72;

const Sidebar = ({ open, onClose, collapsed, onToggleCollapse, user }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const menuItems = [
    { text: 'Dashboard', icon: <Home />, path: '/' },
    { text: 'Doctors', icon: <People />, path: '/doctors', roles: ['admin', 'receptionist', 'doctor'] },
    { text: 'Patients', icon: <LocalHospital />, path: '/patients', roles: ['admin', 'doctor'] },
    { text: 'Appointments', icon: <CalendarMonth />, path: '/appointments' },
    { text: 'Analytics', icon: <BarChart />, path: '/analytics', roles: ['admin'] },
    { text: 'Profile', icon: <Person />, path: '/profile' },
  ];

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const handleNavigation = (path) => {
    navigate(path);
    if (isMobile) {
      onClose();
    }
  };

  const drawerContent = (
    <Box sx={{ overflow: 'auto', pt: 1 }}>
      <List>
        {menuItems
          .filter((item) => !item.roles || item.roles.includes(user?.role))
          .map((item) => (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => handleNavigation(item.path)}
                selected={isActive(item.path)}
                sx={{
                  minHeight: 48,
                  justifyContent: collapsed ? 'center' : 'initial',
                  px: 2.5,
                  mx: 1,
                  borderRadius: 2,
                  transition: 'all 0.2s',
                  '&.Mui-selected': {
                    background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
                    color: 'white',
                    boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
                    '& .MuiListItemIcon-root': {
                      color: 'white',
                    },
                    '&:hover': {
                      background: 'linear-gradient(135deg, #4f46e5 0%, #db2777 100%)',
                    },
                  },
                  '&:hover': {
                    bgcolor: 'action.hover',
                    transform: 'translateX(4px)',
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: collapsed ? 0 : 2,
                    justifyContent: 'center',
                    color: isActive(item.path) ? 'white' : 'text.secondary',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                {!collapsed && (
                  <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{
                      fontWeight: isActive(item.path) ? 600 : 400,
                    }}
                  />
                )}
              </ListItemButton>
            </ListItem>
          ))}
      </List>
      
      {!isMobile && (
        <Box sx={{ mt: 'auto', p: 2 }}>
          <ListItemButton
            onClick={onToggleCollapse}
            sx={{
              borderRadius: 2,
              justifyContent: 'center',
              bgcolor: 'action.hover',
              transition: 'all 0.2s',
              '&:hover': {
                bgcolor: 'action.selected',
              },
            }}
          >
            {collapsed ? <ChevronRight /> : <ChevronLeft />}
          </ListItemButton>
        </Box>
      )}
    </Box>
  );

  // Mobile drawer
  if (isMobile) {
    return (
      <Drawer
        variant="temporary"
        open={open}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            bgcolor: 'background.default',
            borderRight: 1,
            borderColor: 'divider',
            top: 8,
            height: 'calc(100% - 16px)',
            borderRadius: 2,
            ml: 1,
          },
        }}
      >
        <Toolbar />
        {drawerContent}
      </Drawer>
    );
  }

  // Desktop drawer
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: collapsed ? collapsedWidth : drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: collapsed ? collapsedWidth : drawerWidth,
          boxSizing: 'border-box',
          bgcolor: 'background.default',
          borderRight: 1,
          borderColor: 'divider',
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        },
      }}
    >
      <Toolbar />
      {drawerContent}
    </Drawer>
  );
};

export default Sidebar;
