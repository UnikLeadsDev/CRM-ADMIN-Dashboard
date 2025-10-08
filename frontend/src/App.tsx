import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AdminDashboard } from "./components/AdminDashboard";
import { EmployeeDashboard } from "./components/EmployeeDashboard";
import { LeadsOnly } from "./components/LeadsOnly";
import LeadForm from "./components/LeadForm";
import { GeneratedLeads } from "./components/GeneratedLeads";
import ChannelPartnerForm from "./components/ChannelPartnerForm";
import ChannelPartnerApplicationDashboard from "./components/ChannelPartner/ChannelPartnerApplicationDashboard";
import PersonalDetails from "./components/ChannelPartner/PersonalDetails";
import BusinessDashboard from "./components/ChannelPartner/BusinessDashboard";
import { CSVUpload } from "./components/CSVUpload";
import { LeadsTableView } from "./components/LeadsTableView";
import { LeadsAssignedReport } from "./components/LeadsAssignedReport";



function App() {
  return (
    <Router>
      <Routes>
        {/* ✅ Admin route with nested routes inside */}
        <Route path="/admin" element={<AdminDashboard />}>
             {/* <Route path="/admin" element={<AdminDashboard />}> */}
        <Route path="assigned-leads" element={<><CSVUpload /><LeadsTableView /></>} />
        <Route path="assigned-report" element={<LeadsAssignedReport />} />
        <Route path="assigned-employee" element={<LeadsOnly />} />
        <Route path="add-lead" element={<LeadForm />} />
        <Route path="generated-leads" element={<GeneratedLeads />} />
        <Route path="partner-dashboard" element={<ChannelPartnerApplicationDashboard />} />
        
        <Route path="partner-form/:partnerId" element={<ChannelPartnerForm />} />
        <Route path="personal-details" element={<PersonalDetails />} />
        <Route path="business-details" element={<BusinessDashboard />} />

      </Route>
        {/* </Route> */}

        {/* Redirect root to /admin */}
        {/* <Route path="/" element={<Navigate to="/admin" replace />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
