import React, { useEffect } from 'react';
import { Box } from '@mui/material';
import { useEventStore } from '@/modules/events/store/useEventStore';
import EventToolbar from './EventToolbar';
import EventList from './EventList';
import EventForm from './EventForm';
import EventFilter from './EventFilter';
import CommonLoading from '@/common/components/display/CommonLoading';
import CommonConfirmDialog from '@/common/components/popup/CommonConfirmDialog';

const EventsPage = () => {
  const {
    dataList,
    loading,
    pagingEvent,
    resetStore,
    openConfirmDeletePopup,
    openCreateEditPopup,
    handleClose,
    handleConfirmDelete
  } = useEventStore();

  useEffect(() => {
    pagingEvent();
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
      <EventToolbar />
      <EventFilter />
      <EventList />

      {/* Add/Edit Form Dialog */}
      {openCreateEditPopup && <EventForm />}

      {/* Confirm Delete Dialog */}
      <CommonConfirmDialog
        open={openConfirmDeletePopup}
        onClose={handleClose}
        onConfirm={onDeleteConfirm}
        title="Xóa sự kiện"
        text="Bạn có chắc chắn muốn xóa sự kiện này khỏi danh sách? Hành động này không thể hoàn tác."
      />
    </Box>
  );
};

export default EventsPage;
