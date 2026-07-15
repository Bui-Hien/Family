import { Box, Typography, Button } from '@mui/material';
import { Add as AddIcon, Event as EventIcon } from '@mui/icons-material';
import { useEventStore } from '@/modules/events/store/useEventStore';
import { UserRole } from '@/common/constants';
import HasPermission from '@/common/components/auth/HasPermission';

const EventToolbar = () => {
  const { handleOpenCreateEdit } = useEventStore();

  return (
    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'stretch', sm: 'flex-start' }, mb: 3, gap: 2 }}>
      <Box sx={{ minWidth: 0 }}>
        <Typography variant="h4" className="serif-title" sx={{ color: 'primary.main', mb: 0.5, fontSize: { xs: '1.5rem', md: '2.125rem' }, display: 'flex', alignItems: 'center', gap: 1 }}>
          <EventIcon sx={{ fontSize: { xs: '1.75rem', md: '2.25rem' } }} /> Sự kiện &amp; Giỗ chạp
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Quản lý và theo dõi các hoạt động, sự kiện và ngày giỗ chạp trong dòng họ
        </Typography>
      </Box>
      <HasPermission roles={[UserRole.SYSTEM_ADMIN, UserRole.FAMILY_LEADER, UserRole.FAMILY_ADMIN]}>
        <Box sx={{ display: 'flex', justifyContent: { xs: 'flex-start', sm: 'flex-end' } }}>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenCreateEdit(null)} size="medium">
            Thêm sự kiện
          </Button>
        </Box>
      </HasPermission>
    </Box>
  );
};

export default EventToolbar;
