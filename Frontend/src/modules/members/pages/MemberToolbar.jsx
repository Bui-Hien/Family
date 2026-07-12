import { Box, Typography, Button } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useMemberStore } from '@/modules/members/store/useMemberStore';

const MemberToolbar = () => {
  const { handleOpenCreateEdit } = useMemberStore();

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" className="serif-title" sx={{ fontWeight: 700, color: 'primary.main' }}>
          👥 Danh sách Thành viên Dòng họ
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenCreateEdit(null)} size="small">
          Thêm thành viên
        </Button>
      </Box>
    </Box>
  );
};

export default MemberToolbar;
