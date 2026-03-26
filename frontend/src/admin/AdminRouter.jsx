import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './layouts/AdminLayout';

// Real components
import CeoDashboard from './pages/dashboard/CeoDashboard';
import EmployeeManager from './pages/hr/EmployeeManager';
import PageManager from './pages/cms/PageManager';
import EmployeeDashboard from './pages/employee/EmployeeDashboard';
import LeaveDashboard from './pages/leaves/LeaveDashboard';
import EmployeeProfile from './pages/profile/EmployeeProfile';
import MyDocuments from './pages/documents/MyDocuments';
import DocumentVerification from './pages/hr/DocumentVerification';
import ApplicationsList from './pages/hr/ApplicationsList';

const Unauthorized = () => <div className="p-6 text-red-500">Access Denied</div>;

// Simple Auth Guard (Replace with real JWT check later)
const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('adminToken');
  const user = JSON.parse(localStorage.getItem('adminUser'));

  if (!token) return <Navigate to="/login" />;
  if (allowedRoles && !allowedRoles.includes(user?.role)) return <Navigate to="/admin/unauthorized" />;

  return children;
};

// Redirect users to their respective dashboards based on their role
const DashboardRedirect = () => {
    const user = JSON.parse(localStorage.getItem('adminUser'));
    if (!user) return <Navigate to="/login" replace />;
    
    switch(user.role) {
        case 'CEO': return <Navigate to="/admin/dashboard" replace />;
        case 'HR': return <Navigate to="/admin/hr/dashboard" replace />;
        case 'Digital Marketing Manager': return <Navigate to="/admin/marketing/dashboard" replace />;
        case 'Employee': return <Navigate to="/admin/employee/dashboard" replace />;
        default: return <Navigate to="/admin/unauthorized" replace />;
    }
};

const AdminRouter = () => {
    return (
        <Routes>
            {/* Direct hits to /admin redirect to the specific role dashboard */}
            <Route path="/" element={<DashboardRedirect />} />
            <Route path="unauthorized" element={<Unauthorized />} />

            {/* Protected Routes wrapped in Admin Layout */}
            <Route element={
                <ProtectedRoute allowedRoles={['CEO', 'HR', 'Digital Marketing Manager', 'Employee']}>
                    <AdminLayout />
                </ProtectedRoute>
            }>
                {/* Dashboards based on role */}
                <Route path="dashboard" element={<ProtectedRoute allowedRoles={['CEO']}><CeoDashboard /></ProtectedRoute>} />
                <Route path="hr/dashboard" element={<ProtectedRoute allowedRoles={['CEO', 'HR']}><EmployeeManager /></ProtectedRoute>} />
                <Route path="marketing/dashboard" element={<ProtectedRoute allowedRoles={['CEO', 'Digital Marketing Manager']}><PageManager /></ProtectedRoute>} />
                <Route path="employee/dashboard" element={<ProtectedRoute allowedRoles={['Employee']}><EmployeeDashboard /></ProtectedRoute>} />
                <Route path="leaves" element={<ProtectedRoute allowedRoles={['CEO', 'HR', 'Employee']}><LeaveDashboard /></ProtectedRoute>} />
                <Route path="profile" element={<ProtectedRoute allowedRoles={['CEO', 'HR', 'Employee']}><EmployeeProfile /></ProtectedRoute>} />
                <Route path="documents" element={<ProtectedRoute allowedRoles={['CEO', 'HR', 'Employee']}><MyDocuments /></ProtectedRoute>} />
                <Route path="hr/documents" element={<ProtectedRoute allowedRoles={['CEO', 'HR']}><DocumentVerification /></ProtectedRoute>} />
                <Route path="hr/applications" element={<ProtectedRoute allowedRoles={['CEO', 'HR']}><ApplicationsList /></ProtectedRoute>} />

                {/* Catch-all for unknown admin pages falls back to role dashboard */}
                <Route path="*" element={<DashboardRedirect />} />
            </Route>
        </Routes>
    );
};

export default AdminRouter;
