import React from 'react';
import { Card, CardContent, Typography, List, ListItem, ListItemText, Divider } from '@mui/material';
import { useDashboardStore } from '@/modules/dashboard/store/useDashboardStore';

const UpcomingEvents = () => {
  const { upcomingEvents } = useDashboardStore();

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Typography variant="h6" className="serif-title" sx={{ mb: 2, color: 'primary.main' }}>
          📅 Sự kiện sắp diễn ra
        </Typography>
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
                    primary={event.title}
                    secondary={
                      <>
                        <Typography component="span" variant="body2" color="textPrimary" sx={{ display: 'block', mt: 0.5 }}>
                          Ngày diễn ra: {event.eventDate ? new Date(event.eventDate).toLocaleDateString('vi-VN') : 'Chưa định ngày'}
                        </Typography>
                        {event.location}
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
