import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Divider,
  Button,
  Stack,
  Tooltip,
  IconButton
} from '@mui/material';
import {
  Article as ArticleIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { usePostStore } from '@/modules/posts/store/usePostStore';
import { UserRole, PostCategory } from '@/common/constants';
import HasPermission from '@/common/components/auth/HasPermission';

const PostList = () => {
  const { dataList, handleOpenCreateEdit, handleDelete } = usePostStore();
  const navigate = useNavigate();

  if (dataList.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 8, color: 'text.secondary' }}>
        <Box sx={{ fontSize: 64, mb: 2, opacity: 0.4 }}>📰</Box>
        <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
          Chưa có bài viết nào
        </Typography>
        <Typography variant="body2">
          Hiện tại chưa có bài viết hay hoạt động nào được đăng tải trong hệ thống.
        </Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={3}>
      {dataList.map((post) => (
        <Grid item xs={12} md={6} key={post.id}>
          <Card 
            className="hover-lift" 
            sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
          >
            <CardContent sx={{ display: 'flex', gap: 2 }}>
              <Avatar sx={{ bgcolor: 'rgba(197, 160, 89, 0.08)', color: 'secondary.main', p: 1 }}>
                <ArticleIcon />
              </Avatar>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {post.title}
                </Typography>
                <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mb: 1 }}>
                  Danh mục: {post.category === PostCategory.TIN_TUC ? 'Tin tức chung' : 'Hoạt động dòng họ'} • Ngày đăng:{' '}
                  {post.createdDate ? new Date(post.createdDate).toLocaleDateString('vi-VN') : ''}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {post.summary || 'Không có tóm tắt nội dung.'}
                </Typography>
              </Box>
            </CardContent>
            <Divider />
            <Box sx={{ p: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Button
                size="small"
                startIcon={<ViewIcon />}
                onClick={() => navigate(`/posts/${post.id}`)}
              >
                Xem chi tiết
              </Button>
              <HasPermission roles={[UserRole.SYSTEM_ADMIN, UserRole.FAMILY_LEADER, UserRole.FAMILY_ADMIN]}>
                <Stack direction="row" spacing={1}>
                  <Tooltip title="Chỉnh sửa bài viết">
                    <IconButton size="small" onClick={() => handleOpenCreateEdit(post)} color="primary">
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Xóa bài viết">
                    <IconButton size="small" onClick={() => handleDelete(post)} color="error">
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </HasPermission>
            </Box>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default PostList;
