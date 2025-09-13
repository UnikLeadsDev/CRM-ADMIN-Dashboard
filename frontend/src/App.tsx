import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AdminDashboard } from './components/AdminDashboard';
import { EmployeeDashboard } from './components/EmployeeDashboard';
import { LeadsOnly } from './components/LeadsOnly';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/employee/:employeeId" element={<EmployeeDashboard />} />
        <Route path="/leads" element={<LeadsOnly />} />
        <Route path="/" element={<Navigate to="/admin" replace />} />
      </Routes>
    </Router>
  )
}

export default App
