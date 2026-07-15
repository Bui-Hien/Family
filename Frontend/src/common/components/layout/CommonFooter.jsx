import React from 'react';
import { Box, Typography } from '@mui/material';

const CommonFooter = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
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
