import { useState, useEffect } from 'react';
import {
  Container, Typography, Card, CardContent, Grid, Box,
  Button, FormControl, InputLabel, Select, MenuItem,
  Checkbox, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Stack, CircularProgress,
  TextField, Alert
} from '@mui/material';
import { leadAssignmentService } from '../services/leadAssignmentService';
import { useEmployee } from '../hooks/useEmployee';
import type { Lead } from '../types';

export const LeadAssignment = () => {
  const [unassignedLeads, setUnassignedLeads] = useState<Lead[]>([]);
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  
  const { employees } = useEmployee();

  useEffect(() => {
    loadUnassignedLeads();
  }, []);

  const loadUnassignedLeads = async () => {
    try {
      setLoading(true);
      const leads = await leadAssignmentService.getUnassignedLeads();
      setUnassignedLeads(leads);
    } catch (error) {
      console.error('Error loading unassigned leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLeadSelection = (leadIndex: number) => {
    const leadId = leadIndex.toString();
    setSelectedLeads(prev => 
      prev.includes(leadId) 
        ? prev.filter(id => id !== leadId)
        : [...prev, leadId]
    );
  };

  const handleSelectAll = () => {
    if (selectedLeads.length === unassignedLeads.length) {
      setSelectedLeads([]);
    } else {
      setSelectedLeads(unassignedLeads.map((_, index) => index.toString()));
    }
  };

  const handleManualAssign = async () => {
    if (!selectedEmployee || selectedLeads.length === 0) return;
    
    try {
      setAssigning(true);
      await leadAssignmentService.assignLeads(selectedLeads, selectedEmployee);
      setMessage({ type: 'success', text: `${selectedLeads.length} leads assigned successfully!` });
      setSelectedLeads([]);
      setSelectedEmployee('');
      loadUnassignedLeads();
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to assign leads' });
    } finally {
      setAssigning(false);
    }
  };

  const handleAutoAssign = async () => {
    if (employees.length === 0 || unassignedLeads.length === 0) return;
    
    try {
      setAssigning(true);
      const employeeIds = employees.map(emp => emp.employee_id);
      const leadIds = unassignedLeads.map(lead => lead.id!);
      await leadAssignmentService.autoAssignLeads(leadIds, employeeIds);
      setMessage({ type: 'success', text: `${leadIds.length} leads auto-assigned successfully!` });
      loadUnassignedLeads();
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to auto-assign leads' });
    } finally {
      setAssigning(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography>Loading unassigned leads...</Typography>
      </Container>
    );
  }

  return (
    <Box sx={{ width: '100%', p: { xs: 2, sm: 3 } }}>
      <Typography variant="h4" gutterBottom>
        Lead Assignment
      </Typography>

      {message && (
        <Alert severity={message.type} sx={{ mb: 3 }} onClose={() => setMessage(null)}>
          {message.text}
        </Alert>
      )}

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Manual Assignment
              </Typography>
              <Stack spacing={2}>
                <FormControl fullWidth>
                  <InputLabel>Select Employee</InputLabel>
                  <Select
                    value={selectedEmployee}
                    onChange={(e) => setSelectedEmployee(e.target.value)}
                    label="Select Employee"
                  >
                    {employees.map(emp => (
                      <MenuItem key={emp.id} value={emp.employee_id}>
                        {emp.employee_id} - {emp.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Button
                  variant="contained"
                  onClick={handleManualAssign}
                  disabled={!selectedEmployee || selectedLeads.length === 0 || assigning}
                >
                  Assign Selected Leads ({selectedLeads.length})
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Auto Assignment
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                Distribute all unassigned leads evenly among all employees using round-robin algorithm.
              </Typography>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleAutoAssign}
                disabled={unassignedLeads.length === 0 || employees.length === 0 || assigning}
                fullWidth
              >
                Auto-Assign All Leads ({unassignedLeads.length})
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card>
        <CardContent>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
            <Typography variant="h6">
              Unassigned Leads ({unassignedLeads.length})
            </Typography>
            <Button onClick={handleSelectAll}>
              {selectedLeads.length === unassignedLeads.length ? 'Deselect All' : 'Select All'}
            </Button>
          </Stack>
          
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedLeads.length === unassignedLeads.length && unassignedLeads.length > 0}
                      indeterminate={selectedLeads.length > 0 && selectedLeads.length < unassignedLeads.length}
                      onChange={handleSelectAll}
                    />
                  </TableCell>
                  <TableCell>Customer Name</TableCell>
                  <TableCell>Mobile</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Product</TableCell>
                  <TableCell>City</TableCell>
                  <TableCell>Upload Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {unassignedLeads.map((lead, index) => (
                  <TableRow key={index}>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedLeads.includes(index.toString())}
                        onChange={() => handleLeadSelection(index)}
                      />
                    </TableCell>
                    <TableCell>{lead['Customer Name']}</TableCell>
                    <TableCell>{lead['Mobile Number']}</TableCell>
                    <TableCell>{lead['Email ID']}</TableCell>
                    <TableCell>{lead['Product looking']}</TableCell>
                    <TableCell>{lead['Customer City']}</TableCell>
                    <TableCell>{new Date(lead['Date']).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
};