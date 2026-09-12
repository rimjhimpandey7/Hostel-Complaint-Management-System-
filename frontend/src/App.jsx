import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';

// Layouts
import MainLayout from './layouts/MainLayout';
import StudentLayout from './layouts/StudentLayout';
import AdminLayout from './layouts/AdminLayout';

// Public Pages
import Home from './pages/public/Home';
import Login from './pages/public/Login';
import Register from './pages/public/Register';
import ForgotPassword from './pages/public/ForgotPassword';
import ResetPassword from './pages/public/ResetPassword';

// Student Pages
import StudentDashboard from './pages/student/StudentDashboard';
import SubmitComplaint from './pages/student/SubmitComplaint';
import MyComplaints from './pages/student/MyComplaints';
import ComplaintDetails from './pages/student/ComplaintDetails';
import StudentProfile from './pages/student/StudentProfile';
import ChangePassword from './pages/student/ChangePassword';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AllComplaints from './pages/admin/AllComplaints';
import AdminComplaintDetails from './pages/admin/AdminComplaintDetails';
import ManageStudents from './pages/admin/ManageStudents';
import Analytics from './pages/admin/Analytics';
import AdminProfile from './pages/admin/AdminProfile';

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Routes */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Route>

        {/* Student Protected Routes */}
        <Route element={<ProtectedRoute allowedRoles={['student']} />}>
          <Route element={<StudentLayout />}>
            <Route path="/student/dashboard" element={<StudentDashboard />} />
            <Route path="/student/submit-complaint" element={<SubmitComplaint />} />
            <Route path="/student/my-complaints" element={<MyComplaints />} />
            <Route path="/student/complaints/:id" element={<ComplaintDetails />} />
            <Route path="/student/profile" element={<StudentProfile />} />
            <Route path="/student/change-password" element={<ChangePassword />} />
          </Route>
        </Route>

        {/* Admin Protected Routes */}
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/complaints" element={<AllComplaints />} />
            <Route path="/admin/complaints/:id" element={<AdminComplaintDetails />} />
            <Route path="/admin/students" element={<ManageStudents />} />
            <Route path="/admin/analytics" element={<Analytics />} />
            <Route path="/admin/profile" element={<AdminProfile />} />
          </Route>
        </Route>

        {/* Fallback Catch-all Route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
