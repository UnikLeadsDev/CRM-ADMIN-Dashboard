import { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Stack,
  Pagination,
  Paper
} from '@mui/material';
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

  if (loading)
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );

  if (error)
    return (
      <Box p={4} textAlign="center">
        <Typography color="error" variant="h6">
          {error}
        </Typography>
      </Box>
    );

  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, width: '100%' }}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{ fontSize: { xs: '1.5rem', sm: '2rem' }, textAlign: { xs: 'center', md: 'left' } }}
      >
        Assigened Leads Employee ({leads.length})
      </Typography>

      {/* Filters */}
      <Paper
        elevation={1}
        sx={{
          p: 2,
          mb: 3,
          borderRadius: 2,
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: 2,
          alignItems: { xs: 'stretch', md: 'center' },
          justifyContent: 'space-between',
          flexWrap: 'wrap'
        }}
      >
        <TextField
          placeholder="Search by name, phone, or email"
          value={search}
          onChange={e => setSearch(e.target.value)}
          fullWidth
          sx={{ flex: 1, minWidth: { xs: '100%', sm: 300 } }}
        />

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ flex: 1, justifyContent: 'flex-end' }}>
          <FormControl fullWidth sx={{ minWidth: { xs: '100%', sm: 150 } }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value as any)}
              label="Status"
              fullWidth
            >
              <MenuItem value="all">All Status</MenuItem>
              <MenuItem value="new_added">New Added</MenuItem>
              <MenuItem value="contacted">Contacted</MenuItem>
              <MenuItem value="interested">Interested</MenuItem>
              <MenuItem value="in_follow_up">In Follow-Up</MenuItem>
              <MenuItem value="converted">Converted</MenuItem>
              <MenuItem value="not_interested">Not Interested</MenuItem>
              <MenuItem value="invalid">Invalid</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ minWidth: { xs: '100%', sm: 150 } }}>
            <InputLabel>Employee</InputLabel>
            <Select
              value={employeeFilter}
              onChange={e => setEmployeeFilter(e.target.value)}
              label="Employee"
              fullWidth
            >
              <MenuItem value="all">All Employees</MenuItem>
              {uniqueEmployees.map(emp => (
                <MenuItem key={emp} value={emp}>
                  {emp}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
      </Paper>

      {/* Lead Cards Grid */}
      <Box
        sx={{
          display: 'grid',
          gap: 2,
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
            lg: 'repeat(4, 1fr)'
          }
        }}
      >
        {paginatedLeads.map(lead => (
          <LeadCard key={lead.id} lead={lead} onStatusChange={handleStatusChange} />
        ))}
      </Box>

      {/* Pagination */}
      <Box display="flex" justifyContent="center" mt={4}>
        <Pagination
          count={Math.ceil(filteredLeads.length / leadsPerPage)}
          page={page}
          onChange={(_, newPage) => setPage(newPage)}
          color="primary"
          sx={{ '& .MuiPaginationItem-root': { fontSize: { xs: '0.8rem', sm: '1rem' } } }}
        />
      </Box>
    </Box>
  );
};
