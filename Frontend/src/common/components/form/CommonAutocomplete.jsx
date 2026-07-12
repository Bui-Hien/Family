import React, { useCallback, useMemo } from 'react';
import { useField } from 'formik';
import { Autocomplete, TextField } from '@mui/material';
import RequiredLabel from './RequiredLabel';

// 1. Tách các cấu hình tĩnh ra ngoài để giải phóng bộ nhớ (RAM) sau mỗi lần render
const autocompleteSx = { mb: 2 };
const textFieldSx = {
  '& .MuiInputLabel-root': {
    backgroundColor: 'background.paper',
    padding: '0 4px',
  },
};
const defaultInputLabelProps = { shrink: true };

const CommonAutocomplete = ({
                              name,
                              label,
                              required = false,
                              options = [],
                              displayLabel = 'name',
                              displayValue = 'id',
                              multiple = false,
                              disabled = false,
                              size = 'small',
                              fullWidth = true,
                              ...props
                            }) => {
  const [field, meta, helpers] = useField(name);
  const isError = Boolean(meta.touched && meta.error);

  // 2. Kỹ thuật Mock Object: Giữ lại giá trị hiển thị khi options từ API chưa kịp load
  const resolvedValue = useMemo(() => {
    if (multiple) {
      const vals = Array.isArray(field.value) ? field.value : [];
      return vals.map((val) => {
        const found = options.find((o) => o[displayValue] === val);
        // Nếu không tìm thấy, trả về 1 object giả để MUI không báo lỗi và giữ được state
        return found || { [displayValue]: val, [displayLabel]: '' };
      });
    }

    if (field.value == null || field.value === '') return null;

    const found = options.find((o) => o[displayValue] === field.value);
    return found || { [displayValue]: field.value, [displayLabel]: '' };
  }, [field.value, multiple, options, displayValue, displayLabel]);

  // 3. Ổn định các hàm callback bằng useCallback
  const getOptionLabel = useCallback((option) => {
    if (!option) return '';
    if (typeof option === 'string' || typeof option === 'number') {
      const match = options.find((o) => o[displayValue] === option);
      return match ? String(match[displayLabel] ?? '') : '';
    }
    return String(option[displayLabel] ?? '');
  }, [options, displayValue, displayLabel]);

  const isOptionEqualToValue = useCallback((option, val) => {
    const optionVal = typeof option === 'object' ? option[displayValue] : option;
    const valVal = typeof val === 'object' ? val[displayValue] : val;
    return optionVal === valVal;
  }, [displayValue]);

  const handleChange = useCallback((event, newValue) => {
    if (multiple) {
      const selectedVals = newValue
          ? newValue.map((item) => (typeof item === 'object' ? item[displayValue] : item))
          : [];
      helpers.setValue(selectedVals);
    } else {
      const selectedVal = newValue
          ? (typeof newValue === 'object' ? newValue[displayValue] : newValue)
          : null;
      helpers.setValue(selectedVal);
    }
  }, [helpers, multiple, displayValue]);

  // 4. Memoize TextField để tránh bị vẽ (paint) lại liên tục khi người dùng gõ text tìm kiếm
  const renderInput = useCallback((params) => (
      <TextField
          {...params}
          label={label ? <RequiredLabel label={label} required={required} /> : null}
          error={isError}
          helperText={isError ? meta.error : ''}
          size={size}
          fullWidth={fullWidth}
          InputLabelProps={defaultInputLabelProps}
          sx={textFieldSx}
      />
  ), [label, required, isError, meta.error, size, fullWidth]);

  return (
      <Autocomplete
          id={name}
          multiple={multiple}
          options={options}
          disabled={disabled}
          getOptionLabel={getOptionLabel}
          value={resolvedValue}
          isOptionEqualToValue={isOptionEqualToValue}
          onChange={handleChange}
          onBlur={field.onBlur} // 5. BẮT BUỘC: Giúp Formik nhận biết trường này đã bị thao tác
          renderInput={renderInput}
          sx={autocompleteSx}
          {...props}
      />
  );
};

// 6. Đóng băng UI: Ngăn Autocomplete tự render lại khi các ô input khác trong form thay đổi
export default React.memo(CommonAutocomplete);