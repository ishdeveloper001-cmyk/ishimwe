import React, { useState, useEffect } from 'react';
import { Box, Grid, Card, CardContent, Typography, CircularProgress, Chip, Button } from '@mui/material';
import { LocalHospital, People, CalendarMonth, TrendingUp } from '@mui/icons-material';
import { LineChart, Line, Area, AreaChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import dataStore from '../../data/dataStore.jsx';

const Dashboard = () => {
  const [stats, setStats] = useState({ totalDoctors: 0, totalPatients: 0, totalAppointments: 0, todayAppointments: 0 });
  const [chartsData, setChartsData] = useState({ dailyAppointments: [], doctorWorkload: [], specializationDistribution: [], appointmentStatus: [] });
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('week');

  useEffect(() => { loadDashboardData(); }, [timeRange]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const doctors = dataStore.getDoctors();
      const patients = dataStore.getPatients();
      const appointments = dataStore.getAppointments();
      
      const today = new Date().toISOString().split('T')[0];
      const todayAppointments = appointments.filter((apt) => apt.date === today);
      
      setStats({ 
        totalDoctors: doctors.length, 
        totalPatients: patients.length, 
        totalAppointments: appointments.length, 
        todayAppointments: todayAppointments.length 
      });

      const daysBack = timeRange === 'week' ? 7 : timeRange === 'month' ? 30 : 90;
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - daysBack);
      const startDateStr = startDate.toISOString().split('T')[0];
      const filteredAppointments = appointments.filter(apt => apt.date >= startDateStr);

      const dailyAppointments = [];
      for (let i = daysBack - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
        const dayAppointments = filteredAppointments.filter((apt) => apt.date === dateStr).length;
        dailyAppointments.push({ date: dayName, appointments: dayAppointments });
      }
      setChartsData((prev) => ({ ...prev, dailyAppointments }));

      const doctorCounts = {};
      filteredAppointments.forEach((apt) => {
        const doctor = dataStore.getDoctorById(apt.doctorId);
        if (doctor) doctorCounts[doctor.name] = (doctorCounts[doctor.name] || 0) + 1;
      });
      const workloadData = Object.entries(doctorCounts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);
      setChartsData((prev) => ({ ...prev, doctorWorkload: workloadData }));

      const specCounts = {};
      doctors.forEach((doctor) => {
        specCounts[doctor.specialization] = (specCounts[doctor.specialization] || 0) + 1;
      });
      const specData = Object.entries(specCounts).map(([name, value]) => ({ name, value }));
      setChartsData((prev) => ({ ...prev, specializationDistribution: specData }));

      const statusCounts = { scheduled: 0, completed: 0, cancelled: 0, 'in-progress': 0 };
      filteredAppointments.forEach((apt) => {
        if (statusCounts.hasOwnProperty(apt.status)) statusCounts[apt.status]++;
      });
      const statusData = Object.entries(statusCounts)
        .map(([name, value]) => ({ 
          name: name.charAt(0).toUpperCase() + name.slice(1), 
          value 
        }));
      setChartsData((prev) => ({ ...prev, appointmentStatus: statusData }));
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#6366f1', '#ec4899', '#14b8a6', '#f59e0b', '#ef4444', '#8b5cf6'];

  const statCards = [
    { 
      title: 'Total Doctors', 
      value: stats.totalDoctors, 
      icon: <LocalHospital />, 
      gradient: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
      trend: '+12%',
      trendUp: true
    },
    { 
      title: 'Total Patients', 
      value: stats.totalPatients, 
      icon: <People />, 
      gradient: 'linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)',
      trend: '+8%',
      trendUp: true
    },
    { 
      title: 'Total Appointments', 
      value: stats.totalAppointments, 
      icon: <CalendarMonth />, 
      gradient: 'linear-gradient(135deg, #14b8a6 0%, #06b6d4 100%)',
      trend: '+15%',
      trendUp: true
    },
    { 
      title: "Today's Appointments", 
      value: stats.todayAppointments, 
      icon: <TrendingUp />, 
      gradient: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)',
      trend: '+5%',
      trendUp: true
    },
  ];

  return (
    <Box sx={{ 
      background: 'transparent',
      minHeight: '100vh',
      pb: 4
    }}>
      {loading ? (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '60vh',
          flexDirection: 'column',
          gap: 2
        }}>
          <CircularProgress size={60} sx={{ color: '#6366f1' }} />
          <Typography variant="h6" sx={{ color: 'text.secondary' }}>Loading dashboard...</Typography>
        </Box>
      ) : (
        <>
          <Box sx={{ mb: 4 }}>
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 700,
                mb: 1,
                background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              Welcome Back! 👋
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Here's what's happening with your clinic today
            </Typography>
          </Box>

          <Box sx={{ mb: 4, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            {['week', 'month', 'quarter'].map((range) => (
              <Button
                key={range}
                variant={timeRange === range ? 'contained' : 'outlined'}
                onClick={() => setTimeRange(range)}
                sx={{
                  borderRadius: 20,
                  textTransform: 'capitalize',
                  px: 3,
                  ...(timeRange === range && {
                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                    boxShadow: '0 4px 15px rgba(99, 102, 241, 0.4)',
                  }),
                }}
              >
                {range}
              </Button>
            ))}
          </Box>

          <Grid container spacing={3} sx={{ mb: 4 }}>
            {statCards.map((stat, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card 
                  sx={{ 
                    height: '100%',
                    background: stat.gradient,
                    color: 'white',
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: -50,
                      right: -50,
                      width: 150,
                      height: 150,
                      background: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '50%',
                    },
                  }}
                >
                  <CardContent sx={{ position: 'relative', zIndex: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Box sx={{ 
                        width: 56, 
                        height: 56, 
                        borderRadius: '50%', 
                        bgcolor: 'rgba(255,255,255,0.2)', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        backdropFilter: 'blur(10px)'
                      }}>
                        {stat.icon}
                      </Box>
                      <Chip 
                        label={stat.trend}
                        size="small"
                        sx={{ 
                          bgcolor: 'rgba(255,255,255,0.2)',
                          color: 'white',
                          fontWeight: 600,
                          backdropFilter: 'blur(10px)'
                        }}
                      />
                    </Box>
                    <Typography variant="body2" sx={{ opacity: 0.9, mb: 1, fontWeight: 500 }}>
                      {stat.title}
                    </Typography>
                    <Typography variant="h3" sx={{ fontWeight: 700, fontSize: '2.5rem' }}>
                      {stat.value}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Grid container spacing={3}>
            <Grid item xs={12} lg={8}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Appointments Trend
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Daily appointment overview
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Chip 
                        label="This Week" 
                        size="small" 
                        sx={{ 
                          bgcolor: 'primary.main',
                          color: 'white',
                          fontWeight: 500
                        }} 
                      />
                    </Box>
                  </Box>
                  <Box sx={{ height: 350 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartsData.dailyAppointments}>
                        <defs>
                          <linearGradient id="colorAppointments" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis dataKey="date" stroke="#64748b" />
                        <YAxis stroke="#64748b" />
                        <Tooltip 
                          contentStyle={{ 
                            borderRadius: 12, 
                            border: 'none',
                            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
                          }}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="appointments" 
                          stroke="#6366f1" 
                          strokeWidth={3}
                          fillOpacity={1} 
                          fill="url(#colorAppointments)" 
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} lg={4}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Appointment Status
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Current status distribution
                    </Typography>
                  </Box>
                  <Box sx={{ height: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={chartsData.appointmentStatus}
                          cx="50%"
                          cy="50%"
                          innerRadius={70}
                          outerRadius={110}
                          paddingAngle={5}
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          labelLine={false}
                        >
                          {chartsData.appointmentStatus.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ 
                            borderRadius: 12, 
                            border: 'none',
                            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Top Doctors
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Most active this period
                    </Typography>
                  </Box>
                  <Box sx={{ height: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartsData.doctorWorkload} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis type="number" stroke="#64748b" />
                        <YAxis dataKey="name" type="category" width={100} stroke="#64748b" />
                        <Tooltip 
                          contentStyle={{ 
                            borderRadius: 12, 
                            border: 'none',
                            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
                          }}
                        />
                        <Bar 
                          dataKey="count" 
                          fill="url(#barGradient)" 
                          radius={[0, 8, 8, 0]}
                        />
                        <defs>
                          <linearGradient id="barGradient" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="#ec4899" />
                            <stop offset="100%" stopColor="#f43f5e" />
                          </linearGradient>
                        </defs>
                      </BarChart>
                    </ResponsiveContainer>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Specializations
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Department distribution
                    </Typography>
                  </Box>
                  <Box sx={{ height: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={chartsData.specializationDistribution}
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          dataKey="value"
                          label={({ name, value }) => `${name}: ${value}`}
                          labelLine={false}
                        >
                          {chartsData.specializationDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ 
                            borderRadius: 12, 
                            border: 'none',
                            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </>
      )}
    </Box>
  );
};

export default Dashboard;