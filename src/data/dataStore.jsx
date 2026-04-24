import { generateId } from '../utils/validation.jsx';
import { initialDoctors, initialPatients, initialAppointments } from './mockData.jsx';

// Data store class - Added password support for patients/doctors + localStorage persistence
class DataStore {
  constructor() {
    this.doctors = this._loadFromStorage('doctors') || [...initialDoctors];
    this.patients = this._loadFromStorage('patients') || [...initialPatients];
    this.appointments = this._loadFromStorage('appointments') || [...initialAppointments];
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
    } catch {
      // ignore storage errors
    }
  }

  // Doctor operations (password included)
  getDoctors = () => [...this.doctors];

  getDoctorById = (id) => this.doctors.find(d => d.id === id);

  addDoctor = (doctor) => {
    const newDoctor = { 
      ...doctor, 
      id: generateId(), 
      createdAt: new Date().toISOString().split('T')[0],
      role: 'doctor', // Explicit role
      password: 'doc123'
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
      password: 'pat123'
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

  // Get all users for auth (patients + doctors + admin)
  getAllUsers = () => {
    const admin = {
      id: 'admin1',
      role: 'admin',
      email: 'ishimwe@clinic.com',
      name: 'Ishimwe',
      password: 'admin123'
    };
    return [admin, ...this.doctors, ...this.patients];
  };

  // Appointment operations
  getAppointments = () => [...this.appointments];

  getAppointmentById = (id) => this.appointments.find(a => a.id === id);

  getAppointmentsByDoctor = (doctorId) => this.appointments.filter(a => a.doctorId === doctorId);

  getAppointmentsByPatient = (patientId) => this.appointments.filter(a => a.patientId === patientId);

  getAppointmentsByDate = (date) => this.appointments.filter(a => a.date === date);

  addAppointment = (appointment) => {
    const newAppointment = {
      ...appointment,
      id: generateId(),
      createdAt: new Date().toISOString().split('T')[0]
    };
    this.appointments.push(newAppointment);
    this._saveToStorage();
    return newAppointment;
  };

  updateAppointment = (id, updates) => {
    const index = this.appointments.findIndex(a => a.id === id);
    if (index !== -1) {
      this.appointments[index] = { ...this.appointments[index], ...updates };
      this._saveToStorage();
      return this.appointments[index];
    }
    return null;
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

