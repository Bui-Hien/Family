import React, { useCallback } from 'react';
import { useField } from 'formik';
import { FormControl, InputLabel, Select, MenuItem, FormHelperText } from '@mui/material';
import RequiredLabel from './RequiredLabel';

// 1. Tách các object CSS tĩnh ra ngoài để tránh cấp phát lại bộ nhớ liên tục
const formControlSx = { mb: 2 };
const inputLabelSx = { backgroundColor: 'background.paper', px: 0.5 };

const CommonSelectInput = ({
                             name,
                             label,
                             required = false,
                             options = [],
                             keyValue = 'value',
                             displayValue = 'name',
                             noNullOption = false,
                             multiple = false,
                             disabled = false,
                             size = 'small',
                             fullWidth = true,
                             ...props
                           }) => {
  const [field, meta, helpers] = useField(name);
  const isError = Boolean(meta.touched && meta.error);

  // 2. Dùng useCallback để khóa reference của hàm onChange
  const handleChange = useCallback((event) => {
    helpers.setValue(event.target.value);
  }, [helpers]);

  // 3. Sử dụng Nullish Coalescing (??) để viết điều kiện gán value ngắn gọn, an toàn hơn
  const safeValue = field.value ?? (multiple ? [] : '');

  return (
      <FormControl
          fullWidth={fullWidth}
          size={size}
          error={isError}
          disabled={disabled}
          sx={formControlSx}
      >
        {label && (
            <InputLabel shrink id={`${name}-label`} sx={inputLabelSx}>
              <RequiredLabel label={label} required={required} />
            </InputLabel>
        )}
        <Select
            {...props} // Đưa props lên trên để không vô tình đè mất name, onChange cấu hình bên dưới
            name={field.name}
            labelId={`${name}-label`}
            id={name}
            multiple={multiple}
            value={safeValue}
            onChange={handleChange}
            onBlur={field.onBlur}
            label={label ? <RequiredLabel label={label} required={required} /> : null}
            notched
        >
          {!noNullOption && !multiple && (
              <MenuItem value="">
                <em>-- Chọn --</em>
              </MenuItem>
          )}
          {options.map((option) => {
            // 4. Tuyệt đối không dùng Index làm Key trong React Map
            const optionValue = option[keyValue];

            return (
                <MenuItem key={optionValue} value={optionValue}>
                  {option[displayValue]}
                </MenuItem>
            );
          })}
        </Select>
        {isError && <FormHelperText>{meta.error}</FormHelperText>}
      </FormControl>
  );
};

// 5. Bọc React.memo để bảo vệ Component khỏi các tác động re-render thừa từ Formik
export default React.memo(CommonSelectInput);