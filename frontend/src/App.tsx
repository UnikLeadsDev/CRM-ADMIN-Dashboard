import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AdminDashboard } from './components/AdminDashboard';
import { EmployeeDashboard } from './components/EmployeeDashboard';
import { LeadsOnly } from './components/LeadsOnly';
import LeadForm  from './components/LeadForm';
import ChannelPartnerForm from './components/ChannelPartnerForm';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/employee/:employeeId" element={<EmployeeDashboard />} />
        <Route path="/leads" element={<LeadsOnly />} />
        <Route path="/lead" element={<LeadsOnly />} />
        <Route path="/leadform" element={<LeadForm />} />
        <Route path="/channelpartnerform" element={<ChannelPartnerForm />} />
        <Route path="/" element={<Navigate to="/admin" replace />} />
      </Routes>
    </Router>
  )
}

export default App
