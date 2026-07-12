import React, { useCallback } from 'react';
import { useField } from 'formik';
import { FormControlLabel, Checkbox, FormControl, FormHelperText } from '@mui/material';

// 1. Đưa object sx ra ngoài component để tránh cấp phát lại bộ nhớ (memory allocation) mỗi lần render
const formControlSx = { mb: 1, display: 'block' };

const CommonCheckBox = ({
                            name,
                            label,
                            align = 'right', // 'left' | 'right'
                            size = 'small',
                            disabled = false,
                            ...props
                        }) => {
    const [field, meta, helpers] = useField({ name, type: 'checkbox' });
    const isError = Boolean(meta.touched && meta.error);

    // 2. Dùng useCallback để giữ reference hàm ổn định, tránh làm <Checkbox> bị re-render thừa
    const handleChange = useCallback((e) => {
        helpers.setValue(e.target.checked);
    }, [helpers]);

    return (
        <FormControl error={isError} disabled={disabled} sx={formControlSx}>
            <FormControlLabel
                labelPlacement={align === 'left' ? 'start' : 'end'}
                control={
                    <Checkbox
                        {...props}
                        name={field.name}
                        size={size}
                        checked={Boolean(field.value)} // Dùng Boolean() an toàn và rõ nghĩa hơn !!
                        onChange={handleChange}
                        onBlur={field.onBlur} // Bắt buộc phải có onBlur để Formik biết field đã bị 'touched'
                    />
                }
                label={label}
            />
            {isError && <FormHelperText>{meta.error}</FormHelperText>}
        </FormControl>
    );
};

// 3. Bọc React.memo để ngăn component tự re-render khi form có các field khác thay đổi
export default React.memo(CommonCheckBox);