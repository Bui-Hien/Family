import React, { useState, useCallback, useMemo } from 'react';
import { useField } from 'formik';
import { TextField, InputAdornment, IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import RequiredLabel from './RequiredLabel';

// 1. Tách các object tĩnh ra ngoài để tránh cấp phát lại bộ nhớ mỗi lần render
const passwordInputSx = {
    mb: 2,
    '& .MuiInputLabel-root': {
        backgroundColor: 'background.paper',
        padding: '0 4px',
    },
};

const defaultInputLabelProps = {
    shrink: true,
};

const CommonPasswordInput = ({
                                 name,
                                 label,
                                 required = false,
                                 disabled = false,
                                 fullWidth = true,
                                 size = 'small',
                                 ...props
                             }) => {
    const [field, meta] = useField(name);
    const [showPassword, setShowPassword] = useState(false);
    const isError = Boolean(meta.touched && meta.error);

    // 2. Dùng useCallback để ổn định tham chiếu hàm
    const handleClickShowPassword = useCallback(() => {
        setShowPassword((show) => !show);
    }, []);

    // 3. UX Tối ưu: Chặn sự kiện mousedown để tránh làm mất focus của ô Input khi bấm nút con mắt
    const handleMouseDownPassword = useCallback((event) => {
        event.preventDefault();
    }, []);

    // 4. Dùng useMemo cho InputProps để tránh re-render cấu trúc DOM của Icon mỗi khi người dùng gõ phím
    const inputPropsMemo = useMemo(() => ({
        endAdornment: (
            <InputAdornment position="end">
                <IconButton
                    aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                    size="small"
                    tabIndex={-1} // UX: Bỏ qua icon này khi người dùng nhấn phím Tab (giúp form gõ mượt hơn)
                >
                    {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                </IconButton>
            </InputAdornment>
        ),
    }), [showPassword, handleClickShowPassword, handleMouseDownPassword]);

    return (
        <TextField
            {...field}
            {...props}
            id={name}
            type={showPassword ? 'text' : 'password'}
            label={label ? <RequiredLabel label={label} required={required} /> : null}
            error={isError}
            helperText={isError ? meta.error : ''}
            fullWidth={fullWidth}
            size={size}
            disabled={disabled}
            InputLabelProps={defaultInputLabelProps}
            InputProps={inputPropsMemo}
            variant="outlined"
            sx={passwordInputSx}
        />
    );
};

// 5. Bọc React.memo để ngăn component tự re-render khi các field khác trong form thay đổi
export default React.memo(CommonPasswordInput);