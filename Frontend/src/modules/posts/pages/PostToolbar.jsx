import { Box, Typography, Button } from '@mui/material';
import { Add as AddIcon, Article as ArticleIcon } from '@mui/icons-material';
import { usePostStore } from '@/modules/posts/store/usePostStore';
import { UserRole } from '@/common/constants';
import HasPermission from '@/common/components/auth/HasPermission';

const PostToolbar = () => {
  const { handleOpenCreateEdit } = usePostStore();

  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3, flexWrap: 'wrap', gap: 2 }}>
      <Box sx={{ minWidth: 0, flex: 1 }}>
        <Typography variant="h4" className="serif-title" sx={{ color: 'primary.main', mb: 0.5, fontSize: { xs: '1.5rem', md: '2.125rem' }, display: 'flex', alignItems: 'center', gap: 1 }}>
          <ArticleIcon sx={{ fontSize: { xs: '1.75rem', md: '2.25rem' } }} /> Tin tức &amp; Hoạt động
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Đăng tải, chia sẻ các tin tức, hoạt động và thông báo của dòng tộc
        </Typography>
      </Box>
      <HasPermission roles={[UserRole.SYSTEM_ADMIN, UserRole.FAMILY_LEADER, UserRole.FAMILY_ADMIN]}>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenCreateEdit(null)} size="medium">
          Đăng bài viết
        </Button>
      </HasPermission>
    </Box>
  );
};

export default PostToolbar;
