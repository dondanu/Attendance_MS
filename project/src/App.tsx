import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AttendanceManagement from './pages/AttendanceManagement';
import Organization from './pages/Organization';
import Employee from './pages/Employee';
import EmployeeProfile from './pages/EmployeeProfile';
import NewAttendance from './pages/NewAttendance';
import AttendanceReport from './pages/AttendanceReport';
import Layout from './components/Layout';
import Designation from './pages/Designation';
import Status from './pages/Status';
import AddEmployee from './pages/AddEmployee';
import NotFound from './pages/NotFound';
import ForgotPasswordPage  from './pages/ForgotPasswordPage';

function App() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      
      {/* Protected Routes */}
      {/* If user is authenticated, show the layout and its children */}
      {/* If not, redirect to login page */}
      
      <Route path="/" element={user ? <Layout /> : <Navigate to="/login" />}>
        <Route index element={<Dashboard />} />
        <Route path="attendance">
          <Route index element={<AttendanceManagement />} />
          <Route path="new" element={<NewAttendance />} />
          <Route path="report" element={<AttendanceReport />} />
        </Route>
        <Route path="organization">
          <Route index element={<Organization />} />
          <Route path="designation" element={<Designation />} />
          <Route path="status" element={<Status />} />
        </Route>
        <Route path="employee">
          <Route index element={<Employee />} />
          <Route path="add" element={<AddEmployee />} />
          <Route path=":id" element={<EmployeeProfile />} />
        </Route>
      </Route>
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;