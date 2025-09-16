import { useState, useMemo } from 'react';
import {
  Stack, Typography, CircularProgress, TextField, Select, MenuItem,
  FormControl, InputLabel, Chip, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, TablePagination, Box
} from '@mui/material';
import { apiClient } from '../services/apiClient';
import type { Lead } from '../types';

interface LeadsTableViewProps {
  leads: Lead[];
  loading: boolean;
  error: string | null;
}

export const LeadsTableView = ({ leads, loading, error }: LeadsTableViewProps) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [employeeFilter, setEmployeeFilter] = useState('all');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [reassigning, setReassigning] = useState<{[key: number]: boolean}>({});

  const filteredLeads = useMemo(() => {
    return leads.filter(lead => {
      const matchesSearch = !search || 
        lead['Customer Name']?.toLowerCase().includes(search.toLowerCase()) ||
        lead['Mobile Number']?.includes(search) ||
        lead['Email ID']?.toLowerCase().includes(search.toLowerCase());
      
      // Handle status filtering - check for exact match or null/undefined for 'open'
      let matchesStatus = false;
      if (statusFilter === 'all') {
        matchesStatus = true;
      } else if (statusFilter === 'open') {
        matchesStatus = !lead.status || lead.status === 'open';
      } else {
        matchesStatus = lead.status === statusFilter;
      }
      
      const matchesEmployee = employeeFilter === 'all' || lead['Assigned to Lead Employee ID'] === employeeFilter;
      
      return matchesSearch && matchesStatus && matchesEmployee;
    });
  }, [leads, search, statusFilter, employeeFilter]);

  const paginatedLeads = useMemo(() => {
    const start = page * rowsPerPage;
    return filteredLeads.slice(start, start + rowsPerPage);
  }, [filteredLeads, page, rowsPerPage]);

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

  const handleReassign = async (lead: Lead, newEmployeeId: string, index: number) => {
    setReassigning(prev => ({ ...prev, [index]: true }));
    try {
      await apiClient.reassignLead(lead, newEmployeeId);
      window.location.reload();
    } catch (error) {
      console.error('Error reassigning lead:', error);
      alert('Failed to reassign lead');
    } finally {
      setReassigning(prev => ({ ...prev, [index]: false }));
    }
  };

  if (loading) {
    return (
      <Stack alignItems="center" py={4}>
        <CircularProgress />
        <Typography>Loading leads...</Typography>
      </Stack>
    );
  }

  if (error) {
    return (
      <Stack alignItems="center" py={4}>
        <Typography color="error">Error: {error}</Typography>
      </Stack>
    );
  }

  if (leads.length === 0) {
    return (
      <Stack alignItems="center" py={4}>
        <Typography>No leads found. Upload a CSV file to get started.</Typography>
      </Stack>
    );
  }

  return (
    <Box sx={{ width: '100%', maxWidth: '100%' }}>
      <Stack spacing={2}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ width: '100%' }}>
          <TextField
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            size="small"
            sx={{ flex: 1 }}
          />
          <FormControl size="small" sx={{ minWidth: 100 }}>
            <InputLabel>Status</InputLabel>
            <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} label="Status">
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="open">Open</MenuItem>
              <MenuItem value="in_process">Process</MenuItem>
              <MenuItem value="closed">Closed</MenuItem>
              <MenuItem value="not_interested">Not Int.</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 100 }}>
            <InputLabel>Employee</InputLabel>
            <Select value={employeeFilter} onChange={(e) => setEmployeeFilter(e.target.value)} label="Employee">
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="">None</MenuItem>
              {uniqueEmployees.map(emp => (
                <MenuItem key={emp} value={emp}>{emp}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
        
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          <TableContainer sx={{ maxHeight: 600, width: '100%' }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>Date</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>Email</TableCell>
                  <TableCell>Product</TableCell>
                  <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>City</TableCell>
                  <TableCell>Assigned To</TableCell>
                  <TableCell>Reassign</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedLeads.map((lead, index) => (
                  <TableRow key={index} hover>
                    <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>{new Date(lead['Date']).toLocaleDateString()}</TableCell>
                    <TableCell>{lead['Customer Name']}</TableCell>
                    <TableCell>{lead['Mobile Number']}</TableCell>
                    <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>{lead['Email ID']}</TableCell>
                    <TableCell>{lead['Product looking']}</TableCell>
                    <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>{lead['Customer City']}</TableCell>
                    <TableCell>
                      {lead['Assigned to Lead Employee ID'] ? (
                        <Chip 
                          label={lead['Assigned to Lead Employee ID']} 
                          color="primary" 
                          size="small"
                        />
                      ) : (
                        <Chip 
                          label="Unassigned" 
                          color="default" 
                          size="small"
                        />
                      )}
                    </TableCell>
                    <TableCell>
                      <FormControl size="small" sx={{ minWidth: 80 }}>
                        <Select
                          value={lead['Assigned to Lead Employee ID'] || ''}
                          onChange={(e) => handleReassign(lead, e.target.value, index)}
                          disabled={reassigning[index]}
                          displayEmpty
                        >
                          <MenuItem value="">None</MenuItem>
                          {uniqueEmployees.map(emp => (
                            <MenuItem key={emp} value={emp}>{emp}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={lead.status || 'open'} 
                        color={getStatusColor(lead.status || 'open')}
                        size="small"
                      />
                    </TableCell>
                  </TableRow>
                ))
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={filteredLeads.length}
            page={page}
            onPageChange={(_, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
            rowsPerPageOptions={[25, 50, 100]}
          />
        </Paper>
      </Stack>
    </Box>
  );
};