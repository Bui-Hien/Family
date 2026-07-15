import { Box, Typography, Button } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useEventStore } from '@/modules/events/store/useEventStore';
import { UserRole } from '@/common/constants';
import HasPermission from '@/common/components/auth/HasPermission';

const EventToolbar = () => {
  const { handleOpenCreateEdit } = useEventStore();

  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3, flexWrap: 'wrap', gap: 2 }}>
      <Box sx={{ minWidth: 0, flex: 1 }}>
        <Typography variant="h4" className="serif-title" sx={{ color: 'primary.main', mb: 0.5, fontSize: { xs: '1.5rem', md: '2.125rem' } }}>
          📅 Sự kiện & Giỗ chạp
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Quản lý và theo dõi các hoạt động, sự kiện và ngày giỗ chạp trong dòng họ
        </Typography>
      </Box>
      <HasPermission roles={[UserRole.SYSTEM_ADMIN, UserRole.FAMILY_LEADER, UserRole.FAMILY_ADMIN]}>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenCreateEdit(null)} size="medium">
          Thêm sự kiện
        </Button>
      </HasPermission>
    </Box>
  );
};

export default EventToolbar;
