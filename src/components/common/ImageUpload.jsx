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
      <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
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
            borderRadius: 2,
            overflow: 'hidden',
            border: 2,
            borderColor: 'divider',
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
              top: 4,
              right: 4,
              bgcolor: 'error.main',
              color: 'white',
              '&:hover': {
                bgcolor: 'error.dark',
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
            borderRadius: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            bgcolor: 'action.hover',
            transition: 'all 0.2s',
            '&:hover': {
              borderColor: 'primary.main',
              bgcolor: 'action.selected',
            },
          }}
        >
          <ImageIcon sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }} />
          <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center', px: 2 }}>
            Click to upload image
          </Typography>
          <Typography variant="caption" color="text.disabled" sx={{ mt: 0.5 }}>
            Max 5MB (JPEG, PNG, GIF, WebP)
          </Typography>
        </Box>
      )}

      {error && (
        <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
          {error}
        </Typography>
      )}
    </Box>
  );
};

export default ImageUpload;
