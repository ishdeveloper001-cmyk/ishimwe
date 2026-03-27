// Email validation regex pattern
export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Phone validation regex pattern (international format)
export const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;

// Image type validation
export const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

// Maximum image size (5MB)
export const maxImageSize = 5 * 1024 * 1024;

// Validate email
export const validateEmail = (email) => {
  if (!email || email.trim() === '') {
    return { isValid: false, error: 'Email is required' };
  }
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Please enter a valid email address' };
  }
  return { isValid: true, error: '' };
};

// Validate phone number
export const validatePhone = (phone) => {
  if (!phone || phone.trim() === '') {
    return { isValid: false, error: 'Phone number is required' };
  }
  if (!phoneRegex.test(phone)) {
    return { isValid: false, error: 'Please enter a valid phone number' };
  }
  return { isValid: true, error: '' };
};

// Validate required field
export const validateRequired = (value, fieldName) => {
  if (!value || value.toString().trim() === '') {
    return { isValid: false, error: `${fieldName} is required` };
  }
  return { isValid: true, error: '' };
};

// Validate image type
export const validateImageType = (file) => {
  if (!file) {
    return { isValid: false, error: 'Please select an image' };
  }
  if (!validImageTypes.includes(file.type)) {
    return { isValid: false, error: 'Only JPEG, PNG, GIF, and WebP images are allowed' };
  }
  return { isValid: true, error: '' };
};

// Validate image size
export const validateImageSize = (file) => {
  if (!file) {
    return { isValid: false, error: 'Please select an image' };
  }
  if (file.size > maxImageSize) {
    return { isValid: false, error: 'Image size must be less than 5MB' };
  }
  return { isValid: true, error: '' };
};

// Validate image (type and size)
export const validateImage = (file) => {
  const typeValidation = validateImageType(file);
  if (!typeValidation.isValid) {
    return typeValidation;
  }
  const sizeValidation = validateImageSize(file);
  if (!sizeValidation.isValid) {
    return sizeValidation;
  }
  return { isValid: true, error: '' };
};

// Validate appointment time conflict
export const validateAppointmentConflict = (newAppointment, existingAppointments) => {
  const newStart = new Date(newAppointment.date + 'T' + newAppointment.time);
  const newEnd = new Date(newStart.getTime() + newAppointment.duration * 60000);

  for (const appointment of existingAppointments) {
    if (appointment.doctorId !== newAppointment.doctorId) continue;
    
    const existingStart = new Date(appointment.date + 'T' + appointment.time);
    const existingEnd = new Date(existingStart.getTime() + appointment.duration * 60000);

    // Check for overlap
    if (newStart < existingEnd && newEnd > existingStart) {
      return {
        isValid: false,
        error: `This time slot conflicts with an existing appointment at ${appointment.time}`
      };
    }
  }

  return { isValid: true, error: '' };
};

// Generate unique ID
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Format date
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Format time
export const formatTime = (timeString) => {
  const [hours, minutes] = timeString.split(':');
  const hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  return `${hour12}:${minutes} ${ampm}`;
};
