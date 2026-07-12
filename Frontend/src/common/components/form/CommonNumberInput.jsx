import React, { useCallback, useMemo } from 'react';
import { useField, useFormikContext } from 'formik';
import { TextField } from '@mui/material';
import RequiredLabel from './RequiredLabel';

// 1. Tách object CSS tĩnh ra ngoài bộ nhớ để tránh cấp phát lại sau mỗi lần gõ phím
const numberInputSx = {
    mb: 2,
    '& .MuiInputLabel-root': {
        backgroundColor: 'background.paper',
        padding: '0 4px',
    },
    // Ẩn spinner arrows trên number input để UI gọn gàng hơn
    '& input[type=number]::-webkit-outer-spin-button': { WebkitAppearance: 'none', margin: 0 },
    '& input[type=number]::-webkit-inner-spin-button': { WebkitAppearance: 'none', margin: 0 },
    '& input[type=number]': { MozAppearance: 'textfield' },
};

const defaultInputLabelProps = { shrink: true };

const CommonNumberInput = ({
                               name,
                               label,
                               required = false,
                               disabled = false,
                               readOnly = false,
                               fullWidth = true,
                               size = 'small',
                               min,
                               max,
                               step,
                               ...props
                           }) => {
    // 2. Dùng chuẩn useField thay vì FastField cồng kềnh
    const [field, meta] = useField(name);
    const { setFieldValue } = useFormikContext();

    const isError = Boolean(meta.touched && meta.error);

    // 3. Ổn định reference hàm onChange và vá lỗi "Decimal Bug"
    const handleChange = useCallback((e) => {
        const val = e.target.value;
        // KHÔNG ép kiểu Number(val) ở đây để bảo vệ trải nghiệm gõ phím
        setFieldValue(name, val === '' ? '' : val);
    }, [name, setFieldValue]);

    const handleWheel = useCallback((e) => {
        e.target.blur(); // Ngăn chuột cuộn làm thay đổi số
    }, []);

    // 4. Memoize InputProps để tránh TextField bị đập đi xây lại liên tục
    const inputPropsMemo = useMemo(() => ({
        readOnly,
        inputProps: { min, max, step },
    }), [readOnly, min, max, step]);

    return (
        <TextField
            {...props}
            id={name}
            name={name}
            type="number"
            value={field.value ?? ''} // 5. Chặn lỗi Uncontrolled Component khi value undefined
            label={label ? <RequiredLabel label={label} required={required} /> : null}
            error={isError}
            helperText={isError ? meta.error : ''}
            fullWidth={fullWidth}
            size={size}
            disabled={disabled}
            onChange={handleChange}
            onBlur={field.onBlur} // Bắt buộc phải có để báo lỗi khi click ra ngoài
            onWheel={handleWheel}
            InputProps={inputPropsMemo}
            InputLabelProps={defaultInputLabelProps}
            variant="outlined"
            sx={numberInputSx}
        />
    );
};

// 6. Đóng băng UI bằng React.memo thay cho thủ thuật FastField phức tạp
export default React.memo(CommonNumberInput);