import React, { useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useFundStore } from '@/modules/funds/store/useFundStore';
import { TransactionType } from '@/common/constants';

const txValidationSchema = Yup.object({
  fundId: Yup.string().required('Quỹ không được để trống'),
  profileId: Yup.string().nullable(),
  amount: Yup.number().typeError('Số tiền phải là số').positive('Số tiền phải lớn hơn 0').required('Số tiền không được để trống'),
  type: Yup.string().required('Loại giao dịch không được để trống'),
  note: Yup.string().required('Nội dung lý do không được để trống'),
});

const TransactionForm = () => {
  const {
    openTxForm,
    setOpenTxForm,
    funds,
    selectedFundId,
    members,
    saveTransaction
  } = useFundStore();

  const formik = useFormik({
    initialValues: {
      fundId: selectedFundId || (funds.length > 0 ? funds[0].id : ''),
      profileId: '',
      amount: '',
      type: TransactionType.IN,
      note: '',
    },
    enableReinitialize: true,
    validationSchema: txValidationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        await saveTransaction(values);
      } catch (error) {
        console.error(error);
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <Dialog open={openTxForm} onClose={() => setOpenTxForm(false)} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 700 }}>Thực hiện Giao dịch mới</DialogTitle>
      <form onSubmit={formik.handleSubmit}>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <FormControl fullWidth size="small">
              <InputLabel id="fund-select-label">Chọn quỹ áp dụng</InputLabel>
              <Select
                labelId="fund-select-label"
                name="fundId"
                label="Chọn quỹ áp dụng"
                value={formik.values.fundId}
                onChange={formik.handleChange}
                error={formik.touched.fundId && Boolean(formik.errors.fundId)}
              >
                {funds.map((f) => (
                  <MenuItem key={f.id} value={f.id}>
                    {f.name} (Số dư: {f.currentBalance?.toLocaleString('vi-VN') || 0} ₫)
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth size="small">
              <InputLabel id="type-select-label">Loại giao dịch</InputLabel>
              <Select
                labelId="type-select-label"
                name="type"
                label="Loại giao dịch"
                value={formik.values.type}
                onChange={formik.handleChange}
              >
                <MenuItem value="IN">Thu (Thành viên đóng góp, tài trợ)</MenuItem>
                <MenuItem value="OUT">Chi (Chi hoạt động, giỗ chạp, sửa sang)</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth size="small">
              <InputLabel id="profile-select-label">Thành viên liên quan</InputLabel>
              <Select
                labelId="profile-select-label"
                name="profileId"
                label="Thành viên liên quan"
                value={formik.values.profileId}
                onChange={formik.handleChange}
              >
                <MenuItem value="">-- Hội đồng dòng họ (Không chọn thành viên) --</MenuItem>
                {members.map((m) => (
                  <MenuItem key={m.id} value={m.id}>
                    {m.fullName} (Đời thứ {m.generation})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              fullWidth
              size="small"
              name="amount"
              label="Số tiền giao dịch (₫)"
              value={formik.values.amount}
              onChange={formik.handleChange}
              error={formik.touched.amount && Boolean(formik.errors.amount)}
              helperText={formik.touched.amount && formik.errors.amount}
            />

            <TextField
              fullWidth
              size="small"
              name="note"
              label="Nội dung, lý do đóng góp/chi"
              multiline
              rows={3}
              value={formik.values.note}
              onChange={formik.handleChange}
              error={formik.touched.note && Boolean(formik.errors.note)}
              helperText={formik.touched.note && formik.errors.note}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setOpenTxForm(false)} color="inherit">Hủy</Button>
          <Button type="submit" variant="contained" color="primary">Gửi yêu cầu</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default TransactionForm;
