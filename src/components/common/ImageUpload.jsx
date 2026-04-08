import React, { useRef } from 'react';
import {
  Box,
  Typography,
  IconButton,
} from '@mui/material';
import {
  Delete,
  Image as ImageIcon,
} from '@mui/icons-material';

const ImageUpload = ({
  value,
  onChange,
  error,
  label = 'Upload Image',
  aspectRatio = 1,
  maxSize = 5 * 1024 * 1024,
}) => {
  const inputRef = useRef(null);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        onChange(null, 'Only JPEG, PNG, GIF, and WebP images are allowed');
        return;
      }

      // Validate file size
      if (file.size > maxSize) {
        onChange(null, 'Image size must be less than 5MB');
        return;
      }

      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange({
          file,
          preview: reader.result,
        }, '');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemove = () => {
    onChange(null, '');
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <Box>
      <Typography variant="body2" sx={{ mb: 1, fontWeight: 600, color: 'text.primary' }}>
        {label}
      </Typography>
      
      <input
        type="file"
        ref={inputRef}
        onChange={handleChange}
        accept="image/jpeg,image/png,image/gif,image/webp"
        style={{ display: 'none' }}
      />

      {value ? (
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            maxWidth: 200,
            aspectRatio: aspectRatio,
            borderRadius: 3,
            overflow: 'hidden',
            border: 2,
            borderColor: 'divider',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            transition: 'all 0.3s ease',
            '&:hover': {
              boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
              transform: 'translateY(-2px)',
            },
          }}
        >
          <img
            src={value}
            alt="Preview"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
          <IconButton
            size="small"
            onClick={handleRemove}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              bgcolor: 'error.main',
              color: 'white',
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
              transition: 'all 0.2s ease',
              '&:hover': {
                bgcolor: 'error.dark',
                transform: 'scale(1.1)',
              },
            }}
          >
            <Delete fontSize="small" />
          </IconButton>
        </Box>
      ) : (
        <Box
          onClick={handleClick}
          sx={{
            width: '100%',
            maxWidth: 200,
            aspectRatio: aspectRatio,
            border: '2px dashed',
            borderColor: error ? 'error.main' : 'divider',
            borderRadius: 3,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            bgcolor: 'action.hover',
            transition: 'all 0.3s ease',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            '&:hover': {
              borderColor: 'primary.main',
              bgcolor: 'action.selected',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              transform: 'translateY(-2px)',
            },
          }}
        >
          <ImageIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1.5 }} />
          <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center', px: 2, fontWeight: 500 }}>
            Click to upload image
          </Typography>
          <Typography variant="caption" color="text.disabled" sx={{ mt: 0.5 }}>
            Max 5MB (JPEG, PNG, GIF, WebP)
          </Typography>
        </Box>
      )}

      {error && (
        <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block', fontWeight: 500 }}>
          {error}
        </Typography>
      )}
    </Box>
  );
};

export default ImageUpload;
