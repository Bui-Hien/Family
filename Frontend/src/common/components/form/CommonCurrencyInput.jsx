import React, { useCallback, useMemo } from 'react';
import { useField, useFormikContext } from 'formik';
import { InputAdornment, TextField } from '@mui/material';
import RequiredLabel from './RequiredLabel';

// 1. Tách Pure Functions và Object CSS ra ngoài bộ nhớ để tránh khởi tạo lại
const formatNumber = (num) => {
    if (num === null || num === undefined || num === '') return '';
    // Đảm bảo ép kiểu về String trước khi dùng regex
    return String(num).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

const parseRaw = (str) => String(str).replace(/,/g, '');

const textFieldSx = {
    mb: 2,
    '& .MuiInputLabel-root': {
        backgroundColor: 'background.paper',
        padding: '0 4px',
    },
};

const defaultInputLabelProps = { shrink: true };

const CommonCurrencyInput = ({
                                 name,
                                 label,
                                 required = false,
                                 disabled = false,
                                 readOnly = false,
                                 fullWidth = true,
                                 size = 'small',
                                 suffix = '₫',
                                 ...props
                             }) => {
    // 2. Dùng chuẩn useField thay vì FastField cồng kềnh
    const [field, meta] = useField(name);
    const { setFieldValue } = useFormikContext();

    const isError = Boolean(meta.touched && meta.error);

    // 3. Single Source of Truth: Tính toán trực tiếp từ Formik, không dùng useState & useEffect
    const displayValue = useMemo(() => formatNumber(field.value), [field.value]);

    // 4. Khóa Reference hàm onChange bằng useCallback
    const handleChange = useCallback((e) => {
        const raw = parseRaw(e.target.value);
        // Chỉ cho phép chuỗi rỗng hoặc các chữ số nguyên dương (chuẩn tiền tệ VNĐ)
        if (raw === '' || /^\d+$/.test(raw)) {
            const numeric = raw === '' ? '' : Number(raw);
            setFieldValue(name, numeric);
        }
    }, [name, setFieldValue]);

    const handleWheel = useCallback((e) => e.target.blur(), []);

    // 5. Memoize cấu trúc UI của Adornment để tránh đập đi xây lại DOM
    const inputPropsMemo = useMemo(() => ({
        readOnly,
        endAdornment: suffix ? (
            <InputAdornment position="end">{suffix}</InputAdornment>
        ) : null,
    }), [readOnly, suffix]);

    return (
        <TextField
            {...props}
            id={name}
            name={name}
            label={label ? <RequiredLabel label={label} required={required} /> : null}
            value={displayValue}
            onChange={handleChange}
            onBlur={field.onBlur}
            onWheel={handleWheel}
            error={isError}
            helperText={isError ? meta.error : ''}
            fullWidth={fullWidth}
            size={size}
            disabled={disabled}
            InputProps={inputPropsMemo}
            InputLabelProps={defaultInputLabelProps}
            variant="outlined"
            sx={textFieldSx}
            autoComplete="off" // Tắt tự động điền bậy bạ của trình duyệt
        />
    );
};

// 6. Đóng băng UI bằng React.memo thay cho thủ thuật FastField phức tạp
export default React.memo(CommonCurrencyInput);