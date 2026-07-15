import { Box, Typography, Button } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useAdminStore } from '@/modules/admin/store/useAdminStore';

const AdminToolbar = () => {
  const { handleOpenCreateEdit } = useAdminStore();

  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
      <Box>
        <Typography variant="h4" className="serif-title" sx={{ color: 'primary.main', mb: 0.5 }}>
          🛡️ Quản trị Tài khoản Hệ thống
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
