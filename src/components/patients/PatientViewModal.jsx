import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Avatar,
  Divider,
  Chip,
} from '@mui/material';
import dataStore from '../../data/dataStore.jsx';

const PatientViewModal = ({ open, onClose, patientId, user }) => {
  const patient = dataStore.getPatientById(patientId);

  if (!patient) {
    return null;
  }

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  const calculateAge = (dateOfBirth) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) age--;
    return age;
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
        }
      }}
    >
      <DialogTitle sx={{ 
        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        color: 'white',
        fontWeight: 600,
        py: 2.5,
      }}>
        Patient Details
      </DialogTitle>
      <DialogContent sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4, alignItems: 'flex-start' }}>
          {/* Profile Section */}
          <Box sx={{ flex: 1, textAlign: 'center' }}>
            <Avatar 
              sx={{ 
                width: 100, 
                height: 100, 
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                fontSize: '2.5rem',
                mx: 'auto',
                fontWeight: 600,
                boxShadow: '0 4px 16px rgba(16, 185, 129, 0.4)',
              }}
            >
              {patient.name.split(' ').map(n => n[0]).join('').toUpperCase()}
            </Avatar>
            <Typography variant="h6" sx={{ mt: 2, fontWeight: 700, color: 'text.primary' }}>
              {patient.name}
            </Typography>
            <Chip 
              label={`Age ${calculateAge(patient.dateOfBirth)}`} 
              size="small" 
              sx={{ mt: 1, fontWeight: 600 }} 
              color="success" 
              variant="filled"
            />
            <Chip 
              label={patient.gender} 
              size="small" 
              sx={{ mt: 1, ml: 1 }} 
              color="primary" 
              variant="outlined"
            />
          </Box>

          {/* Details Section */}
          <Box sx={{ flex: 2 }}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1.5, color: 'text.secondary' }}>
                Contact Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography><strong>Email:</strong> {patient.email}</Typography>
                <Typography><strong>Phone:</strong> {patient.phone}</Typography>
                <Typography><strong>Address:</strong> {patient.address || 'Not specified'}</Typography>
              </Box>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1.5, color: 'text.secondary' }}>
                Medical Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography><strong>Date of Birth:</strong> {formatDate(patient.dateOfBirth)}</Typography>
                <Typography><strong>Registered:</strong> {formatDate(patient.registrationDate)}</Typography>
                <Typography><strong>Blood Group:</strong> {patient.bloodGroup || 'Not specified'}</Typography>
                <Typography><strong>Allergies:</strong> {patient.allergies || 'None'}</Typography>
              </Box>
            </Box>

            {patient.medicalHistory && (
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1.5, color: 'text.secondary' }}>
                  Medical History
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Typography sx={{ lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                  {patient.medicalHistory}
                </Typography>
              </Box>
            )}

            {user?.role === 'admin' && (
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1.5, color: 'text.secondary' }}>
                  Account Credentials (Admin Only)
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Typography><strong>Password:</strong> <Chip label={patient.password || '***'} size="small" color="info" variant="outlined" sx={{ ml: 1 }} /></Typography>
                  <Typography><strong>Last Changed:</strong> {patient.passwordChangedAt ? formatDate(patient.passwordChangedAt) : 'Original (never changed)'}</Typography>
                </Box>
              </Box>
            )}
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 3, gap: 1 }}>
        <Button 
          onClick={onClose} 
          variant="outlined" 
          sx={{
            borderRadius: 2,
            fontWeight: 600,
            px: 4,
            transition: 'all 0.2s ease',
            '&:hover': {
              transform: 'translateY(-1px)',
            },
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PatientViewModal;
