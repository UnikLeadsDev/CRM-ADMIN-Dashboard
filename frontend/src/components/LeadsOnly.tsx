import { useState, useEffect, useMemo } from 'react';
import { Box, Typography, CircularProgress, TextField, Select, MenuItem, FormControl, InputLabel, Stack, Pagination } from '@mui/material';
import { apiClient } from '../services/apiClient';
import type { Lead } from '../types';
import { LeadCard } from './LeadCard';

export const LeadsOnly = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | Lead['status']>('all');
  const [employeeFilter, setEmployeeFilter] = useState('all');
  const [page, setPage] = useState(1);
  const leadsPerPage = 12;

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        setLoading(true);
        const data = await apiClient.getLeads();
        console.log('Fetched leads:', data);
        setLeads(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load leads');
      } finally {
        setLoading(false);
      }
    };
    fetchLeads();
  }, []);

  const filteredLeads = useMemo(() => {
    return leads.filter(lead => {
      const matchesSearch =
        !search ||
        lead.name.toLowerCase().includes(search.toLowerCase()) ||
        lead.phone.includes(search) ||
        lead.email.toLowerCase().includes(search.toLowerCase());

      const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
      const matchesEmployee = employeeFilter === 'all' || lead.assigned_to === employeeFilter;

      return matchesSearch && matchesStatus && matchesEmployee;
    });
  }, [leads, search, statusFilter, employeeFilter]);

  const paginatedLeads = useMemo(() => {
    const start = (page - 1) * leadsPerPage;
    return filteredLeads.slice(start, start + leadsPerPage);
  }, [filteredLeads, page]);

  const uniqueEmployees = useMemo(() => {
    const employees = new Set(leads.map(l => l.assigned_to).filter(Boolean));
    return Array.from(employees);
  }, [leads]);

  const handleStatusChange = (lead: Lead, status: Lead['status']) => {
    setLeads(prev => prev.map(l => (l.id === lead.id ? { ...l, status } : l)));
  };

  if (loading) return <Box display="flex" justifyContent="center" p={4}><CircularProgress /></Box>;
  if (error) return <Box p={4}><Typography color="error">{error}</Typography></Box>;

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>All Leads ({leads.length})</Typography>

      {/* Filters */}
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mb: 3 }}>
        <TextField placeholder="Search by name, phone, or email" value={search} onChange={e => setSearch(e.target.value)} sx={{ minWidth: 300 }} />
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Status</InputLabel>
          <Select value={statusFilter} onChange={e => setStatusFilter(e.target.value as any)} label="Status">
            <MenuItem value="all">All Status</MenuItem>
            <MenuItem value="open">Open</MenuItem>
            <MenuItem value="in_process">In Process</MenuItem>
            <MenuItem value="closed">Closed</MenuItem>
            <MenuItem value="not_interested">Not Interested</MenuItem>
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Employee</InputLabel>
          <Select value={employeeFilter} onChange={e => setEmployeeFilter(e.target.value)} label="Employee">
            <MenuItem value="all">All Employees</MenuItem>
            {uniqueEmployees.map(emp => <MenuItem key={emp} value={emp}>{emp}</MenuItem>)}
          </Select>
        </FormControl>
      </Stack>

      {/* Lead Cards */}
      <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' } }}>
        {paginatedLeads.map(lead => (
          <LeadCard key={lead.id} lead={lead} onStatusChange={handleStatusChange} />
        ))}
      </Box>

      {/* Pagination */}
      <Box display="flex" justifyContent="center" mt={3}>
        <Pagination count={Math.ceil(filteredLeads.length / leadsPerPage)} page={page} onChange={(_, newPage) => setPage(newPage)} color="primary" />
      </Box>
    </Box>
  );
};
