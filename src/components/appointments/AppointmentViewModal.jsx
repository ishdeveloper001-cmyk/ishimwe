import React from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, Typography, Chip, Divider, Grid, Avatar,
} from '@mui/material';
import { CalendarMonth, Person, LocalHospital, AccessTime, Notes } from '@mui/icons-material';
import dataStore from '../../data/dataStore.jsx';

const AppointmentViewModal = ({ open, onClose, appointment }) => {
  if (!appointment) return null;

  const doctor = dataStore.getDoctorById(appointment.doctorId);
  const patient = dataStore.getPatientById(appointment.patientId);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };

  const formatTime = (timeString) => {
    if (!timeString) return 'N/A';
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled': return 'info';
      case 'completed': return 'success';
      case 'cancelled': return 'error';
      case 'in-progress': return 'warning';
      default: return 'default';
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 2 } }}>
      <DialogTitle sx={{ pb: 0 }}>Appointment Details</DialogTitle>
      <DialogContent dividers>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <CalendarMonth color="primary" sx={{ fontSize: 32 }} />
            <Box>
              <Typography variant="h6">{formatDate(appointment.date)}</Typography>
              <Typography variant="body2" color="text.secondary">{formatTime(appointment.time)}</Typography>
            </Box>
            <Chip label={appointment.status} color={getStatusColor(appointment.status)} size="small" sx={{ ml: 'auto' }} />
          </Box>

          <Divider />

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'primary.main', width: 44, height: 44 }}>
                  <Person />
                </Avatar>
                <Box>
                  <Typography variant="caption" color="text.secondary">Patient</Typography>
                  <Typography variant="body1" fontWeight={600}>{patient?.name || 'Unknown'}</Typography>
                  <Typography variant="body2" color="text.secondary">{patient?.email || ''}</Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'secondary.main', width: 44, height: 44 }}>
                  <LocalHospital />
                </Avatar>
                <Box>
                  <Typography variant="caption" color="text.secondary">Doctor</Typography>
                  <Typography variant="body1" fontWeight={600}>{doctor?.name || 'Unknown'}</Typography>
                  <Typography variant="body2" color="text.secondary">{doctor?.specialization || ''}</Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>

          <Divider />

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <AccessTime color="primary" />
            <Box>
              <Typography variant="caption" color="text.secondary">Duration</Typography>
              <Typography variant="body1">{appointment.duration} minutes</Typography>
            </Box>
          </Box>

          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Notes color="primary" />
              <Typography variant="caption" color="text.secondary">Reason for Visit</Typography>
            </Box>
            <Typography variant="body1" sx={{ pl: 4 }}>{appointment.reason}</Typography>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} variant="outlined">Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AppointmentViewModal;
