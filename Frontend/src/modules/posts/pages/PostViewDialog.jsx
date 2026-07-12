import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Box,
  Chip,
  Stack,
  Divider,
  IconButton
} from '@mui/material';
import {
  Close as CloseIcon,
  CalendarMonth as CalendarIcon,
  Category as CategoryIcon,
  Star as StarIcon,
  Visibility as PublishedIcon,
  EditNote as DraftIcon
} from '@mui/icons-material';
import { usePostStore } from '@/modules/posts/store/usePostStore';
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

const PostViewDialog = () => {
  const { openViewPopup, selectedRow, handleClose } = usePostStore();

  if (!selectedRow) return null;

  const statusConfig = getStatusConfig(selectedRow.status);

  return (
    <Dialog
      open={openViewPopup}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          maxHeight: '90vh',
        }
      }}
    >
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
            sx={{
              fontWeight: 700,
              lineHeight: 1.3,
              color: 'text.primary',
              mb: 1.5,
            }}
          >
            {selectedRow.title}
          </Typography>

          {/* Metadata chips */}
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ gap: 1 }}>
            <Chip
              icon={<CategoryIcon sx={{ fontSize: 16 }} />}
              label={getCategoryLabel(selectedRow.category)}
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
            {selectedRow.featured && (
              <Chip
                icon={<StarIcon sx={{ fontSize: 16 }} />}
                label="Tin nổi bật"
                size="small"
                color="secondary"
                sx={{ borderRadius: 2, fontWeight: 500 }}
              />
            )}
            {selectedRow.createdDate && (
              <Chip
                icon={<CalendarIcon sx={{ fontSize: 16 }} />}
                label={new Date(selectedRow.createdDate).toLocaleDateString('vi-VN', {
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
          onClick={handleClose}
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
        {/* Summary section */}
        {selectedRow.summary && (
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
              sx={{
                fontWeight: 600,
                color: 'text.secondary',
                fontStyle: 'italic',
                lineHeight: 1.6,
              }}
            >
              {selectedRow.summary}
            </Typography>
          </Box>
        )}

        {/* Main content (HTML) */}
        <Box
          sx={{
            '& p': {
              margin: 0,
              paddingBottom: '8px',
              lineHeight: 1.75,
              color: 'text.primary',
            },
            '& img': {
              maxWidth: '100%',
              height: 'auto',
              borderRadius: 2,
              display: 'block',
              margin: '16px 0',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            },
            '& h1, & h2, & h3, & h4, & h5, & h6': {
              marginTop: '16px',
              marginBottom: '8px',
              fontWeight: 600,
              color: 'text.primary',
            },
            '& ul, & ol': {
              paddingLeft: '24px',
              marginBottom: '12px',
            },
            '& li': {
              marginBottom: '4px',
              lineHeight: 1.6,
            },
            '& blockquote': {
              borderLeft: '3px solid',
              borderLeftColor: 'primary.light',
              margin: '12px 0',
              padding: '8px 16px',
              bgcolor: 'action.hover',
              borderRadius: '0 8px 8px 0',
              fontStyle: 'italic',
              color: 'text.secondary',
            },
            '& a': {
              color: 'primary.main',
              textDecoration: 'underline',
            },
            '& pre': {
              bgcolor: 'grey.100',
              borderRadius: 1,
              p: 2,
              overflowX: 'auto',
            },
            '& code': {
              bgcolor: 'grey.100',
              borderRadius: 0.5,
              px: 0.5,
              fontSize: '0.875em',
            },
          }}
          dangerouslySetInnerHTML={{ __html: selectedRow.content }}
        />

        {/* Empty content fallback */}
        {!selectedRow.content && (
          <Typography variant="body1" color="text.secondary" sx={{ fontStyle: 'italic', textAlign: 'center', py: 4 }}>
            Bài viết chưa có nội dung chi tiết.
          </Typography>
        )}
      </DialogContent>

      <Divider />

      {/* Footer */}
      <DialogActions sx={{ px: 3, py: 1.5 }}>
        {selectedRow.modifiedDate && (
          <Typography variant="caption" color="text.secondary" sx={{ mr: 'auto' }}>
            Cập nhật lần cuối: {new Date(selectedRow.modifiedDate).toLocaleString('vi-VN')}
          </Typography>
        )}
        <Button
          onClick={handleClose}
          variant="contained"
          color="primary"
          sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600, px: 3 }}
        >
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PostViewDialog;
