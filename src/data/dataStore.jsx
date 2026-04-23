import { generateId } from '../utils/validation.jsx';
import { initialDoctors, initialPatients, initialAppointments } from './mockData.jsx';

// Data store class - Added password support for patients/doctors
class DataStore {
  constructor() {
    // Load from localStorage or use initial data
    this.doctors = JSON.parse(localStorage.getItem('clinic-doctors')) || [...initialDoctors];
    this.patients = JSON.parse(localStorage.getItem('clinic-patients')) || [...initialPatients];
    this.appointments = JSON.parse(localStorage.getItem('clinic-appointments')) || [...initialAppointments];
  }

  saveData = () => {
    localStorage.setItem('clinic-doctors', JSON.stringify(this.doctors));
    localStorage.setItem('clinic-patients', JSON.stringify(this.patients));
    localStorage.setItem('clinic-appointments', JSON.stringify(this.appointments));
  };

  // Doctor operations (password included)
  getDoctors = () => [...this.doctors];

  getDoctorById = (id) => this.doctors.find(d => d.id === id);

  addDoctor = (doctor) => {
    const newDoctor = { 
      ...doctor, 
      password: 'doctor123',
      id: generateId(), 
      createdAt: new Date().toISOString().split('T')[0],
      role: 'doctor' // Explicit role
    };
    this.doctors.push(newDoctor);
    this.saveData();
    return newDoctor;
  };

  updateDoctor = (id, updates) => {
    const index = this.doctors.findIndex(d => d.id === id);
    if (index !== -1) {
      this.doctors[index] = { ...this.doctors[index], ...updates };
      this.saveData();
      return this.doctors[index];
    }
    return null;
  };

  deleteDoctor = (id) => {
    const index = this.doctors.findIndex(d => d.id === id);
    if (index !== -1) {
      this.doctors.splice(index, 1);
      this.saveData();
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
      password: 'pat123',
      id: generateId(), 
      registrationDate: new Date().toISOString().split('T')[0],
      role: 'patient' // Explicit role
    };
    this.patients.push(newPatient);
    this.saveData();
    return newPatient;
  };

  updatePatient = (id, updates) => {
    const index = this.patients.findIndex(p => p.id === id);
    if (index !== -1) {
      this.patients[index] = { ...this.patients[index], ...updates };
      this.saveData();
      return this.patients[index];
    }
    return null;
  };

  deletePatient = (id) => {
    const index = this.patients.findIndex(p => p.id === id);
    if (index !== -1) {
      this.patients.splice(index, 1);
      this.saveData();
      return true;
    }
    return false;
  };

  // Get all users for auth (patients + doctors + admin)
  getUserByRoleAndEmail = (role, email) => {
    if (role === 'admin') {
      return { id: 'admin1', role: 'admin', email: 'ishimwe@clinic.com', name: 'Ishimwe' };
    }
    if (role === 'doctor') {
      return this.doctors.find(d => d.email === email);
    }
    if (role === 'patient') {
      return this.patients.find(p => p.email === email);
    }
    return null;
  };

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

  // Appointment operations (unchanged)
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
    this.saveData();
    return newAppointment;
  };

  updateAppointment = (id, updates) => {
    const index = this.appointments.findIndex(a => a.id === id);
    if (index !== -1) {
      this.appointments[index] = { ...this.appointments[index], ...updates };
      this.saveData();
      return this.appointments[index];
    }
    return null;
  };

  deleteAppointment = (id) => {
    const index = this.appointments.findIndex(a => a.id === id);
    if (index !== -1) {
      this.appointments.splice(index, 1);
      this.saveData();
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
