import React, { useEffect } from 'react';
import { Box } from '@mui/material';
import { useMemberStore } from '@/modules/members/store/useMemberStore';
import MemberToolbar from './MemberToolbar';
import MemberFilter from './MemberFilter';
import MemberList from './MemberList';
import MemberForm from './MemberForm';
import CommonConfirmDialog from '@/common/components/popup/CommonConfirmDialog';

const MembersPage = () => {
  const {
    fetchInitialData,
    resetStore,
    openCreateEditPopup,
    openConfirmDeletePopup,
    handleClose,
    handleConfirmDelete
  } = useMemberStore();

  useEffect(() => {
    fetchInitialData();
    return () => {
      resetStore();
    };
  }, []);

  return (
    <Box>
      <MemberToolbar />
      <MemberFilter />
      <MemberList />

      {/* Forms */}
      {openCreateEditPopup && <MemberForm />}

      {/* Confirm Delete Dialog */}
      <CommonConfirmDialog
        open={openConfirmDeletePopup}
        onClose={handleClose}
        onConfirm={handleConfirmDelete}
        title="Xóa thành viên"
        text="Bạn có chắc chắn muốn xóa thành viên này ra khỏi danh sách dòng họ? Thao tác này không thể hoàn tác."
      />
    </Box>
  );
};

export default MembersPage;
