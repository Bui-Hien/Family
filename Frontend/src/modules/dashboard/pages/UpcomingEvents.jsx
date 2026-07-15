import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, Typography, List, ListItem, ListItemText, Divider, Box, Button } from '@mui/material';
import { useDashboardStore } from '@/modules/dashboard/store/useDashboardStore';

const UpcomingEvents = () => {
  const { upcomingEvents } = useDashboardStore();
  const navigate = useNavigate();

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" className="serif-title" sx={{ color: 'primary.main' }}>
            📅 Sự kiện sắp tới
          </Typography>
          <Button 
            size="small" 
            variant="text" 
            onClick={() => navigate('/events')}
            sx={{ fontWeight: 600, '&:hover': { color: 'primary.light' } }}
          >
            Xem tất cả
          </Button>
        </Box>
        {upcomingEvents.length === 0 ? (
          <Typography variant="body2" color="textSecondary" sx={{ py: 2 }}>
            Không có sự kiện sắp tới nào.
          </Typography>
        ) : (
          <List>
            {upcomingEvents.map((event, idx) => (
              <React.Fragment key={event.id || idx}>
                <ListItem alignItems="flex-start" sx={{ px: 0 }}>
                  <ListItemText
                    primary={
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {event.title}
                      </Typography>
                    }
                    secondary={
                      <>
                        <Typography component="span" variant="body2" color="textPrimary" sx={{ display: 'block', mt: 0.5, fontSize: '13px' }}>
                          Ngày diễn ra: {event.eventDate ? new Date(event.eventDate).toLocaleDateString('vi-VN') : 'Chưa định ngày'}
                        </Typography>
                        <span style={{ fontSize: '12px', color: 'text.secondary' }}>{event.location}</span>
                      </>
                    }
                  />
                </ListItem>
                {idx < upcomingEvents.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        )}
      </CardContent>
    </Card>
  );
};

export default UpcomingEvents;
