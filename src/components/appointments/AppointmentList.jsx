import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, InputAdornment, Paper, Chip, Typography, CircularProgress, Tabs, Tab, Card, CardContent } from '@mui/material';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import { Add, Search, Visibility, Edit, Delete, CalendarToday, List, Download } from '@mui/icons-material';
import dataStore from '../../data/dataStore.jsx';
import { useNotification } from '../../context/NotificationContext.jsx';
import AppointmentForm from './AppointmentForm.jsx';
import AppointmentViewModal from './AppointmentViewModal.jsx';
import ConfirmDialog from '../common/ConfirmDialog.jsx';

const AppointmentList = ({ user }) => {
  const { showNotification } = useNotification();
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [appointmentToDelete, setAppointmentToDelete] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'calendar'
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => { loadAppointments(); }, []);
  useEffect(() => {
    const filtered = appointments.filter((apt) => {
      const doctor = dataStore.getDoctorById(apt.doctorId);
      const patient = dataStore.getPatientById(apt.patientId);
      const searchLower = searchQuery.toLowerCase();
      return (apt.date?.includes(searchQuery) || false) || (apt.time?.includes(searchQuery) || false) || apt.reason.toLowerCase().includes(searchLower) || doctor?.name.toLowerCase().includes(searchLower) || patient?.name.toLowerCase().includes(searchLower);
    });
    setFilteredAppointments(filtered);
  }, [searchQuery, appointments]);

  const loadAppointments = async () => {
    setLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      const data = dataStore.getAppointments();
      const enrichedData = data.map((apt) => ({ 
        ...apt, 
        doctorName: dataStore.getDoctorById(apt.doctorId)?.name || 'Unknown', 
        patientName: dataStore.getPatientById(apt.patientId)?.name || 'Unknown', 
        doctorSpecialization: dataStore.getDoctorById(apt.doctorId)?.specialization || '' 
      }));
      setAppointments(enrichedData);
      setFilteredAppointments(enrichedData);
    } catch (error) {
      showNotification('Failed to load appointments', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    const csvContent = [
      ['Date', 'Time', 'Patient', 'Doctor', 'Reason', 'Duration', 'Status'],
      ...filteredAppointments.map(apt => [
        apt.date,
        apt.time,
        apt.patientName,
        apt.doctorName,
        apt.reason,
        apt.duration,
        apt.status
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'appointments.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    showNotification('Appointments exported successfully', 'success');
  };

  const handleViewChange = (event, newValue) => {
    setViewMode(newValue);
  };

  const formatDate = (dateString) => { if (!dateString) return 'N/A'; return new Date(dateString).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' }); };
  const formatTime = (timeString) => { if (!timeString) return 'N/A'; const [hours, minutes] = timeString.split(':'); const hour = parseInt(hours, 10); const ampm = hour >= 12 ? 'PM' : 'AM'; const hour12 = hour % 12 || 12; return `${hour12}:${minutes} ${ampm}`; };
  const getStatusColor = (status) => { switch (status) { case 'scheduled': return 'info'; case 'completed': return 'success'; case 'cancelled': return 'error'; case 'in-progress': return 'warning'; default: return 'default'; } };

  const columns = [
    { field: 'date', headerName: 'Date', width: 140, renderCell: (params) => formatDate(params.value) },
    { field: 'time', headerName: 'Time', width: 100, renderCell: (params) => formatTime(params.value) },
    { field: 'patientName', headerName: 'Patient', flex: 1, minWidth: 150 },
    { field: 'doctorName', headerName: 'Doctor', flex: 1, minWidth: 150, renderCell: (params) => <Box><Typography variant="body2" sx={{ fontWeight: 600 }}>{params.value}</Typography><Typography variant="caption" color="text.secondary">{params.row.doctorSpecialization}</Typography></Box> },
    { field: 'reason', headerName: 'Reason', flex: 1, minWidth: 180, renderCell: (params) => <Typography variant="body2" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{params.value}</Typography> },
    { field: 'duration', headerName: 'Duration', width: 100, renderCell: (params) => `${params.value} min` },
    { field: 'status', headerName: 'Status', width: 120, renderCell: (params) => <Chip label={params.value} size="small" color={getStatusColor(params.value)} variant="filled" /> },
    { field: 'actions', type: 'actions', headerName: 'Actions', width: 180, getActions: (params) => {
      const actions = [
        <GridActionsCellItem key="view" icon={<Visibility />} label="View" onClick={() => { setSelectedAppointment(params.row); setViewModalOpen(true); }} />,
      ];
      if (user?.role === 'admin') {
        actions.push(
          <GridActionsCellItem key="edit" icon={<Edit />} label="Edit" onClick={() => { setSelectedAppointment(params.row); setFormOpen(true); }} />,
          <GridActionsCellItem key="delete" icon={<Delete />} label="Delete" onClick={() => { setAppointmentToDelete(params.row); setDeleteDialogOpen(true); }} sx={{ color: 'error.main' }} />,
        );
      }
      return actions;
    }},
  ];

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <TextField 
          placeholder="Search by date, doctor, patient, or reason..." 
          value={searchQuery} 
          onChange={(e) => setSearchQuery(e.target.value)} 
          size="small" 
          sx={{ 
            minWidth: 350,
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              transition: 'all 0.2s',
              '&:hover': {
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'primary.main',
                },
              },
              '&.Mui-focused': {
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'primary.main',
                  borderWidth: 2,
                },
              },
            },
          }} 
          InputProps={{ 
            startAdornment: <InputAdornment position="start"><Search sx={{ color: 'text.secondary' }} /></InputAdornment> 
          }} 
        />
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button 
            variant="outlined" 
            startIcon={<Download />} 
            onClick={handleExport}
            size="small"
            sx={{
              borderRadius: 2,
              transition: 'all 0.2s',
              '&:hover': {
                transform: 'translateY(-2px)',
              },
            }}
          >
            Export
          </Button>
          {user?.role === 'admin' && (
            <Button 
              variant="contained" 
              startIcon={<Add />} 
              onClick={() => { setSelectedAppointment(null); setFormOpen(true); }}
              sx={{
                borderRadius: 2,
                background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
                boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
                transition: 'all 0.2s',
                '&:hover': {
                  background: 'linear-gradient(135deg, #4f46e5 0%, #db2777 100%)',
                  boxShadow: '0 6px 16px rgba(99, 102, 241, 0.4)',
                  transform: 'translateY(-2px)',
                },
              }}
            >
              Book Appointment
            </Button>
          )}
        </Box>
      </Box>

      <Paper 
        sx={{ 
          width: '100%', 
          overflow: 'hidden',
          borderRadius: 2,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
        }}
      >
        <Tabs 
          value={viewMode} 
          onChange={handleViewChange} 
          sx={{ 
            borderBottom: 1, 
            borderColor: 'divider',
            '& .MuiTab-root': {
              fontWeight: 500,
              transition: 'all 0.2s',
            },
            '& .Mui-selected': {
              color: 'primary.main',
              fontWeight: 600,
            },
            '& .MuiTabs-indicator': {
              background: 'linear-gradient(90deg, #6366f1 0%, #ec4899 100%)',
            },
          }}
        >
          <Tab icon={<List />} label="List View" value="list" />
          <Tab icon={<CalendarToday />} label="Calendar View" value="calendar" />
        </Tabs>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
            <CircularProgress sx={{ color: 'primary.main' }} />
            <Typography sx={{ ml: 2 }}>Loading appointments...</Typography>
          </Box>
        ) : viewMode === 'list' ? (
          <DataGrid 
            rows={filteredAppointments} 
            columns={columns} 
            initialState={{ 
              pagination: { paginationModel: { pageSize: pageSize, page: 0 } }, 
              sorting: { sortModel: [{ field: 'date', sort: 'asc' }] } 
            }} 
            pageSizeOptions={[5, 10, 25]}
            onPaginationModelChange={(model) => setPageSize(model.pageSize)}
            checkboxSelection 
            disableRowSelectionOnClick 
            autoHeight 
            sx={{ 
              border: 0, 
              '& .MuiDataGrid-columnHeaders': { 
                bgcolor: 'action.hover',
                '& .MuiDataGrid-columnHeaderTitle': {
                  fontWeight: 600,
                },
              },
              '& .MuiDataGrid-row': {
                transition: 'all 0.2s',
                '&:hover': {
                  bgcolor: 'action.hover',
                },
              },
              '& .MuiDataGrid-cell': {
                borderBottom: 1,
                borderColor: 'divider',
              },
            }} 
          />
        ) : (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>Calendar View</Typography>
            <Typography variant="body2" color="text.secondary">
              Calendar view coming soon! Currently showing {filteredAppointments.length} appointments.
            </Typography>
            <Box sx={{ mt: 2, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 2 }}>
              {filteredAppointments.slice(0, 6).map((apt) => (
                <Card 
                  key={apt.id} 
                  sx={{ 
                    minHeight: 120,
                    borderRadius: 2,
                    transition: 'all 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
                    },
                  }}
                >
                  <CardContent>
                    <Typography variant="subtitle2" sx={{ 
                      fontWeight: 600,
                      background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}>
                      {formatDate(apt.date)} at {formatTime(apt.time)}
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      <strong>Patient:</strong> {apt.patientName}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Doctor:</strong> {apt.doctorName}
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      {apt.reason}
                    </Typography>
                    <Chip 
                      label={apt.status} 
                      size="small" 
                      color={getStatusColor(apt.status)} 
                      sx={{ mt: 1 }} 
                    />
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Box>
        )}
      </Paper>
      <AppointmentForm open={formOpen} onClose={() => { setFormOpen(false); setSelectedAppointment(null); }} onSave={() => { loadAppointments(); setFormOpen(false); setSelectedAppointment(null); showNotification(selectedAppointment ? 'Appointment updated successfully' : 'Appointment created successfully', 'success'); }} appointment={selectedAppointment} onConflictError={(message) => showNotification(message, 'error')} />
      <AppointmentViewModal open={viewModalOpen} onClose={() => { setViewModalOpen(false); setSelectedAppointment(null); }} appointment={selectedAppointment} />
      <ConfirmDialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} onConfirm={() => { if (appointmentToDelete) { dataStore.deleteAppointment(appointmentToDelete.id); loadAppointments(); setAppointmentToDelete(null); showNotification('Appointment cancelled successfully', 'success'); } }} title="Cancel Appointment" message={`Are you sure you want to cancel the appointment for ${appointmentToDelete?.patientName} on ${formatDate(appointmentToDelete?.date)} at ${formatTime(appointmentToDelete?.time)}?`} confirmText="Cancel Appointment" type="danger" />
    </Box>
  );
};

export default AppointmentList;
