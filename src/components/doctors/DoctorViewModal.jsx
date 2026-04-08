import React from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, Typography, Chip, Rating, Divider, Grid, Avatar,
} from '@mui/material';
import { CalendarMonth, School, Work, Phone, Email, AccessTime } from '@mui/icons-material';
import { formatDate } from '../../utils/validation.jsx';

const DoctorViewModal = ({ open, onClose, doctor }) => {
  if (!doctor) return null;
  const appointments = doctor.appointments || [];
  const upcomingAppointments = appointments.filter((apt) => apt.status === 'scheduled').sort((a, b) => new Date(a.date) - new Date(b.date)).slice(0, 5);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 3, boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)' } }}>
      <DialogTitle sx={{ 
        pb: 0,
        background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        fontWeight: 700,
      }}>Doctor Profile</DialogTitle>
      <DialogContent dividers>
        <Box className="doctor-profile">
          <Box className="doctor-profile-header">
            <Box className="doctor-profile-image">
              {doctor.profileImage ? <img src={doctor.profileImage} alt={doctor.name} /> : <Avatar sx={{ width: '100%', height: '100%', fontSize: '3rem', background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)' }}>{doctor.name?.charAt(0)}</Avatar>}
            </Box>
            <Box className="doctor-profile-info">
              <Typography variant="h4" component="h2" sx={{ fontWeight: 700 }}>{doctor.name}</Typography>
              <Typography variant="subtitle1" className="specialization" sx={{ color: 'primary.main', fontWeight: 500 }}>{doctor.specialization}</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Rating value={doctor.rating} precision={0.1} readOnly />
                <Typography variant="body2" sx={{ fontWeight: 600 }}>({doctor.rating})</Typography>
              </Box>
              <Chip label={doctor.status === 'available' ? 'Available' : 'Busy'} color={doctor.status === 'available' ? 'success' : 'warning'} size="small" sx={{ borderRadius: 2 }} />
            </Box>
          </Box>
          <Box className="doctor-profile-stats">
            <Box className="stat"><Typography className="value">{doctor.experience}</Typography><Typography className="label">Years Experience</Typography></Box>
            <Box className="stat"><Typography className="value">${doctor.consultationFee}</Typography><Typography className="label">Consultation Fee</Typography></Box>
            <Box className="stat"><Typography className="value">{doctor.availability?.length || 0}</Typography><Typography className="label">Days Available</Typography></Box>
          </Box>
          <Divider />
          <Box className="doctor-profile-details">
            <Typography variant="h6" sx={{ mb: 2, color: 'primary.main', fontWeight: 600 }}>Contact Information</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}><Email color="primary" /><Box><Typography variant="caption" color="text.secondary">Email</Typography><Typography variant="body2">{doctor.email}</Typography></Box></Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}><Phone color="primary" /><Box><Typography variant="caption" color="text.secondary">Phone</Typography><Typography variant="body2">{doctor.phone}</Typography></Box></Box>
              </Grid>
            </Grid>
          </Box>
          <Divider />
          <Box className="doctor-profile-details">
            <Typography variant="h6" sx={{ mb: 2, color: 'primary.main', fontWeight: 600 }}><School color="primary" sx={{ mr: 1, verticalAlign: 'middle' }} />Education</Typography>
            <Typography variant="body2" color="text.secondary">{doctor.education}</Typography>
          </Box>
          {doctor.workHistory && <><Divider /><Box className="doctor-profile-details"><Typography variant="h6" sx={{ mb: 2, color: 'primary.main', fontWeight: 600 }}><Work color="primary" sx={{ mr: 1, verticalAlign: 'middle' }} />Work History</Typography><Typography variant="body2" color="text.secondary">{doctor.workHistory}</Typography></Box></>}
          <Divider />
          <Box className="doctor-profile-details">
            <Typography variant="h6" sx={{ mb: 2, color: 'primary.main', fontWeight: 600 }}><AccessTime color="primary" sx={{ mr: 1, verticalAlign: 'middle' }} />Availability</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>{doctor.availability?.map((day) => <Chip key={day} label={day} size="small" variant="outlined" sx={{ borderRadius: 2 }} />)}</Box>
            <Typography variant="body2" color="text.secondary">Working Hours: {doctor.workingHours?.start} - {doctor.workingHours?.end}</Typography>
          </Box>
          <Divider />
          <Box className="doctor-profile-details">
            <Typography variant="h6" sx={{ mb: 2, color: 'primary.main', fontWeight: 600 }}><CalendarMonth color="primary" sx={{ mr: 1, verticalAlign: 'middle' }} />Upcoming Schedule</Typography>
            {upcomingAppointments.length > 0 ? <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>{upcomingAppointments.map((apt) => <Box key={apt.id} sx={{ p: 2, bgcolor: 'action.hover', borderRadius: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'all 0.2s', '&:hover': { bgcolor: 'action.selected' } }}><Box><Typography variant="body2" sx={{ fontWeight: 600 }}>{formatDate(apt.date)}</Typography><Typography variant="caption" color="text.secondary">{apt.time} ({apt.duration} min)</Typography></Box><Chip label={apt.status} size="small" color={apt.status === 'scheduled' ? 'info' : 'default'} sx={{ borderRadius: 2 }} /></Box>)}</Box> : <Typography variant="body2" color="text.secondary">No upcoming appointments scheduled</Typography>}
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}><Button onClick={onClose} variant="outlined" sx={{ borderRadius: 2 }}>Close</Button></DialogActions>
    </Dialog>
  );
};

export default DoctorViewModal;
