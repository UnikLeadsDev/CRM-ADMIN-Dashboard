import { useState, useMemo } from 'react';
import {
  Box, Typography, CircularProgress, TextField, Select, MenuItem,
  FormControl, InputLabel, Stack, Chip, Pagination, Grid, Card, CardContent, Button
} from '@mui/material';
import { Call as CallIcon, WhatsApp as WhatsAppIcon } from '@mui/icons-material';
import { useLeads } from '../hooks/useLeads';
import type { Lead } from '../types';

export const LeadsOnly = () => {
  const { leads, loading, error } = useLeads();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [employeeFilter, setEmployeeFilter] = useState('all');
  const [page, setPage] = useState(1);
  const leadsPerPage = 24;

  const filteredLeads = useMemo(() => {
    return leads.filter(lead => {
      const matchesSearch = !search || 
        lead['Customer Name'].toLowerCase().includes(search.toLowerCase()) ||
        lead['Mobile Number'].includes(search) ||
        lead['Email ID'].toLowerCase().includes(search.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
      const matchesEmployee = employeeFilter === 'all' || lead['Assigned to Lead Employee ID'] === employeeFilter;
      
      return matchesSearch && matchesStatus && matchesEmployee;
    });
  }, [leads, search, statusFilter, employeeFilter]);

  const paginatedLeads = useMemo(() => {
    const start = (page - 1) * leadsPerPage;
    return filteredLeads.slice(start, start + leadsPerPage);
  }, [filteredLeads, page]);

  const uniqueEmployees = useMemo(() => {
    const employees = new Set(leads.map(lead => lead['Assigned to Lead Employee ID']).filter(Boolean));
    return Array.from(employees);
  }, [leads]);

  const getStatusColor = (status: Lead['status']) => {
    switch (status) {
      case 'open': return 'primary';
      case 'in_process': return 'warning';
      case 'closed': return 'success';
      case 'not_interested': return 'error';
      default: return 'default';
    }
  };

  const handleCall = (phone: string) => {
    window.location.href = `tel:${phone}`;
  };

  const handleWhatsApp = (phone: string) => {
    window.open(`https://wa.me/${phone}`, '_blank');
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={4}>
        <Typography color="error">Error loading leads: {error}</Typography>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        All Leads ({leads.length})
      </Typography>

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mb: 3 }}>
        <TextField
          placeholder="Search by name, phone, or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ minWidth: 300 }}
        />
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Status</InputLabel>
          <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} label="Status">
            <MenuItem value="all">All Status</MenuItem>
            <MenuItem value="open">Open</MenuItem>
            <MenuItem value="in_process">In Process</MenuItem>
            <MenuItem value="closed">Closed</MenuItem>
            <MenuItem value="not_interested">Not Interested</MenuItem>
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Employee</InputLabel>
          <Select value={employeeFilter} onChange={(e) => setEmployeeFilter(e.target.value)} label="Employee">
            <MenuItem value="all">All Employees</MenuItem>
            <MenuItem value="">Unassigned</MenuItem>
            {uniqueEmployees.map(emp => (
              <MenuItem key={emp} value={emp}>{emp}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>

      <Grid container spacing={2}>
        {paginatedLeads.map((lead, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
            <Card sx={{ height: 280, display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flex: 1, p: 2 }}>
                <Stack spacing={1}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 600 }}>
                      {lead['Customer Name']}
                    </Typography>
                    <Chip 
                      label={lead.status || 'open'}
                      color={getStatusColor(lead.status || 'open')}
                      size="small"
                    />
                  </Stack>
                  
                  <Typography variant="body2" color="text.secondary">
                    📱 {lead['Mobile Number']}
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                    ✉️ {lead['Email ID']}
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary">
                    🏷️ {lead['Product looking']}
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary">
                    📍 {lead['Customer City']}
                  </Typography>
                  
                  {lead['Assigned to Lead Employee ID'] && (
                    <Typography variant="body2" color="primary">
                      👤 {lead['Assigned to Lead Employee ID']}
                    </Typography>
                  )}
                  
                  <Typography variant="caption" color="text.secondary">
                    📅 {new Date(lead['Date']).toLocaleDateString()}
                  </Typography>
                </Stack>
              </CardContent>
              
              <Stack direction="row" spacing={1} sx={{ p: 1 }}>
                <Button
                  variant="contained"
                  onClick={() => handleCall(lead['Mobile Number'])}
                  size="small"
                  fullWidth
                  sx={{ minWidth: 0, px: 1, fontSize: '0.7rem' }}
                >
                  <CallIcon sx={{ fontSize: 16, mr: 0.5 }} />
                  Call
                </Button>
                <Button
                  variant="contained"
                  color="success"
                  onClick={() => handleWhatsApp(lead['Mobile Number'])}
                  size="small"
                  fullWidth
                  sx={{ minWidth: 0, px: 1, fontSize: '0.7rem' }}
                >
                  <WhatsAppIcon sx={{ fontSize: 16, mr: 0.5 }} />
                  WhatsApp
                </Button>
              </Stack>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box display="flex" justifyContent="center" mt={3}>
        <Pagination
          count={Math.ceil(filteredLeads.length / leadsPerPage)}
          page={page}
          onChange={(_, newPage) => setPage(newPage)}
          color="primary"
        />
      </Box>
    </Box>
  );
};