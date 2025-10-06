import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AdminDashboard } from "./components/AdminDashboard";
import { EmployeeDashboard } from "./components/EmployeeDashboard";
import { LeadsOnly } from "./components/LeadsOnly";
import LeadForm from "./components/LeadForm";
import { GeneratedLeads } from "./components/GeneratedLeads";
import ChannelPartnerForm from "./components/ChannelPartnerForm";

function App() {
  return (
    <Router>
      <Routes>
        {/* ✅ Admin route with nested routes inside */}
        <Route path="/admin" element={<AdminDashboard />}>
          <Route path="employee/:employeeId" element={<EmployeeDashboard />} />
          <Route path="leads" element={<LeadsOnly />} />
          <Route path="leadform" element={<LeadForm />} />
          <Route path="generatedleads" element={<GeneratedLeads />} />
          {/* ✅ Now nested under /admin */}
          <Route path="partner/:partnerId" element={<ChannelPartnerForm />} />
        </Route>

        {/* Redirect root to /admin */}
        <Route path="/" element={<Navigate to="/admin" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
