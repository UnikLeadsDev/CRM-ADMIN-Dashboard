import { useState, useMemo, useEffect } from 'react';
import {
  Stack, Typography, CircularProgress, TextField, Select, MenuItem,
  FormControl, InputLabel, Chip, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, TablePagination, Box, IconButton, useMediaQuery
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import axios from 'axios';
import Link from '@mui/material/Link';

interface Lead {
  id: number;
  date: string;
  name: string;
  phone: string;
  email: string;
  product: string;
  city: string;
  location: string;
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

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // 👈 detect mobile

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://44.193.214.12:3001/api/getassignleads");
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
      await axios.put(`http://44.193.214.12:3001/api/reassign/${leadId}`, {
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

      const matchesStatus =
        statusFilter === 'all' ? true :
          statusFilter === 'open' ? !lead.status || lead.status === 'open' :
            lead.status === statusFilter;

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

  if (loading)
    return (
      <Stack alignItems="center" py={4}>
        <CircularProgress />
        <Typography>Loading leads...</Typography>
      </Stack>
    );

  if (error)
    return (
      <Stack alignItems="center" py={4}>
        <Typography color="error">Error: {error}</Typography>
      </Stack>
    );

  if (leads.length === 0)
    return (
      <Stack alignItems="center" py={4}>
        <Typography>No leads found.</Typography>
      </Stack>
    );

  return (
    <Box sx={{ width: '100%', px: { xs: 1, sm: 2, md: 3 },marginTop: 4 }}>
      <Stack spacing={2}>
        {/* 🔹 Filters */}
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={1.5}
          flexWrap="wrap"
          sx={{ width: '100%', justifyContent: 'space-between' }}
        >
          <TextField
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            size="small"
            sx={{ flex: 1, minWidth: { xs: '100%', sm: '180px' } }}
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
            <Select value={productFilter} onChange={(e) => setProductFilter(e.target.value)} label="Product">
              <MenuItem value="all">All</MenuItem>
              {Array.from(new Set(leads.map(lead => lead.product))).map(prod => (
                <MenuItem key={prod} value={prod}>{prod}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>City</InputLabel>
            <Select value={cityFilter} onChange={(e) => setCityFilter(e.target.value)} label="City">
              <MenuItem value="all">All</MenuItem>
              {Array.from(new Set(leads.map(lead => lead.city))).map(city => (
                <MenuItem key={city} value={city}>{city}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Status</InputLabel>
            <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} label="Status">
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="open">Open</MenuItem>
              <MenuItem value="in_process">In Process</MenuItem>
              <MenuItem value="closed">Closed</MenuItem>
              <MenuItem value="not_interested">Not Interested</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Employee</InputLabel>
            <Select value={employeeFilter} onChange={(e) => setEmployeeFilter(e.target.value)} label="Employee">
              <MenuItem value="all">All</MenuItem>
              {uniqueEmployees.map(emp => (
                <MenuItem key={emp} value={emp}>{emp}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>

        {/* 🔹 Responsive Table */}
        <Paper sx={{ width: '100%', overflowX: 'auto' }}>
          <TableContainer sx={{ maxHeight: isMobile ? 400 : 600 }}>
            <Table stickyHeader size={isMobile ? 'small' : 'medium'}>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Name</TableCell>
                  {!isMobile && <TableCell>Phone</TableCell>}
                  {!isMobile && <TableCell>Email</TableCell>}
                  <TableCell>Product</TableCell>
                  {!isMobile && <TableCell>City</TableCell>}
                  {!isMobile && <TableCell>Location</TableCell>}
                  <TableCell>Assigned To</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {paginatedLeads.map((lead) => (
                  <TableRow key={lead.id} hover>
                    <TableCell>{new Date(lead.date).toLocaleDateString()}</TableCell>
                    <TableCell>{lead.name}</TableCell>
                    {!isMobile && <TableCell>{lead.phone}</TableCell>}
                    {!isMobile && <TableCell>{lead.email}</TableCell>}
                    <TableCell>{lead.product}</TableCell>
                    {!isMobile && <TableCell>{lead.city}</TableCell>}
                     <TableCell>
                      <Link
                        href={lead.location}
                        target="_blank"
                        rel="noopener noreferrer"
                        underline="hover"
                        color="primary"
                      >
                        View Map
                      </Link>
                    </TableCell>
                    <TableCell>
                      {editingLeadId === lead.id ? (
                        <FormControl size="small" sx={{ minWidth: 120 }}>
                          <Select
                            value={lead.assigned_to || ''}
                            onChange={(e) => handleReassign(lead.id, e.target.value)}
                            onBlur={() => setEditingLeadId(null)}
                          >
                            {uniqueEmployees.map((emp) => (
                              <MenuItem key={emp} value={emp}>{emp}</MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      ) : (
                        <Chip
                          label={lead.assigned_to || "Unassigned"}
                          color={lead.assigned_to ? "primary" : "default"}
                          size="small"
                          onClick={() => setEditingLeadId(lead.id)}
                          sx={{ cursor: "pointer" }}
                        />
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
            rowsPerPageOptions={[10, 25, 50]}
          />
        </Paper>
      </Stack>
    </Box>
  );
};
