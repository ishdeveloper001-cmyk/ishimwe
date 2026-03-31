import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Avatar,
} from '@mui/material';

const ProfileViewModal = ({ open, onClose, user }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>User Profile</DialogTitle>
      <DialogContent sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <Avatar sx={{ width: 100, height: 100, bgcolor: 'primary.main' }}>
            {user.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U'}
          </Avatar>
          <Typography variant="h5" sx={{ mt: 2 }}>
            {user.name || 'No Name'}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {user.role?.charAt(0).toUpperCase() + user.role?.slice(1)}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {user.email || 'No Email'}
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} variant="outlined" color="inherit">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProfileViewModal;