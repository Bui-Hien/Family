import React from 'react';
import {
  TextField,
  Grid
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useFundStore } from '@/modules/funds/store/useFundStore';
import CommonPopupForm from '@/common/components/popup/CommonPopupForm';

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
    <CommonPopupForm
      open={openFundForm}
      handleClose={() => setOpenFundForm(false)}
      title={editingFund ? 'Cập nhật Quỹ dòng họ' : 'Tạo Quỹ dòng họ mới'}
      formik={formik}
      size="xs"
      textSubmit={editingFund ? 'Lưu thay đổi' : 'Tạo quỹ'}
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
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
        </Grid>

        <Grid item xs={12}>
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
        </Grid>

        <Grid item xs={12}>
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
        </Grid>
      </Grid>
    </CommonPopupForm>
  );
};

export default FundForm;
