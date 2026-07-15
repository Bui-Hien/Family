import { Box, Typography, Button } from '@mui/material';
import { Add as AddIcon, People as PeopleIcon } from '@mui/icons-material';
import { useMemberStore } from '@/modules/members/store/useMemberStore';

const MemberToolbar = () => {
  const { handleOpenCreateEdit } = useMemberStore();

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography variant="h4" className="serif-title" sx={{ color: 'primary.main', mb: 0.5, fontSize: { xs: '1.5rem', md: '2.125rem' }, display: 'flex', alignItems: 'center', gap: 1 }}>
            <PeopleIcon sx={{ fontSize: { xs: '1.75rem', md: '2.25rem' } }} /> Danh sách Thành viên
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
