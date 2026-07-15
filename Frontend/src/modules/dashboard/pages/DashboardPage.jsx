import React, { useEffect } from 'react';
import { Box, Grid, Card, CardContent, Typography } from '@mui/material';
import { useDashboardStore } from '@/modules/dashboard/store/useDashboardStore';
import CommonLoading from '@/common/components/display/CommonLoading';
import StatsCard from './StatsCard';
import UpcomingEvents from './UpcomingEvents';
import FeaturedPosts from './FeaturedPosts';

const DashboardPage = () => {
  const { loading, loadDashboardData, resetStore } = useDashboardStore();

  useEffect(() => {
    loadDashboardData();
    return () => {
      resetStore();
    };
  }, []);

  if (loading) {
    return <CommonLoading loading={loading} type="skeleton" rows={5} />;
  }

  return (
    <Box>
      {/* Welcome Banner */}
      <Card
        sx={{
          mb: 4,
          position: 'relative',
          overflow: 'hidden',
          background: (theme) => `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
          color: '#ffffff',
          borderRadius: 4,
          boxShadow: '0 4px 20px rgba(140, 29, 64, 0.12)',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'%3E%3Cpath d='M30 10c-5.5 0-10 4.5-10 10s4.5 10 10 10 10-4.5 10-10-4.5-10-10-10zm0 16c-3.3 0-6-2.7-6-6s2.7-6 6-6 6 2.7 6 6-2.7 6-6 6zm0 14c-5.5 0-10 4.5-10 10s4.5 10 10 10 10-4.5 10-10-4.5-10-10-10zm0 16c-3.3 0-6-2.7-6-6s2.7-6 6-6 6 2.7 6 6-2.7 6-6 6zM10 30c0-5.5 4.5-10 10-10s10 4.5 10 10-4.5 10-10 10-10-4.5-10-10zm16 0c0-3.3-2.7-6-6-6s-6 2.7-6 6 2.7 6 6 6 6-2.7 6-6zm24 0c0-5.5 4.5-10 10-10s10 4.5 10 10-4.5 10-10 10-10-4.5-10-10zm16 0c0-3.3-2.7-6-6-6s-6 2.7-6 6 2.7 6 6 6 6-2.7 6-6z' fill='%23ffffff' fill-opacity='0.06' fill-rule='evenodd'/%3E%3C/svg%3E")`,
            pointerEvents: 'none',
          }
        }}
      >
        <CardContent sx={{ p: { xs: 3, md: 4 }, position: 'relative', zIndex: 1 }}>
          <Typography variant="h4" className="serif-title" sx={{ mb: 1, fontWeight: 700, fontSize: { xs: '1.8rem', md: '2.2rem' } }}>
            🏛️ Kính chào gia tộc!
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.95, fontSize: '15px', maxWidth: '800px', lineHeight: 1.6 }}>
            Chào mừng bạn đến với Hệ thống Quản lý Gia phả & Thông tin Dòng họ. Hệ thống giúp lưu trữ thông tin gia đình, kết nối thế hệ và gìn giữ văn hóa truyền thống của dòng họ.
          </Typography>
        </CardContent>
      </Card>

      {/* Metrics Row */}
      <Box sx={{ mb: 4 }}>
        <StatsCard />
      </Box>

      {/* Content Grid */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={7} lg={8}>
          <FeaturedPosts />
        </Grid>
        <Grid item xs={12} md={5} lg={4}>
          <UpcomingEvents />
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardPage;
