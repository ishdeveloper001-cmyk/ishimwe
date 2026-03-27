import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  MenuItem,
  Alert,
} from '@mui/material';

const roleOptions = [
  { value: 'admin', label: 'Admin' },
  { value: 'doctor', label: 'Doctor' },
  { value: 'patient', label: 'Patient' },
];

const sampleUsers = {
  admin: { email: 'ishimwe@clinic.com', password: 'admin123', name: 'Ishimwe' },
  doctor: { email: 'kwizera@clinic.com', password: 'doctor123', name: 'Dr. Kwizera' },
  patient: { email: 'uwamahoro@clinic.com', password: 'patient123', name: 'Uwamahoro' },
};

const Login = ({ onLogin }) => {
  const [role, setRole] = useState('admin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const user = sampleUsers[role];

    if (!user) {
      setError('Invalid role selected.');
      return;
    }
    if (email.toLowerCase() !== user.email || password !== user.password) {
      setError('Invalid credentials. Use sample credentials listed below.');
      return;
    }

    setError('');
    onLogin({ role, email: user.email, name: user.name });
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        px: 2,
      }}
    >
      <Paper sx={{ width: '100%', maxWidth: 420, p: 4, borderRadius: 2 }} elevation={3}>
        <Typography variant="h5" fontWeight={700} gutterBottom>
          Login
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          Choose your role and sign in with sample credentials.
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            fullWidth
            select
            label="Role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            sx={{ mb: 2 }}
          >
            {roleOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            fullWidth
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ mb: 2 }}
            autoComplete="email"
          />

          <TextField
            fullWidth
            type="password"
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ mb: 2 }}
            autoComplete="current-password"
          />

          <Button type="submit" variant="contained" fullWidth>
            Sign In
          </Button>

           <Box mt={2}>
             <Typography variant="subtitle2" mb={1}>
               Sample credentials
             </Typography>
             <Typography variant="caption" display="block">
               Admin: ishimwe@clinic.com / admin123
             </Typography>
             <Typography variant="caption" display="block">
               Doctor: kwizera@clinic.com / doctor123
             </Typography>
             <Typography variant="caption" display="block">
               Patient: uwamahoro@clinic.com / patient123
             </Typography>
           </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default Login;
