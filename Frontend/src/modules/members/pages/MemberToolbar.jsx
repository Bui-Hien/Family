import { Box, Typography, Button } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useMemberStore } from '@/modules/members/store/useMemberStore';

const MemberToolbar = () => {
  const { handleOpenCreateEdit } = useMemberStore();

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
        <Box>
          <Typography variant="h4" className="serif-title" sx={{ color: 'primary.main', mb: 0.5 }}>
            👥 Danh sách Thành viên
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Quản lý và tra cứu thông tin chi tiết các thành viên trong dòng họ
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenCreateEdit(null)} size="medium">
          Thêm thành viên
        </Button>
      </Box>
    </Box>
  );
};

export default MemberToolbar;
