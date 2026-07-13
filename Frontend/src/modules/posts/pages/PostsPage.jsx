import React, { useEffect } from 'react';
import { Box } from '@mui/material';
import { usePostStore } from '@/modules/posts/store/usePostStore';
import PostToolbar from './PostToolbar';
import PostList from './PostList';
import PostForm from './PostForm';
import PostFilter from './PostFilter';
import CommonLoading from '@/common/components/display/CommonLoading';
import CommonConfirmDialog from '@/common/components/popup/CommonConfirmDialog';

import { Pagination, Stack } from '@mui/material';

const PostsPage = () => {
  const {
    dataList,
    loading,
    pagingPost,
    resetStore,
    openConfirmDeletePopup,
    openCreateEditPopup,
    handleClose,
    handleConfirmDelete,
    searchObject,
    setSearchObject,
    totalPages
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

      {totalPages > 1 && (
        <Stack direction="row" justifyContent="center" sx={{ mt: 4, mb: 2 }}>
          <Pagination
            count={totalPages}
            page={searchObject.pageIndex}
            onChange={(e, value) => {
              setSearchObject({ pageIndex: value });
              pagingPost();
            }}
            color="primary"
          />
        </Stack>
      )}

      {/* Add/Edit Form Dialog */}
      {openCreateEditPopup && <PostForm />}

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


 