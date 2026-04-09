import React, { useState } from 'react';
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
  MenuItem as MuiMenuItem,
} from '@mui/material';
import {
  Notifications,
  Security,
  Palette,
  Language,
  Save,
} from '@mui/icons-material';
import { useThemeMode } from '../../context/ThemeContext.jsx';

const Settings = ({ user }) => {
  const { isDark, toggleTheme } = useThemeMode();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [twoFactor, setTwoFactor] = useState(false);

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
              <ListItem>
                <ListItemText primary="Two-Factor Authentication" secondary="Add an extra layer of security" />
                <ListItemSecondaryAction>
                  <Switch checked={twoFactor} onChange={(e) => setTwoFactor(e.target.checked)} color="primary" />
                </ListItemSecondaryAction>
              </ListItem>
              <ListItem>
                <ListItemText primary="Password" secondary="Change your account password" />
                <Button variant="outlined" size="small" sx={{ borderRadius: 2 }}>Update</Button>
              </ListItem>
            </List>
          </Paper>
        </Grid>

        {/* Regional Settings */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 3, height: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1.5 }}>
              <Language color="primary" />
              <Typography variant="h6" fontWeight={600}>Language & Region</Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <TextField select fullWidth label="Language" defaultValue="en" sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}>
              <MuiMenuItem value="en">English (US)</MuiMenuItem>
              <MuiMenuItem value="fr">French</MuiMenuItem>
              <MuiMenuItem value="rw">Kinyarwanda</MuiMenuItem>
            </TextField>
          </Paper>
        </Grid>

        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          <Button variant="contained" startIcon={<Save />} sx={{ px: 4, py: 1, borderRadius: 2, background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)', '&:hover': { background: 'linear-gradient(135deg, #4f46e5 0%, #db2777 100%)' } }}>
            Save Changes
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Settings;