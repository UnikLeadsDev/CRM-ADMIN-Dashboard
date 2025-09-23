import { useState } from 'react';
import { Stack, Typography, Box, Tabs, Tab, Paper } from '@mui/material';
import { CSVUpload } from './CSVUpload';
import { LeadsAssignedReport } from './LeadsAssignedReport';
import { LeadsTableView } from './LeadsTableView';
import { LeadsOnly } from './LeadsOnly';   // ⬅️ Import your new component
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
      style={{ width: "100%" }}
    >
      {value === index && <Box sx={{ p: 3, width: "100%" }}>{children}</Box>}
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
    <Box sx={{ display: "flex", width: "100vw", minHeight: "100vh", bgcolor: "#f4f6f8" }}>
      
      {/* Sidebar */}
      <Paper
        elevation={3}
        sx={{
          minWidth: 240,
          height: "full",
          display: "flex",
          flexDirection: "column",
          bgcolor: "#1e293b",
          color: "white",
          borderRadius: 0,
          position: "sticky",
          top: 0,
          alignItems: "center",
          py: 2,
          px: 1,
          boxShadow: "2px 0 5px rgba(0,0,0,0.1)",
          zIndex: 1000,
          flexShrink: 0,
        }}
      >
        <Typography
          variant="h6"
          align="center"
          sx={{ py: 3, fontWeight: "bold", letterSpacing: 1 }}
        >
          Admin Panel
        </Typography>
        <Tabs
          orientation="vertical"
          value={tabValue}
          onChange={handleTabChange}
          TabIndicatorProps={{ style: { display: "none" } }}
          sx={{
            flexGrow: 1,
            "& .MuiTab-root": {
              alignItems: "flex-start",
              px: 3,
              justifyContent: "flex-start",
              color: "#cbd5e1",
              textTransform: "none",
              fontWeight: 500,
              fontSize: "1rem",
              borderRadius: "8px",
              mb: 1,
            },
            "& .MuiTab-root.Mui-selected": {
              bgcolor: "#334155",
              color: "#fff",
              fontWeight: 600,
            },
            "& .MuiTab-root:hover": {
              bgcolor: "#475569",
              color: "#fff",
            },
          }}
        >
          <Tab label="📋 All Leads" />
          <Tab label="📊 Assignment Report" />
          <Tab label="🧾 Leads Only" /> {/* ⬅️ New Tab */}
        </Tabs>
      </Paper>

      {/* Main Content */}
      <Box sx={{ flexGrow: 1, p: { xs: 2, sm: 4 } }}>
        <Paper
          elevation={1}
          sx={{
            p: 4,
            borderRadius: 3,
            minHeight: "85vh",
            display: "flex",
            flexDirection: "column",
            bgcolor: "white",
          }}
        >
          <Typography
            variant="h4"
            align="center"
            gutterBottom
            sx={{ fontWeight: "bold", color: "#1e293b", mb: 4 }}
          >
            UniKLeads CRM - Admin Dashboard
          </Typography>

          {/* Tab 1 */}
          <TabPanel value={tabValue} index={0}>
            <Stack spacing={3}>
              <CSVUpload />
              <LeadsTableView leads={leads} loading={loading} error={error} />
            </Stack>
          </TabPanel>

          {/* Tab 2 */}
          <TabPanel value={tabValue} index={1}>
            <Box sx={{ width: "100%" }}>
              <LeadsAssignedReport />
            </Box>
          </TabPanel>

          {/* Tab 3 */}
          <TabPanel value={tabValue} index={2}>
            <LeadsOnly />  {/* ⬅️ Your component */}
          </TabPanel>
        </Paper>
      </Box>
    </Box>
  );
};
