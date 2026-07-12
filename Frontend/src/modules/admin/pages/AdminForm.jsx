import React from 'react';
import { Grid } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAdminStore } from '@/modules/admin/store/useAdminStore';
import CommonPopupForm from '@/common/components/popup/CommonPopupForm';
import CommonTextField from '@/common/components/form/CommonTextField';
import CommonSelectInput from '@/common/components/form/CommonSelectInput';
import { UserRole, UserRoleOptions } from '@/common/constants';

const AdminForm = () => {
  const { selectedRow, handleClose, saveUser, members } = useAdminStore();

  const formik = useFormik({
    initialValues: {
      username: selectedRow?.username || '',
      email: selectedRow?.email || '',
      fullName: selectedRow?.fullName || '',
      phoneNumber: selectedRow?.phoneNumber || '',
      password: selectedRow?.password || '',
      role: selectedRow?.role || UserRole.FAMILY_MEMBER,
      profileId: selectedRow?.profileId || '',
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      username: Yup.string().required('Tên đăng nhập không được để trống'),
      fullName: Yup.string().required('Họ và tên không được để trống'),
      email: Yup.string().email('Email không đúng định dạng').required('Email không được để trống'),
      role: Yup.string().required('Quyền hạn không được để trống'),
      password: Yup.string().test('pass-req', 'Mật khẩu không được để trống', function(value) {
        if (!selectedRow?.id && !value) return false;
        return true;
      }),
    }),
    onSubmit: async (values) => {
      await saveUser(values);
    },
  });

  return (
    <CommonPopupForm
      open={true}
      handleClose={handleClose}
      title={selectedRow?.id ? 'Sửa tài khoản' : 'Thêm tài khoản mới'}
      formik={formik}
      size="md"
    >
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <CommonTextField name="username" label="Tên đăng nhập" required disabled={!!selectedRow?.id} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <CommonTextField name="fullName" label="Họ và tên" required />
        </Grid>
        <Grid item xs={12} sm={6}>
          <CommonTextField name="email" label="Email" required />
        </Grid>
        <Grid item xs={12} sm={6}>
          <CommonTextField name="phoneNumber" label="Số điện thoại" />
        </Grid>
        <Grid item xs={12} sm={6}>
          <CommonTextField
            name="password"
            label={selectedRow?.id ? 'Mật khẩu mới (bỏ trống nếu không đổi)' : 'Mật khẩu'}
            type="password"
            required={!selectedRow?.id}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <CommonSelectInput
            name="role"
            label="Quyền hạn"
            required
            options={UserRoleOptions}
            noNullOption
          />
        </Grid>
        <Grid item xs={12}>
          <CommonSelectInput
            name="profileId"
            label="Liên kết hồ sơ thành viên dòng họ"
            options={members.map((m) => ({
              value: m.id,
              name: `${m.fullName} (Đời thứ ${m.generation})`
            }))}
          />
        </Grid>
      </Grid>
    </CommonPopupForm>
  );
};

export default AdminForm;
