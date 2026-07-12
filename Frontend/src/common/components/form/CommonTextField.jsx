import React, { useMemo } from 'react';
import { useField } from 'formik';
import { TextField } from '@mui/material';
import RequiredLabel from './RequiredLabel';

// 1. Đưa các object tĩnh ra ngoài bộ nhớ component
const textFieldSx = {
  mb: 2,
  '& .MuiInputLabel-root': {
    backgroundColor: 'background.paper',
    padding: '0 4px',
  },
};

const defaultInputLabelProps = {
  shrink: true,
};

const CommonTextField = ({
                           name,
                           label,
                           required = false,
                           disabled = false,
                           readOnly = false,
                           fullWidth = true,
                           size = 'small',
                           isTextArea = false,
                           rows = 4, // Nên để mặc định khoảng 3-4 dòng nếu là TextArea
                           InputProps, // Hỗ trợ lấy InputProps từ component cha truyền vào nếu có
                           ...props
                         }) => {
  const [field, meta] = useField(name);
  const isError = Boolean(meta.touched && meta.error);

  // 2. Memoize InputProps để tránh MUI TextField phải đập đi xây lại liên tục
  const inputPropsMemo = useMemo(() => ({
    readOnly: readOnly,
    ...InputProps, // Merge cẩn thận với InputProps bên ngoài truyền vào
  }), [readOnly, InputProps]);

  return (
      <TextField
          {...props} // Đưa props phụ lên trước
          {...field} // Trải name, onChange, onBlur đè lên props phụ
          value={field.value ?? ''} // 3. An toàn giá trị khởi tạo, chặn lỗi uncontrolled component
          id={name}
          label={label ? <RequiredLabel label={label} required={required} /> : null}
          error={isError}
          helperText={isError ? meta.error : ''}
          fullWidth={fullWidth}
          size={size}
          disabled={disabled}
          multiline={isTextArea}
          rows={isTextArea ? rows : undefined} // Chỉ truyền rows khi isTextArea = true để tránh văng warning của MUI
          InputProps={inputPropsMemo}
          InputLabelProps={defaultInputLabelProps}
          variant="outlined"
          sx={textFieldSx}
      />
  );
};

// 4. Bọc React.memo để đóng băng UI khi các trường khác trong Form bị thay đổi
export default React.memo(CommonTextField);