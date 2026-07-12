import React, { useMemo } from 'react';
import { Outlet } from 'react-router-dom';
import { Container, Paper, Box, Typography } from '@mui/material';

// 1. Tách Style ra khỏi Component để trình duyệt không phải khởi tạo lại Object mỗi lần render
const containerSx = {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #8C1D40 0%, #5E0E27 100%)',
    py: 4,
    px: 2, // Thêm padding ngang cho màn hình mobile
};

const paperSx = {
    p: 4,
    borderRadius: 3,
    border: '1px solid rgba(255, 255, 255, 0.1)',
    background: 'rgba(255, 255, 255, 0.98)', // Tăng opacity nhẹ để text dễ đọc hơn
    backdropFilter: 'blur(10px)',
    transition: 'all 0.3s ease',
};

const headerSx = { textAlign: 'center', mb: 3 };

const titleSx = {
    fontFamily: '"Playfair Display", serif',
    color: '#8C1D40',
    fontWeight: 700,
    mb: 1,
    letterSpacing: '0.5px', // Thêm khoảng cách chữ để sang trọng hơn
};

const AuthLayout = () => {
    return (
        <Box sx={containerSx}>
            <Container maxWidth="xs">
                <Paper elevation={6} sx={paperSx}>
                    {/* Header thương hiệu */}
                    <Box sx={headerSx}>
                        <Typography variant="h4" sx={titleSx} component="h1">
                            🏛️ DÒNG HỌ
                        </Typography>
                        <Typography variant="body2" color="textSecondary" component="p">
                            Hệ thống Gia phả & Quản lý Thông tin Dòng họ
                        </Typography>
                    </Box>

                    {/* Nội dung trang (Login/Register/Forgot Password) */}
                    <Outlet />
                </Paper>
            </Container>
        </Box>
    );
};

// Sử dụng React.memo để bảo vệ layout không bị re-render nếu không có thay đổi từ Router
export default React.memo(AuthLayout);