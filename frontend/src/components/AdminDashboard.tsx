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
import AssignmentIcon from "@mui/icons-material/Assignment";
import AssessmentIcon from "@mui/icons-material/Assessment";
import PersonIcon from "@mui/icons-material/Person";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import MenuIcon from "@mui/icons-material/Menu";
import { CSVUpload } from "./CSVUpload";
import { LeadsAssignedReport } from "./LeadsAssignedReport";
import { LeadsTableView } from "./LeadsTableView";
import { LeadsOnly } from "./LeadsOnly";
import LeadForm from "./LeadForm";
import { GeneratedLeads } from "./GeneratedLeads";
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
      {value === index && (
        <Box sx={{ p: { xs: 1, sm: 3 }, width: "100%" }}>{children}</Box>
      )}
    </div>
  );
}

export const AdminDashboard = () => {
  const [tabValue, setTabValue] = useState(0);
  const [dropdownAnchor, setDropdownAnchor] = useState<null | HTMLElement>(
    null
  );
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 900px)");

  const handleDropdownClick = (
    event: React.MouseEvent<HTMLDivElement>,
    menuType: string
  ) => {
    setDropdownAnchor(event.currentTarget);
    setActiveDropdown(menuType);
  };

  const handleDropdownClose = (index: number) => {
    setTabValue(index);
    setDropdownAnchor(null);
    setActiveDropdown(null);
    if (isMobile) setMobileOpen(false);
  };

  const open = Boolean(dropdownAnchor);

  const sidebarContent = (
    <Paper
      elevation={0}
      sx={{
        width: { xs: "75vw", sm: 300 },
        height: "100%",
        bgcolor: "#1e293b",
        color: "white",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        py: 2,
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
        onChange={() => {}}
        TabIndicatorProps={{ style: { display: "none" } }}
        sx={{
          flexGrow: 1,
          width: "100%",
          "& .MuiTab-root": {
            alignItems: "center",
            flexDirection: "row",
            gap: "10px",
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
        {/* 🔹 1. Assigned Leads Dropdown */}
        <Tab
          icon={<AssignmentIcon />}
          label="Assigned Leads ▾"
          onClick={(e) => handleDropdownClick(e, "assigned")}
          value={false}
        />

        {/* 🔹 2. Generated Leads Dropdown */}
        <Tab
          icon={<AddCircleOutlineIcon />}
          label="Generate Leads ▾"
          onClick={(e) => handleDropdownClick(e, "generate")}
          value={false}
        />

        {/* 🔹 3. Channel Partner Dropdown */}
        <Tab
          icon={<BusinessCenterIcon />}
          label="Channel Partner ▾"
          onClick={(e) => handleDropdownClick(e, "partner")}
          value={false}
        />
      </Tabs>

      {/* 🔽 Dropdown Menus */}
      <Menu
        anchorEl={dropdownAnchor}
        open={open}
        onClose={() => {
          setDropdownAnchor(null);
          setActiveDropdown(null);
        }}
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
        {activeDropdown === "assigned" &&
          [
            { text: "Assigned Leads List", index: 0 },
            { text: "Assigned Leads Report", index: 1 },
            { text: "Assigned Lead Employee", index: 2 },
          ].map((item) => (
            <MenuItem
              key={item.text}
              onClick={() => handleDropdownClose(item.index)}
              sx={{
                px: 3,
                py: 1.5,
                "&:hover": { bgcolor: "#334155", color: "#fff" },
              }}
            >
              {item.text}
            </MenuItem>
          ))}

        {activeDropdown === "generate" &&
          [
            { text: "Add Lead", index: 3 },
            { text: "Generated Leads", index: 4 },
          ].map((item) => (
            <MenuItem
              key={item.text}
              onClick={() => handleDropdownClose(item.index)}
              sx={{
                px: 3,
                py: 1.5,
                "&:hover": { bgcolor: "#334155", color: "#fff" },
              }}
            >
              {item.text}
            </MenuItem>
          ))}

        {activeDropdown === "partner" &&
          [
            { text: "Application Dashboard", index: 5 },
            { text: "Channel Partner Form", index: 6 },
            { text: "Personal Details", index: 7 },
            { text: "Business Details", index: 8 },
          ].map((item) => (
            <MenuItem
              key={item.text}
              onClick={() => handleDropdownClose(item.index)}
              sx={{
                px: 3,
                py: 1.5,
                "&:hover": { bgcolor: "#334155", color: "#fff" },
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
        <Box sx={{ width: 300, flexShrink: 0, position: "sticky", top: 0, height: "100vh" }}>
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
      <Box sx={{ flexGrow: 1, p: { xs: 2, sm: 4 }, mt: { xs: 6, sm: 0 } }}>
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
          {/* Tab Panels */}
          <TabPanel value={tabValue} index={0}>
            <CSVUpload />
            <LeadsTableView />
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
            <GeneratedLeads />
          </TabPanel>

          <TabPanel value={tabValue} index={5}>
            <ChannelPartnerApplicationDashboard />
          </TabPanel>

          <TabPanel value={tabValue} index={6}>
            <ChannelPartnerForm />
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
