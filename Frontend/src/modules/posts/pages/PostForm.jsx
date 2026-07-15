import React from 'react';
import {
  TextField,
  Grid,
  FormControlLabel,
  Checkbox
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { usePostStore } from '@/modules/posts/store/usePostStore';
import CommonEditor from '@/common/components/form/CommonEditor.jsx';
import CommonSelectInput from '@/common/components/form/CommonSelectInput';
import CommonPopupForm from '@/common/components/popup/CommonPopupForm';
import { PostCategory, PostStatus } from '@/common/constants';

const validationSchema = Yup.object({
  title: Yup.string().required('Tiêu đề bài viết không được để trống'),
  summary: Yup.string().required('Tóm tắt nội dung không được để trống'),
  content: Yup.string().required('Nội dung chi tiết không được để trống'),
  category: Yup.string().required('Danh mục không được để trống'),
  status: Yup.string().required('Trạng thái không được để trống'),
});

const PostForm = () => {
  const { openCreateEditPopup, selectedRow, handleClose, savePost } = usePostStore();

  const formik = useFormik({
    initialValues: {
      title: selectedRow?.title || '',
      summary: selectedRow?.summary || '',
      content: selectedRow?.content || '',
      category: selectedRow?.category || PostCategory.TIN_TUC,
      status: selectedRow?.status || PostStatus.PUBLISHED,
      featured: selectedRow?.featured || false,
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        await savePost(values);
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
      title={selectedRow?.id ? 'Chỉnh sửa bài viết' : 'Đăng bài viết mới'}
      formik={formik}
      size="md"
      textSubmit="Lưu bài viết"
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            size="small"
            name="title"
            label="Tiêu đề bài viết"
            value={formik.values.title}
            onChange={formik.handleChange}
            error={formik.touched.title && Boolean(formik.errors.title)}
            helperText={formik.touched.title && formik.errors.title}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <CommonSelectInput
            name="category"
            label="Danh mục bài viết"
            required
            noNullOption
            options={[
              { value: 'TIN_TUC', name: 'Tin tức chung dòng họ' },
              { value: 'HOAT_DONG', name: 'Hoạt động / Sự kiện đã diễn ra' }
            ]}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <CommonSelectInput
            name="status"
            label="Trạng thái xuất bản"
            required
            noNullOption
            options={[
              { value: 'PUBLISHED', name: 'Công khai (Xuất bản ngay)' },
              { value: 'DRAFT', name: 'Nháp (Lưu trữ tạm)' }
            ]}
          />
        </Grid>

        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Checkbox
                name="featured"
                checked={formik.values.featured}
                onChange={formik.handleChange}
              />
            }
            label="Đặt làm tin nổi bật (Hiển thị đầu trang chủ)"
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            size="small"
            name="summary"
            label="Tóm tắt ngắn (Summary)"
            multiline
            rows={2}
            value={formik.values.summary}
            onChange={formik.handleChange}
            error={formik.touched.summary && Boolean(formik.errors.summary)}
            helperText={formik.touched.summary && formik.errors.summary}
          />
        </Grid>

        <Grid item xs={12}>
          <CommonEditor
            name="content"
            label="Nội dung chi tiết bài viết"
          />
        </Grid>
      </Grid>
    </CommonPopupForm>
  );
};

export default PostForm;
