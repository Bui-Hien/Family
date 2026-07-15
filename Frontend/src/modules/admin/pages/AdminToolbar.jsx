import { Box, Typography, Button } from '@mui/material';
import { Add as AddIcon, AdminPanelSettings as AdminIcon } from '@mui/icons-material';
import { useAdminStore } from '@/modules/admin/store/useAdminStore';

const AdminToolbar = () => {
  const { handleOpenCreateEdit } = useAdminStore();

  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3, flexWrap: 'wrap', gap: 2 }}>
      <Box sx={{ minWidth: 0, flex: 1 }}>
        <Typography variant="h4" className="serif-title" sx={{ color: 'primary.main', mb: 0.5, fontSize: { xs: '1.5rem', md: '2.125rem' }, display: 'flex', alignItems: 'center', gap: 1 }}>
          <AdminIcon sx={{ fontSize: { xs: '1.75rem', md: '2.25rem' } }} /> Quản trị Tài khoản Hệ thống
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Quản lý và cấp quyền tài khoản người dùng truy cập hệ thống gia tộc
        </Typography>
      </Box>
      <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenCreateEdit(null)} size="medium">
        Thêm tài khoản
      </Button>
    </Box>
  );
};

export default AdminToolbar;
