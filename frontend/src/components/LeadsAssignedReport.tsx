import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Typography, Card, CardContent, Box, Chip,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, CircularProgress, Select, MenuItem, FormControl, InputLabel,
  Button, Stack
} from '@mui/material';

export interface Lead {
  id: number;
  date: string;
  name: string;
  phone: string;
  email: string;
  product: string;
  city: string;
  assigned_to: string;
  status: 'new_added' | 'contacted' | 'interested' | 'in_follow_up' | 'converted' | 'not_interested' | 'invalid';
}

interface EmployeeLeads {
  employee_id: string;
  lead_count: number;
  leads: Lead[];
}

export const LeadsAssignedReport = () => {
  const [assignments, setAssignments] = useState<EmployeeLeads[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEmployee, setSelectedEmployee] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState<Record<string, number>>({});
  const [employeePage, setEmployeePage] = useState(1);

  const LEADS_PER_PAGE = 10;
  const EMPLOYEES_PER_PAGE = 2;

  useEffect(() => {
    loadAssignments();
  }, []);

  const loadAssignments = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://44.193.214.12:3001/api/getassignleads");

      if (res.data.success && res.data.leads) {
        const grouped: Record<string, Lead[]> = {};
        res.data.leads.forEach((lead: Lead) => {
          if (!grouped[lead.assigned_to]) grouped[lead.assigned_to] = [];
          grouped[lead.assigned_to].push(lead);
        });

        const formatted: EmployeeLeads[] = Object.entries(grouped).map(
          ([employee_id, leads]) => ({
            employee_id,
            lead_count: leads.length,
            leads
          })
        );

        setAssignments(formatted);

        const pages: Record<string, number> = {};
        formatted.forEach(emp => {
          pages[emp.employee_id] = 1;
        });
        setCurrentPage(pages);
      }
    } catch (error) {
      console.error('Error loading assignments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (lead: Lead, status: Lead['status']) => {
    try {
      await axios.put(`http://44.193.214.12:3001/api/leads/${lead.id}/status`, { status });
      loadAssignments();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const getStatusColor = (status: Lead['status']) => {
    switch (status) {
      case 'new_added': return 'primary';
      case 'contacted': return 'info';
      case 'interested': return 'success';
      case 'in_follow_up': return 'warning';
      case 'converted': return 'secondary';
      case 'not_interested': return 'error';
      case 'invalid': return 'default';
      default: return 'default';
    }
  };

  const filteredAssignments = selectedEmployee === 'all'
    ? assignments
    : assignments.filter(a => a.employee_id === selectedEmployee);

  const totalLeads = assignments.reduce((sum, a) => sum + a.lead_count, 0);
  const totalEmployeePages = Math.ceil(filteredAssignments.length / EMPLOYEES_PER_PAGE);

  const handlePageChange = (employeeId: string, direction: 'prev' | 'next', totalLeads: number) => {
    setCurrentPage(prev => {
      const current = prev[employeeId] || 1;
      const totalPages = Math.ceil(totalLeads / LEADS_PER_PAGE);
      const newPage = direction === 'prev' ? Math.max(1, current - 1) : Math.min(totalPages, current + 1);
      return { ...prev, [employeeId]: newPage };
    });
  };

  const handleEmployeePageChange = (direction: 'prev' | 'next') => {
    setEmployeePage(prev => {
      if (direction === 'prev') return Math.max(1, prev - 1);
      else return Math.min(totalEmployeePages, prev + 1);
    });
  };

  const employeesToShow = filteredAssignments.slice(
    (employeePage - 1) * EMPLOYEES_PER_PAGE,
    employeePage * EMPLOYEES_PER_PAGE
  );

  if (loading) {
    return (
      <Box sx={{ width: '100%', p: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography sx={{ mt: 1 }}>Loading assignments...</Typography>
      </Box>
    );
  }

  if (assignments.length === 0) {
    return (
      <Box sx={{ width: '100%', p: 4, textAlign: 'center' }}>
        <Typography>No leads have been assigned yet.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', p: { xs: 2, sm: 3, md: 4 } }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom textAlign="center">
        Leads Assignment Report
      </Typography>

      {/* Summary Cards */}
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        mb={4}
        flexWrap="wrap"
        justifyContent="center"
      >
        <Card sx={{ flex: 1, minWidth: 200, maxWidth: 300 }}>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Total Leads Assigned
            </Typography>
            <Typography variant="h4" fontWeight="bold">{totalLeads}</Typography>
          </CardContent>
        </Card>

        <Card sx={{ flex: 1, minWidth: 200, maxWidth: 300 }}>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Active Employees
            </Typography>
            <Typography variant="h4" fontWeight="bold">{assignments.length}</Typography>
          </CardContent>
        </Card>
      </Stack>

      {/* Employee Filter */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
        <FormControl size="small" sx={{ minWidth: 220 }}>
          <InputLabel>Filter by Employee</InputLabel>
          <Select
            value={selectedEmployee}
            onChange={(e) => {
              setSelectedEmployee(e.target.value);
              setEmployeePage(1);
            }}
            label="Filter by Employee"
          >
            <MenuItem value="all">All Employees</MenuItem>
            {assignments.map(a => (
              <MenuItem key={a.employee_id} value={a.employee_id}>
                {a.employee_id} ({a.lead_count} leads)
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Employee-wise Lead Tables */}
      {employeesToShow.map(assignment => {
        const page = currentPage[assignment.employee_id] || 1;
        const startIndex = (page - 1) * LEADS_PER_PAGE;
        const endIndex = startIndex + LEADS_PER_PAGE;
        const paginatedLeads = assignment.leads.slice(startIndex, endIndex);
        const totalPages = Math.ceil(assignment.lead_count / LEADS_PER_PAGE);

        return (
          <Card key={assignment.employee_id} sx={{ mb: 4 }}>
            <CardContent>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ textAlign: { xs: 'center', sm: 'left' }, wordBreak: 'break-word' }}
              >
                Employee: <b>{assignment.employee_id}</b> ({assignment.lead_count} leads)
              </Typography>

              <TableContainer component={Paper} sx={{ overflowX: 'auto' }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Customer Name</TableCell>
                      <TableCell>Mobile</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Product</TableCell>
                      <TableCell>City</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginatedLeads.map((lead) => (
                      <TableRow key={lead.id} hover>
                        <TableCell>{lead.name}</TableCell>
                        <TableCell>{lead.phone}</TableCell>
                        <TableCell sx={{ wordBreak: 'break-word' }}>{lead.email}</TableCell>
                        <TableCell>{lead.product}</TableCell>
                        <TableCell>{lead.city}</TableCell>
                        <TableCell>
                          <Chip
                            label={lead.status}
                            color={getStatusColor(lead.status)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <FormControl size="small" sx={{ minWidth: 140 }}>
                            <Select
                              value={lead.status}
                              onChange={(e) =>
                                handleStatusUpdate(lead, e.target.value as Lead['status'])
                              }
                            >
                              <MenuItem value="new_added">New Added</MenuItem>
                              <MenuItem value="contacted">Contacted</MenuItem>
                              <MenuItem value="interested">Interested</MenuItem>
                              <MenuItem value="in_follow_up">In Follow-Up</MenuItem>
                              <MenuItem value="converted">Converted</MenuItem>
                              <MenuItem value="not_interested">Not Interested</MenuItem>
                              <MenuItem value="invalid">Invalid</MenuItem>
                            </Select>
                          </FormControl>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Lead Pagination */}
              {totalPages > 1 && (
                <Stack
                  direction="row"
                  spacing={2}
                  sx={{ mt: 2 }}
                  justifyContent="center"
                  alignItems="center"
                >
                  <Button
                    variant="outlined"
                    size="small"
                    disabled={page === 1}
                    onClick={() =>
                      handlePageChange(assignment.employee_id, 'prev', assignment.lead_count)
                    }
                  >
                    Previous
                  </Button>
                  <Typography variant="body2">
                    Page {page} of {totalPages}
                  </Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    disabled={page === totalPages}
                    onClick={() =>
                      handlePageChange(assignment.employee_id, 'next', assignment.lead_count)
                    }
                  >
                    Next
                  </Button>
                </Stack>
              )}
            </CardContent>
          </Card>
        );
      })}

      {/* Employee Pagination */}
      {totalEmployeePages > 1 && (
        <Stack direction="row" spacing={2} sx={{ mt: 3 }} justifyContent="center" alignItems="center">
          <Button
            variant="contained"
            size="small"
            disabled={employeePage === 1}
            onClick={() => handleEmployeePageChange('prev')}
          >
            Previous Employees
          </Button>
          <Typography variant="body2">
            Employee Page {employeePage} of {totalEmployeePages}
          </Typography>
          <Button
            variant="contained"
            size="small"
            disabled={employeePage === totalEmployeePages}
            onClick={() => handleEmployeePageChange('next')}
          >
            Next Employees
          </Button>
        </Stack>
      )}
    </Box>
  );
};
