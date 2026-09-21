import React, { useState } from 'react';
import dataStore from '../../data/dataStore.jsx';
import PatientForm from '../patients/PatientForm.jsx';
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
  const [success, setSuccess] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [securityQuestion, setSecurityQuestion] = useState('');
  const [securityAnswer, setSecurityAnswer] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [registerOpen, setRegisterOpen] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const allUsers = dataStore.getAllUsers();
    const user = allUsers.find(u => 
      u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (!user) {
      setError('Invalid email or password.');
      setSuccess('');
      return;
    }

    setError('');
    setSuccess('');
    onLogin({ 
      id: user.id,
      role: user.role, 
      email: user.email, 
      name: user.name 
    });
  };

  const resetForgotPasswordState = () => {
    setShowForgotPassword(false);
    setResetEmail('');
    setSecurityQuestion('');
    setSecurityAnswer('');
    setNewPassword('');
    setError('');
  };

  const handleForgotPasswordSubmit = (e) => {
    e.preventDefault();

    if (!securityQuestion) {
      const user = dataStore.getUserByEmail(resetEmail);

      if (!user) {
        setError('No account matches that email.');
        setSuccess('');
        return;
      }

      if (!user.securityQuestion) {
        setError('This account does not have a security question configured.');
        setSuccess('');
        return;
      }

      setSecurityQuestion(user.securityQuestion);
      setError('');
      setSuccess('');
      return;
    }

    const user = dataStore.getUserByEmail(resetEmail);
    if (!user) {
      setError('No account matches that email.');
      setSuccess('');
      return;
    }

    if (String(user.securityAnswer || '').trim().toLowerCase() !== String(securityAnswer || '').trim().toLowerCase()) {
      setError('The security answer is incorrect.');
      setSuccess('');
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      setError('New password must be at least 6 characters long.');
      setSuccess('');
      return;
    }

    dataStore.updateUserPassword(resetEmail, newPassword);
    setError('');
    setPassword('');
    setSuccess('Password reset successful. Please sign in with your new password.');
    resetForgotPasswordState();
    setShowForgotPassword(false);
    setEmail(resetEmail);
    setPassword('');
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
        {success && <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }}>{success}</Alert>}

        {showForgotPassword ? (
          <Box component="form" onSubmit={handleForgotPasswordSubmit} noValidate>
            {!securityQuestion ? (
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                autoComplete="email"
              />
            ) : (
              <>
                <Alert severity="info" sx={{ mb: 2, borderRadius: 2 }}>
                  Security question: {securityQuestion}
                </Alert>
                <TextField
                  fullWidth
                  label="Answer to security question"
                  value={securityAnswer}
                  onChange={(e) => setSecurityAnswer(e.target.value)}
                  sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
                <TextField
                  fullWidth
                  type="password"
                  label="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  sx={{ mb: 3, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  autoComplete="new-password"
                />
              </>
            )}

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
                mb: 1.5,
                '&:hover': {
                  background: 'linear-gradient(135deg, #4f46e5 0%, #db2777 100%)',
                  boxShadow: '0 6px 16px rgba(99, 102, 241, 0.4)',
                  transform: 'translateY(-2px)',
                },
              }}
            >
              {securityQuestion ? 'Reset Password' : 'Continue'}
            </Button>

            <Button
              type="button"
              fullWidth
              variant="text"
              onClick={resetForgotPasswordState}
              sx={{ color: 'text.primary' }}
            >
              Back to Sign In
            </Button>
          </Box>
        ) : (
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

            <Button
              type="button"
              fullWidth
              variant="text"
              onClick={() => {
                setShowForgotPassword(true);
                setError('');
                setSuccess('');
                setResetEmail(email);
              }}
              sx={{ mt: 1.5, color: 'primary.main' }}
            >
              Forgot Password?
            </Button>

            <Button
              type="button"
              fullWidth
              variant="contained"
              onClick={() => setRegisterOpen(true)}
              sx={{
                mt: 1,
                borderRadius: 2,
                background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #4f46e5 0%, #db2777 100%)',
                },
              }}
            >
              Create Account
            </Button>
          </Box>
        )}

        <PatientForm
          open={registerOpen}
          onClose={() => setRegisterOpen(false)}
          onSave={() => {
            setRegisterOpen(false);
            setSuccess('Account created successfully. Please sign in with your new account.');
            setError('');
          }}
          patient={null}
        />
      </Paper>
    </Box>
  );
};

export default Login;
