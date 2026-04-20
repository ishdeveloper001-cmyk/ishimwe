import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Chip,
  Rating,
  TextField,
  InputAdornment,
  Paper,
  Typography,
  Avatar,
} from '@mui/material';
import {
  DataGrid,
  GridActionsCellItem,
} from '@mui/x-data-grid';
import {
  Add,
  Search,
  Visibility,
  Edit,
  Delete,
} from '@mui/icons-material';
import dataStore from '../../data/dataStore.jsx';
import DoctorForm from './DoctorForm.jsx';
import DoctorViewModal from './DoctorViewModal.jsx';
import ConfirmDialog from '../common/ConfirmDialog.jsx';

const DoctorList = ({ user }) => {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [doctorToDelete, setDoctorToDelete] = useState(null);

  useEffect(() => {
    loadDoctors();
  }, []);

  useEffect(() => {
    const filtered = doctors.filter((doctor) =>
      doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.specialization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredDoctors(filtered);
  }, [searchQuery, doctors]);

  const loadDoctors = () => {
    const data = dataStore.getDoctors();
    setDoctors(data);
    setFilteredDoctors(data);
  };

  const handleAddDoctor = () => {
    setSelectedDoctor(null);
    setFormOpen(true);
  };

  const handleEditDoctor = (doctor) => {
    setSelectedDoctor(doctor);
    setFormOpen(true);
  };

  const handleViewDoctor = (doctor) => {
    setSelectedDoctor(doctor);
    setViewModalOpen(true);
  };

  const handleDeleteClick = (doctor) => {
    setDoctorToDelete(doctor);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (doctorToDelete) {
      dataStore.deleteDoctor(doctorToDelete.id);
      loadDoctors();
      setDoctorToDelete(null);
    }
  };

  const handleFormClose = () => {
    setFormOpen(false);
    setSelectedDoctor(null);
  };

  const handleFormSave = () => {
    loadDoctors();
    handleFormClose();
  };

  const columns = [
    {
      field: 'profileImage',
      headerName: 'Photo',
      width: 70,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Avatar
          src={params.value}
          sx={{ width: 40, height: 40, bgcolor: 'primary.main' }}
        >
{params.row.name?.charAt(0).toUpperCase() + params.row.name.split(' ')[1]?.charAt(0).toUpperCase()}
        </Avatar>
      ),
    },
    {
      field: 'name',
      headerName: 'Doctor Name',
      flex: 1,
      minWidth: 180,
    },
    {
      field: 'specialization',
      headerName: 'Specialization',
      flex: 1,
      minWidth: 150,
      renderCell: (params) => (
        <Chip
          label={params.value}
          size="small"
          color="primary"
          variant="outlined"
        />
      ),
    },
    {
      field: 'experience',
      headerName: 'Experience',
      width: 120,
      renderCell: (params) => `${params.value} years`,
    },
    {
      field: 'rating',
      headerName: 'Rating',
      width: 150,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Rating value={params.value} precision={0.1} readOnly size="small" />
          <Typography variant="body2" sx={{ ml: 1 }}>
            ({params.value})
          </Typography>
        </Box>
      ),
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.value}
          size="small"
          color={params.value === 'available' ? 'success' : 'warning'}
          variant="filled"
        />
      ),
    },
    {
      field: 'password',
      headerName: 'Password',
      width: 120,
      renderCell: (params) => user?.role === 'admin' ? <Chip label={params.value || '***'} size="small" color="info" variant="outlined" /> : '***',
    },
    {
      field: 'consultationFee',
      headerName: 'Fee',
      width: 100,
      renderCell: (params) => `$${params.value}`,
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 180,
      getActions: (params) => {
        const actions = [
          <GridActionsCellItem
            key="view"
            icon={<Visibility />}
            label="View"
            onClick={() => handleViewDoctor(params.row)}
            title="View"
          />,
        ];
        if (user?.role === 'admin') {
          actions.push(
            <GridActionsCellItem
              key="edit"
              icon={<Edit />}
              label="Edit"
              onClick={() => handleEditDoctor(params.row)}
              title="Edit"
            />,
            <GridActionsCellItem
              key="delete"
              icon={<Delete />}
              label="Delete"
              onClick={() => handleDeleteClick(params.row)}
              title="Delete"
              sx={{ color: 'error.main' }}
            />,
          );
        }
        return actions;
      },
    },
  ];

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <TextField
          placeholder="Search doctors..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          size="small"
          sx={{ 
            minWidth: 300,
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
            startAdornment: (
              <InputAdornment position="start">
                <Search sx={{ color: 'text.secondary' }} />
              </InputAdornment>
            ),
          }}
        />
        {user?.role === 'admin' && (
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleAddDoctor}
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
            Add New Doctor
          </Button>
        )}
      </Box>

      <Paper 
        sx={{ 
          width: '100%', 
          overflow: 'hidden',
          borderRadius: 2,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
        }}
      >
        <DataGrid
          rows={filteredDoctors}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 10, page: 0 },
            },
            sorting: {
              sortModel: [{ field: 'name', sort: 'asc' }],
            },
          }}
          pageSizeOptions={[5, 10, 25]}
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
      </Paper>

      <DoctorForm
        open={formOpen}
        onClose={handleFormClose}
        onSave={handleFormSave}
        doctor={selectedDoctor}
      />

      <DoctorViewModal
        open={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        doctor={selectedDoctor}
      />

      <ConfirmDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Doctor"
        message={`Are you sure you want to delete Dr. ${doctorToDelete?.name}? This action cannot be undone.`}
        confirmText="Delete"
        type="danger"
      />
    </Box>
  );
};

export default DoctorList;
