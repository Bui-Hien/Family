import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  Avatar,
  Box,
  Typography,
  Stack,
  Tooltip,
  IconButton
} from '@mui/material';
import {
  Event as EventIcon,
  LocationOn as LocationIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { useEventStore } from '@/modules/events/store/useEventStore';
import { UserRole } from '@/common/constants';
import HasPermission from '@/common/components/auth/HasPermission';

const EventList = () => {
  const { dataList, handleOpenCreateEdit, handleDelete } = useEventStore();

  if (dataList.length === 0) {
    return (
      <Typography color="textSecondary" sx={{ py: 5, textAlign: 'center' }}>
        Chưa có sự kiện nào được ghi nhận.
      </Typography>
    );
  }

  return (
    <Grid container spacing={3}>
      {dataList.map((event) => (
        <Grid item xs={12} sm={6} key={event.id}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <CardContent sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
              <Avatar sx={{ bgcolor: 'rgba(140, 29, 64, 0.08)', color: 'primary.main', p: 1 }}>
                <EventIcon />
              </Avatar>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {event.title}
                </Typography>
                <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mt: 0.5 }}>
                  Thời gian: {event.eventDate ? new Date(event.eventDate).toLocaleString('vi-VN') : 'Chưa thiết lập'}
                </Typography>
                {event.annual && (
                  <Typography variant="caption" color="secondary.main" sx={{ fontWeight: 500, display: 'block' }}>
                    🔄 Sự kiện thường niên hàng năm
                  </Typography>
                )}
                <Typography variant="body2" sx={{ mt: 1.5, color: 'text.secondary' }}>
                  {event.description || 'Không có mô tả chi tiết.'}
                </Typography>
                <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mt: 1.5 }}>
                  <LocationIcon sx={{ fontSize: '0.875rem', color: 'primary.main' }} />
                  <Typography variant="caption" color="primary.main" sx={{ fontWeight: 500 }}>
                    {event.location || 'Tại nhà thờ tổ'}
                  </Typography>
                </Stack>
              </Box>
            </CardContent>
            <HasPermission roles={[UserRole.SYSTEM_ADMIN, UserRole.FAMILY_LEADER, UserRole.FAMILY_ADMIN]}>
              <Box sx={{ p: 1.5, display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid', borderColor: 'divider' }}>
                <Stack direction="row" spacing={1}>
                  <Tooltip title="Chỉnh sửa sự kiện">
                    <IconButton size="small" onClick={() => handleOpenCreateEdit(event)} color="primary">
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Xóa sự kiện">
                    <IconButton size="small" onClick={() => handleDelete(event)} color="error">
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </Box>
            </HasPermission>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default EventList;
