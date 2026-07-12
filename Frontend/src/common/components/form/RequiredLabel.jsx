import React from 'react';
import { Box } from '@mui/material';

// 1. Tách object CSS tĩnh ra ngoài bộ nhớ để tránh cấp phát lại
const asteriskSx = {
    color: 'error.main',
    ml: 0.5,
    fontWeight: 'bold'
};

const RequiredLabel = ({ label, required }) => {
    return (
        <React.Fragment>
            {/* 2. Trả thẳng chuỗi text ra ngoài để nó kế thừa 100% font, size, và màu sắc (lỗi/focus) của Label cha */}
            {label}

            {/* 3. Dùng Box render thẻ span nhẹ nhàng cho dấu sao */}
            {required && (
                <Box
                    component="span"
                    sx={asteriskSx}
                    aria-hidden="true" // UX: Ẩn dấu sao khỏi các trình đọc màn hình để người khiếm thị không nghe chữ "sao" thừa thãi
                >
                    *
                </Box>
            )}
        </React.Fragment>
    );
};

// 4. Bọc React.memo cực kỳ quan trọng cho các component "Lá" (Leaf Component)
export default React.memo(RequiredLabel);