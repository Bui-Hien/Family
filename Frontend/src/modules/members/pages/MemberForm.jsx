import React from 'react';
import { 
  Grid, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Button, 
  IconButton, 
  Tooltip,
  Box,
  TextField,
  Typography
} from '@mui/material';
import { useFormik, FieldArray } from 'formik';
import * as Yup from 'yup';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useMemberStore } from '@/modules/members/store/useMemberStore';
import CommonPopupForm from '@/common/components/popup/CommonPopupForm';
import CommonTextField from '@/common/components/form/CommonTextField';
import CommonSelectInput from '@/common/components/form/CommonSelectInput';
import CommonDateTimePicker from '@/common/components/form/CommonDateTimePicker';
import CommonImageUpload from '@/common/components/file/CommonImageUpload';
import { saveFilePublic } from '@/services/FileDescriptionService';
import { API_ENDPOINT } from '@/common/appConfig';
import { Gender, GenderOptions } from '@/common/constants';

const validationSchema = Yup.object({
  fullName: Yup.string().required('Họ và tên không được để trống'),
  gender: Yup.string().required('Giới tính không được để trống'),
  generation: Yup.number().typeError('Thế hệ phải là số').required('Thế hệ không được để trống'),
  additionalInfo: Yup.array().of(
    Yup.object().shape({
      key: Yup.string().test(
        'key-required',
        'Tên thuộc tính không được để trống',
        function (value) {
          const { value: val } = this.parent;
          if (val && !value) return false;
          return true;
        }
      ),
      value: Yup.string().test(
        'value-required',
        'Giá trị không được để trống',
        function (value) {
          const { key } = this.parent;
          if (key && !value) return false;
          return true;
        }
      ),
    })
  ),
});

const getInitialAdditionalInfo = (info) => {
  if (!info) return [{ key: '', value: '' }];
  if (typeof info === 'object') {
    const entries = Object.entries(info);
    if (entries.length === 0) return [{ key: '', value: '' }];
    return entries.map(([key, value]) => ({ key, value: typeof value === 'object' ? JSON.stringify(value) : String(value) }));
  }
  try {
    const obj = JSON.parse(info);
    if (obj && typeof obj === 'object') {
      const entries = Object.entries(obj);
      if (entries.length === 0) return [{ key: '', value: '' }];
      return entries.map(([key, value]) => ({ key, value: typeof value === 'object' ? JSON.stringify(value) : String(value) }));
    }
  } catch (e) {
    // Ignore parse error
  }
  return [{ key: '', value: '' }];
};

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
      avatarUrl: selectedRow?.avatarUrl || '',
      additionalInfo: getInitialAdditionalInfo(selectedRow?.additionalInfo),
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        // Upload avatar nếu user chọn file mới
        let avatarUrl = values.avatarUrl;
        if (values.avatarUrl instanceof File) {
          const uploadRes = await saveFilePublic(values.avatarUrl);
          const fileId = uploadRes?.data?.data?.id;
          avatarUrl = fileId ? `${API_ENDPOINT}/api/files/public/${fileId}` : '';
        }

        const infoObj = {};
        if (values.additionalInfo && Array.isArray(values.additionalInfo)) {
          values.additionalInfo.forEach(item => {
            if (item.key && item.key.trim()) {
              infoObj[item.key.trim()] = item.value || '';
            }
          });
        }
        const submitValues = {
          ...values,
          avatarUrl,
          additionalInfo: Object.keys(infoObj).length > 0 ? JSON.stringify(infoObj) : null
        };
        await saveMember(submitValues);
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
        {/* Ảnh đại diện */}
        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
          <CommonImageUpload
            name="avatarUrl"
            imagePath={selectedRow?.avatarUrl || ''}
          />
        </Grid>
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
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
            Thông tin bổ sung đặc biệt
          </Typography>
          <FieldArray name="additionalInfo">
            {({ push, remove }) => (
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ bgcolor: 'action.hover' }}>
                      <TableCell sx={{ fontWeight: 'bold', width: '40%' }}>Tên thuộc tính (Key)</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', width: '50%' }}>Giá trị (Value)</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 'bold', width: '10%' }}>Thao tác</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(formik.values.additionalInfo || []).map((item, index) => {
                      const keyName = `additionalInfo[${index}].key`;
                      const valueName = `additionalInfo[${index}].value`;
                      const isKeyTouched = formik.touched.additionalInfo?.[index]?.key;
                      const keyError = formik.errors.additionalInfo?.[index]?.key;
                      const isValTouched = formik.touched.additionalInfo?.[index]?.value;
                      const valError = formik.errors.additionalInfo?.[index]?.value;

                      return (
                        <TableRow key={index}>
                          <TableCell sx={{ verticalAlign: 'top', pt: 1, pb: 1 }}>
                            <TextField
                              size="small"
                              fullWidth
                              name={keyName}
                              value={item.key}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              placeholder="Ví dụ: Học vị"
                              error={Boolean(isKeyTouched && keyError)}
                              helperText={isKeyTouched && keyError ? keyError : ''}
                            />
                          </TableCell>
                          <TableCell sx={{ verticalAlign: 'top', pt: 1, pb: 1 }}>
                            <TextField
                              size="small"
                              fullWidth
                              name={valueName}
                              value={item.value}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              placeholder="Ví dụ: Tiến sĩ"
                              error={Boolean(isValTouched && valError)}
                              helperText={isValTouched && valError ? valError : ''}
                            />
                          </TableCell>
                          <TableCell align="center" sx={{ verticalAlign: 'top', pt: 1 }}>
                            <Tooltip title="Xóa dòng">
                              <span>
                                <IconButton
                                  color="error"
                                  onClick={() => remove(index)}
                                  disabled={formik.values.additionalInfo.length === 1 && !item.key && !item.value}
                                  size="small"
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </span>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
                <Box sx={{ p: 1, display: 'flex', justifyContent: 'flex-start' }}>
                  <Button
                    size="small"
                    startIcon={<AddIcon />}
                    onClick={() => push({ key: '', value: '' })}
                  >
                    Thêm dòng
                  </Button>
                </Box>
              </TableContainer>
            )}
          </FieldArray>
        </Grid>
      </Grid>
    </CommonPopupForm>
  );
};

export default MemberForm;
