import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Button,
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useGalleryStore } from '@/modules/gallery/store/useGalleryStore';
import { Visibility } from '@/common/constants';

const validationSchema = Yup.object({
  name: Yup.string().required('Tên album không được để trống'),
  description: Yup.string().nullable(),
  visibility: Yup.string().required('Quyền riêng tư không được để trống'),
});

const AlbumForm = () => {
  const { openAlbumForm, setOpenAlbumForm, createAlbum } = useGalleryStore();

  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
      visibility: Visibility.PUBLIC,
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      const result = await createAlbum(values);
      if (result?.success) {
        resetForm();
      }
    },
  });

  const handleClose = () => {
    setOpenAlbumForm(false);
    formik.resetForm();
  };

  return (
    <Dialog open={openAlbumForm} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontWeight: 700 }}>Tạo Album ảnh mới</DialogTitle>
      <form onSubmit={formik.handleSubmit}>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField
              fullWidth
              size="small"
              name="name"
              label="Tên album ảnh"
              value={formik.values.name}
              onChange={formik.handleChange}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
            />
            <TextField
              fullWidth
              size="small"
              name="description"
              label="Mô tả về album"
              multiline
              rows={2}
              value={formik.values.description}
              onChange={formik.handleChange}
              error={formik.touched.description && Boolean(formik.errors.description)}
              helperText={formik.touched.description && formik.errors.description}
            />
            <FormControl fullWidth size="small">
              <InputLabel id="visibility-select-label">Quyền riêng tư</InputLabel>
              <Select
                labelId="visibility-select-label"
                name="visibility"
                label="Quyền riêng tư"
                value={formik.values.visibility}
                onChange={formik.handleChange}
              >
                <MenuItem value="PUBLIC">Công khai (Tất cả mọi người)</MenuItem>
                <MenuItem value="PROTECTED">Nội bộ dòng họ (Yêu cầu đăng nhập)</MenuItem>
                <MenuItem value="PRIVATE">Chỉ admin/Trưởng họ xem</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleClose} color="inherit">Hủy</Button>
          <Button type="submit" variant="contained" color="primary">Tạo Album</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AlbumForm;
