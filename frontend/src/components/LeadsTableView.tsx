import { useState, useMemo, useEffect } from 'react';
import {
  Stack, Typography, CircularProgress, TextField, Select, MenuItem,
  FormControl, InputLabel, Chip, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, TablePagination, Box, IconButton
} from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';
import axios from 'axios';

interface Lead {
  id: number;
  date: string;
  name: string;
  phone: string;
  email: string;
  product: string;
  city: string;
  assigned_to: string;
  status: 'open' | 'in_process' | 'closed' | 'not_interested';
}

export const LeadsTableView = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [employeeFilter, setEmployeeFilter] = useState('all');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [dateFilter, setDateFilter] = useState('');
  const [productFilter, setProductFilter] = useState('all');
  const [cityFilter, setCityFilter] = useState('all');


  const [editingLeadId, setEditingLeadId] = useState<number | null>(null);

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:3001/api/getassignleads");
        if (res.data.success) {
          setLeads(res.data.leads);
        }
      } catch (err: any) {
        setError(err.message || "Failed to load leads");
      } finally {
        setLoading(false);
      }
    };

    fetchLeads();
  }, []);

  const handleReassign = async (leadId: number, newEmployee: string) => {
    try {
      await axios.put(`http://localhost:3001/api/reassign/${leadId}`, {
        assigned_to: newEmployee,
      });
      setLeads((prev) =>
        prev.map((lead) =>
          lead.id === leadId ? { ...lead, assigned_to: newEmployee } : lead
        )
      );
      setEditingLeadId(null);
    } catch (err: any) {
      console.error("Reassign failed", err);
    }
  };

  const filteredLeads = useMemo(() => {
    return leads.filter(lead => {
      const matchesSearch = !search ||
        lead.name.toLowerCase().includes(search.toLowerCase()) ||
        lead.phone.includes(search) ||
        lead.email.toLowerCase().includes(search.toLowerCase());

      let matchesStatus = false;
      if (statusFilter === 'all') matchesStatus = true;
      else if (statusFilter === 'open') matchesStatus = !lead.status || lead.status === 'open';
      else matchesStatus = lead.status === statusFilter;

      const matchesEmployee = employeeFilter === 'all' || lead.assigned_to === employeeFilter;

      const matchesDate = !dateFilter || lead.date === dateFilter;
      const matchesProduct = productFilter === 'all' || lead.product === productFilter;
      const matchesCity = cityFilter === 'all' || lead.city === cityFilter;

      return matchesSearch && matchesStatus && matchesEmployee && matchesDate && matchesProduct && matchesCity;
    });
  }, [leads, search, statusFilter, employeeFilter, dateFilter, productFilter, cityFilter]);

  const paginatedLeads = useMemo(() => {
    const start = page * rowsPerPage;
    return filteredLeads.slice(start, start + rowsPerPage);
  }, [filteredLeads, page, rowsPerPage]);

  const uniqueEmployees = useMemo(() => {
    const employees = new Set(leads.map(lead => lead.assigned_to).filter(Boolean));
    return Array.from(employees);
  }, [leads, search, statusFilter, employeeFilter, dateFilter, productFilter, cityFilter]);

  const getStatusColor = (status: Lead['status']) => {
    switch (status) {
      case 'open': return 'primary';
      case 'in_process': return 'warning';
      case 'closed': return 'success';
      case 'not_interested': return 'error';
      default: return 'default';
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
        <Typography>No leads found.</Typography>
      </Stack>
    );
  }

  return (
    <Box sx={{ width: '100%', maxWidth: '100%' }}>
      <Stack spacing={2}>
        {/* Filters */}
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ width: '100%' }}>
          <TextField
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            size="small"
            sx={{ flex: 1 }}
          />
          <TextField
            type="date"
            size="small"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            sx={{ minWidth: 120 }}
          />

          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Product</InputLabel>
            <Select
              value={productFilter}
              onChange={(e) => setProductFilter(e.target.value)}
              label="Product"
            >
              <MenuItem value="all">All</MenuItem>
              {Array.from(new Set(leads.map(lead => lead.product))).map((prod) => (
                <MenuItem key={prod} value={prod}>{prod}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>City</InputLabel>
            <Select
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              label="City"
            >
              <MenuItem value="all">All</MenuItem>
              {Array.from(new Set(leads.map(lead => lead.city))).map((city) => (
                <MenuItem key={city} value={city}>{city}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 100 }}>
            <InputLabel>Status</InputLabel>
            <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} label="Status">
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="open">Open</MenuItem>
              <MenuItem value="in_process">In Process</MenuItem>
              <MenuItem value="closed">Closed</MenuItem>
              <MenuItem value="not_interested">Not Interested</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 100 }}>
            <InputLabel>Employee</InputLabel>
            <Select value={employeeFilter} onChange={(e) => setEmployeeFilter(e.target.value)} label="Employee">
              <MenuItem value="all">All</MenuItem>
              {uniqueEmployees.map(emp => (
                <MenuItem key={emp} value={emp}>{emp}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>

        {/* Leads Table */}
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          <TableContainer sx={{ maxHeight: 600, width: '100%' }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Product</TableCell>
                  <TableCell>City</TableCell>
                  <TableCell>Assigned To</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedLeads.map((lead) => (
                  <TableRow key={lead.id} hover>
                    <TableCell>{new Date(lead.date).toLocaleDateString()}</TableCell>
                    <TableCell>{lead.name}</TableCell>
                    <TableCell>{lead.phone}</TableCell>
                    <TableCell>{lead.email}</TableCell>
                    <TableCell>{lead.product}</TableCell>
                    <TableCell>{lead.city}</TableCell>
                    <TableCell>
                      {editingLeadId === lead.id ? (
                        <FormControl size="small" sx={{ minWidth: 120 }}>
                          <Select
                            value={lead.assigned_to || ''}
                            onChange={(e) => handleReassign(lead.id, e.target.value)}
                            onBlur={() => setEditingLeadId(null)} // closes after selection
                          >
                            {uniqueEmployees.map((emp) => (
                              <MenuItem key={emp} value={emp}>{emp}</MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      ) : (
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Chip
                            label={lead.assigned_to || "Unassigned"}
                            color={lead.assigned_to ? "primary" : "default"}
                            size="small"
                            onClick={() => setEditingLeadId(lead.id)} // 👈 enable editing
                            sx={{ cursor: "pointer" }}
                          />
                        </Stack>
                      )}

                    </TableCell>
                    <TableCell>
                      <Chip
                        label={lead.status || 'open'}
                        color={getStatusColor(lead.status || 'open')}
                        size="small"
                      />
                    </TableCell>
                  </TableRow>
                ))}
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
