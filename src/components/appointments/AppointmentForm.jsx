import React, { useState, useEffect, useCallback } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Grid, Box, Divider, Typography, MenuItem, Alert, FormControl, InputLabel, Select } from '@mui/material';
import dataStore from '../../data/dataStore.jsx';
import { validateRequired } from '../../utils/validation.jsx';

const durationOptions = [{ value: 15, label: '15 minutes' }, { value: 30, label: '30 minutes' }, { value: 45, label: '45 minutes' }, { value: 60, label: '1 hour' }, { value: 90, label: '1.5 hours' }, { value: 120, label: '2 hours' }];
const statusOptions = [{ value: 'scheduled', label: 'Scheduled' }, { value: 'in-progress', label: 'In Progress' }, { value: 'completed', label: 'Completed' }, { value: 'cancelled', label: 'Cancelled' }];

const AppointmentForm = ({ open, onClose, onSave, appointment, onConflictError }) => {
  const isEdit = Boolean(appointment);
  const [formData, setFormData] = useState({ patientId: '', doctorId: '', date: '', time: '', duration: 30, status: 'scheduled', reason: '', notes: '' });
  const [errors, setErrors] = useState({});
  const [conflictError, setConflictError] = useState('');
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);

  const resetForm = () => { 
    setFormData({ patientId: '', doctorId: '', date: '', time: '', duration: 30, status: 'scheduled', reason: '', notes: '' }); 
    setErrors({}); 
    setConflictError(''); 
    setAvailableTimeSlots([]); 
  };

  useEffect(() => { if (open) { setDoctors(dataStore.getDoctors()); setPatients(dataStore.getPatients()); } }, [open]);
  useEffect(() => { if (appointment) setFormData({ ...appointment }); else resetForm(); }, [appointment, open]);

  const generateTimeSlots = useCallback(() => {
    const doctor = dataStore.getDoctorById(formData.doctorId);
    if (!doctor) return;
    const selectedDate = new Date(formData.date);
    const dayName = selectedDate.toLocaleDateString('en-US', { weekday: 'long' });
    if (!doctor.availability.includes(dayName)) { setAvailableTimeSlots([]); return; }
    const slots = [];
    const startHour = parseInt(doctor.workingHours.start.split(':')[0], 10);
    const endHour = parseInt(doctor.workingHours.end.split(':')[0], 10);
    for (let hour = startHour; hour < endHour; hour++) { for (let minute = 0; minute < 60; minute += 30) { slots.push(`${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`); } }
    const existingAppointments = dataStore.getAppointmentsByDoctor(formData.doctorId).filter((apt) => apt.date === formData.date && apt.id !== appointment?.id);
    const bookedTimes = existingAppointments.map((apt) => apt.time);
    setAvailableTimeSlots(slots.filter((slot) => !bookedTimes.includes(slot)));
  }, [formData.doctorId, formData.date, appointment?.id]);

  useEffect(() => { if (formData.doctorId && formData.date) generateTimeSlots(); }, [formData.doctorId, formData.date, generateTimeSlots]);

  const handleChange = (field) => (event) => {
    const value = event.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
    if (field === 'doctorId' || field === 'date') { setConflictError(''); setFormData((prev) => ({ ...prev, time: '' })); }
  };

  const validateForm = () => {
    const newErrors = {};
    const patientValidation = validateRequired(formData.patientId, 'Patient'); if (!patientValidation.isValid) newErrors.patientId = patientValidation.error;
    const doctorValidation = validateRequired(formData.doctorId, 'Doctor'); if (!doctorValidation.isValid) newErrors.doctorId = doctorValidation.error;
    const dateValidation = validateRequired(formData.date, 'Date'); if (!dateValidation.isValid) newErrors.date = dateValidation.error;
    const timeValidation = validateRequired(formData.time, 'Time'); if (!timeValidation.isValid) newErrors.time = timeValidation.error;
    const reasonValidation = validateRequired(formData.reason, 'Reason'); if (!reasonValidation.isValid) newErrors.reason = reasonValidation.error;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const checkConflict = () => {
    const hasConflict = dataStore.hasConflict(formData.doctorId, formData.date, formData.time, formData.duration, appointment?.id);
    if (hasConflict) { setConflictError('This time slot conflicts with an existing appointment. Please select a different time.'); return true; }
    return false;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    if (checkConflict()) { onConflictError?.('Time slot conflict detected. Please select a different time.'); return; }
    const appointmentData = { ...formData, duration: Number(formData.duration) };
    if (isEdit) dataStore.updateAppointment(appointment.id, appointmentData);
    else dataStore.addAppointment(appointmentData);
    onSave();
  };

  const getToday = () => new Date().toISOString().split('T')[0];
  const selectedDoctor = doctors.find((d) => d.id === formData.doctorId);
  const selectedDate = new Date(formData.date);
  const dayName = selectedDate.toLocaleDateString('en-US', { weekday: 'long' });
  const isDoctorAvailableOnDate = selectedDoctor?.availability.includes(dayName);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 3, boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)' } }}>
      <DialogTitle sx={{ 
        pb: 2,
        background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        fontWeight: 700,
      }}>
        {isEdit ? 'Edit Appointment' : 'Book New Appointment'}
      </DialogTitle>
      <DialogContent dividers>
        <Box sx={{ pt: 2 }}>
          {conflictError && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{conflictError}</Alert>}
          <Grid container spacing={3}>
            <Grid item xs={12}><Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: 'primary.main' }}>Appointment Details</Typography></Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={Boolean(errors.patientId)}><InputLabel>Patient *</InputLabel>
                <Select value={formData.patientId} onChange={handleChange('patientId')} label="Patient *" sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}>{patients.map((p) => <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>)}</Select>
                {errors.patientId && <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>{errors.patientId}</Typography>}
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={Boolean(errors.doctorId)}><InputLabel>Doctor *</InputLabel>
                <Select value={formData.doctorId} onChange={handleChange('doctorId')} label="Doctor *" sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}>{doctors.map((d) => <MenuItem key={d.id} value={d.id}>{d.name} - {d.specialization}</MenuItem>)}</Select>
                {errors.doctorId && <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>{errors.doctorId}</Typography>}
              </FormControl>
            </Grid>
            {formData.doctorId && <Grid item xs={12}><Alert severity={isDoctorAvailableOnDate ? "info" : "warning"} icon={<Typography>📅</Typography>} sx={{ borderRadius: 2 }}>{isDoctorAvailableOnDate ? `Dr. ${selectedDoctor?.name} is available on ${dayName}s` : `Dr. ${selectedDoctor?.name} is NOT available on ${dayName}. Please select a different date.`}<br />Regular hours: {selectedDoctor?.workingHours?.start} - {selectedDoctor?.workingHours?.end}</Alert></Grid>}
            <Grid item xs={12} md={4}><TextField fullWidth label="Date" type="date" value={formData.date} onChange={handleChange('date')} error={Boolean(errors.date)} helperText={errors.date} InputLabelProps={{ shrink: true }} inputProps={{ min: getToday() }} required sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} /></Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth error={Boolean(errors.time)}><InputLabel>Time *</InputLabel>
                <Select value={formData.time} onChange={handleChange('time')} label="Time *" disabled={!formData.date || !formData.doctorId || !isDoctorAvailableOnDate} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}>{availableTimeSlots.length > 0 ? availableTimeSlots.map((slot) => <MenuItem key={slot} value={slot}>{slot}</MenuItem>) : <MenuItem value="" disabled>{formData.date && formData.doctorId ? 'No available slots' : 'Select doctor and date first'}</MenuItem>}</Select>
                {errors.time && <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>{errors.time}</Typography>}
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}><FormControl fullWidth><InputLabel>Duration</InputLabel><Select value={formData.duration} onChange={handleChange('duration')} label="Duration" sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}>{durationOptions.map((opt) => <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>)}</Select></FormControl></Grid>
            <Grid item xs={12}><TextField fullWidth label="Reason for Visit *" value={formData.reason} onChange={handleChange('reason')} error={Boolean(errors.reason)} helperText={errors.reason} required placeholder="e.g., Annual checkup, Follow-up consultation" sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} /></Grid>
            <Grid item xs={12}><TextField fullWidth label="Additional Notes" value={formData.notes} onChange={handleChange('notes')} multiline rows={3} placeholder="Any additional information for the doctor..." sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} /></Grid>
            {isEdit && <Grid item xs={12}><Divider sx={{ my: 2 }} /><Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: 'primary.main' }}>Status Management</Typography><FormControl fullWidth><InputLabel>Status</InputLabel><Select value={formData.status} onChange={handleChange('status')} label="Status" sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}>{statusOptions.map((opt) => <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>)}</Select></FormControl></Grid>}
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}><Button onClick={onClose} variant="outlined" color="inherit" sx={{ borderRadius: 2 }}>Cancel</Button><Button onClick={handleSubmit} variant="contained" sx={{ borderRadius: 2, background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)', '&:hover': { background: 'linear-gradient(135deg, #4f46e5 0%, #db2777 100%)' } }}>{isEdit ? 'Update' : 'Book'} Appointment</Button></DialogActions>
    </Dialog>
  );
};

export default AppointmentForm;
