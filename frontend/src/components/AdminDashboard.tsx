import { useState } from 'react';
import { Stack, Typography, Box, Tabs, Tab, Paper } from '@mui/material';
import { CSVUpload } from './CSVUpload';
import { LeadsAssignedReport } from './LeadsAssignedReport';
import { LeadsTableView } from './LeadsTableView';
import { useLeads } from '../hooks/useLeads';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`admin-tabpanel-${index}`}
      aria-labelledby={`admin-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

export const AdminDashboard = () => {
  const [tabValue, setTabValue] = useState(0);
  const { leads, loading, error } = useLeads();
  
  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Box sx={{ width: '100vw', minHeight: '100vh', p: { xs: 2, sm: 3 } }}>
      <Typography variant="h3" align="center" gutterBottom sx={{ mb: 4 }}>
        UniKLeads CRM - Admin Dashboard
      </Typography>

      <Paper sx={{ mb: 3, width: '100%' }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          centered
          variant="scrollable"
          scrollButtons="auto"
          sx={{ minHeight: 48 }}
        >
          <Tab label="All Leads" />
          <Tab label="Assignment Report" />
        </Tabs>
      </Paper>

      <TabPanel value={tabValue} index={0}>
        <Stack spacing={4}>
          <CSVUpload />
          
          <LeadsTableView leads={leads} loading={loading} error={error} />
        </Stack>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <Box sx={{ width: '100%' }}>
          <LeadsAssignedReport />
        </Box>
      </TabPanel>
    </Box>
  );
};