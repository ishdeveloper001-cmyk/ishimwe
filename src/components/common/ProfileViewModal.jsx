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
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
        }
      }}
    >
      <DialogTitle sx={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        fontWeight: 600,
        py: 2.5,
      }}>
        User Profile
      </DialogTitle>
      <DialogContent sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <Avatar 
            sx={{ 
              width: 120, 
              height: 120, 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              fontSize: '3rem',
              fontWeight: 600,
              boxShadow: '0 4px 16px rgba(102, 126, 234, 0.4)',
            }}
          >
            {user.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U'}
          </Avatar>
          <Typography variant="h5" sx={{ mt: 3, fontWeight: 600, color: 'text.primary' }}>
            {user.name || 'No Name'}
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ 
              mt: 1.5,
              px: 2,
              py: 0.5,
              borderRadius: 2,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              fontWeight: 500,
            }}
          >
            {user.role?.charAt(0).toUpperCase() + user.role?.slice(1)}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2, fontWeight: 500 }}>
            {user.email || 'No Email'}
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2.5, gap: 1 }}>
        <Button 
          onClick={onClose} 
          variant="outlined" 
          sx={{
            borderRadius: 2,
            fontWeight: 600,
            px: 3,
            transition: 'all 0.2s ease',
            '&:hover': {
              transform: 'translateY(-1px)',
            },
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProfileViewModal;