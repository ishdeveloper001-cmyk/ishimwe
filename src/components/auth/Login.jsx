import React, { useState } from 'react';
import dataStore from '../../data/dataStore.jsx';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
} from '@mui/material';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const allUsers = dataStore.getAllUsers();
    const user = allUsers.find(u => 
      u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (!user) {
      setError('Invalid email or password.');
      return;
    }

    setError('');
    onLogin({ 
      id: user.id,
      role: user.role, 
      email: user.email, 
      name: user.name 
    });
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
        background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
      }}
    >
      <Paper sx={{ width: '100%', maxWidth: 420, p: 4, borderRadius: 3, boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)' }} elevation={3}>
        <Typography variant="h5" fontWeight={700} gutterBottom sx={{ 
          background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}>
          Clinic Login
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          Sign in with your email and password.
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            autoComplete="email"
          />

          <TextField
            fullWidth
            type="password"
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ mb: 3, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            autoComplete="current-password"
          />

          <Button 
            type="submit" 
            variant="contained" 
            fullWidth
            sx={{
              borderRadius: 2,
              background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
              boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
              transition: 'all 0.2s',
              py: 1.5,
              '&:hover': {
                background: 'linear-gradient(135deg, #4f46e5 0%, #db2777 100%)',
                boxShadow: '0 6px 16px rgba(99, 102, 241, 0.4)',
                transform: 'translateY(-2px)',
              },
            }}
          >
            Sign In
          </Button>

          {/* {/* <Box mt={3}>
             <Typography variant="subtitle2" mb={1} sx={{ fontWeight: 600, textAlign: 'center' }}>
               Sample credentials
             </Typography>
             <Typography variant="caption" display="block" sx={{ textAlign: 'center', mb: 0.5 }}>
               Admin: ishimwe@clinic.com / admin123
             </Typography>
             <Typography variant="caption" display="block" sx={{ textAlign: 'center', mb: 0.5 }}>
               Use mock doctors/patients from lists
             </Typography>
           </Box> */}
        </Box> 
      </Paper>
    </Box>
  );
};

export default Login;
