import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Chip,
  Stack,
  Divider,
  Button,
  Paper,
  Avatar
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  CalendarMonth as CalendarIcon,
  Category as CategoryIcon,
  Star as StarIcon,
  Visibility as PublishedIcon,
  EditNote as DraftIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import postService from '@/modules/posts/services/postService';
import useUiStore from '@/stores/uiStore';
import CommonLoading from '@/common/components/display/CommonLoading';
import CommonBreadcrumb from '@/common/components/layout/CommonBreadcrumb';
import { PostCategory, PostStatus } from '@/common/constants';

const getCategoryLabel = (category) => {
  switch (category) {
    case PostCategory.TIN_TUC:
      return 'Tin tức chung';
    case PostCategory.HOAT_DONG:
      return 'Hoạt động dòng họ';
    default:
      return category || 'Chưa phân loại';
  }
};

const getStatusConfig = (status) => {
  switch (status) {
    case PostStatus.PUBLISHED:
      return { label: 'Đã xuất bản', color: 'success', icon: <PublishedIcon sx={{ fontSize: 16 }} /> };
    case PostStatus.DRAFT:
      return { label: 'Bản nháp', color: 'warning', icon: <DraftIcon sx={{ fontSize: 16 }} /> };
    default:
      return { label: status || 'Không rõ', color: 'default', icon: null };
  }
};

const PostDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPost = async () => {
      setLoading(true);
      try {
        const res = await postService.getById(id);
        if (res.success && res.data) {
          setPost(res.data);
        } else {
          useUiStore.getState().showNotification('Không tìm thấy bài viết', 'error');
          navigate('/posts', { replace: true });
        }
      } catch (error) {
        console.error('Error loading post detail:', error);
        useUiStore.getState().showNotification('Lỗi khi tải bài viết', 'error');
        navigate('/posts', { replace: true });
      } finally {
        setLoading(false);
      }
    };
    loadPost();
  }, [id, navigate]);

  if (loading) {
    return <CommonLoading loading={loading} type="skeleton" rows={8} />;
  }

  if (!post) return null;

  const statusConfig = getStatusConfig(post.status);

  return (
    <Box>
      {/* Breadcrumb */}
      <CommonBreadcrumb
        routeSegments={[
          { name: 'Tin tức & Hoạt động', path: '/posts' },
          { name: post.title },
        ]}
      />

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mt: 1.5, mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography variant="h4" className="serif-title" sx={{ color: 'primary.main', mb: 0.5, fontSize: { xs: '1.5rem', md: '2.125rem' } }}>
            📰 Chi tiết Bài viết
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Đọc tin tức, sự kiện và các thông báo hoạt động của dòng tộc
          </Typography>
        </Box>
        <Button variant="outlined" startIcon={<BackIcon />} onClick={() => navigate('/posts')}>
          Quay lại
        </Button>
      </Box>

      {/* Article Container */}
      <Paper
        elevation={0}
        sx={{
          maxWidth: 860,
          mx: 'auto',
          borderRadius: 3,
          border: '1px solid',
          borderColor: 'divider',
          overflow: 'hidden',
        }}
      >
        {/* Article Header */}
        <Box
          sx={{
            px: { xs: 3, md: 5 },
            pt: { xs: 3, md: 4 },
            pb: 3,
          }}
        >
          {/* Category & Status chips */}
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 2, gap: 1 }}>
            <Chip
              icon={<CategoryIcon sx={{ fontSize: 16 }} />}
              label={getCategoryLabel(post.category)}
              size="small"
              variant="outlined"
              color="primary"
              sx={{ borderRadius: 2, fontWeight: 500 }}
            />
            <Chip
              icon={statusConfig.icon}
              label={statusConfig.label}
              size="small"
              color={statusConfig.color}
              sx={{ borderRadius: 2, fontWeight: 500 }}
            />
            {post.featured && (
              <Chip
                icon={<StarIcon sx={{ fontSize: 16 }} />}
                label="Tin nổi bật"
                size="small"
                color="secondary"
                sx={{ borderRadius: 2, fontWeight: 500 }}
              />
            )}
          </Stack>

          {/* Title */}
          <Typography
            variant="h4"
            component="h1"
            className="serif-title"
            sx={{
              fontWeight: 800,
              lineHeight: 1.3,
              color: 'text.primary',
              mb: 2.5,
              letterSpacing: '-0.02em',
            }}
          >
            {post.title}
          </Typography>

          {/* Author & Date info */}
          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            sx={{ color: 'text.secondary' }}
          >
            <Avatar
              sx={{
                width: 40,
                height: 40,
                bgcolor: 'primary.main',
                fontSize: '0.875rem',
              }}
            >
              <PersonIcon fontSize="small" />
            </Avatar>
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.primary', lineHeight: 1.3 }}>
                {post.createdBy || 'Ban quản trị'}
              </Typography>
              <Stack direction="row" spacing={1} alignItems="center">
                <CalendarIcon sx={{ fontSize: 14 }} />
                <Typography variant="caption">
                  {post.createdDate
                    ? new Date(post.createdDate).toLocaleDateString('vi-VN', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })
                    : 'Không rõ ngày đăng'}
                </Typography>
                {post.modifiedDate && post.modifiedDate !== post.createdDate && (
                  <Typography variant="caption" sx={{ fontStyle: 'italic' }}>
                    • Cập nhật: {new Date(post.modifiedDate).toLocaleDateString('vi-VN')}
                  </Typography>
                )}
              </Stack>
            </Box>
          </Stack>
        </Box>

        <Divider />

        {/* Article Body */}
        <Box
          sx={{
            px: { xs: 3, md: 5 },
            py: { xs: 3, md: 4 },
          }}
        >
          {/* Summary / Lead paragraph */}
          {post.summary && (
            <Typography
              variant="h6"
              component="p"
              sx={{
                fontWeight: 600,
                color: 'text.secondary',
                lineHeight: 1.7,
                mb: 3,
                fontSize: '1.1rem',
                borderLeft: '4px solid',
                borderLeftColor: 'primary.main',
                pl: 2.5,
                py: 0.5,
              }}
            >
              {post.summary}
            </Typography>
          )}

          {/* Main HTML content */}
          <Box
            sx={{
              // Typography styles cho nội dung HTML từ TipTap editor
              fontSize: '1.05rem',
              lineHeight: 1.8,
              color: 'text.primary',

              '& p': {
                margin: 0,
                paddingBottom: '12px',
              },
              '& h1': { fontSize: '1.75rem', fontWeight: 700, mt: 4, mb: 2 },
              '& h2': { fontSize: '1.5rem', fontWeight: 700, mt: 3.5, mb: 1.5 },
              '& h3': { fontSize: '1.25rem', fontWeight: 600, mt: 3, mb: 1 },
              '& h4, & h5, & h6': { fontWeight: 600, mt: 2.5, mb: 1 },
              '& img': {
                maxWidth: '100%',
                height: 'auto',
                borderRadius: 2,
                display: 'block',
                margin: '24px auto',
                boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
              },
              '& ul, & ol': {
                paddingLeft: '28px',
                marginBottom: '16px',
              },
              '& li': {
                marginBottom: '6px',
              },
              '& blockquote': {
                borderLeft: '4px solid',
                borderLeftColor: 'primary.light',
                margin: '20px 0',
                padding: '12px 20px',
                bgcolor: 'action.hover',
                borderRadius: '0 8px 8px 0',
                fontStyle: 'italic',
                color: 'text.secondary',
                fontSize: '1rem',
              },
              '& a': {
                color: 'primary.main',
                textDecoration: 'underline',
                '&:hover': { color: 'primary.dark' },
              },
              '& pre': {
                bgcolor: 'grey.100',
                borderRadius: 2,
                p: 2.5,
                overflowX: 'auto',
                fontSize: '0.875rem',
                lineHeight: 1.6,
              },
              '& code': {
                bgcolor: 'grey.100',
                borderRadius: 0.5,
                px: 0.75,
                py: 0.25,
                fontSize: '0.875em',
                fontFamily: 'monospace',
              },
              '& hr': {
                border: 'none',
                borderTop: '1px solid',
                borderColor: 'divider',
                my: 3,
              },
              '& table': {
                width: '100%',
                borderCollapse: 'collapse',
                mb: 2,
                '& th, & td': {
                  border: '1px solid',
                  borderColor: 'divider',
                  p: 1.5,
                  textAlign: 'left',
                },
                '& th': {
                  bgcolor: 'action.hover',
                  fontWeight: 600,
                },
              },
            }}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Empty content fallback */}
          {!post.content && (
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ fontStyle: 'italic', textAlign: 'center', py: 6 }}
            >
              Bài viết chưa có nội dung chi tiết.
            </Typography>
          )}
        </Box>

        <Divider />

        {/* Footer */}
        <Box
          sx={{
            px: { xs: 3, md: 5 },
            py: 2.5,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            bgcolor: 'action.hover',
          }}
        >
          <Button
            startIcon={<BackIcon />}
            onClick={() => navigate('/posts')}
            sx={{ textTransform: 'none', fontWeight: 600 }}
          >
            Quay lại danh sách
          </Button>
          {post.modifiedDate && (
            <Typography variant="caption" color="text.secondary">
              Cập nhật lần cuối: {new Date(post.modifiedDate).toLocaleString('vi-VN')}
            </Typography>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default PostDetailPage;
