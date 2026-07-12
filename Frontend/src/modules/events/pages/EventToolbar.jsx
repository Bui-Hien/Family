import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useEventStore } from '@/modules/events/store/useEventStore';
import { UserRole } from '@/common/constants';
import HasPermission from '@/common/components/auth/HasPermission';

const EventToolbar = () => {
  const { handleOpenCreateEdit } = useEventStore();

  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
      <Typography variant="h5" className="serif-title" sx={{ fontWeight: 700, color: 'primary.main' }}>
        📅 Sự kiện & Giỗ chạp dòng họ
      </Typography>
      <HasPermission roles={[UserRole.SYSTEM_ADMIN, UserRole.FAMILY_LEADER, UserRole.FAMILY_ADMIN]}>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenCreateEdit(null)} size="small">
          Thêm sự kiện
        </Button>
      </HasPermission>
    </Box>
  );
};

export default EventToolbar;
