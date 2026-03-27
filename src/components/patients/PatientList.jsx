import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, InputAdornment, Paper, Chip, Avatar, Typography } from '@mui/material';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import { Add, Search, Edit, Delete } from '@mui/icons-material';
import dataStore from '../../data/dataStore.jsx';
import PatientForm from './PatientForm.jsx';
import ConfirmDialog from '../common/ConfirmDialog.jsx';

const PatientList = () => {
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState(null);

  useEffect(() => { loadPatients(); }, []);
  useEffect(() => {
    const filtered = patients.filter((p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.phone.includes(searchQuery)
    );
    setFilteredPatients(filtered);
  }, [searchQuery, patients]);

  const loadPatients = () => {
    const data = dataStore.getPatients();
    setPatients(data);
    setFilteredPatients(data);
  };

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  const calculateAge = (dateOfBirth) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) age--;
    return age;
  };

  const columns = [
    { field: 'avatar', headerName: 'Patient', flex: 1, minWidth: 200, renderCell: (params) => (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Avatar sx={{ bgcolor: 'primary.main' }}>{params.row.name?.charAt(0)}</Avatar>
        <Box><Typography variant="body2" sx={{ fontWeight: 600 }}>{params.row.name}</Typography><Typography variant="caption" color="text.secondary">{params.row.email}</Typography></Box>
      </Box>
    )},
    { field: 'phone', headerName: 'Phone', width: 140 },
    { field: 'gender', headerName: 'Gender', width: 100, renderCell: (params) => <Chip label={params.value} size="small" variant="outlined" /> },
    { field: 'age', headerName: 'Age', width: 80, renderCell: (params) => calculateAge(params.row.dateOfBirth) },
    { field: 'dateOfBirth', headerName: 'Date of Birth', width: 130, renderCell: (params) => formatDate(params.value) },
    { field: 'registrationDate', headerName: 'Registered', width: 130, renderCell: (params) => formatDate(params.value) },
    { field: 'medicalHistory', headerName: 'Medical Notes', flex: 1, minWidth: 150, renderCell: (params) => <Typography variant="body2" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{params.value || 'None'}</Typography> },
    { field: 'actions', type: 'actions', headerName: 'Actions', width: 120, getActions: (params) => [
      <GridActionsCellItem key="edit" icon={<Edit />} label="Edit" onClick={() => { setSelectedPatient(params.row); setFormOpen(true); }} />,
      <GridActionsCellItem key="delete" icon={<Delete />} label="Delete" onClick={() => { setPatientToDelete(params.row); setDeleteDialogOpen(true); }} sx={{ color: 'error.main' }} />,
    ]},
  ];

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <TextField placeholder="Search patients..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} size="small" sx={{ minWidth: 300 }} InputProps={{ startAdornment: <InputAdornment position="start"><Search /></InputAdornment> }} />
        <Button variant="contained" startIcon={<Add />} onClick={() => { setSelectedPatient(null); setFormOpen(true); }}>Add New Patient</Button>
      </Box>
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <DataGrid rows={filteredPatients} columns={columns} initialState={{ pagination: { paginationModel: { pageSize: 10, page: 0 } }, sorting: { sortModel: [{ field: 'name', sort: 'asc' }] } }} pageSizeOptions={[5, 10, 25]} checkboxSelection disableRowSelectionOnClick autoHeight sx={{ border: 0, '& .MuiDataGrid-columnHeaders': { bgcolor: 'action.hover' } }} />
      </Paper>
      <PatientForm open={formOpen} onClose={() => { setFormOpen(false); setSelectedPatient(null); }} onSave={() => { loadPatients(); setFormOpen(false); setSelectedPatient(null); }} patient={selectedPatient} />
      <ConfirmDialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} onConfirm={() => { if (patientToDelete) { dataStore.deletePatient(patientToDelete.id); loadPatients(); setPatientToDelete(null); } }} title="Delete Patient" message={`Are you sure you want to delete ${patientToDelete?.name}? This action cannot be undone.`} confirmText="Delete" type="danger" />
    </Box>
  );
};

export default PatientList;
