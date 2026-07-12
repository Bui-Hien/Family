import React, { useState, useCallback } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, CircularProgress } from '@mui/material';

const CommonConfirmDialog = ({
                               open,
                               onClose,
                               title = 'Xác nhận',
                               text,
                               textConfirm = 'Xác nhận',
                               textClose = 'Hủy',
                               onConfirm,
                               isNotAPromise = false,
                               maxWidth = 'xs',
                               ...props
                             }) => {
  const [loading, setLoading] = useState(false);

  // 1. Dùng useCallback để hàm không bị tái khởi tạo
  const handleConfirm = useCallback(async () => {
    if (!onConfirm) {
      onClose();
      return;
    }

    if (isNotAPromise) {
      onConfirm();
      onClose();
    } else {
      setLoading(true);
      try {
        await onConfirm();
        onClose(); // Chỉ đóng khi đã thực thi xong
      } catch (error) {
        console.error('Lỗi khi xác nhận:', error);
      } finally {
        setLoading(false);
      }
    }
  }, [onConfirm, isNotAPromise, onClose]);

  return (
      <Dialog
          open={open}
          onClose={loading ? undefined : onClose} // 2. Chặn việc đóng dialog khi đang loading
          maxWidth={maxWidth}
          fullWidth
          {...props}
      >
        <DialogTitle>{title}</DialogTitle>
        <DialogContent dividers>
          <Typography variant="body1">{text}</Typography>
        </DialogContent>
        <DialogActions>
          <Button
              onClick={onClose}
              disabled={loading}
              color="inherit"
              variant="outlined"
              size="small"
          >
            {textClose}
          </Button>
          <Button
              onClick={handleConfirm}
              disabled={loading}
              color="primary"
              variant="contained"
              size="small"
              // 3. Tăng tính chuyên nghiệp khi loading
              startIcon={loading ? <CircularProgress size={16} color="inherit" /> : null}
          >
            {textConfirm}
          </Button>
        </DialogActions>
      </Dialog>
  );
};

// 4. React.memo: Không cần thiết cho Dialog (vì nó là overlay),
// nhưng nếu đặt trong form phức tạp vẫn nên giữ để tránh render thừa.
export default React.memo(CommonConfirmDialog);