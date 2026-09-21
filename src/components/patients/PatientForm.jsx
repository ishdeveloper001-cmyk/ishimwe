import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Grid, Box, Divider, Typography, MenuItem } from '@mui/material';
import dataStore, { DEFAULT_SECURITY_QUESTION, DEFAULT_SECURITY_ANSWER, SECURITY_QUESTION_OPTIONS } from '../../data/dataStore.jsx';
import { validateEmail, validatePhone, validateRequired } from '../../utils/validation.jsx';

const genderOptions = [{ value: 'Male', label: 'Male' }, { value: 'Female', label: 'Female' }, { value: 'Other', label: 'Other' }];

const PatientForm = ({ open, onClose, onSave, patient }) => {
  const isEdit = Boolean(patient);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    address: '',
    emergencyContact: '',
    medicalHistory: '',
    securityQuestion: DEFAULT_SECURITY_QUESTION,
    securityAnswer: DEFAULT_SECURITY_ANSWER,
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (patient) setFormData({
      ...patient,
      dateOfBirth: patient.dateOfBirth || '',
      securityQuestion: patient.securityQuestion || DEFAULT_SECURITY_QUESTION,
      securityAnswer: patient.securityAnswer || DEFAULT_SECURITY_ANSWER,
    });
    else resetForm();
  }, [patient, open]);

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      gender: '',
      address: '',
      emergencyContact: '',
      medicalHistory: '',
      securityQuestion: DEFAULT_SECURITY_QUESTION,
      securityAnswer: DEFAULT_SECURITY_ANSWER,
    });
    setErrors({});
  };

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
    const securityQuestionValidation = validateRequired(formData.securityQuestion, 'Security Question'); if (!securityQuestionValidation.isValid) newErrors.securityQuestion = securityQuestionValidation.error;
    const securityAnswerValidation = validateRequired(formData.securityAnswer, 'Security Answer'); if (!securityAnswerValidation.isValid) newErrors.securityAnswer = securityAnswerValidation.error;
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
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 3, boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)' } }}>
      <DialogTitle sx={{ 
        pb: 2,
        background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        fontWeight: 700,
      }}>
        {isEdit ? 'Edit Patient' : 'Add New Patient'}
      </DialogTitle>
      <DialogContent dividers>
        <Box sx={{ pt: 2 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}><Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: 'primary.main' }}>Personal Information</Typography></Grid>
            <Grid item xs={12} md={6}><TextField fullWidth label="Full Name" value={formData.name} onChange={handleChange('name')} error={Boolean(errors.name)} helperText={errors.name} required sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} /></Grid>
            <Grid item xs={12} md={6}><TextField fullWidth label="Email Address" type="email" value={formData.email} onChange={handleChange('email')} error={Boolean(errors.email)} helperText={errors.email} required sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} /></Grid>
            <Grid item xs={12} md={6}><TextField fullWidth label="Phone Number" value={formData.phone} onChange={handleChange('phone')} error={Boolean(errors.phone)} helperText={errors.phone} required sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} /></Grid>
            <Grid item xs={12} md={6}><TextField fullWidth label="Date of Birth" type="date" value={formData.dateOfBirth} onChange={handleChange('dateOfBirth')} error={Boolean(errors.dateOfBirth)} helperText={errors.dateOfBirth} InputLabelProps={{ shrink: true }} required sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} /></Grid>
            <Grid item xs={12} md={6}><TextField fullWidth select label="Gender" value={formData.gender} onChange={handleChange('gender')} error={Boolean(errors.gender)} helperText={errors.gender} required sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}>{genderOptions.map((option) => <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>)}</TextField></Grid>
            <Grid item xs={12}><Divider sx={{ my: 2 }} /><Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: 'primary.main' }}>Security for Password Reset</Typography></Grid>
            <Grid item xs={12} md={6}><TextField fullWidth select label="Security Question" value={formData.securityQuestion} onChange={handleChange('securityQuestion')} error={Boolean(errors.securityQuestion)} helperText={errors.securityQuestion} required sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}>{SECURITY_QUESTION_OPTIONS.map((question) => <MenuItem key={question} value={question}>{question}</MenuItem>)}<MenuItem value={DEFAULT_SECURITY_QUESTION}>{DEFAULT_SECURITY_QUESTION}</MenuItem></TextField></Grid>
            <Grid item xs={12} md={6}><TextField fullWidth label="Security Answer" value={formData.securityAnswer} onChange={handleChange('securityAnswer')} error={Boolean(errors.securityAnswer)} helperText={errors.securityAnswer} required sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} /></Grid>
            <Grid item xs={12}><Divider sx={{ my: 2 }} /><Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: 'primary.main' }}>Address & Contact</Typography></Grid>
            <Grid item xs={12}><TextField fullWidth label="Address" value={formData.address} onChange={handleChange('address')} error={Boolean(errors.address)} helperText={errors.address} required placeholder="Street, City, State, ZIP" sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} /></Grid>
            <Grid item xs={12}><TextField fullWidth label="Emergency Contact" value={formData.emergencyContact} onChange={handleChange('emergencyContact')} error={Boolean(errors.emergencyContact)} helperText={errors.emergencyContact} required placeholder="Name - Phone Number" sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} /></Grid>
            <Grid item xs={12}><Divider sx={{ my: 2 }} /><Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: 'primary.main' }}>Medical Information</Typography></Grid>
            <Grid item xs={12}><TextField fullWidth label="Medical History" value={formData.medicalHistory} onChange={handleChange('medicalHistory')} multiline rows={3} placeholder="Known allergies, chronic conditions, current medications..." sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} /></Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}><Button onClick={onClose} variant="outlined" color="inherit" sx={{ borderRadius: 2 }}>Cancel</Button><Button onClick={handleSubmit} variant="contained" sx={{ borderRadius: 2, background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)', '&:hover': { background: 'linear-gradient(135deg, #4f46e5 0%, #db2777 100%)' } }}>{isEdit ? 'Update' : 'Add'} Patient</Button></DialogActions>
    </Dialog>
  );
};

export default PatientForm;
