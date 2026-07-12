import { Box, Typography, Button } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { usePostStore } from '@/modules/posts/store/usePostStore';
import { UserRole } from '@/common/constants';
import HasPermission from '@/common/components/auth/HasPermission';

const PostToolbar = () => {
  const { handleOpenCreateEdit } = usePostStore();

  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
      <Typography variant="h5" className="serif-title" sx={{ fontWeight: 700, color: 'primary.main' }}>
        📰 Tin tức & Hoạt động dòng họ
      </Typography>
      <HasPermission roles={[UserRole.SYSTEM_ADMIN, UserRole.FAMILY_LEADER, UserRole.FAMILY_ADMIN]}>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenCreateEdit(null)} size="small">
          Đăng bài viết
        </Button>
      </HasPermission>
    </Box>
  );
};

export default PostToolbar;
