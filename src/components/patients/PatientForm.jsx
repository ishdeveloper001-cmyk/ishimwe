import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Grid, Box, Divider, Typography, MenuItem } from '@mui/material';
import dataStore from '../../data/dataStore.jsx';
import { validateEmail, validatePhone, validateRequired } from '../../utils/validation.jsx';

const genderOptions = [{ value: 'Male', label: 'Male' }, { value: 'Female', label: 'Female' }, { value: 'Other', label: 'Other' }];

const PatientForm = ({ open, onClose, onSave, patient }) => {
  const isEdit = Boolean(patient);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', dateOfBirth: '', gender: '', address: '', emergencyContact: '', medicalHistory: '' });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (patient) setFormData({ ...patient, dateOfBirth: patient.dateOfBirth || '' });
    else resetForm();
  }, [patient, open]);

  const resetForm = () => { setFormData({ name: '', email: '', phone: '', dateOfBirth: '', gender: '', address: '', emergencyContact: '', medicalHistory: '' }); setErrors({}); };

  const handleChange = (field) => (event) => { setFormData((prev) => ({ ...prev, [field]: event.target.value })); if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' })); };

  const validateForm = () => {
    const newErrors = {};
    const nameValidation = validateRequired(formData.name, 'Name'); if (!nameValidation.isValid) newErrors.name = nameValidation.error;
    const emailValidation = validateEmail(formData.email); if (!emailValidation.isValid) newErrors.email = emailValidation.error;
    const phoneValidation = validatePhone(formData.phone); if (!phoneValidation.isValid) newErrors.phone = phoneValidation.error;
    const dobValidation = validateRequired(formData.dateOfBirth, 'Date of Birth'); if (!dobValidation.isValid) newErrors.dateOfBirth = dobValidation.error;
    const genderValidation = validateRequired(formData.gender, 'Gender'); if (!genderValidation.isValid) newErrors.gender = genderValidation.error;
    const addressValidation = validateRequired(formData.address, 'Address'); if (!addressValidation.isValid) newErrors.address = addressValidation.error;
    const emergencyValidation = validateRequired(formData.emergencyContact, 'Emergency Contact'); if (!emergencyValidation.isValid) newErrors.emergencyContact = emergencyValidation.error;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    if (isEdit) dataStore.updatePatient(patient.id, formData);
    else dataStore.addPatient(formData);
    onSave();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 2 } }}>
      <DialogTitle>{isEdit ? 'Edit Patient' : 'Add New Patient'}</DialogTitle>
      <DialogContent dividers>
        <Box sx={{ pt: 2 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}><Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>Personal Information</Typography></Grid>
            <Grid item xs={12} md={6}><TextField fullWidth label="Full Name" value={formData.name} onChange={handleChange('name')} error={Boolean(errors.name)} helperText={errors.name} required /></Grid>
            <Grid item xs={12} md={6}><TextField fullWidth label="Email Address" type="email" value={formData.email} onChange={handleChange('email')} error={Boolean(errors.email)} helperText={errors.email} required /></Grid>
            <Grid item xs={12} md={6}><TextField fullWidth label="Phone Number" value={formData.phone} onChange={handleChange('phone')} error={Boolean(errors.phone)} helperText={errors.phone} required /></Grid>
            <Grid item xs={12} md={6}><TextField fullWidth label="Date of Birth" type="date" value={formData.dateOfBirth} onChange={handleChange('dateOfBirth')} error={Boolean(errors.dateOfBirth)} helperText={errors.dateOfBirth} InputLabelProps={{ shrink: true }} required /></Grid>
            <Grid item xs={12} md={6}><TextField fullWidth select label="Gender" value={formData.gender} onChange={handleChange('gender')} error={Boolean(errors.gender)} helperText={errors.gender} required>{genderOptions.map((option) => <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>)}</TextField></Grid>
            <Grid item xs={12}><Divider sx={{ my: 2 }} /><Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>Address & Contact</Typography></Grid>
            <Grid item xs={12}><TextField fullWidth label="Address" value={formData.address} onChange={handleChange('address')} error={Boolean(errors.address)} helperText={errors.address} required placeholder="Street, City, State, ZIP" /></Grid>
            <Grid item xs={12}><TextField fullWidth label="Emergency Contact" value={formData.emergencyContact} onChange={handleChange('emergencyContact')} error={Boolean(errors.emergencyContact)} helperText={errors.emergencyContact} required placeholder="Name - Phone Number" /></Grid>
            <Grid item xs={12}><Divider sx={{ my: 2 }} /><Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>Medical Information</Typography></Grid>
            <Grid item xs={12}><TextField fullWidth label="Medical History" value={formData.medicalHistory} onChange={handleChange('medicalHistory')} multiline rows={3} placeholder="Known allergies, chronic conditions, current medications..." /></Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}><Button onClick={onClose} variant="outlined" color="inherit">Cancel</Button><Button onClick={handleSubmit} variant="contained">{isEdit ? 'Update' : 'Add'} Patient</Button></DialogActions>
    </Dialog>
  );
};

export default PatientForm;
