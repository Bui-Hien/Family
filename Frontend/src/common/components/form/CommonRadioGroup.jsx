import React, { useCallback } from 'react';
import { useField } from 'formik';
import { FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, FormHelperText } from '@mui/material';
import RequiredLabel from './RequiredLabel';

// 1. Tách các object cấu hình CSS tĩnh ra ngoài để tránh cấp phát bộ nhớ sau mỗi nhịp render
const formControlSx = { mb: 2, display: 'block' };
const formLabelSx = { mb: 1, '&.MuiFormLabel-root': { fontSize: '13px' } };

const CommonRadioGroup = ({
                              name,
                              label,
                              required = false,
                              options = [],
                              row = true,
                              disabled = false,
                              ...props
                          }) => {
    const [field, meta, helpers] = useField(name);
    const isError = Boolean(meta.touched && meta.error);

    // 2. Dùng useCallback để khóa reference của hàm onChange
    const handleChange = useCallback((e) => {
        const val = e.target.value;

        // Tối ưu thuật toán ép kiểu (Type Coercion) an toàn hơn
        if (val === 'true') {
            helpers.setValue(true);
        } else if (val === 'false') {
            helpers.setValue(false);
        } else if (val.trim() !== '' && !isNaN(Number(val))) {
            // Dùng Number(val) kết hợp isNaN để tránh lỗi nhận diện khoảng trắng (" ") thành số 0
            helpers.setValue(Number(val));
        } else {
            helpers.setValue(val);
        }
    }, [helpers]);

    return (
        <FormControl error={isError} component="fieldset" disabled={disabled} sx={formControlSx}>
            {label && (
                <FormLabel component="legend" sx={formLabelSx}>
                    <RequiredLabel label={label} required={required} />
                </FormLabel>
            )}
            <RadioGroup
                {...props}
                name={field.name}
                row={row}
                // Ép kiểu chuẩn xác về chuỗi để MUI so sánh đúng với option.value
                value={field.value != null ? String(field.value) : ''}
                onChange={handleChange}
                onBlur={field.onBlur} // Bắt buộc phải có để Formik nhận biết hành động click ra ngoài (touched)
            >
                {options.map((option) => (
                    <FormControlLabel
                        key={String(option.value)} // 3. Dùng option.value làm key thay vì index (index dễ gây bug khi mảng bị thay đổi thứ tự)
                        value={String(option.value)}
                        control={<Radio size="small" />}
                        label={option.label}
                    />
                ))}
            </RadioGroup>
            {isError && <FormHelperText>{meta.error}</FormHelperText>}
        </FormControl>
    );
};

// 4. Bọc React.memo để ngăn Component render lại nếu các field khác trong Formik bị thay đổi
export default React.memo(CommonRadioGroup);