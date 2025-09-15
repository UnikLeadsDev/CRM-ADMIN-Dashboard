import { useState, useEffect } from 'react';
import {
  Typography, Card, CardContent, Box, Chip,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, CircularProgress, Select, MenuItem, FormControl,
  InputLabel
} from '@mui/material';
import { leadAssignmentService } from '../services/leadAssignmentService';
import type { LeadAssignment, Lead } from '../types';

export const LeadsAssignedReport = () => {
  const [assignments, setAssignments] = useState<LeadAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEmployee, setSelectedEmployee] = useState<string>('all');

  useEffect(() => {
    loadAssignments();
  }, []);

  const loadAssignments = async () => {
    try {
      setLoading(true);
      const data = await leadAssignmentService.getLeadAssignments();
      setAssignments(data);
    } catch (error) {
      console.error('Error loading assignments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (lead: Lead, status: Lead['status']) => {
    try {
      await leadAssignmentService.updateLeadStatus(lead, status);
      loadAssignments();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const getStatusColor = (status: Lead['status']) => {
    switch (status) {
      case 'open': return 'primary';
      case 'in_process': return 'warning';
      case 'closed': return 'success';
      case 'not_interested': return 'error';
      default: return 'default';
    }
  };

  const filteredAssignments = selectedEmployee === 'all' 
    ? assignments 
    : assignments.filter(a => a.employee_id === selectedEmployee);

  const totalLeads = assignments.reduce((sum, a) => sum + a.lead_count, 0);

  if (loading) {
    return (
      <Box sx={{ width: '100%', p: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography>Loading assignments...</Typography>
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
    <Box sx={{ width: '100%', p: { xs: 2, sm: 3 } }}>
      <Typography variant="h4" gutterBottom>
        Leads Assignment Report
      </Typography>

      {/* Summary Cards */}
      <Box sx={{ display: 'flex', gap: 3, mb: 4, flexWrap: 'wrap' }}>
        <Card sx={{ flex: 1, minWidth: 200 }}>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Total Leads Assigned
            </Typography>
            <Typography variant="h4">
              {totalLeads}
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ flex: 1, minWidth: 200 }}>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Active Employees
            </Typography>
            <Typography variant="h4">
              {assignments.length}
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Filter */}
      <Box sx={{ mb: 3 }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Filter by Employee</InputLabel>
          <Select
            value={selectedEmployee}
            onChange={(e) => setSelectedEmployee(e.target.value)}
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

      {/* Assignments Table */}
      {filteredAssignments.map(assignment => (
        <Card key={assignment.employee_id} sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Employee ID: {assignment.employee_id} ({assignment.lead_count} leads)
            </Typography>
            
            <TableContainer component={Paper}>
              <Table>
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
                  {assignment.leads.map((lead, index) => (
                    <TableRow key={index}>
                      <TableCell>{lead['Customer Name']}</TableCell>
                      <TableCell>{lead['Mobile Number']}</TableCell>
                      <TableCell>{lead['Email ID']}</TableCell>
                      <TableCell>{lead['Product looking']}</TableCell>
                      <TableCell>{lead['Customer City']}</TableCell>
                      <TableCell>
                        <Chip 
                          label={lead.status || 'open'} 
                          color={getStatusColor(lead.status || 'open')}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <FormControl size="small" sx={{ minWidth: 120 }}>
                          <Select
                            value={lead.status || 'open'}
                            onChange={(e) => handleStatusUpdate(lead, e.target.value as Lead['status'])}
                          >
                            <MenuItem value="open">Open</MenuItem>
                            <MenuItem value="in_process">In Process</MenuItem>
                            <MenuItem value="closed">Closed</MenuItem>
                            <MenuItem value="not_interested">Not Interested</MenuItem>
                          </Select>
                        </FormControl>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};