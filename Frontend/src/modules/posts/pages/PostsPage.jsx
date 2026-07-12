import React, { useEffect } from 'react';
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button
} from '@mui/material';
import { usePostStore } from '@/modules/posts/store/usePostStore';
import PostToolbar from './PostToolbar';
import PostList from './PostList';
import PostForm from './PostForm';
import PostFilter from './PostFilter';
import CommonLoading from '@/common/components/display/CommonLoading';
import CommonConfirmDialog from '@/common/components/popup/CommonConfirmDialog';
import { PostCategory } from '@/common/constants';

const PostsPage = () => {
  const {
    dataList,
    loading,
    pagingPost,
    resetStore,
    openConfirmDeletePopup,
    openCreateEditPopup,
    openViewPopup,
    selectedRow,
    handleClose,
    handleConfirmDelete
  } = usePostStore();

  useEffect(() => {
    pagingPost();
    return () => {
      resetStore();
    };
  }, []);

  const onDeleteConfirm = () => {
    handleConfirmDelete();
  };

  if (loading && dataList.length === 0) {
    return <CommonLoading loading={loading} type="skeleton" rows={5} />;
  }

  return (
    <Box>
      <PostToolbar />
      <PostFilter />
      <PostList />

      {/* Add/Edit Form Dialog */}
      {openCreateEditPopup && <PostForm />}

      {/* Viewing Post Detail Dialog */}
      <Dialog open={openViewPopup} onClose={handleClose} maxWidth="md" fullWidth>
        {selectedRow && (
          <>
            <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>
              {selectedRow.title}
            </DialogTitle>
            <DialogContent dividers>
              <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mb: 2 }}>
                Ngày đăng: {selectedRow.createdDate ? new Date(selectedRow.createdDate).toLocaleString('vi-VN') : ''} • Danh mục: {selectedRow.category === PostCategory.TIN_TUC ? 'Tin tức chung' : 'Hoạt động dòng họ'}
              </Typography>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'text.secondary', mb: 2, fontStyle: 'italic' }}>
                {selectedRow.summary}
              </Typography>
              <Typography variant="body1" sx={{ whiteSpace: 'pre-line', lineHeight: 1.6 }} dangerouslySetInnerHTML={{ __html: selectedRow.content }} />
            </DialogContent>
            <DialogActions sx={{ px: 3, py: 1.5 }}>
              <Button onClick={handleClose} color="primary" variant="contained">Đóng</Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Confirm Delete Dialog */}
      <CommonConfirmDialog
        open={openConfirmDeletePopup}
        onClose={handleClose}
        onConfirm={onDeleteConfirm}
        title="Xóa bài viết"
        text="Bạn có chắc chắn muốn xóa bài viết này? Hành động này không thể hoàn tác."
      />
    </Box>
  );
};

export default PostsPage;
