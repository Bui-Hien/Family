import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  List,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Chip,
  Stack,
  IconButton
} from '@mui/material';
import {
  Article as ArticleIcon,
  Close as CloseIcon,
  CalendarMonth as CalendarIcon,
  Category as CategoryIcon,
  Star as StarIcon
} from '@mui/icons-material';
import { useDashboardStore } from '@/modules/dashboard/store/useDashboardStore';
import { PostCategory } from '@/common/constants';

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

const FeaturedPosts = () => {
  const { featuredPosts } = useDashboardStore();
  const [selectedPost, setSelectedPost] = useState(null);

  const handleOpenDetail = (post) => {
    setSelectedPost(post);
  };

  const handleCloseDetail = () => {
    setSelectedPost(null);
  };

  return (
    <>
      <Card sx={{ height: '100%' }}>
        <CardContent>
          <Typography variant="h6" className="serif-title" sx={{ mb: 2, color: 'primary.main' }}>
            📰 Tin tức & Hoạt động nổi bật
          </Typography>
          {featuredPosts.length === 0 ? (
            <Typography variant="body2" color="textSecondary" sx={{ py: 2 }}>
              Không có tin nổi bật nào mới đăng.
            </Typography>
          ) : (
            <List disablePadding>
              {featuredPosts.map((post, idx) => (
                <React.Fragment key={post.id || idx}>
                  <ListItemButton
                    alignItems="flex-start"
                    sx={{
                      px: 1,
                      py: 1.5,
                      borderRadius: 2,
                      '&:hover': {
                        bgcolor: 'action.hover',
                      },
                    }}
                    onClick={() => handleOpenDetail(post)}
                  >
                    <ListItemIcon sx={{ minWidth: 36, mt: 0.5 }}>
                      <ArticleIcon fontSize="small" color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, lineHeight: 1.4 }}>
                          {post.title}
                        </Typography>
                      }
                      secondary={
                        <Typography component="span" variant="body2" color="textSecondary" sx={{ display: 'block', mt: 0.5 }}>
                          {post.summary || 'Không có tóm tắt...'}
                        </Typography>
                      }
                    />
                  </ListItemButton>
                  {idx < featuredPosts.length - 1 && <Divider component="li" />}
                </React.Fragment>
              ))}
            </List>
          )}
        </CardContent>
      </Card>

      {/* Post Detail Dialog */}
      <Dialog
        open={Boolean(selectedPost)}
        onClose={handleCloseDetail}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            maxHeight: '90vh',
          }
        }}
      >
        {selectedPost && (
          <>
            {/* Header */}
            <DialogTitle
              sx={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                gap: 2,
                pb: 1,
              }}
            >
              <Box sx={{ flex: 1 }}>
                <Typography
                  variant="h5"
                  component="h2"
                  sx={{ fontWeight: 700, lineHeight: 1.3, color: 'text.primary', mb: 1.5 }}
                >
                  {selectedPost.title}
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ gap: 1 }}>
                  <Chip
                    icon={<CategoryIcon sx={{ fontSize: 16 }} />}
                    label={getCategoryLabel(selectedPost.category)}
                    size="small"
                    variant="outlined"
                    color="primary"
                    sx={{ borderRadius: 2, fontWeight: 500 }}
                  />
                  {selectedPost.featured && (
                    <Chip
                      icon={<StarIcon sx={{ fontSize: 16 }} />}
                      label="Tin nổi bật"
                      size="small"
                      color="secondary"
                      sx={{ borderRadius: 2, fontWeight: 500 }}
                    />
                  )}
                  {selectedPost.createdDate && (
                    <Chip
                      icon={<CalendarIcon sx={{ fontSize: 16 }} />}
                      label={new Date(selectedPost.createdDate).toLocaleDateString('vi-VN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                      size="small"
                      variant="outlined"
                      sx={{ borderRadius: 2, fontWeight: 500 }}
                    />
                  )}
                </Stack>
              </Box>
              <IconButton
                onClick={handleCloseDetail}
                size="small"
                sx={{
                  mt: 0.5,
                  color: 'text.secondary',
                  '&:hover': { color: 'error.main', bgcolor: 'error.lighter' },
                }}
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>

            <Divider />

            {/* Content */}
            <DialogContent sx={{ py: 3 }}>
              {selectedPost.summary && (
                <Box
                  sx={{
                    mb: 3,
                    p: 2,
                    borderRadius: 2,
                    bgcolor: 'action.hover',
                    borderLeft: '4px solid',
                    borderLeftColor: 'primary.main',
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: 600, color: 'text.secondary', fontStyle: 'italic', lineHeight: 1.6 }}
                  >
                    {selectedPost.summary}
                  </Typography>
                </Box>
              )}

              <Box
                sx={{
                  '& p': { margin: 0, paddingBottom: '8px', lineHeight: 1.75, color: 'text.primary' },
                  '& img': {
                    maxWidth: '100%', height: 'auto', borderRadius: 2,
                    display: 'block', margin: '16px 0', boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  },
                  '& h1, & h2, & h3, & h4, & h5, & h6': {
                    marginTop: '16px', marginBottom: '8px', fontWeight: 600, color: 'text.primary',
                  },
                  '& ul, & ol': { paddingLeft: '24px', marginBottom: '12px' },
                  '& li': { marginBottom: '4px', lineHeight: 1.6 },
                  '& blockquote': {
                    borderLeft: '3px solid', borderLeftColor: 'primary.light',
                    margin: '12px 0', padding: '8px 16px', bgcolor: 'action.hover',
                    borderRadius: '0 8px 8px 0', fontStyle: 'italic', color: 'text.secondary',
                  },
                  '& a': { color: 'primary.main', textDecoration: 'underline' },
                }}
                dangerouslySetInnerHTML={{ __html: selectedPost.content }}
              />

              {!selectedPost.content && (
                <Typography variant="body1" color="text.secondary" sx={{ fontStyle: 'italic', textAlign: 'center', py: 4 }}>
                  Bài viết chưa có nội dung chi tiết.
                </Typography>
              )}
            </DialogContent>

            <Divider />

            <DialogActions sx={{ px: 3, py: 1.5 }}>
              {selectedPost.modifiedDate && (
                <Typography variant="caption" color="text.secondary" sx={{ mr: 'auto' }}>
                  Cập nhật lần cuối: {new Date(selectedPost.modifiedDate).toLocaleString('vi-VN')}
                </Typography>
              )}
              <Button
                onClick={handleCloseDetail}
                variant="contained"
                color="primary"
                sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600, px: 3 }}
              >
                Đóng
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </>
  );
};

export default FeaturedPosts;
