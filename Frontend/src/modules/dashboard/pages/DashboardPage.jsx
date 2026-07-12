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
      <Card
        sx={{
          mb: 4,
          background: 'linear-gradient(135deg, #8C1D40 0%, #B23B68 100%)',
          color: '#ffffff',
          borderRadius: 3,
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h4" className="serif-title" sx={{ mb: 1, fontWeight: 700 }}>
            🏛️ Kính chào gia tộc!
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.9 }}>
            Chào mừng bạn đến với Hệ thống Quản lý Gia phả & Thông tin Dòng họ. Hệ thống giúp lưu trữ thông tin gia đình, kết nối thế hệ và gìn giữ văn hóa truyền thống của dòng họ.
          </Typography>
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <StatsCard />
        </Grid>
        <Grid item xs={12} md={4}>
          <UpcomingEvents />
        </Grid>
        <Grid item xs={12} md={4}>
          <FeaturedPosts />
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardPage;
