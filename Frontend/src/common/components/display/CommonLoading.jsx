import React from 'react';
import { Backdrop, CircularProgress, Box, Skeleton } from '@mui/material';

// 1. Tách toàn bộ CSS tĩnh ra ngoài bộ nhớ để tránh cấp phát lại (Garbage Collection)
const backdropSx = {
  color: '#fff',
  // MUI hỗ trợ callback cho zIndex trong sx, khai báo ngoài này vẫn hoạt động hoàn hảo
  zIndex: (theme) => theme.zIndex.drawer + 999
};
const spinnerContainerSx = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '200px',
  width: '100%',
  p: 3
};
const skeletonContainerSx = { width: '100%', p: 2 };
const skeletonItemSx = { my: 1, borderRadius: 1 };

const CommonLoading = ({
                         loading = false,
                         type = 'spinner', // 'spinner' | 'skeleton'
                         overlay = false,
                         rows = 3,
                         ...props // 2. Bổ sung để cho phép truyền thêm class, style, hoặc aria-labels từ bên ngoài
                       }) => {
  if (!loading) return null;

  if (type === 'spinner') {
    if (overlay) {
      return (
          <Backdrop
              open={loading}
              sx={backdropSx}
              {...props}
          >
            <CircularProgress color="primary" />
          </Backdrop>
      );
    }

    return (
        <Box sx={spinnerContainerSx} {...props}>
          <CircularProgress color="primary" />
        </Box>
    );
  }

  // Khối Skeleton
  return (
      <Box sx={skeletonContainerSx} {...props}>
        {Array.from(new Array(rows)).map((_, index) => (
            <Skeleton
                // index được chấp nhận ở đây vì mảng giả (dummy array) này là tĩnh, không bao giờ bị sắp xếp lại hay xóa
                key={index}
                animation="wave"
                height={40}
                sx={skeletonItemSx}
            />
        ))}
      </Box>
  );
};

// 3. React.memo: Cực kỳ quan trọng để bảo vệ hoạt ảnh quay (Animation) không bị giật lag
export default React.memo(CommonLoading);