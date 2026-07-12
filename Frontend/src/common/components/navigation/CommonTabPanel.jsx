import React from 'react';
import { Box } from '@mui/material';

const CommonTabPanel = ({ children, value, index, ...other }) => {
  // 1. Kiểm tra điều kiện render sớm để không tạo ra các Node DOM không cần thiết
  const isActive = value === index;

  return (
      <div
          role="tabpanel"
          hidden={!isActive}
          id={`tabpanel-${index}`}
          aria-labelledby={`tab-${index}`}
          // 2. Dùng 'display: none' để ẩn/hiện, giúp trình duyệt giữ nguyên vị trí scroll
          // và trạng thái của các Input bên trong khi người dùng chuyển Tab
          style={{ display: isActive ? 'block' : 'none' }}
          {...other}
      >
        {/*
        3. Logic "Lazy Render":
        Chỉ render nội dung bên trong khi Tab được kích hoạt lần đầu tiên.
        Nếu Form phức tạp, nội dung sẽ không bị hủy khi chuyển tab.
      */}
        {isActive && (
            <Box sx={{ py: 1 }}>
              {children}
            </Box>
        )}
      </div>
  );
};

// 4. Bọc React.memo để ngăn TabPanel bị re-render nếu Tabs cha cập nhật
// (ví dụ khi có đếm số lượng tin nhắn mới hiển thị ở Header)
export default React.memo(CommonTabPanel);