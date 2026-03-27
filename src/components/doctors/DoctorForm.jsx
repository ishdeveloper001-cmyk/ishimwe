import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  MenuItem,
  Box,
  Divider,
  Typography,
  FormControl,
  InputLabel,
  Select,
  OutlinedInput,
  Checkbox,
  ListItemText,
} from '@mui/material';
import dataStore from '../../data/dataStore.jsx';
import { validateEmail, validatePhone, validateRequired } from '../../utils/validation.jsx';
import ImageUpload from '../common/ImageUpload.jsx';

const specializations = [
  'Cardiology', 'Neurology', 'Pediatrics', 'Orthopedics',
  'Dermatology', 'General Medicine', 'Ophthalmology', 'Psychiatry', 'Oncology', 'Radiology'
];

const availabilityOptions = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const statusOptions = [
  { value: 'available', label: 'Available' },
  { value: 'busy', label: 'Busy' },
  { value: 'offline', label: 'Offline' },
];

const DoctorForm = ({ open, onClose, onSave, doctor }) => {
  const isEdit = Boolean(doctor);
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', specialization: '', experience: '',
    rating: '', consultationFee: '', status: 'available', education: '',
    workHistory: '', profileImage: null, availability: [],
    workingHours: { start: '09:00', end: '17:00' },
  });
  const [errors, setErrors] = useState({});
  const [imageError, setImageError] = useState('');
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (doctor) {
      setFormData({ ...doctor, profileImage: doctor.profileImage || null });
      setImagePreview(doctor.profileImage || null);
    } else {
      resetForm();
    }
  }, [doctor, open]);

  const resetForm = () => {
    setFormData({
      name: '', email: '', phone: '', specialization: '', experience: '',
      rating: '', consultationFee: '', status: 'available', education: '',
      workHistory: '', profileImage: null, availability: [],
      workingHours: { start: '09:00', end: '17:00' },
    });
    setErrors({});
    setImageError('');
    setImagePreview(null);
  };

  const handleChange = (field) => (event) => {
    const value = event.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const handleAvailabilityChange = (event) => {
    setFormData((prev) => ({ ...prev, availability: event.target.value }));
  };

  const handleWorkingHoursChange = (field) => (event) => {
    setFormData((prev) => ({
      ...prev, workingHours: { ...prev.workingHours, [field]: event.target.value },
    }));
  };

  const handleImageChange = (value, error) => {
    if (error) {
      setImageError(error);
    } else {
      setImageError('');
      if (value) {
        setFormData((prev) => ({ ...prev, profileImage: value.preview }));
        setImagePreview(value.preview);
      } else {
        setFormData((prev) => ({ ...prev, profileImage: null }));
        setImagePreview(null);
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const nameValidation = validateRequired(formData.name, 'Name');
    if (!nameValidation.isValid) newErrors.name = nameValidation.error;
    const emailValidation = validateEmail(formData.email);
    if (!emailValidation.isValid) newErrors.email = emailValidation.error;
    const phoneValidation = validatePhone(formData.phone);
    if (!phoneValidation.isValid) newErrors.phone = phoneValidation.error;
    const specValidation = validateRequired(formData.specialization, 'Specialization');
    if (!specValidation.isValid) newErrors.specialization = specValidation.error;
    const expValidation = validateRequired(formData.experience, 'Experience');
    if (!expValidation.isValid) newErrors.experience = expValidation.error;
    else if (isNaN(formData.experience) || Number(formData.experience) < 0) newErrors.experience = 'Experience must be a positive number';
    const feeValidation = validateRequired(formData.consultationFee, 'Consultation Fee');
    if (!feeValidation.isValid) newErrors.consultationFee = feeValidation.error;
    else if (isNaN(formData.consultationFee) || Number(formData.consultationFee) < 0) newErrors.consultationFee = 'Fee must be a positive number';
    const eduValidation = validateRequired(formData.education, 'Education');
    if (!eduValidation.isValid) newErrors.education = eduValidation.error;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    const doctorData = {
      ...formData,
      experience: Number(formData.experience),
      rating: Number(formData.rating) || 0,
      consultationFee: Number(formData.consultationFee),
    };
    if (isEdit) {
      dataStore.updateDoctor(doctor.id, doctorData);
    } else {
      dataStore.addDoctor(doctorData);
    }
    onSave();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 2 } }}>
      <DialogTitle>{isEdit ? 'Edit Doctor' : 'Add New Doctor'}</DialogTitle>
      <DialogContent dividers>
        <Box sx={{ pt: 2 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}><Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>Personal Information</Typography></Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Full Name" value={formData.name} onChange={handleChange('name')} error={Boolean(errors.name)} helperText={errors.name} required />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Email Address" type="email" value={formData.email} onChange={handleChange('email')} error={Boolean(errors.email)} helperText={errors.email} required />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Phone Number" value={formData.phone} onChange={handleChange('phone')} error={Boolean(errors.phone)} helperText={errors.phone} required />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={Boolean(errors.specialization)}>
                <InputLabel>Specialization *</InputLabel>
                <Select value={formData.specialization} onChange={handleChange('specialization')} label="Specialization *">
                  {specializations.map((spec) => <MenuItem key={spec} value={spec}>{spec}</MenuItem>)}
                </Select>
                {errors.specialization && <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>{errors.specialization}</Typography>}
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Years of Experience" type="number" value={formData.experience} onChange={handleChange('experience')} error={Boolean(errors.experience)} helperText={errors.experience} inputProps={{ min: 0 }} required />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Consultation Fee ($)" type="number" value={formData.consultationFee} onChange={handleChange('consultationFee')} error={Boolean(errors.consultationFee)} helperText={errors.consultationFee} inputProps={{ min: 0 }} required />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select value={formData.status} onChange={handleChange('status')} label="Status">
                  {statusOptions.map((option) => <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Rating (0-5)" type="number" value={formData.rating} onChange={handleChange('rating')} inputProps={{ min: 0, max: 5, step: 0.1 }} />
            </Grid>
            <Grid item xs={12}><Divider sx={{ my: 2 }} /><Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>Professional Information</Typography></Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Education" value={formData.education} onChange={handleChange('education')} error={Boolean(errors.education)} helperText={errors.education} required placeholder="e.g., Harvard Medical School - MD" />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Work History" value={formData.workHistory} onChange={handleChange('workHistory')} multiline rows={3} placeholder="Describe previous work experience..." />
            </Grid>
            <Grid item xs={12}><Divider sx={{ my: 2 }} /><Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>Availability</Typography></Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Available Days</InputLabel>
                <Select multiple value={formData.availability} onChange={handleAvailabilityChange} input={<OutlinedInput label="Available Days" />} renderValue={(selected) => selected.join(', ')}>
                  {availabilityOptions.map((day) => <MenuItem key={day} value={day}><Checkbox checked={formData.availability.indexOf(day) > -1} /><ListItemText primary={day} /></MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Working Hours Start" type="time" value={formData.workingHours.start} onChange={handleWorkingHoursChange('start')} InputLabelProps={{ shrink: true }} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Working Hours End" type="time" value={formData.workingHours.end} onChange={handleWorkingHoursChange('end')} InputLabelProps={{ shrink: true }} />
            </Grid>
            <Grid item xs={12}><Divider sx={{ my: 2 }} /><Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>Profile Image</Typography><ImageUpload value={imagePreview} onChange={handleImageChange} error={imageError} aspectRatio={1} /></Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} variant="outlined" color="inherit">Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">{isEdit ? 'Update' : 'Add'} Doctor</Button>
      </DialogActions>
    </Dialog>
  );
};

export default DoctorForm;
