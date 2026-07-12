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
import { usePostStore } from '@/modules/posts/store/usePostStore';
import CommonEditor from '@/common/components/form/CommonEditor.jsx';
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
    <Dialog open={openCreateEditPopup} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ fontWeight: 700 }}>
        {selectedRow?.id ? 'Chỉnh sửa bài viết' : 'Đăng bài viết mới'}
      </DialogTitle>
      <FormikProvider value={formik}>
        <form onSubmit={formik.handleSubmit}>
          <DialogContent>
            <Stack spacing={3} sx={{ mt: 1 }}>
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

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <InputLabel id="category-select-label">Danh mục bài viết</InputLabel>
                    <Select
                      labelId="category-select-label"
                      name="category"
                      label="Danh mục bài viết"
                      value={formik.values.category}
                      onChange={formik.handleChange}
                    >
                      <MenuItem value="TIN_TUC">Tin tức chung dòng họ</MenuItem>
                      <MenuItem value="HOAT_DONG">Hoạt động / Sự kiện đã diễn ra</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <InputLabel id="status-select-label">Trạng thái xuất bản</InputLabel>
                    <Select
                      labelId="status-select-label"
                      name="status"
                      label="Trạng thái xuất bản"
                      value={formik.values.status}
                      onChange={formik.handleChange}
                    >
                      <MenuItem value="PUBLISHED">Công khai (Xuất bản ngay)</MenuItem>
                      <MenuItem value="DRAFT">Nháp (Lưu trữ tạm)</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>

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

              <CommonEditor
                name="content"
                label="Nội dung chi tiết bài viết"
              />
            </Stack>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={handleClose} color="inherit">Hủy</Button>
            <Button type="submit" variant="contained" color="primary">Lưu bài viết</Button>
          </DialogActions>
        </form>
      </FormikProvider>
    </Dialog>
  );
};

export default PostForm;
