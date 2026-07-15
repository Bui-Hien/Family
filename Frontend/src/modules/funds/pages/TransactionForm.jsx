import {
  TextField,
  Grid
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useFundStore } from '@/modules/funds/store/useFundStore';
import { TransactionType } from '@/common/constants';
import CommonPopupForm from '@/common/components/popup/CommonPopupForm';
import CommonSelectInput from '@/common/components/form/CommonSelectInput';

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
    <CommonPopupForm
      open={openTxForm}
      handleClose={() => setOpenTxForm(false)}
      title="Thực hiện Giao dịch mới"
      formik={formik}
      size="sm"
      textSubmit="Gửi yêu cầu"
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <CommonSelectInput
            name="fundId"
            label="Chọn quỹ áp dụng"
            required
            noNullOption
            options={funds.map((f) => ({
              value: f.id,
              name: `${f.name} (Số dư: ${f.currentBalance?.toLocaleString('vi-VN') || 0} ₫)`
            }))}
          />
        </Grid>

        <Grid item xs={12}>
          <CommonSelectInput
            name="type"
            label="Loại giao dịch"
            required
            noNullOption
            options={[
              { value: 'IN', name: 'Thu (Thành viên đóng góp, tài trợ)' },
              { value: 'OUT', name: 'Chi (Chi hoạt động, giỗ chạp, sửa sang)' }
            ]}
          />
        </Grid>

        <Grid item xs={12}>
          <CommonSelectInput
            name="profileId"
            label="Thành viên liên quan"
            options={[
              { value: '', name: '-- Hội đồng dòng họ (Không chọn thành viên) --' },
              ...members.map((m) => ({
                value: m.id,
                name: `${m.fullName} (Đời thứ ${m.generation})`
              }))
            ]}
          />
        </Grid>

        <Grid item xs={12}>
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
        </Grid>

        <Grid item xs={12}>
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
        </Grid>
      </Grid>
    </CommonPopupForm>
  );
};

export default TransactionForm;
