import React, { useState } from 'react';
import { AppBar, Toolbar, Box, IconButton, Typography, Tooltip, Avatar, Menu, MenuItem, Divider, ListItemIcon, ListItemText } from '@mui/material';
import { Menu as MenuIcon, Brightness4 as DarkIcon, Brightness7 as LightIcon, ExitToApp as LogoutIcon } from '@mui/icons-material';

const CommonHeader = ({
  onToggleSidebar,
  onLogout,
  user,
  themeMode,
  onToggleTheme,
  sidebarOpen,
  drawerWidth = 260,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleLogoutAction = () => {
    handleMenuClose();
    if (onLogout) onLogout();
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        width: { md: sidebarOpen ? `calc(100% - ${drawerWidth}px)` : '100%' },
        marginLeft: { md: sidebarOpen ? `${drawerWidth}px` : 0 },
        transition: (theme) =>
          theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        backgroundColor: 'background.paper',
        color: 'text.primary',
        boxShadow: '0 1px 10px rgba(0,0,0,0.05)',
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={onToggleSidebar}
            edge="start"
            sx={{ marginRight: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{
              fontFamily: '"Playfair Display", serif',
              fontWeight: 700,
              color: 'primary.main',
            }}
          >
            🏛️ QUẢN LÝ DÒNG HỌ
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Tooltip title={themeMode === 'light' ? 'Chế độ tối' : 'Chế độ sáng'}>
            <IconButton onClick={onToggleTheme} color="inherit">
              {themeMode === 'light' ? <DarkIcon /> : <LightIcon />}
            </IconButton>
          </Tooltip>

          <Tooltip title="Tài khoản">
            <IconButton onClick={handleMenuOpen} sx={{ p: 0, ml: 1 }}>
              <Avatar sx={{ bgcolor: 'primary.main' }}>
                {user?.fullName?.charAt(0) || 'U'}
              </Avatar>
            </IconButton>
          </Tooltip>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <MenuItem disabled sx={{ opacity: '1 !important' }}>
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  {user?.fullName || 'Thành viên dòng họ'}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  {user?.email || 'member@family.com'}
                </Typography>
              </Box>
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogoutAction}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Đăng xuất" />
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default CommonHeader;
