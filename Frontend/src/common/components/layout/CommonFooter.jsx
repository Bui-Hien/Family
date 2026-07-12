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
        borderTop: '1px solid',
        borderColor: 'divider',
        backgroundColor: 'background.paper',
      }}
    >
      <Typography variant="body2" color="text.secondary">
        © {new Date().getFullYear()} <strong>Hệ thống Quản lý Gia phả & Dòng họ</strong> • Bảo tồn di sản tổ tiên.
      </Typography>
    </Box>
  );
};

export default CommonFooter;
