import React from 'react';
import { Card, CardContent, Typography, Grid, Avatar } from '@mui/material';
import { Event as EventIcon, People as PeopleIcon, AccountBalance as BalanceIcon } from '@mui/icons-material';
import { useDashboardStore } from '@/modules/dashboard/store/useDashboardStore';

const StatsCard = () => {
  const { totalMembers, totalEvents, fundBalance } = useDashboardStore();

  return (
    <Grid container spacing={3}>
      {/* Card 1: Members */}
      <Grid item xs={12} sm={4}>
        <Card className="hover-lift" sx={{ cursor: 'default', height: '100%' }}>
          <CardContent sx={{ p: 3, textAlign: 'center' }}>
            <Avatar 
              sx={{ 
                bgcolor: 'rgba(140, 29, 64, 0.08)', 
                color: 'primary.main', 
                mx: 'auto', 
                mb: 2, 
                width: 56, 
                height: 56,
                transition: 'transform 0.2s ease',
                '&:hover': { transform: 'scale(1.1)' }
              }}
            >
              <PeopleIcon fontSize="large" />
            </Avatar>
            <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main', mb: 0.5 }}>
              {totalMembers}
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 500 }}>
              Thành viên dòng họ
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* Card 2: Events */}
      <Grid item xs={12} sm={4}>
        <Card className="hover-lift" sx={{ cursor: 'default', height: '100%' }}>
          <CardContent sx={{ p: 3, textAlign: 'center' }}>
            <Avatar 
              sx={{ 
                bgcolor: 'rgba(197, 160, 89, 0.08)', 
                color: 'secondary.main', 
                mx: 'auto', 
                mb: 2, 
                width: 56, 
                height: 56,
                transition: 'transform 0.2s ease',
                '&:hover': { transform: 'scale(1.1)' }
              }}
            >
              <EventIcon fontSize="large" />
            </Avatar>
            <Typography variant="h4" sx={{ fontWeight: 700, color: 'secondary.main', mb: 0.5 }}>
              {totalEvents}
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 500 }}>
              Sự kiện & Giỗ chạp
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* Card 3: Funds */}
      <Grid item xs={12} sm={4}>
        <Card className="hover-lift" sx={{ cursor: 'default', height: '100%' }}>
          <CardContent sx={{ p: 3, textAlign: 'center' }}>
            <Avatar 
              sx={{ 
                bgcolor: 'rgba(46, 125, 50, 0.08)', 
                color: 'success.main', 
                mx: 'auto', 
                mb: 2, 
                width: 56, 
                height: 56,
                transition: 'transform 0.2s ease',
                '&:hover': { transform: 'scale(1.1)' }
              }}
            >
              <BalanceIcon fontSize="large" />
            </Avatar>
            <Typography variant="h4" sx={{ fontWeight: 700, color: 'success.main', mb: 0.5, fontSize: { xs: '1.5rem', md: '1.8rem', lg: '2.1rem' } }}>
              {fundBalance.toLocaleString('vi-VN')} <span style={{ fontSize: '1rem' }}>₫</span>
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 500 }}>
              Quỹ dòng họ hiện tại
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default StatsCard;
