import React, { useRef, useMemo } from 'react';
import Draggable from 'react-draggable';
import { Dialog, DialogTitle, DialogContent, DialogActions, Paper, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

// 1. Tối ưu PaperComponent: Chắc chắn rằng nodeRef được quản lý ổn định
export const PaperComponent = React.forwardRef((props, ref) => {
  const nodeRef = useRef(null);
  return (
      <Draggable
          nodeRef={nodeRef}
          handle="#draggable-dialog-title"
          cancel={'[class*="MuiDialogContent-root"]'}
      >
        <Paper ref={nodeRef} {...props} />
      </Draggable>
  );
});

const CommonPopup = ({
                       open,
                       handleClose,
                       title,
                       size = 'md',
                       action,
                       children,
                       ...props
                     }) => {
  // 2. Tối ưu sx bằng useMemo để tránh re-render object không cần thiết
  const closeButtonSx = useMemo(() => ({
    position: 'absolute',
    right: 8,
    top: 8,
    color: (theme) => theme.palette.grey[500],
  }), []);

  return (
      <Dialog
          open={open}
          onClose={handleClose}
          PaperComponent={PaperComponent}
          aria-labelledby="draggable-dialog-title"
          maxWidth={size}
          fullWidth
          // 3. Đảm bảo Popup luôn nằm trên các thành phần khác khi kéo
          sx={{ '& .MuiDialog-container': { alignItems: 'flex-start', pt: 10 } }}
          {...props}
      >
        <DialogTitle
            style={{ cursor: 'move', paddingRight: '48px' }}
            id="draggable-dialog-title"
        >
          {title}
          {handleClose && (
              <IconButton
                  aria-label="close"
                  onClick={handleClose}
                  sx={closeButtonSx}
                  size="small"
              >
                <CloseIcon fontSize="small" />
              </IconButton>
          )}
        </DialogTitle>

        <DialogContent dividers>
          {children}
        </DialogContent>

        {action && (
            <DialogActions>
              {action}
            </DialogActions>
        )}
      </Dialog>
  );
};

// 4. Bọc memo nếu popup thường xuyên xuất hiện trong các danh sách dài
export default React.memo(CommonPopup);