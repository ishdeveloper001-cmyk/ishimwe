import React, { useState } from 'react';
import dataStore from '../../data/dataStore.jsx';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Switch,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem as MuiMenuItem,
} from '@mui/material';
import {
  Notifications,
  Security,
  Palette,
  Person as PersonIcon, // Renamed to avoid conflict with Person from Profile
  Save,
  Logout,

} from '@mui/icons-material';
import { useThemeMode } from '../../context/ThemeContext.jsx';
import { useNotification } from '../../context/NotificationContext.jsx';

const Settings = ({ user, onLogout }) => {
  const { isDark, toggleTheme } = useThemeMode();
  const { showNotification } = useNotification();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [twoFactor, setTwoFactor] = useState(false);

  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [passwordData, setPasswordData] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordUpdate = async () => {
    // Find user in dataStore
    const allUsers = dataStore.getAllUsers();
    const currentUser = allUsers.find(u => u.email === user.email && u.role === user.role);

    // Verify current password
    if (!currentUser || passwordData.current !== currentUser.password) {
      showNotification('Current password is incorrect.', 'error');
      return;
    }

    // Update user password in dataStore
    if (currentUser.id) {
      if (user.role === 'doctor') {
        dataStore.updateDoctor(currentUser.id, { password: passwordData.new });
      } else if (user.role === 'patient') {
        dataStore.updatePatient(currentUser.id, { password: passwordData.new });
      }
    }

    showNotification('Password updated successfully! Use your new password for future logins.', 'success');
    setPasswordDialogOpen(false);
    setPasswordData({ current: '', new: '', confirm: '' });
  };

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Typography variant="h4" sx={{ 
        mb: 4, 
        fontWeight: 700,
        background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
      }}>
        Settings
      </Typography>

      <Grid container spacing={3}>
        {/* Appearance Settings */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 3, height: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1.5 }}>
              <Palette color="primary" />
              <Typography variant="h6" fontWeight={600}>Appearance</Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <List disablePadding>
              <ListItem>
                <ListItemText primary="Dark Mode" secondary="Toggle between light and dark theme" />
                <ListItemSecondaryAction>
                  <Switch checked={isDark} onChange={toggleTheme} color="primary" />
                </ListItemSecondaryAction>
              </ListItem>
            </List>
          </Paper>
        </Grid>

        {/* Notification Settings */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 3, height: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1.5 }}>
              <Notifications color="primary" />
              <Typography variant="h6" fontWeight={600}>Notifications</Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <List disablePadding>
              <ListItem>
                <ListItemText primary="Email Notifications" secondary="Receive appointment updates via email" />
                <ListItemSecondaryAction>
                  <Switch checked={emailNotifications} onChange={(e) => setEmailNotifications(e.target.checked)} color="primary" />
                </ListItemSecondaryAction>
              </ListItem>
              <ListItem>
                <ListItemText primary="SMS Notifications" secondary="Receive reminders via text message" />
                <ListItemSecondaryAction>
                  <Switch checked={smsNotifications} onChange={(e) => setSmsNotifications(e.target.checked)} color="primary" />
                </ListItemSecondaryAction>
              </ListItem>
            </List>
          </Paper>
        </Grid>

        {/* Security Settings */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 3, height: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1.5 }}>
              <Security color="primary" />
              <Typography variant="h6" fontWeight={600}>Security</Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <List disablePadding>
              {/* <ListItem>
                <ListItemText primary="Two-Factor Authentication" secondary="Add an extra layer of security" />
                <ListItemSecondaryAction>
                  <Switch checked={twoFactor} onChange={(e) => setTwoFactor(e.target.checked)} color="primary" />
                </ListItemSecondaryAction>
              </ListItem> */}
              <ListItem>
                <ListItemText primary="Password" secondary="Change your account password" />
                <Button 
                  variant="outlined" 
                  size="small" 
                  sx={{ borderRadius: 2 }}
                  onClick={() => setPasswordDialogOpen(true)}
                >
                  Update
                </Button>
              </ListItem>
            </List>
          </Paper>
        </Grid>

        {/* Regional Settings */}
        <Grid item xs={12} md={6}> {/* This is the Paper you wanted to change */}
          <Paper sx={{ p: 3, borderRadius: 3, height: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1.5 }}>
              <PersonIcon color="primary" /> {/* Changed icon */}
              <Typography variant="h6" fontWeight={600}>Account Information</Typography> {/* Changed title */}
            </Box>
            <Divider sx={{ mb: 2 }} />
            <List disablePadding>
              <ListItem>
                <ListItemText primary="Username" secondary={user?.name || 'N/A'} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Email" secondary={user?.email || 'N/A'} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Role" secondary={user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1) || 'N/A'} />
              </ListItem>
              <Divider sx={{ my: 1 }} />
              <ListItem>
                <Button variant="outlined" startIcon={<Logout />} onClick={onLogout} fullWidth sx={{ borderRadius: 2 }}>
                  Logout
                </Button>
              </ListItem>
            </List>
          </Paper>
        </Grid>

        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          <Button variant="contained" startIcon={<Save />} sx={{ px: 4, py: 1, borderRadius: 2, background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)', '&:hover': { background: 'linear-gradient(135deg, #4f46e5 0%, #db2777 100%)' } }}>
            Save Changes
          </Button>
        </Grid>
      </Grid>

      {/* Change Password Dialog */}
      <Dialog 
        open={passwordDialogOpen} 
        onClose={() => setPasswordDialogOpen(false)}
        PaperProps={{ sx: { borderRadius: 3, width: '100%', maxWidth: 400 } }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Change Password</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              type="password"
              label="Current Password"
              name="current"
              value={passwordData.current}
              onChange={handlePasswordChange}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
            <TextField
              fullWidth
              type="password"
              label="New Password"
              name="new"
              value={passwordData.new}
              onChange={handlePasswordChange}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
            <TextField
              fullWidth
              type="password"
              label="Confirm New Password"
              name="confirm"
              value={passwordData.confirm}
              onChange={handlePasswordChange}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setPasswordDialogOpen(false)} color="inherit">
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={handlePasswordUpdate}
            disabled={!passwordData.current || !passwordData.new || passwordData.new !== passwordData.confirm}
            sx={{ 
              borderRadius: 2,
              background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)'
            }}
          >
            Update Password
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Settings;