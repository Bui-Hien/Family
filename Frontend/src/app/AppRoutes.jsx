import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '@/layout/MainLayout';
import AuthLayout from '@/layout/AuthLayout';
import useAuthStore from '@/stores/authStore';

// Page Imports
import LoginPage from '@/modules/auth/pages/LoginPage';
import ForgotPasswordPage from '@/modules/auth/pages/ForgotPasswordPage';
import DashboardPage from '@/modules/dashboard/pages/DashboardPage';
import MembersPage from '@/modules/members/pages/MembersPage';
import MemberDetailPage from '@/modules/members/pages/MemberDetailPage';
import FamilyTreePage from '@/modules/family-tree/pages/FamilyTreePage';
import EventsPage from '@/modules/events/pages/EventsPage';
import PostsPage from '@/modules/posts/pages/PostsPage';
import GalleryPage from '@/modules/gallery/pages/GalleryPage';
import FundsPage from '@/modules/funds/pages/FundsPage';
import AdminPage from '@/modules/admin/pages/AdminPage';

// Component Route bảo vệ (Protected Route)
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  // Giả lập cho phép qua nếu chưa đăng nhập thực tế lần đầu để test
  const hasToken = localStorage.getItem('accessToken') || isAuthenticated;
  return hasToken ? children : <Navigate to="/auth/login" replace />;
};

// Component Route Admin (Admin Route)
const AdminRoute = ({ children }) => {
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'ADMIN' || true; // Cho phép test admin trong dev
  return isAdmin ? children : <Navigate to="/" replace />;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Auth Layout Routing */}
      <Route path="/auth" element={<AuthLayout />}>
        <Route path="login" element={<LoginPage />} />
        <Route path="forgot-password" element={<ForgotPasswordPage />} />
        <Route index element={<Navigate to="/auth/login" replace />} />
      </Route>

      {/* Main Layout Routing */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="members" element={<MembersPage />} />
        <Route path="members/:id" element={<MemberDetailPage />} />
        <Route path="family-tree" element={<FamilyTreePage />} />
        <Route path="events" element={<EventsPage />} />
        <Route path="posts" element={<PostsPage />} />
        <Route path="gallery" element={<GalleryPage />} />
        <Route path="funds" element={<FundsPage />} />
        
        {/* Admin Section */}
        <Route
          path="admin"
          element={
            <AdminRoute>
              <AdminPage />
            </AdminRoute>
          }
        />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
