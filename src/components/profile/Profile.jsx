import React, { useState } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Avatar,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  Divider,
  Chip,
} from '@mui/material';
import {
  Person,
  Email,
  Phone,
  CalendarToday,
  LocationOn,
  Edit,
  Save,
  Cancel,
} from '@mui/icons-material';

const Profile = ({ user }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    dateOfBirth: user?.dateOfBirth || '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = () => {
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      address: user?.address || '',
      dateOfBirth: user?.dateOfBirth || '',
    });
    setIsEditing(false);
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name[0].toUpperCase();
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          My Profile
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          View and manage your personal information
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              textAlign: 'center',
            }}
          >
            <Avatar
              sx={{
                width: 120,
                height: 120,
                margin: '0 auto',
                mb: 2,
                background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
                fontSize: '3rem',
                fontWeight: 600,
                boxShadow: '0 4px 16px rgba(99, 102, 241, 0.4)',
              }}
            >
              {getInitials(user?.name)}
            </Avatar>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
              {user?.name || 'User Name'}
            </Typography>
            <Chip
              label={user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1) || 'User'}
              size="small"
              sx={{
                background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
                color: 'white',
                fontWeight: 600,
              }}
            />
            <Box sx={{ mt: 3, textAlign: 'left' }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Email fontSize="small" />
                  {user?.email || 'No email'}
                </Box>
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CalendarToday fontSize="small" />
                  Member since {new Date().getFullYear()}
                </Box>
              </Typography>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Personal Information
              </Typography>
              {!isEditing ? (
                <Button
                  variant="outlined"
                  startIcon={<Edit />}
                  onClick={() => setIsEditing(true)}
                  sx={{
                    borderRadius: 2,
                    fontWeight: 600,
                    px: 2,
                  }}
                >
                  Edit Profile
                </Button>
              ) : (
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    variant="outlined"
                    startIcon={<Cancel />}
                    onClick={handleCancel}
                    sx={{
                      borderRadius: 2,
                      fontWeight: 600,
                      px: 2,
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<Save />}
                    onClick={handleSave}
                    sx={{
                      borderRadius: 2,
                      fontWeight: 600,
                      px: 2,
                      background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #4f46e5 0%, #db2777 100%)',
                      },
                    }}
                  >
                    Save Changes
                  </Button>
                </Box>
              )}
            </Box>

            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Full Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={!isEditing}
                  InputProps={{
                    startAdornment: <Person sx={{ mr: 1, color: 'text.secondary' }} />,
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email Address"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={!isEditing}
                  InputProps={{
                    startAdornment: <Email sx={{ mr: 1, color: 'text.secondary' }} />,
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={!isEditing}
                  InputProps={{
                    startAdornment: <Phone sx={{ mr: 1, color: 'text.secondary' }} />,
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Date of Birth"
                  name="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  disabled={!isEditing}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  InputProps={{
                    startAdornment: <CalendarToday sx={{ mr: 1, color: 'text.secondary' }} />,
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  disabled={!isEditing}
                  multiline
                  rows={3}
                  InputProps={{
                    startAdornment: <LocationOn sx={{ mr: 1, color: 'text.secondary', mt: 1 }} />,
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    },
                  }}
                />
              </Grid>
            </Grid>
          </Paper>

          {/* <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              mt: 3,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Account Statistics
            </Typography>
            <Divider sx={{ mb: 3 }} />
            <Grid container spacing={3}>
              <Grid item xs={12} sm={4}>
                <Card
                  elevation={0}
                  sx={{
                    borderRadius: 2,
                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                    color: 'white',
                  }}
                >
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="h3" sx={{ fontWeight: 700 }}>
                      {user?.role === 'doctor' ? '24' : user?.role === 'patient' ? '8' : '156'}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      {user?.role === 'doctor' ? 'Appointments' : user?.role === 'patient' ? 'Visits' : 'Total Users'}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Card
                  elevation={0}
                  sx={{
                    borderRadius: 2,
                    background: 'linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)',
                    color: 'white',
                  }}
                >
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="h3" sx={{ fontWeight: 700 }}>
                      {user?.role === 'doctor' ? '18' : user?.role === 'patient' ? '5' : '42'}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      {user?.role === 'doctor' ? 'Patients' : user?.role === 'patient' ? 'Doctors' : 'Active Now'}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Card
                  elevation={0}
                  sx={{
                    borderRadius: 2,
                    background: 'linear-gradient(135deg, #10b981 0%, #14b8a6 100%)',
                    color: 'white',
                  }}
                >
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="h3" sx={{ fontWeight: 700 }}>
                      {user?.role === 'doctor' ? '4.9' : user?.role === 'patient' ? '100%' : '98%'}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      {user?.role === 'doctor' ? 'Rating' : user?.role === 'patient' ? 'Satisfaction' : 'Uptime'}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Paper> */}
        </Grid>
      </Grid>
    </Container>
  );
};

export default Profile;
