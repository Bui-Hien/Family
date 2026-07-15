import React from 'react';
import {
  TextField,
  Grid
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useGalleryStore } from '@/modules/gallery/store/useGalleryStore';
import { Visibility } from '@/common/constants';
import CommonPopupForm from '@/common/components/popup/CommonPopupForm';
import CommonSelectInput from '@/common/components/form/CommonSelectInput';

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
    <CommonPopupForm
      open={openAlbumForm}
      handleClose={handleClose}
      title="Tạo Album ảnh mới"
      formik={formik}
      size="xs"
      textSubmit="Tạo Album"
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
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
        </Grid>
        <Grid item xs={12}>
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
        </Grid>
        <Grid item xs={12}>
          <CommonSelectInput
            name="visibility"
            label="Quyền riêng tư"
            required
            noNullOption
            options={[
              { value: 'PUBLIC', name: 'Công khai (Tất cả mọi người)' },
              { value: 'PROTECTED', name: 'Nội bộ dòng họ (Yêu cầu đăng nhập)' },
              { value: 'PRIVATE', name: 'Chỉ admin/Trưởng họ xem' }
            ]}
          />
        </Grid>
      </Grid>
    </CommonPopupForm>
  );
};

export default AlbumForm;
