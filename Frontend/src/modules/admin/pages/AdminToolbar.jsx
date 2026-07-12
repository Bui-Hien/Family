import { Box, Typography, Button } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useAdminStore } from '@/modules/admin/store/useAdminStore';

const AdminToolbar = () => {
  const { handleOpenCreateEdit } = useAdminStore();

  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
      <Typography variant="h5" className="serif-title" sx={{ fontWeight: 700, color: 'primary.main' }}>
        🛡️ Quản trị Tài khoản Hệ thống
      </Typography>
      <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenCreateEdit(null)} size="small">
        Thêm tài khoản
      </Button>
    </Box>
  );
};

export default AdminToolbar;
