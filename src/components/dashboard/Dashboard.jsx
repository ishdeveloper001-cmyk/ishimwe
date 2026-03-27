import React, { useState, useEffect } from 'react';
import { Box, Grid, Card, CardContent, Typography, CircularProgress } from '@mui/material';
import { LocalHospital, People, CalendarMonth, TrendingUp } from '@mui/icons-material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import dataStore from '../../data/dataStore.jsx';

const Dashboard = () => {
  const [stats, setStats] = useState({ totalDoctors: 0, totalPatients: 0, totalAppointments: 0, todayAppointments: 0 });
  const [chartsData, setChartsData] = useState({ dailyAppointments: [], doctorWorkload: [], specializationDistribution: [], appointmentStatus: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadDashboardData(); }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const doctors = dataStore.getDoctors();
      const patients = dataStore.getPatients();
      const appointments = dataStore.getAppointments();
      const today = new Date().toISOString().split('T')[0];
      const todayAppointments = appointments.filter((apt) => apt.date === today);
      setStats({ totalDoctors: doctors.length, totalPatients: patients.length, totalAppointments: appointments.length, todayAppointments: todayAppointments.length });

      const last7Days = [];
      for (let i = 6; i >= 0; i--) { const date = new Date(); date.setDate(date.getDate() - i); const dateStr = date.toISOString().split('T')[0]; last7Days.push({ date: date.toLocaleDateString('en-US', { weekday: 'short' }), appointments: appointments.filter((apt) => apt.date === dateStr).length }); }
      setChartsData((prev) => ({ ...prev, dailyAppointments: last7Days }));

      const doctorCounts = {}; appointments.forEach((apt) => { const doctor = dataStore.getDoctorById(apt.doctorId); if (doctor) doctorCounts[doctor.name] = (doctorCounts[doctor.name] || 0) + 1; });
      const workloadData = Object.entries(doctorCounts).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count).slice(0, 5);
      setChartsData((prev) => ({ ...prev, doctorWorkload: workloadData }));

      const specCounts = {}; doctors.forEach((doctor) => { specCounts[doctor.specialization] = (specCounts[doctor.specialization] || 0) + 1; });
      const specData = Object.entries(specCounts).map(([name, value]) => ({ name, value }));
      setChartsData((prev) => ({ ...prev, specializationDistribution: specData }));

      const statusCounts = { scheduled: 0, completed: 0, cancelled: 0, 'in-progress': 0 }; appointments.forEach((apt) => { if (statusCounts.hasOwnProperty(apt.status)) statusCounts[apt.status]++; });
      const statusData = Object.entries(statusCounts).map(([name, value]) => ({ name: name.charAt(0).toUpperCase() + name.slice(1), value }));
      setChartsData((prev) => ({ ...prev, appointmentStatus: statusData }));
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#1976d2', '#4caf50', '#ff9800', '#f44336', '#9c27b0'];

  const statCards = [
    { title: 'Total Doctors', value: stats.totalDoctors, icon: <LocalHospital />, color: '#1976d2' },
    { title: 'Total Patients', value: stats.totalPatients, icon: <People />, color: '#4caf50' },
    { title: 'Total Appointments', value: stats.totalAppointments, icon: <CalendarMonth />, color: '#ff9800' },
    { title: "Today's Appointments", value: stats.todayAppointments, icon: <TrendingUp />, color: '#9c27b0' },
  ];

  return (
    <Box>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
          <CircularProgress size={60} />
          <Typography variant="h6" sx={{ ml: 2 }}>Loading dashboard...</Typography>
        </Box>
      ) : (
        <>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {statCards.map((stat, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card sx={{ height: '100%', background: `linear-gradient(135deg, ${stat.color} 0%, ${stat.color}99 100%)`, color: 'white' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Box><Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>{stat.title}</Typography><Typography variant="h3" sx={{ fontWeight: 700 }}>{stat.value}</Typography></Box>
                      <Box sx={{ width: 50, height: 50, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>{stat.icon}</Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          <Grid container spacing={3}>
            <Grid item xs={12} lg={8}>
              <Card sx={{ height: '100%' }}><CardContent><Typography variant="h6" sx={{ mb: 3 }}>Appointments This Week</Typography><Box sx={{ height: 300 }}><ResponsiveContainer width="100%" height="100%"><BarChart data={chartsData.dailyAppointments}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="date" /><YAxis /><Tooltip /><Bar dataKey="appointments" fill="#1976d2" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></Box></CardContent></Card>
            </Grid>
            <Grid item xs={12} lg={4}>
              <Card sx={{ height: '100%' }}><CardContent><Typography variant="h6" sx={{ mb: 3 }}>Appointment Status</Typography><Box sx={{ height: 300 }}><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={chartsData.appointmentStatus} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value" label>{chartsData.appointmentStatus.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}</Pie><Tooltip /><Legend /></PieChart></ResponsiveContainer></Box></CardContent></Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card sx={{ height: '100%' }}><CardContent><Typography variant="h6" sx={{ mb: 3 }}>Top Doctors by Appointments</Typography><Box sx={{ height: 300 }}><ResponsiveContainer width="100%" height="100%"><BarChart data={chartsData.doctorWorkload} layout="vertical"><CartesianGrid strokeDasharray="3 3" /><XAxis type="number" /><YAxis dataKey="name" type="category" width={100} /><Tooltip /><Bar dataKey="count" fill="#4caf50" radius={[0, 4, 4, 0]} /></BarChart></ResponsiveContainer></Box></CardContent></Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card sx={{ height: '100%' }}><CardContent><Typography variant="h6" sx={{ mb: 3 }}>Doctors by Specialization</Typography><Box sx={{ height: 300 }}><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={chartsData.specializationDistribution} cx="50%" cy="50%" outerRadius={100} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>{chartsData.specializationDistribution.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}</Pie><Tooltip /><Legend /></PieChart></ResponsiveContainer></Box></CardContent></Card>
            </Grid>
          </Grid>
        </>
      )}
    </Box>
  );
};

export default Dashboard;
