import React from 'react';
import { Drawer, Toolbar, IconButton, Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { ChevronLeft as ChevronLeftIcon } from '@mui/icons-material';

const CommonSidebar = ({
  open,
  onClose,
  items = [],
  variant = 'permanent',
  drawerWidth = 260,
  activePath,
  onNavigate,
}) => {
  const sidebarContent = (
    <>
      <Toolbar sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', px: 1 }}>
        <IconButton onClick={onClose}>
          <ChevronLeftIcon />
        </IconButton>
      </Toolbar>
      <Divider />
      <List sx={{ px: 1 }}>
        {items.map((item) => {
          const isActive = activePath === item.path;
          return (
            <ListItem key={item.text} disablePadding sx={{ display: 'block', mb: 0.5 }}>
              <ListItemButton
                onClick={() => onNavigate && onNavigate(item.path)}
                sx={{
                  minHeight: 48,
                  px: 2.5,
                  borderRadius: 2,
                  backgroundColor: isActive ? 'primary.main' : 'transparent',
                  color: isActive ? 'primary.contrastText' : 'text.primary',
                  '&:hover': {
                    backgroundColor: isActive ? 'primary.main' : 'rgba(140, 29, 64, 0.08)',
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: 3,
                    justifyContent: 'center',
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
    </>
  );

  if (variant === 'temporary') {
    return (
      <Drawer
        variant="temporary"
        open={open}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
            background: (theme) => theme.palette.mode === 'light' ? '#FAF8F5' : '#1E1E1E',
          },
        }}
      >
        {sidebarContent}
      </Drawer>
    );
  }

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: open ? drawerWidth : 0,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          borderRight: '1px solid',
          borderColor: 'divider',
          background: (theme) => theme.palette.mode === 'light' ? '#FAF8F5' : '#1E1E1E',
          transition: (theme) =>
            theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
          ...(!open && {
            width: 0,
            overflowX: 'hidden',
            transition: (theme) =>
              theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
              }),
          }),
        },
      }}
      open={open}
    >
      {sidebarContent}
    </Drawer>
  );
};

export default CommonSidebar;
