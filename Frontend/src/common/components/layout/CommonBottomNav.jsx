import React, { useState, useMemo, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  BottomNavigation,
  BottomNavigationAction,
  Paper,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  Divider,
  IconButton,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  AccountTree as AccountTreeIcon,
  Event as EventIcon,
  MoreHoriz as MoreIcon,
  Article as ArticleIcon,
  PhotoLibrary as PhotoLibraryIcon,
  MonetizationOn as MonetizationOnIcon,
  AdminPanelSettings as AdminIcon,
  Close as CloseIcon,
} from '@mui/icons-material';

// 5 tab chính hiển thị ở bottom bar
const PRIMARY_TABS = [
  { label: 'Bảng tin', icon: <DashboardIcon />, path: '/dashboard' },
  { label: 'Thành viên', icon: <PeopleIcon />, path: '/members' },
  { label: 'Gia phả', icon: <AccountTreeIcon />, path: '/family-tree' },
  { label: 'Sự kiện', icon: <EventIcon />, path: '/events' },
  { label: 'Thêm', icon: <MoreIcon />, path: '__more__' },
];

// Các mục phụ hiển thị trong drawer "Thêm"
const SECONDARY_ITEMS = [
  { text: 'Tin tức & Hoạt động', icon: <ArticleIcon />, path: '/posts' },
  { text: 'Thư viện ảnh', icon: <PhotoLibraryIcon />, path: '/gallery' },
  { text: 'Quỹ dòng họ', icon: <MonetizationOnIcon />, path: '/funds' },
  { text: 'Quản trị hệ thống', icon: <AdminIcon />, path: '/admin', adminOnly: true },
];

const CommonBottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [moreOpen, setMoreOpen] = useState(false);

  // Xác định tab active dựa trên path hiện tại
  const activeTab = useMemo(() => {
    const currentPath = location.pathname;
    // Kiểm tra primary tabs trước
    const primaryIndex = PRIMARY_TABS.findIndex(
      (tab) => tab.path !== '__more__' && currentPath.startsWith(tab.path)
    );
    if (primaryIndex >= 0) return primaryIndex;
    // Nếu đang ở secondary page → highlight tab "Thêm"
    const isSecondary = SECONDARY_ITEMS.some((item) => currentPath.startsWith(item.path));
    if (isSecondary) return 4; // index của "Thêm"
    return 0; // default Dashboard
  }, [location.pathname]);

  const handleTabChange = useCallback(
    (_event, newValue) => {
      const tab = PRIMARY_TABS[newValue];
      if (tab.path === '__more__') {
        setMoreOpen(true);
      } else {
        navigate(tab.path);
      }
    },
    [navigate]
  );

  const handleSecondaryNav = useCallback(
    (path) => {
      setMoreOpen(false);
      navigate(path);
    },
    [navigate]
  );

  return (
    <>
      {/* Bottom Navigation Bar */}
      <Paper
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: (theme) => theme.zIndex.appBar + 1,
          display: { xs: 'block', md: 'none' },
          borderTop: '2px solid',
          borderColor: 'secondary.main',
          paddingBottom: 'env(safe-area-inset-bottom)',
        }}
        elevation={8}
      >
        <BottomNavigation
          value={activeTab}
          onChange={handleTabChange}
          showLabels
          sx={{
            height: 64,
            '& .MuiBottomNavigationAction-root': {
              minWidth: 'auto',
              py: 0.5,
              transition: 'all 0.2s ease',
              '&.Mui-selected': {
                color: 'primary.main',
              },
            },
            '& .MuiBottomNavigationAction-label': {
              fontSize: '0.65rem',
              '&.Mui-selected': {
                fontSize: '0.7rem',
                fontWeight: 600,
              },
            },
          }}
        >
          {PRIMARY_TABS.map((tab) => (
            <BottomNavigationAction
              key={tab.label}
              label={tab.label}
              icon={tab.icon}
            />
          ))}
        </BottomNavigation>
      </Paper>

      {/* Drawer "Thêm" cho các mục phụ */}
      <Drawer
        anchor="bottom"
        open={moreOpen}
        onClose={() => setMoreOpen(false)}
        PaperProps={{
          sx: {
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            maxHeight: '50vh',
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              Chức năng khác
            </Typography>
            <IconButton size="small" onClick={() => setMoreOpen(false)}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
          <Divider sx={{ mb: 1 }} />
          <List disablePadding>
            {SECONDARY_ITEMS.map((item) => {
              const isActive = location.pathname.startsWith(item.path);
              return (
                <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
                  <ListItemButton
                    onClick={() => handleSecondaryNav(item.path)}
                    sx={{
                      borderRadius: 2,
                      minHeight: 48,
                      backgroundColor: isActive ? 'primary.main' : 'transparent',
                      color: isActive ? 'primary.contrastText' : 'text.primary',
                      '&:hover': {
                        backgroundColor: isActive ? 'primary.main' : 'rgba(140, 29, 64, 0.06)',
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 40,
                        color: isActive ? 'primary.contrastText' : 'text.secondary',
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.text}
                      primaryTypographyProps={{
                        fontSize: '14px',
                        fontWeight: isActive ? 600 : 500,
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default React.memo(CommonBottomNav);
