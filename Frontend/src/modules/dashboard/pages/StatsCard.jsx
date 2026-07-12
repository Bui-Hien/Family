import React from 'react';
import { Card, CardContent, Typography, List, ListItem, ListItemAvatar, ListItemText, Avatar, Divider } from '@mui/material';
import { Event as EventIcon, People as PeopleIcon, AccountBalance as BalanceIcon } from '@mui/icons-material';
import { useDashboardStore } from '@/modules/dashboard/store/useDashboardStore';

const StatsCard = () => {
  const { totalMembers, totalEvents, fundBalance } = useDashboardStore();

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" className="serif-title" sx={{ mb: 2, color: 'primary.main' }}>
          📊 Số liệu chung
        </Typography>
        <List>
          <ListItem>
            <ListItemAvatar>
              <Avatar sx={{ bgcolor: 'rgba(140, 29, 64, 0.08)', color: 'primary.main' }}>
                <PeopleIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary="Tổng thành viên" secondary={`${totalMembers} thành viên`} />
          </ListItem>
          <Divider variant="inset" component="li" />
          <ListItem>
            <ListItemAvatar>
              <Avatar sx={{ bgcolor: 'rgba(197, 160, 89, 0.08)', color: 'secondary.main' }}>
                <EventIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary="Sự kiện trong năm" secondary={`${totalEvents} sự kiện`} />
          </ListItem>
          <Divider variant="inset" component="li" />
          <ListItem>
            <ListItemAvatar>
              <Avatar sx={{ bgcolor: 'success.light', color: '#fff' }}>
                <BalanceIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary="Quỹ dòng họ hiện tại" secondary={`${fundBalance.toLocaleString('vi-VN')} ₫`} />
          </ListItem>
        </List>
      </CardContent>
    </Card>
  );
};

export default StatsCard;
