import { useState, useMemo, useEffect } from 'react';
import {
  Stack, Typography, CircularProgress, TextField, Select, MenuItem,
  FormControl, InputLabel, Chip, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, TablePagination, Box, useMediaQuery
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import axios from 'axios';

// 🔹 Updated Lead Interface (as per your new API response)
interface GeneratedLeads {
  lead_id: string;
  full_name: string;
  mobile_number: string;
  product: string;
  loan_amount: string;
  email: string;
  pancard_number: string;
  aadhar_number: string;
  area_pincode: string;
  monthly_income: string;
  source_of_income: string;
  lead_type: string;
  lead_status: string;
  referral_code: string;
  created_at: string;
}

export const GeneratedLeads = () => {
  const [leads, setLeads] = useState<GeneratedLeads[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 🔹 Filters
  const [search, setSearch] = useState('');
  const [productFilter, setProductFilter] = useState('all');
  const [leadTypeFilter, setLeadTypeFilter] = useState('all');
  const [leadStatusFilter, setLeadStatusFilter] = useState('all');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // 🔹 Fetch leads
  useEffect(() => {
    const fetchLeads = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:3001/api/getgeneratedleads");
        if (res.data.success) {
          setLeads(res.data.leads);
        } else {
          setError("No leads found.");
        }
      } catch (err: any) {
        setError(err.message || "Failed to load leads");
      } finally {
        setLoading(false);
      }
    };
    fetchLeads();
  }, []);

  // 🔹 Filtering logic
  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const matchesSearch =
        !search ||
        lead.full_name.toLowerCase().includes(search.toLowerCase()) ||
        lead.mobile_number.includes(search) ||
        lead.email.toLowerCase().includes(search.toLowerCase());

      const matchesProduct =
        productFilter === 'all' || lead.product === productFilter;

      const matchesLeadType =
        leadTypeFilter === 'all' || lead.lead_type === leadTypeFilter;

      const matchesLeadStatus =
        leadStatusFilter === 'all' || lead.lead_status === leadStatusFilter;

      return matchesSearch && matchesProduct && matchesLeadType && matchesLeadStatus;
    });
  }, [leads, search, productFilter, leadTypeFilter, leadStatusFilter]);

  const paginatedLeads = useMemo(() => {
    const start = page * rowsPerPage;
    return filteredLeads.slice(start, start + rowsPerPage);
  }, [filteredLeads, page, rowsPerPage]);

  // 🔹 Unique dropdown values
  const uniqueProducts = Array.from(new Set(leads.map(l => l.product)));
  const uniqueLeadTypes = Array.from(new Set(leads.map(l => l.lead_type)));
  const uniqueLeadStatuses = Array.from(new Set(leads.map(l => l.lead_status)));

  // 🔹 Loader / Error / Empty states
  if (loading)
    return (
      <Stack alignItems="center" py={4}>
        <CircularProgress />
        <Typography>Loading generated leads...</Typography>
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
        <Typography>No leads available.</Typography>
      </Stack>
    );

  return (
    <Box sx={{ width: '100%', px: { xs: 1, sm: 2, md: 3 } }}>
      <Stack spacing={2}>
        {/* 🔹 Filters Section */}
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={1.5}
          flexWrap="wrap"
          sx={{ width: '100%', justifyContent: 'space-between' }}
        >
          <TextField
            placeholder="Search by name, phone, or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            size="small"
            sx={{ flex: 1, minWidth: { xs: '100%', sm: '180px' } }}
          />

          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Product</InputLabel>
            <Select value={productFilter} onChange={(e) => setProductFilter(e.target.value)} label="Product">
              <MenuItem value="all">All</MenuItem>
              {uniqueProducts.map((prod) => (
                <MenuItem key={prod} value={prod}>{prod}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Lead Type</InputLabel>
            <Select value={leadTypeFilter} onChange={(e) => setLeadTypeFilter(e.target.value)} label="Lead Type">
              <MenuItem value="all">All</MenuItem>
              {uniqueLeadTypes.map((type) => (
                <MenuItem key={type} value={type}>{type}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel>Lead Status</InputLabel>
            <Select value={leadStatusFilter} onChange={(e) => setLeadStatusFilter(e.target.value)} label="Lead Status">
              <MenuItem value="all">All</MenuItem>
              {uniqueLeadStatuses.map((status) => (
                <MenuItem key={status} value={status}>{status}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>

        {/* 🔹 Leads Table */}
        <Paper sx={{ width: '100%', overflowX: 'auto' }}>
          <TableContainer sx={{ maxHeight: isMobile ? 400 : 600 }}>
            <Table stickyHeader size={isMobile ? 'small' : 'medium'}>
              <TableHead>
                <TableRow>
                  <TableCell>Lead ID</TableCell>
                  <TableCell>Full Name</TableCell>
                  {!isMobile && <TableCell>Mobile</TableCell>}
                  {!isMobile && <TableCell>Email</TableCell>}
                  <TableCell>Product</TableCell>
                  <TableCell>Loan Amount</TableCell>
                  {!isMobile && <TableCell>Lead Type</TableCell>}
                  <TableCell>Lead Status</TableCell>
                  {!isMobile && <TableCell>Source</TableCell>}
                  {!isMobile && <TableCell>Created At</TableCell>}
                </TableRow>
              </TableHead>

              <TableBody>
                {paginatedLeads.map((lead) => (
                  <TableRow key={lead.lead_id} hover>
                    <TableCell>{lead.lead_id}</TableCell>
                    <TableCell>{lead.full_name}</TableCell>
                    {!isMobile && <TableCell>{lead.mobile_number}</TableCell>}
                    {!isMobile && <TableCell>{lead.email}</TableCell>}
                    <TableCell>{lead.product}</TableCell>
                    <TableCell>₹{Number(lead.loan_amount).toLocaleString()}</TableCell>
                    {!isMobile && <TableCell>{lead.lead_type}</TableCell>}
                    <TableCell>
                      <Chip
                        label={lead.lead_status}
                        color={
                          lead.lead_status.toLowerCase().includes('follow') ? 'warning' :
                          lead.lead_status.toLowerCase().includes('interested') ? 'success' :
                          'default'
                        }
                        size="small"
                      />
                    </TableCell>
                    {!isMobile && <TableCell>{lead.source_of_income}</TableCell>}
                    {!isMobile && (
                      <TableCell>{new Date(lead.created_at).toLocaleDateString()}</TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* 🔹 Pagination */}
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

