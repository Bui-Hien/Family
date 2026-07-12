import React, { useMemo } from 'react';
import { Chip } from '@mui/material';

// 1. Đưa các thuộc tính CSS tĩnh ra ngoài để tránh cấp phát lại bộ nhớ
const baseChipSx = {
    fontWeight: 600,
    borderRadius: '6px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
};

const CommonBadge = ({
                         status,
                         color = 'primary',
                         icon,
                         size = 'small',
                         ...props // Bổ sung rải props để dễ dàng mở rộng (vd: thêm onClick, variant="outlined", class)
                     }) => {
    // 2. Chỉ tính toán lại object CSS khi prop `size` thay đổi
    const chipSx = useMemo(() => ({
        ...baseChipSx,
        fontSize: size === 'small' ? '11px' : '13px',
    }), [size]);

    // Nếu không có status, có thể không cần render để tránh hiển thị một Chip rỗng
    if (!status) return null;

    return (
        <Chip
            {...props}
            label={status}
            color={color}
            icon={icon}
            size={size}
            sx={chipSx}
        />
    );
};

// 3. React.memo: Cực kỳ quan trọng!
// Đóng băng component này để nó không bị render lại khi các component khác trong Table/List thay đổi.
export default React.memo(CommonBadge);