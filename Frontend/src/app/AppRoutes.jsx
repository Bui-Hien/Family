import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '@/layout/MainLayout';
import AuthLayout from '@/layout/AuthLayout';
import useAuthStore from '@/stores/authStore';
import CommonLoading from '@/common/components/display/CommonLoading';

// Page Imports
const LoginPage = lazy(() => import('@/modules/auth/pages/LoginPage'));
const ForgotPasswordPage = lazy(() => import('@/modules/auth/pages/ForgotPasswordPage'));
const DashboardPage = lazy(() => import('@/modules/dashboard/pages/DashboardPage'));
const MembersPage = lazy(() => import('@/modules/members/pages/MembersPage'));
const MemberDetailPage = lazy(() => import('@/modules/members/pages/MemberDetailPage'));
const FamilyTreePage = lazy(() => import('@/modules/family-tree/pages/FamilyTreePage'));
const EventsPage = lazy(() => import('@/modules/events/pages/EventsPage'));
const PostsPage = lazy(() => import('@/modules/posts/pages/PostsPage'));
const PostDetailPage = lazy(() => import('@/modules/posts/pages/PostDetailPage'));
const GalleryPage = lazy(() => import('@/modules/gallery/pages/GalleryPage'));
const FundsPage = lazy(() => import('@/modules/funds/pages/FundsPage'));
const AdminPage = lazy(() => import('@/modules/admin/pages/AdminPage'));
import { getCookie } from '@/common/utils/cookieUtils';
import { UserRole } from '@/common/constants';

// Component Route bảo vệ (Protected Route)
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  const hasToken = getCookie('accessToken') || isAuthenticated;
  return hasToken ? children : <Navigate to="/auth/login" replace />;
};

// Component Route Admin (Admin Route)
const AdminRoute = ({ children }) => {
  const { user } = useAuthStore();
  const isAdmin =
    user?.role === UserRole.SYSTEM_ADMIN ||
    user?.role === UserRole.FAMILY_ADMIN ||
    user?.role === UserRole.FAMILY_LEADER;
  return isAdmin ? children : <Navigate to="/" replace />;
};

const AppRoutes = () => {
  return (
    <Suspense fallback={<CommonLoading loading={true} style={{ minHeight: '80vh' }} />}>
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
          <Route path="posts/:id" element={<PostDetailPage />} />
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
    </Suspense>
  );
};

export default AppRoutes;
