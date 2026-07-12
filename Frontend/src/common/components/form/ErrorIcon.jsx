import React from 'react';
import { Tooltip, IconButton } from '@mui/material';
import { ErrorOutline as ErrorIconMui } from '@mui/icons-material';

// 1. Tách object CSS tĩnh ra ngoài để tránh cấp phát lại bộ nhớ mỗi lần render
const iconButtonSx = { ml: 0.5, cursor: 'default' };

const ErrorIcon = ({ helperText }) => {
    if (!helperText) return null;

    return (
        <Tooltip title={helperText} arrow placement="top">
            <IconButton
                size="small"
                color="error"
                sx={iconButtonSx}
                disableRipple // 2. Tắt hiệu ứng sóng (ripple) vì đây chỉ là icon báo lỗi, không phải nút bấm
                aria-label="thông báo lỗi" // 3. Thêm aria-label hỗ trợ trình đọc màn hình (Accessibility)
                tabIndex={-1} // Ngăn phím Tab focus nhầm vào icon này
            >
                <ErrorIconMui fontSize="small" />
            </IconButton>
        </Tooltip>
    );
};

// 4. Bọc React.memo cực kỳ quan trọng đối với các component "lá" (leaf component) như thế này
export default React.memo(ErrorIcon);