import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Box, IconButton, Typography, Tooltip, Avatar, Menu, MenuItem, Divider, ListItemIcon, ListItemText } from '@mui/material';
import { Menu as MenuIcon, Brightness4 as DarkIcon, Brightness7 as LightIcon, ExitToApp as LogoutIcon, AccountBox as ProfileIcon } from '@mui/icons-material';
import CommonAvatar from '@/common/components/display/CommonAvatar';

const CommonHeader = ({
  onToggleSidebar,
  onLogout,
  user,
  profile,
  themeMode,
  onToggleTheme,
  sidebarOpen,
  drawerWidth = 260,
}) => {
  const navigate = useNavigate();
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
        boxShadow: (theme) => theme.palette.mode === 'light' 
          ? '0 2px 10px rgba(140, 29, 64, 0.04)' 
          : '0 2px 15px rgba(0,0,0,0.3)',
        borderBottom: '2px solid',
        borderColor: (theme) => theme.palette.mode === 'light' ? 'secondary.main' : 'secondary.dark',
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
              fontSize: { xs: '0.95rem', sm: '1.1rem', md: '1.25rem' },
            }}
          >
            <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
              🏛️ QUẢN LÝ DÒNG HỌ
            </Box>
            <Box component="span" sx={{ display: { xs: 'inline', sm: 'none' } }}>
              🏛️ DÒNG HỌ
            </Box>
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
              <CommonAvatar
                name={profile?.fullName || user?.fullName || 'U'}
                imgPath={profile?.avatarUrl || ''}
                style={{ width: 40, height: 40 }}
              />
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
                  {profile?.fullName || user?.fullName || 'Thành viên dòng họ'}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  {user?.email || 'member@family.com'}
                </Typography>
              </Box>
            </MenuItem>
            <Divider />
            {profile?.id && (
              <>
                <MenuItem onClick={() => { handleMenuClose(); navigate(`/members/${profile.id}`); }}>
                  <ListItemIcon>
                    <ProfileIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Hồ sơ của tôi" />
                </MenuItem>
                <Divider />
              </>
            )}
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
