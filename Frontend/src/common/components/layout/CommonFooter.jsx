import { Box, Typography } from '@mui/material';

const CommonFooter = ({ sidebarOpen, drawerWidth = 260 }) => {
  return (
    <Box
      component="footer"
      sx={{
        py: 2,
        px: 2,
        position: 'fixed',
        bottom: 0,
        right: 0,
        zIndex: (theme) => theme.zIndex.drawer - 1,
        width: { md: sidebarOpen ? `calc(100% - ${drawerWidth}px)` : '100%' },
        transition: (theme) =>
          theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        textAlign: 'center',
        borderTop: '2px solid',
        borderColor: (theme) => theme.palette.mode === 'light' ? 'secondary.main' : 'secondary.dark',
        backgroundColor: 'background.paper',
      }}
    >
      <Typography variant="body2" color="text.secondary" sx={{ letterSpacing: '0.3px' }}>
        © {new Date().getFullYear()} <strong>Hệ thống Quản lý Gia phả & Dòng họ</strong> • <span style={{ fontFamily: '"Playfair Display", Georgia, serif', fontStyle: 'italic', fontWeight: 600, color: '#C5A059' }}>Bảo tồn di sản tổ tiên</span>.
      </Typography>
    </Box>
  );
};

export default CommonFooter;
