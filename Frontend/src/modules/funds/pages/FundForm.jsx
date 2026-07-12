import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  TextField,
  Button
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useFundStore } from '@/modules/funds/store/useFundStore';

const fundValidationSchema = Yup.object({
  name: Yup.string().required('Tên quỹ không được để trống'),
  description: Yup.string().nullable(),
  initialBalance: Yup.number().typeError('Số dư ban đầu phải là số').min(0, 'Số dư ban đầu không được nhỏ hơn 0').required('Số dư ban đầu không được để trống'),
});

const FundForm = () => {
  const { openFundForm, editingFund, setOpenFundForm, saveFund } = useFundStore();

  const formik = useFormik({
    initialValues: {
      name: editingFund?.name || '',
      description: editingFund?.description || '',
      initialBalance: editingFund?.initialBalance || 0,
    },
    enableReinitialize: true,
    validationSchema: fundValidationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        await saveFund(values);
      } catch (error) {
        console.error(error);
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <Dialog open={openFundForm} onClose={() => setOpenFundForm(false)} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontWeight: 700 }}>
        {editingFund ? 'Cập nhật Quỹ dòng họ' : 'Tạo Quỹ dòng họ mới'}
      </DialogTitle>
      <form onSubmit={formik.handleSubmit}>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField
              fullWidth
              size="small"
              name="name"
              label="Tên quỹ"
              value={formik.values.name}
              onChange={formik.handleChange}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
            />

            <TextField
              fullWidth
              size="small"
              name="initialBalance"
              label="Số dư khởi tạo ban đầu (₫)"
              value={formik.values.initialBalance}
              onChange={formik.handleChange}
              disabled={!!editingFund}
              error={formik.touched.initialBalance && Boolean(formik.errors.initialBalance)}
              helperText={formik.touched.initialBalance && formik.errors.initialBalance}
            />

            <TextField
              fullWidth
              size="small"
              name="description"
              label="Mô tả quỹ"
              multiline
              rows={3}
              value={formik.values.description}
              onChange={formik.handleChange}
              error={formik.touched.description && Boolean(formik.errors.description)}
              helperText={formik.touched.description && formik.errors.description}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setOpenFundForm(false)} color="inherit">Hủy</Button>
          <Button type="submit" variant="contained" color="primary">
            {editingFund ? 'Lưu thay đổi' : 'Tạo quỹ'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default FundForm;
