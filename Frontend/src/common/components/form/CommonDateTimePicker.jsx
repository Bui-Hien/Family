import React, { useCallback, useMemo } from 'react';
import { useField } from 'formik';
import { DatePicker, DateTimePicker, TimePicker } from '@mui/x-date-pickers';
import { FormControl, FormHelperText } from '@mui/material';
import RequiredLabel from './RequiredLabel';

// 1. Tách object CSS tĩnh ra ngoài để tránh cấp phát lại bộ nhớ liên tục
const formControlSx = { mb: 2 };
const textFieldSx = {
  '& .MuiInputLabel-root': {
    backgroundColor: 'background.paper',
    padding: '0 4px',
  },
};

const CommonDateTimePicker = ({
                                name,
                                label,
                                required = false,
                                format,
                                isDateTimePicker = false,
                                isTimePicker = false,
                                disablePast = false,
                                disableFuture = false,
                                minDate,
                                maxDate,
                                disabled = false,
                                size = 'small',
                                fullWidth = true,
                                isEndOfPeriod = false, // Tính năng mở rộng: Tự động set giây về 59 cho các trường "Đến ngày" (Max Date)
                                ...props
                              }) => {
  const [field, meta, helpers] = useField(name);
  const isError = Boolean(meta.touched && meta.error);

  // 2. Tránh parse Date thừa thãi nếu value không đổi
  const value = useMemo(() => {
    if (!field.value) return null;
    const dateObj = new Date(field.value);
    return isNaN(dateObj.getTime()) ? null : dateObj;
  }, [field.value]);

  // 3. Ổn định hàm handleChange, xử lý chuẩn xác logic thời gian
  const handleChange = useCallback((newValue) => {
    if (!newValue || isNaN(new Date(newValue).getTime())) {
      helpers.setValue(null);
      return;
    }

    const dateToSave = new Date(newValue);

    // Xử lý logic gán "Max Date" cho các bộ lọc tìm kiếm
    if (isEndOfPeriod) {
      // Giữ nguyên ngày/giờ/phút, chỉ set giây lên 59 và mili-giây lên 999
      dateToSave.setSeconds(59);
      dateToSave.setMilliseconds(999);
    } else if (!isTimePicker && !isDateTimePicker) {
      // Làm sạch dữ liệu cho DatePicker thông thường
      dateToSave.setHours(0, 0, 0, 0);
    } else {
      // Làm sạch số giây tránh rác dữ liệu
      dateToSave.setSeconds(0);
      dateToSave.setMilliseconds(0);
    }

    helpers.setValue(dateToSave);
  }, [helpers, isEndOfPeriod, isTimePicker, isDateTimePicker]);

  // 4. Bắt buộc setTouched khi đóng popup lịch để Formik kích hoạt Validate
  const handleClose = useCallback(() => {
    helpers.setTouched(true);
  }, [helpers]);

  const PickerComponent = isDateTimePicker
      ? DateTimePicker
      : isTimePicker
          ? TimePicker
          : DatePicker;

  const resolvedFormat = format || (isDateTimePicker
      ? 'dd/MM/yyyy HH:mm'
      : isTimePicker
          ? 'HH:mm'
          : 'dd/MM/yyyy');

  // 5. Memoize slotProps để TextInput không bị re-render mất focus khi nhập tay
  const slotProps = useMemo(() => ({
    textField: {
      size: size,
      error: isError,
      InputLabelProps: { shrink: true },
      sx: textFieldSx,
      // Fallback touched state khi user gõ tay thay vì dùng popup
      onBlur: () => helpers.setTouched(true)
    },
  }), [size, isError, helpers]);

  return (
      <FormControl fullWidth={fullWidth} error={isError} sx={formControlSx}>
        <PickerComponent
            {...props}
            label={label ? <RequiredLabel label={label} required={required} /> : null}
            value={value}
            onChange={handleChange}
            onClose={handleClose}
            disabled={disabled}
            disablePast={disablePast}
            disableFuture={disableFuture}
            minDate={minDate}
            maxDate={maxDate}
            format={resolvedFormat}
            slotProps={slotProps}
        />
        {isError && <FormHelperText>{meta.error}</FormHelperText>}
      </FormControl>
  );
};

// Bọc React.memo để bảo vệ component khỏi các re-render không liên quan trong form
export default React.memo(CommonDateTimePicker);