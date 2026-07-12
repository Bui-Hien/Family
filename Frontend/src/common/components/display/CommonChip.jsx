import React, { useMemo } from 'react';
import { Chip } from '@mui/material';

// 1. Đưa CSS tĩnh ra ngoài để trình duyệt không phải tạo lại Object sau mỗi lần render
const baseChipSx = {
    borderRadius: '16px',
    fontWeight: 500,
};

const CommonChip = ({
                        label,
                        color = 'default',
                        onDelete,
                        onClick,
                        size = 'small',
                        ...props // Bổ sung để dễ dàng truyền thêm icon, avatar, hoặc variant="outlined"
                    }) => {
    // 2. Ghép nối CSS động bằng useMemo
    const chipSx = useMemo(() => ({
        ...baseChipSx,
        // Thực tế MUI tự động thêm cursor: pointer nếu có onClick,
        // nhưng giữ lại ở đây để kiểm soát chặt chẽ theo ý muốn của bạn
        cursor: onClick ? 'pointer' : 'default',
    }), [onClick]);

    // Ngăn chặn render thẻ rỗng làm vỡ giao diện (vẫn cho phép số 0)
    if (!label && label !== 0) return null;

    return (
        <Chip
            {...props}
            label={label}
            color={color}
            onDelete={onDelete}
            onClick={onClick}
            size={size}
            sx={chipSx}
        />
    );
};

// 3. Đóng băng Component bằng React.memo
export default React.memo(CommonChip);