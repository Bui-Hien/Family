import { useEffect } from 'react';
import { Box } from '@mui/material';
import { useAdminStore } from '@/modules/admin/store/useAdminStore';
import AdminToolbar from './AdminToolbar';
import AdminFilter from './AdminFilter';
import AdminList from './AdminList';
import AdminForm from './AdminForm';
import CommonLoading from '@/common/components/display/CommonLoading';
import CommonConfirmDialog from '@/common/components/popup/CommonConfirmDialog';

const AdminPage = () => {
  const {
    dataList,
    loading,
    searchObject,
    openCreateEditPopup,
    openConfirmDeletePopup,
    handleClose,
    handleConfirmDelete,
    fetchInitialData,
    pagingUser,
    resetStore,
  } = useAdminStore();

  useEffect(() => {
    fetchInitialData();
    return () => {
      resetStore();
    };
  }, []);

  useEffect(() => {
    pagingUser();
  }, [searchObject.pageIndex, searchObject.pageSize, searchObject.keyword, searchObject.role]);

  if (loading && dataList.length === 0) {
    return <CommonLoading loading={loading} type="skeleton" rows={5} />;
  }

  return (
    <Box>
      <AdminToolbar />
      <AdminFilter />
      <AdminList />

      {/* Add/Edit Form Dialog */}
      {openCreateEditPopup && <AdminForm />}

      {/* Confirm Delete Dialog */}
      <CommonConfirmDialog
        open={openConfirmDeletePopup}
        onClose={handleClose}
        onConfirm={handleConfirmDelete}
        title="Xóa tài khoản"
        text="Bạn có chắc muốn xóa tài khoản người dùng này ra khỏi hệ thống?"
      />
    </Box>
  );
};

export default AdminPage;
