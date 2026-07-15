import React from 'react';
import {
  TextField,
  Grid,
  FormControlLabel,
  Checkbox
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useEventStore } from '@/modules/events/store/useEventStore';
import CommonDateTimePicker from '@/common/components/form/CommonDateTimePicker';
import CommonSelectInput from '@/common/components/form/CommonSelectInput';
import CommonPopupForm from '@/common/components/popup/CommonPopupForm';
import { EventStatus } from '@/common/constants';

const validationSchema = Yup.object({
  title: Yup.string().required('Tên sự kiện không được để trống'),
  description: Yup.string().nullable(),
  eventDate: Yup.string().required('Thời gian bắt đầu không được để trống'),
  location: Yup.string().required('Địa điểm không được để trống'),
  status: Yup.string().required('Trạng thái không được để trống'),
});

const EventForm = () => {
  const { openCreateEditPopup, selectedRow, handleClose, saveEvent } = useEventStore();

  const formik = useFormik({
    initialValues: {
      title: selectedRow?.title || '',
      description: selectedRow?.description || '',
      eventDate: selectedRow?.eventDate || new Date(),
      location: selectedRow?.location || '',
      annual: selectedRow?.annual || false,
      status: selectedRow?.status || EventStatus.ACTIVE,
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        await saveEvent(values);
      } catch (error) {
        console.error(error);
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <CommonPopupForm
      open={openCreateEditPopup}
      handleClose={handleClose}
      title={selectedRow?.id ? 'Sửa thông tin sự kiện' : 'Thêm sự kiện mới'}
      formik={formik}
      size="sm"
      textSubmit="Lưu sự kiện"
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            size="small"
            name="title"
            label="Tên sự kiện"
            value={formik.values.title}
            onChange={formik.handleChange}
            error={formik.touched.title && Boolean(formik.errors.title)}
            helperText={formik.touched.title && formik.errors.title}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <CommonDateTimePicker
            name="eventDate"
            label="Thời gian diễn ra"
            isDateTimePicker
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <CommonSelectInput
            name="status"
            label="Trạng thái sự kiện"
            required
            noNullOption
            options={[
              { value: 'ACTIVE', name: 'Hoạt động (Sắp diễn ra)' },
              { value: 'INACTIVE', name: 'Hủy bỏ / Tạm hoãn' }
            ]}
          />
        </Grid>

        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Checkbox
                name="annual"
                checked={formik.values.annual}
                onChange={formik.handleChange}
              />
            }
            label="Sự kiện thường niên (lặp lại hàng năm)"
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            size="small"
            name="location"
            label="Địa điểm diễn ra"
            value={formik.values.location}
            onChange={formik.handleChange}
            error={formik.touched.location && Boolean(formik.errors.location)}
            helperText={formik.touched.location && formik.errors.location}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            size="small"
            name="description"
            label="Mô tả chi tiết nội dung sự kiện"
            multiline
            rows={4}
            value={formik.values.description}
            onChange={formik.handleChange}
            error={formik.touched.description && Boolean(formik.errors.description)}
            helperText={formik.touched.description && formik.errors.description}
          />
        </Grid>
      </Grid>
    </CommonPopupForm>
  );
};

export default EventForm;
