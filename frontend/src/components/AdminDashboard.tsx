import { useState } from 'react';
import { Stack, Typography, Box, Tabs, Tab, Paper, Menu, MenuItem } from '@mui/material';
import { CSVUpload } from './CSVUpload';
import { LeadsAssignedReport } from './LeadsAssignedReport';
import { LeadsTableView } from './LeadsTableView';
import { LeadsOnly } from './LeadsOnly';
import LeadForm from './LeadForm';
import ChannelPartnerForm from './ChannelPartnerForm';
import ChannelPartnerApplicationDashboard from './ChannelPartner/ChannelPartnerApplicationDashboard';
import PersonalDetails from './ChannelPartner/PersonalDetails';
import BusinessDashboard from './ChannelPartner/BusinessDashboard';

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
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleDropdownClick = (event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleDropdownClose = (index: number) => {
    setTabValue(index);
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

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
          <Tab label="🧾 Leads Only" />
          <Tab label="➕ Add Lead" />

          {/* Channel Partner Dropdown */}
          <Tab
            label="💼 Channel Partner ▾"
            onClick={handleDropdownClick}
            sx={{ cursor: "pointer" }}
          />
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={() => setAnchorEl(null)}
            PaperProps={{
              sx: {
                bgcolor: "#1e293b", // match sidebar background
                color: "#cbd5e1",
                borderRadius: 2,
                mt: 1,
                minWidth: 200,
              },
            }}
          >
            <MenuItem
              onClick={() => handleDropdownClose(5)}
              sx={{
                px: 3,
                py: 1.5,
                "&:hover": {
                  bgcolor: "#334155",
                  color: "#fff",
                },
              }}
            >
              Application Dashboard
            </MenuItem>
            <MenuItem
              onClick={() => handleDropdownClose(4)}
              sx={{
                px: 3,
                py: 1.5,
                "&:hover": {
                  bgcolor: "#334155",
                  color: "#fff",
                },
              }}
            >
              Channel Partner Form
            </MenuItem>
            <MenuItem
              onClick={() => handleDropdownClose(6)}
              sx={{
                px: 3,
                py: 1.5,
                "&:hover": {
                  bgcolor: "#334155",
                  color: "#fff",
                },
              }}
            >
              Personal Details
            </MenuItem>
            <MenuItem
              onClick={() => handleDropdownClose(7)}
              sx={{
                px: 3,
                py: 1.5,
                "&:hover": {
                  bgcolor: "#334155",
                  color: "#fff",
                },
              }}
            >
              Business Details
            </MenuItem>
          </Menu>
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

          {/* TabPanels */}
          <TabPanel value={tabValue} index={0}>
            <Stack spacing={3}>
              <CSVUpload />
              <LeadsTableView />
            </Stack>
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <LeadsAssignedReport />
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            <LeadsOnly />
          </TabPanel>

          <TabPanel value={tabValue} index={3}>
            <LeadForm />
          </TabPanel>

          {/* Channel Partner TabPanels */}
          <TabPanel value={tabValue} index={4}>
            <ChannelPartnerForm />
          </TabPanel>
          <TabPanel value={tabValue} index={5}>
            <ChannelPartnerApplicationDashboard />
          </TabPanel>
          <TabPanel value={tabValue} index={6}>
            <PersonalDetails />
          </TabPanel>
          <TabPanel value={tabValue} index={7}>
            <BusinessDashboard />
          </TabPanel>
        </Paper>
      </Box>
    </Box>
  );
};
