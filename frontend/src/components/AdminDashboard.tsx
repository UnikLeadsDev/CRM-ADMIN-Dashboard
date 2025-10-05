import { useState } from "react";
import {
  Stack,
  Typography,
  Box,
  Tabs,
  Tab,
  Paper,
  Menu,
  MenuItem,
  IconButton,
  Drawer,
  useMediaQuery,
} from "@mui/material";
import AssignmentIcon from '@mui/icons-material/Assignment';
import AssessmentIcon from '@mui/icons-material/Assessment';
import PersonIcon from '@mui/icons-material/Person';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import MenuIcon from "@mui/icons-material/Menu";
import { CSVUpload } from "./CSVUpload";
import { LeadsAssignedReport } from "./LeadsAssignedReport";
import { LeadsTableView } from "./LeadsTableView";
import { LeadsOnly } from "./LeadsOnly";
import LeadForm from "./LeadForm";
import {GeneratedLeads} from "./GeneratedLeads";
import ChannelPartnerForm from "./ChannelPartnerForm";
import ChannelPartnerApplicationDashboard from "./ChannelPartner/ChannelPartnerApplicationDashboard";
import PersonalDetails from "./ChannelPartner/PersonalDetails";
import BusinessDashboard from "./ChannelPartner/BusinessDashboard";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel({ children, value, index }: TabPanelProps) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`admin-tabpanel-${index}`}
      aria-labelledby={`admin-tab-${index}`}
      style={{ width: "100%" }}
    >
      {value === index && <Box sx={{ p: { xs: 1, sm: 3 }, width: "100%" }}>{children}</Box>}
    </div>
  );
}

export const AdminDashboard = () => {
  const [tabValue, setTabValue] = useState(0);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 900px)");

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    if (isMobile) setMobileOpen(false); // Auto-close drawer on mobile after selecting
  };

  const handleDropdownClick = (event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleDropdownClose = (index: number) => {
    setTabValue(index);
    setAnchorEl(null);
    if (isMobile) setMobileOpen(false);
  };

  const open = Boolean(anchorEl);

  // Sidebar content reused for Drawer and Desktop
  const sidebarContent = (
    <Paper
      elevation={0}
      sx={{
        width: { xs: "75vw", sm: 240 },
        height: "100%",
        bgcolor: "#1e293b",
        color: "white",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        py: 2,
        px: 1,
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
    width: "100%",
    "& .MuiTab-root": {
      alignItems: "center",        // 👈 aligns icon + label
      flexDirection: "row",        // 👈 inline layout
      gap: "10px",                 // 👈 spacing between icon and text
      px: 3,
      justifyContent: "flex-start",
      color: "#cbd5e1",
      textTransform: "none",
      fontWeight: 500,
      fontSize: "1rem",
      borderRadius: "8px",
      mb: 1,
      minHeight: "48px",
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

        <Tab icon={<AssignmentIcon />} label="Assigned Leads" />
        <Tab icon={<AssessmentIcon />} label="Assigned Leads Report" />
        <Tab icon={<PersonIcon />} label="Assigned Lead Employee" />
        <Tab icon={<AddCircleOutlineIcon />} label="Add Lead" />
        <Tab icon={<BusinessCenterIcon />} label="Generated Leads" />
       <Tab
          icon={<BusinessCenterIcon />}
          label="Channel Partner ▾"
          onClick={(e) => {
            //e.preventDefault(); // stop tab from being selected
            handleDropdownClick(e); // open your dropdown
          }}
        />

      </Tabs>

      {/* Dropdown Menu */}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={() => setAnchorEl(null)}
        PaperProps={{
          sx: {
            bgcolor: "#1e293b",
            color: "#cbd5e1",
            borderRadius: 2,
            mt: 1,
            minWidth: 200,
          },
        }}
      >
        {[
          { text: "Application Dashboard", index: 5 },
          { text: "Channel Partner Form", index: 4 },
          { text: "Personal Details", index: 6 },
          { text: "Business Details", index: 7 },
        ].map((item) => (
          <MenuItem
            key={item.text}
            onClick={() => handleDropdownClose(item.index)}
            sx={{
              px: 3,
              py: 1.5,
              "&:hover": {
                bgcolor: "#334155",
                color: "#fff",
              },
            }}
          >
            {item.text}
          </MenuItem>
        ))}
      </Menu>
    </Paper>
  );

  return (
    <Box sx={{ display: "flex", width: "100vw", minHeight: "100vh", bgcolor: "#f4f6f8" }}>
      {/* Sidebar for Desktop */}
      {!isMobile && (
        <Box sx={{ width: 240, flexShrink: 0, position: "sticky", top: 0, height: "100vh" }}>
          {sidebarContent}
        </Box>
      )}

      {/* Drawer for Mobile */}
      {isMobile && (
        <>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={() => setMobileOpen(true)}
            sx={{
              position: "fixed",
              top: 16,
              left: 16,
              zIndex: 1300,
              bgcolor: "#1e293b",
              color: "white",
              "&:hover": { bgcolor: "#334155" },
            }}
          >
            <MenuIcon />
          </IconButton>

          <Drawer
            anchor="left"
            open={mobileOpen}
            onClose={() => setMobileOpen(false)}
            ModalProps={{ keepMounted: true }}
          >
            {sidebarContent}
          </Drawer>
        </>
      )}

      {/* Main Content */}
      <Box
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 4 },
          mt: { xs: 6, sm: 0 }, // space for mobile menu icon
        }}
      >
        <Paper
          elevation={1}
          sx={{
            p: { xs: 2, sm: 4 },
            borderRadius: 3,
            minHeight: "85vh",
            display: "flex",
            flexDirection: "column",
            bgcolor: "white",
          }}
        >
          {/* <Typography
            variant="h5"
            align="center"
            gutterBottom
            sx={{
              fontWeight: "bold",
              color: "#1e293b",
              mb: { xs: 2, sm: 4 },
              fontSize: { xs: "1.3rem", sm: "1.8rem" },
            }}
          >
            UniKLeads CRM - Admin Dashboard
          </Typography> */}

          {/* Tab Panels */}
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
          <TabPanel value={tabValue} index={4}>
            <GeneratedLeads/>
          </TabPanel>
          <TabPanel value={tabValue} index={5}>
            <ChannelPartnerForm />
          </TabPanel>
          <TabPanel value={tabValue} index={6}>
            <ChannelPartnerApplicationDashboard />
          </TabPanel>
          <TabPanel value={tabValue} index={7}>
            <PersonalDetails />
          </TabPanel>
          <TabPanel value={tabValue} index={8}>
            <BusinessDashboard />
          </TabPanel>
        </Paper>
      </Box>
    </Box>
  );
};
