import React, { useState, useEffect, useCallback } from 'react';
import { Box, Grid, Card, CardContent, Typography, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Area, AreaChart, Legend, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import dataStore from '../../data/dataStore.jsx';

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('30');
  const [chartsData, setChartsData] = useState({ appointmentTrend: [], patientVisitFrequency: [], monthlyRevenue: [], departmentWorkload: [], peakHours: [], specializationDemand: [] });

  const loadAnalyticsData = useCallback(() => {
    const appointments = dataStore.getAppointments();
    const doctors = dataStore.getDoctors();

    const days = parseInt(timeRange);
    const appointmentTrend = [];
    for (let i = days - 1; i >= 0; i--) { const date = new Date(); date.setDate(date.getDate() - i); const dateStr = date.toISOString().split('T')[0]; const dayAppointments = appointments.filter((apt) => apt.date === dateStr); appointmentTrend.push({ date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), appointments: dayAppointments.length, completed: dayAppointments.filter((apt) => apt.status === 'completed').length, cancelled: dayAppointments.filter((apt) => apt.status === 'cancelled').length }); }
    setChartsData((prev) => ({ ...prev, appointmentTrend }));

    const patientVisitCounts = {}; appointments.forEach((apt) => { if (!patientVisitCounts[apt.patientId]) { const patient = dataStore.getPatientById(apt.patientId); patientVisitCounts[apt.patientId] = { name: patient?.name || 'Unknown', visits: 0 }; } patientVisitCounts[apt.patientId].visits++; });
    const visitFrequencyData = Object.values(patientVisitCounts).sort((a, b) => b.visits - a.visits).slice(0, 10);
    setChartsData((prev) => ({ ...prev, patientVisitFrequency: visitFrequencyData }));

    const monthlyRevenue = [{ month: 'Jan', revenue: 12500 }, { month: 'Feb', revenue: 15800 }, { month: 'Mar', revenue: 14200 }, { month: 'Apr', revenue: 18900 }, { month: 'May', revenue: 21000 }, { month: 'Jun', revenue: 19500 }];
    setChartsData((prev) => ({ ...prev, monthlyRevenue }));

    const deptCounts = {}; appointments.forEach((apt) => { const doctor = doctors.find((d) => d.id === apt.doctorId); if (doctor) deptCounts[doctor.specialization] = (deptCounts[doctor.specialization] || 0) + 1; });
    const departmentData = Object.entries(deptCounts).map(([department, appointments]) => ({ department, appointments }));
    setChartsData((prev) => ({ ...prev, departmentWorkload: departmentData }));

    const hourCounts = {}; appointments.forEach((apt) => { const hour = parseInt(apt.time.split(':')[0], 10); const period = hour < 12 ? 'Morning (8AM-12PM)' : hour < 17 ? 'Afternoon (12PM-5PM)' : 'Evening (5PM+)'; hourCounts[period] = (hourCounts[period] || 0) + 1; });
    const peakHoursData = Object.entries(hourCounts).map(([period, count]) => ({ period, count }));
    setChartsData((prev) => ({ ...prev, peakHours: peakHoursData }));

    const specCounts = {}; appointments.forEach((apt) => { const doctor = doctors.find((d) => d.id === apt.doctorId); if (doctor) specCounts[doctor.specialization] = (specCounts[doctor.specialization] || 0) + 1; });
    const demandData = Object.entries(specCounts).map(([specialty, demand]) => ({ specialty, demand })).sort((a, b) => b.demand - a.demand);
    setChartsData((prev) => ({ ...prev, specializationDemand: demandData }));
  }, [timeRange]);

  useEffect(() => { loadAnalyticsData(); }, [loadAnalyticsData]);

  const COLORS = ['#1976d2', '#4caf50', '#ff9800', '#f44336', '#9c27b0', '#00bcd4'];

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5">Analytics Dashboard</Typography>
        <FormControl size="small" sx={{ minWidth: 150 }}><InputLabel>Time Range</InputLabel><Select value={timeRange} onChange={(e) => setTimeRange(e.target.value)} label="Time Range"><MenuItem value="7">Last 7 Days</MenuItem><MenuItem value="14">Last 14 Days</MenuItem><MenuItem value="30">Last 30 Days</MenuItem><MenuItem value="60">Last 60 Days</MenuItem></Select></FormControl>
      </Box>
      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}><Card><CardContent><Typography variant="h6" sx={{ mb: 3 }}>Appointment Trend</Typography><Box sx={{ height: 350 }}><ResponsiveContainer width="100%" height="100%"><AreaChart data={chartsData.appointmentTrend}><defs><linearGradient id="colorAppointments" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#1976d2" stopOpacity={0.8}/><stop offset="95%" stopColor="#1976d2" stopOpacity={0}/></linearGradient></defs><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="date" /><YAxis /><Tooltip /><Legend /><Area type="monotone" dataKey="appointments" stroke="#1976d2" fillOpacity={1} fill="url(#colorAppointments)" name="Total Appointments" /><Line type="monotone" dataKey="completed" stroke="#4caf50" strokeWidth={2} name="Completed" /></AreaChart></ResponsiveContainer></Box></CardContent></Card></Grid>
        <Grid item xs={12} lg={4}><Card sx={{ height: '100%' }}><CardContent><Typography variant="h6" sx={{ mb: 3 }}>Peak Hours Analysis</Typography><Box sx={{ height: 350 }}><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={chartsData.peakHours} cx="50%" cy="50%" outerRadius={100} dataKey="count" nameKey="period" label={({ period, count, percent }) => `${period}: ${count} (${(percent * 100).toFixed(0)}%)`}>{chartsData.peakHours.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></Box></CardContent></Card></Grid>
        <Grid item xs={12} md={6}><Card><CardContent><Typography variant="h6" sx={{ mb: 3 }}>Department Workload</Typography><Box sx={{ height: 350 }}><ResponsiveContainer width="100%" height="100%"><BarChart data={chartsData.departmentWorkload}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="department" angle={-45} textAnchor="end" height={80} /><YAxis /><Tooltip /><Bar dataKey="appointments" fill="#ff9800" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></Box></CardContent></Card></Grid>
        <Grid item xs={12} md={6}><Card><CardContent><Typography variant="h6" sx={{ mb: 3 }}>Most Requested Specializations</Typography><Box sx={{ height: 350 }}><ResponsiveContainer width="100%" height="100%"><RadarChart data={chartsData.specializationDemand}><PolarGrid /><PolarAngleAxis dataKey="specialty" /><PolarRadiusAxis /><Radar name="Demand" dataKey="demand" stroke="#9c27b0" fill="#9c27b0" fillOpacity={0.6} /></RadarChart></ResponsiveContainer></Box></CardContent></Card></Grid>
        <Grid item xs={12}><Card><CardContent><Typography variant="h6" sx={{ mb: 3 }}>Top Patients by Visit Frequency</Typography><Box sx={{ height: 300 }}><ResponsiveContainer width="100%" height="100%"><BarChart data={chartsData.patientVisitFrequency} layout="vertical"><CartesianGrid strokeDasharray="3 3" /><XAxis type="number" /><YAxis dataKey="name" type="category" width={120} /><Tooltip /><Bar dataKey="visits" fill="#4caf50" radius={[0, 4, 4, 0]} /></BarChart></ResponsiveContainer></Box></CardContent></Card></Grid>
        <Grid item xs={12}><Card><CardContent><Typography variant="h6" sx={{ mb: 3 }}>Monthly Revenue (USD)</Typography><Box sx={{ height: 300 }}><ResponsiveContainer width="100%" height="100%"><LineChart data={chartsData.monthlyRevenue}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" /><YAxis /><Tooltip formatter={(value) => `$${value.toLocaleString()}`} /><Line type="monotone" dataKey="revenue" stroke="#1976d2" strokeWidth={3} dot={{ fill: '#1976d2', strokeWidth: 2 }} name="Revenue" /></LineChart></ResponsiveContainer></Box></CardContent></Card></Grid>
      </Grid>
    </Box>
  );
};

export default Analytics;
