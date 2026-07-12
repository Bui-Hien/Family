import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Button
} from '@mui/material';
import { useFormik, FormikProvider } from 'formik';
import * as Yup from 'yup';
import { useEventStore } from '@/modules/events/store/useEventStore';
import CommonDateTimePicker from '@/common/components/form/CommonDateTimePicker';
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
    <Dialog open={openCreateEditPopup} onClose={handleClose} maxWidth="sm" fullWidth>
      <FormikProvider value={formik}>
        <DialogTitle sx={{ fontWeight: 700 }}>
          {selectedRow?.id ? 'Sửa thông tin sự kiện' : 'Thêm sự kiện mới'}
        </DialogTitle>
        <form onSubmit={formik.handleSubmit}>
          <DialogContent>
            <Stack spacing={3} sx={{ mt: 1 }}>
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

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <CommonDateTimePicker
                    name="eventDate"
                    label="Thời gian diễn ra"
                    isDateTimePicker
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth size="small" sx={{ mt: 0.5 }}>
                    <InputLabel id="status-select-label">Trạng thái sự kiện</InputLabel>
                    <Select
                      labelId="status-select-label"
                      name="status"
                      label="Trạng thái sự kiện"
                      value={formik.values.status}
                      onChange={formik.handleChange}
                    >
                      <MenuItem value="ACTIVE">Hoạt động (Sắp diễn ra)</MenuItem>
                      <MenuItem value="INACTIVE">Hủy bỏ / Tạm hoãn</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>

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
            </Stack>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={handleClose} color="inherit">Hủy</Button>
            <Button type="submit" variant="contained" color="primary">Lưu sự kiện</Button>
          </DialogActions>
        </form>
      </FormikProvider>
    </Dialog>
  );
};

export default EventForm;
