import React from 'react';
import { Grid } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useMemberStore } from '@/modules/members/store/useMemberStore';
import CommonPopupForm from '@/common/components/popup/CommonPopupForm';
import CommonTextField from '@/common/components/form/CommonTextField';
import CommonSelectInput from '@/common/components/form/CommonSelectInput';
import CommonDateTimePicker from '@/common/components/form/CommonDateTimePicker';
import { Gender, GenderOptions } from '@/common/constants';

const validationSchema = Yup.object({
  fullName: Yup.string().required('Họ và tên không được để trống'),
  gender: Yup.string().required('Giới tính không được để trống'),
  generation: Yup.number().typeError('Thế hệ phải là số').required('Thế hệ không được để trống'),
  additionalInfo: Yup.string().test(
    'is-json',
    'Thông tin bổ sung phải là định dạng JSON hợp lệ (ví dụ: {"key": "value"})',
    (value) => {
      if (!value) return true;
      try {
        JSON.parse(value);
        return true;
      } catch (e) {
        return false;
      }
    }
  ),
});

const MemberForm = () => {
  const {
    openCreateEditPopup,
    selectedRow,
    membersList,
    handleClose,
    saveMember
  } = useMemberStore();

  const formik = useFormik({
    initialValues: {
      fullName: selectedRow?.fullName || '',
      gender: selectedRow?.gender || Gender.MALE,
      generation: selectedRow?.generation || 1,
      birthDate: selectedRow?.birthDate || '',
      deathDate: selectedRow?.deathDate || '',
      occupation: selectedRow?.occupation || '',
      biography: selectedRow?.biography || '',
      achievements: selectedRow?.achievements || '',
      fatherId: selectedRow?.fatherId || '',
      motherId: selectedRow?.motherId || '',
      spouseId: selectedRow?.spouseId || '',
      additionalInfo: selectedRow?.additionalInfo || '',
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        await saveMember(values);
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
      title={selectedRow?.id ? 'Sửa thông tin thành viên' : 'Thêm thành viên mới'}
      formik={formik}
      size="md"
    >
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <CommonTextField name="fullName" label="Họ và tên" required />
        </Grid>
        <Grid item xs={12} sm={6}>
          <CommonSelectInput
            name="gender"
            label="Giới tính"
            required
            options={GenderOptions}
            noNullOption
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <CommonTextField name="generation" label="Đời thứ (Thế hệ)" type="number" required />
        </Grid>
        <Grid item xs={12} sm={6}>
          <CommonTextField name="occupation" label="Nghề nghiệp" />
        </Grid>
        <Grid item xs={12} sm={6}>
          <CommonDateTimePicker name="birthDate" label="Ngày sinh" format="dd/MM/yyyy" />
        </Grid>
        <Grid item xs={12} sm={6}>
          <CommonDateTimePicker name="deathDate" label="Ngày mất (nếu đã mất)" format="dd/MM/yyyy" />
        </Grid>
        <Grid item xs={12} sm={6}>
          <CommonSelectInput
            name="fatherId"
            label="Cha"
            options={membersList
              .filter((m) => m.gender === Gender.MALE && (!selectedRow?.id || m.id !== selectedRow.id))
              .map((m) => ({
                value: m.id,
                name: `${m.fullName} (Đời thứ ${m.generation})`
              }))}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <CommonSelectInput
            name="motherId"
            label="Mẹ"
            options={membersList
              .filter((m) => m.gender === Gender.FEMALE && (!selectedRow?.id || m.id !== selectedRow.id))
              .map((m) => ({
                value: m.id,
                name: `${m.fullName} (Đời thứ ${m.generation})`
              }))}
          />
        </Grid>
        <Grid item xs={12}>
          <CommonSelectInput
            name="spouseId"
            label={formik.values.gender === Gender.MALE ? 'Vợ (Người phối ngẫu)' : 'Chồng (Người phối ngẫu)'}
            options={membersList
              .filter((m) => m.gender !== formik.values.gender)
              .map((m) => ({
                value: m.id,
                name: `${m.fullName} (Đời thứ ${m.generation})`
              }))}
          />
        </Grid>
        <Grid item xs={12}>
          <CommonTextField name="biography" label="Tiểu sử / Quá trình hoạt động" isTextArea rows={3} />
        </Grid>
        <Grid item xs={12}>
          <CommonTextField name="achievements" label="Thành tích / Đóng góp nổi bật" isTextArea rows={2} />
        </Grid>
        <Grid item xs={12}>
          <CommonTextField
            name="additionalInfo"
            label="Thông tin bổ sung đặc biệt (định dạng JSON)"
            isTextArea
            rows={4}
            placeholder='Ví dụ: { "Học vị": "Tiến sĩ", "Nơi sống": "Hà Nội" }'
          />
        </Grid>
      </Grid>
    </CommonPopupForm>
  );
};

export default MemberForm;
