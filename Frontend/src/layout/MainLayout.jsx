import React, { useMemo, useCallback, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import memberService from '@/modules/members/services/memberService';
import { Box, Toolbar, useTheme, useMediaQuery } from '@mui/material';
import {
    Dashboard as DashboardIcon, People as PeopleIcon, AccountTree as AccountTreeIcon,
    Event as EventIcon, Article as ArticleIcon, PhotoLibrary as PhotoLibraryIcon,
    MonetizationOn as MonetizationOnIcon, AdminPanelSettings as AdminIcon,
} from '@mui/icons-material';

import useUiStore from '@/stores/uiStore';
import useAuthStore from '@/stores/authStore';
import CommonHeader from '@/common/components/layout/CommonHeader';
import CommonSidebar from '@/common/components/layout/CommonSidebar';
import CommonFooter from '@/common/components/layout/CommonFooter';

const DRAWER_WIDTH = 260;

const MainLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const { sidebarOpen, toggleSidebar, setSidebarOpen, themeMode, toggleThemeMode } = useUiStore();
    const { user, profile, setProfile, logout } = useAuthStore();

    useEffect(() => {
        if (user && !profile) {
            memberService.getCurrentProfile()
                .then((res) => {
                    if (res.success && res.data) {
                        setProfile(res.data);
                    }
                })
                .catch((err) => console.error('Failed to fetch current profile:', err));
        }
    }, [user, profile, setProfile]);

    // 1. Memoize Menu Items: Tránh tạo lại array mỗi lần render
    const menuItems = useMemo(() => [
        { text: 'Bảng tin', icon: <DashboardIcon />, path: '/dashboard' },
        { text: 'Thành viên', icon: <PeopleIcon />, path: '/members' },
        { text: 'Gia phả', icon: <AccountTreeIcon />, path: '/family-tree' },
        { text: 'Sự kiện & Giỗ chạp', icon: <EventIcon />, path: '/events' },
        { text: 'Tin tức & Hoạt động', icon: <ArticleIcon />, path: '/posts' },
        { text: 'Thư viện ảnh', icon: <PhotoLibraryIcon />, path: '/gallery' },
        { text: 'Quỹ dòng họ', icon: <MonetizationOnIcon />, path: '/funds' },
        { text: 'Quản trị hệ thống', icon: <AdminIcon />, path: '/admin', adminOnly: true },
    ], []);

    // 2. Tối ưu Handlers bằng useCallback để không truyền props thay đổi xuống Header/Sidebar
    const handleLogout = useCallback(() => {
        logout();
        navigate('/auth/login', { replace: true });
    }, [logout, navigate]);

    const handleNavigation = useCallback((path) => {
        navigate(path);
        if (isMobile) setSidebarOpen(false);
    }, [navigate, isMobile, setSidebarOpen]);

    // 3. Tách Layout logic ra các biến sx memoized
    const mainBoxSx = useMemo(() => ({
        flexGrow: 1, p: 3, pb: 10, width: '100%',
        backgroundColor: 'background.default',
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
    }), []);

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
            <CommonHeader
                onToggleSidebar={toggleSidebar}
                onLogout={handleLogout}
                user={user}
                profile={profile}
                themeMode={themeMode}
                onToggleTheme={toggleThemeMode}
                sidebarOpen={sidebarOpen}
                drawerWidth={DRAWER_WIDTH}
            />

            <CommonSidebar
                open={sidebarOpen}
                onClose={toggleSidebar}
                items={menuItems}
                variant={isMobile ? 'temporary' : 'permanent'}
                drawerWidth={DRAWER_WIDTH}
                activePath={location.pathname}
                onNavigate={handleNavigation}
            />

            <Box component="main" sx={mainBoxSx}>
                <Toolbar />
                <Box sx={{ flexGrow: 1 }}>
                    <Outlet />
                </Box>
                <CommonFooter sidebarOpen={sidebarOpen} drawerWidth={DRAWER_WIDTH} />
            </Box>
        </Box>
    );
};

export default React.memo(MainLayout);