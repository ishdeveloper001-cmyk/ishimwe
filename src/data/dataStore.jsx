import { generateId } from '../utils/validation.jsx';
import { initialDoctors, initialPatients, initialAppointments } from './mockData.jsx';

export const DEFAULT_SECURITY_QUESTION = 'What is the vision of our clinic?';
export const DEFAULT_SECURITY_ANSWER = '2070';
export const SECURITY_QUESTION_OPTIONS = [
  'What is your nick name?',
  'When is your birth day?',
  'What is your former school?'
];
export const APPOINTMENT_STATUS_OPTIONS = ['pending', 'approved', 'scheduled', 'completed', 'cancelled'];

const normalizeSecurityProfile = (user) => {
  if (!user) return user;

  if (user.role === 'admin') {
    return {
      ...user,
      role: 'admin',
      securityQuestion: user.securityQuestion || 'What is your nickname?',
      securityAnswer: user.securityAnswer || ''
    };
  }

  return {
    ...user,
    role: user.role || 'patient',
    securityQuestion: user.securityQuestion || DEFAULT_SECURITY_QUESTION,
    securityAnswer: user.securityAnswer || DEFAULT_SECURITY_ANSWER
  };
};

// Data store class - Added password support for patients/doctors + localStorage persistence
class DataStore {
  constructor() {
    this.doctors = (this._loadFromStorage('doctors') || [...initialDoctors]).map((doctor) => ({
      ...normalizeSecurityProfile(doctor),
      role: doctor?.role || 'doctor'
    }));
    this.patients = (this._loadFromStorage('patients') || [...initialPatients]).map((patient) => ({
      ...normalizeSecurityProfile(patient),
      role: patient?.role || 'patient'
    }));
    this.appointments = this._loadFromStorage('appointments') || [...initialAppointments];
    this.admin = normalizeSecurityProfile(this._loadFromStorage('admin') || {
      id: 'admin1',
      role: 'admin',
      email: 'ishimwe@clinic.com',
      name: 'Ishimwe',
      password: 'admin123',
      securityQuestion: 'What is your nickname?',
      securityAnswer: 'Ishimwe'
    });
    this._saveToStorage();
  }

  _loadFromStorage(key) {
    try {
      const data = localStorage.getItem(`clinic-${key}`);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  _saveToStorage() {
    try {
      localStorage.setItem('clinic-doctors', JSON.stringify(this.doctors));
      localStorage.setItem('clinic-patients', JSON.stringify(this.patients));
      localStorage.setItem('clinic-appointments', JSON.stringify(this.appointments));
      localStorage.setItem('clinic-admin', JSON.stringify(this.admin));
    } catch {
      // ignore storage errors
    }
  }

  generateClinicEmail = (fullName, preferredEmail = '') => {
    const source = (preferredEmail || fullName || '').trim();
    const localPart = String(source)
      .toLowerCase()
      .replace(/@clinic\.com$/i, '')
      .replace(/\s+/g, '.')
      .replace(/[^a-z0-9._-]/g, '')
      .replace(/\.+/g, '.')
      .replace(/^\.|\.$/g, '') || 'doctor';

    let candidate = `${localPart}@clinic.com`;
    let counter = 1;
    const existingEmails = new Set(this.getAllUsers().map(user => user.email && user.email.toLowerCase()));

    while (existingEmails.has(candidate.toLowerCase())) {
      candidate = `${localPart}${counter}@clinic.com`;
      counter += 1;
    }

    return candidate;
  };

  // Doctor operations (password included)
  getDoctors = () => [...this.doctors];

  getDoctorById = (id) => this.doctors.find(d => d.id === id);

  addDoctor = (doctor) => {
    const email = this.generateClinicEmail(doctor?.name || '', doctor?.email || '');
    const newDoctor = { 
      ...doctor,
      email,
      id: generateId(), 
      createdAt: new Date().toISOString().split('T')[0],
      role: 'doctor', // Explicit role
      password: doctor?.password || 'doc123',
      securityQuestion: doctor?.securityQuestion || DEFAULT_SECURITY_QUESTION,
      securityAnswer: doctor?.securityAnswer || DEFAULT_SECURITY_ANSWER
    };
    this.doctors.push(newDoctor);
    this._saveToStorage();
    return newDoctor;
  };

  updateDoctor = (id, updates) => {
    const index = this.doctors.findIndex(d => d.id === id);
    if (index !== -1) {
      this.doctors[index] = { ...this.doctors[index], ...updates };
      this._saveToStorage();
      return this.doctors[index];
    }
    return null;
  };

  deleteDoctor = (id) => {
    const index = this.doctors.findIndex(d => d.id === id);
    if (index !== -1) {
      this.doctors.splice(index, 1);
      this._saveToStorage();
      return true;
    }
    return false;
  };

  // Patient operations (password included)
  getPatients = () => [...this.patients];

  getPatientById = (id) => this.patients.find(p => p.id === id);

  addPatient = (patient) => {
    const newPatient = { 
      ...patient,
      id: generateId(), 
      registrationDate: new Date().toISOString().split('T')[0],
      role: 'patient', // Explicit role
      password: patient?.password || 'pat123',
      securityQuestion: patient?.securityQuestion || DEFAULT_SECURITY_QUESTION,
      securityAnswer: patient?.securityAnswer || DEFAULT_SECURITY_ANSWER
    };
    this.patients.push(newPatient);
    this._saveToStorage();
    return newPatient;
  };

  updatePatient = (id, updates) => {
    const index = this.patients.findIndex(p => p.id === id);
    if (index !== -1) {
      this.patients[index] = { ...this.patients[index], ...updates };
      this._saveToStorage();
      return this.patients[index];
    }
    return null;
  };

  deletePatient = (id) => {
    const index = this.patients.findIndex(p => p.id === id);
    if (index !== -1) {
      this.patients.splice(index, 1);
      this._saveToStorage();
      return true;
    }
    return false;
  };

  // Admin operations
  getAdmin = () => ({ ...this.admin });

  updateAdmin = (updates) => {
    this.admin = { ...this.admin, ...updates };
    this._saveToStorage();
    return { ...this.admin };
  };

  // Get all users for auth (patients + doctors + admin)
  getAllUsers = () => {
    return [
      normalizeSecurityProfile({ ...this.admin }),
      ...this.doctors.map((doctor) => ({ ...normalizeSecurityProfile(doctor), role: doctor.role || 'doctor' })),
      ...this.patients.map((patient) => ({ ...normalizeSecurityProfile(patient), role: patient.role || 'patient' }))
    ];
  };

  getUserByEmail = (email) => {
    const normalizedEmail = String(email || '').trim().toLowerCase();
    if (!normalizedEmail) return null;
    return this.getAllUsers().find(user => user.email && user.email.toLowerCase() === normalizedEmail) || null;
  };

  updateUserPassword = (email, newPassword) => {
    const user = this.getUserByEmail(email);
    if (!user) return null;

    if (user.role === 'admin') {
      this.admin = { ...this.admin, password: newPassword };
    } else if (user.role === 'doctor') {
      const index = this.doctors.findIndex(doctor => doctor.id === user.id);
      if (index !== -1) {
        this.doctors[index] = { ...this.doctors[index], password: newPassword };
      }
    } else if (user.role === 'patient') {
      const index = this.patients.findIndex(patient => patient.id === user.id);
      if (index !== -1) {
        this.patients[index] = { ...this.patients[index], password: newPassword };
      }
    }

    this._saveToStorage();
    return user;
  };

  // Appointment operations
  getAppointments = () => [...this.appointments];

  getAppointmentById = (id) => this.appointments.find(a => a.id === id);

  getAppointmentsByDoctor = (doctorId) => this.appointments.filter(a => a.doctorId === doctorId);

  getAppointmentsByPatient = (patientId) => this.appointments.filter(a => a.patientId === patientId);

  getAppointmentsForUser = (user) => {
    if (!user) return [];
    if (user.role === 'patient') return this.getAppointmentsByPatient(user.id);
    if (user.role === 'doctor') return this.getAppointmentsByDoctor(user.id);
    return [...this.appointments];
  };

  getAppointmentsByDate = (date) => this.appointments.filter(a => a.date === date);

  addAppointment = (appointment) => {
    const newAppointment = {
      ...appointment,
      id: generateId(),
      status: APPOINTMENT_STATUS_OPTIONS.includes(appointment?.status) ? appointment.status : 'pending',
      createdAt: new Date().toISOString().split('T')[0]
    };
    this.appointments.push(newAppointment);
    this._saveToStorage();
    return newAppointment;
  };

  updateAppointment = (id, updates) => {
    const index = this.appointments.findIndex(a => a.id === id);
    if (index !== -1) {
      this.appointments[index] = {
        ...this.appointments[index],
        ...updates,
        status: APPOINTMENT_STATUS_OPTIONS.includes(updates?.status) ? updates.status : this.appointments[index].status
      };
      this._saveToStorage();
      return this.appointments[index];
    }
    return null;
  };

  approveAppointment = (id) => {
    return this.updateAppointment(id, { status: 'approved' });
  };

  deleteAppointment = (id) => {
    const index = this.appointments.findIndex(a => a.id === id);
    if (index !== -1) {
      this.appointments.splice(index, 1);
      this._saveToStorage();
      return true;
    }
    return false;
  };

  // Check for appointment conflicts
  hasConflict = (doctorId, date, time, duration, excludeId = null) => {
    const newStart = new Date(`${date}T${time}`);
    const newEnd = new Date(newStart.getTime() + duration * 60000);

    return this.appointments.some(appointment => {
      if (excludeId && appointment.id === excludeId) return false;
      if (appointment.doctorId !== doctorId) return false;
      if (appointment.date !== date) return false;

      const existingStart = new Date(`${appointment.date}T${appointment.time}`);
      const existingEnd = new Date(existingStart.getTime() + appointment.duration * 60000);

      return newStart < existingEnd && newEnd > existingStart;
    });
  };
}

// Create singleton instance
const dataStore = new DataStore();
export default dataStore;

