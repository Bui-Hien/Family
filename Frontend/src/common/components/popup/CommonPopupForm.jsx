import React, { useMemo, useCallback } from 'react';
import { FormikProvider } from 'formik';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, IconButton, CircularProgress, useMediaQuery, useTheme } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import FormikFocusError from '@/common/components/form/FormikFocusError';
import { PaperComponent } from './CommonPopup';

const CommonPopupForm = ({
                           open,
                           handleClose,
                           title,
                           formik,
                           action,
                           hideFooter = false,
                           hideSubmit = false,
                           textSubmit = 'Lưu',
                           formId = 'popup-form',
                           size = 'md',
                           children,
                           ...props
                         }) => {
  // Detect mobile for fullScreen behavior
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // 1. Memoize các style để tránh tạo object mới khi re-render
  const titleSx = useMemo(() => ({ cursor: isMobile ? 'default' : 'move', pr: 6 }), [isMobile]);
  const closeBtnSx = useMemo(() => ({
    position: 'absolute', right: 8, top: 8, color: 'grey.500'
  }), []);

  // 2. Wrap handleSubmit để ngăn chặn việc submit nhiều lần (Double submission)
  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    formik.handleSubmit();
  }, [formik]);

  return (
      <FormikProvider value={formik}>
        <Dialog
            open={open}
            onClose={formik.isSubmitting ? undefined : handleClose}
            PaperComponent={isMobile ? undefined : PaperComponent}
            aria-labelledby="draggable-dialog-title"
            maxWidth={size}
            fullWidth
            fullScreen={isMobile}
            {...props}
        >
          <DialogTitle sx={titleSx} id="draggable-dialog-title">
            {title}
            {handleClose && (
                <IconButton
                    aria-label="close"
                    onClick={handleClose}
                    sx={closeBtnSx}
                    size="small"
                    disabled={formik.isSubmitting}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
            )}
          </DialogTitle>

          <DialogContent dividers>
            {/* Tối ưu thẻ form: ngăn mặc định của trình duyệt, xử lý qua Formik */}
            <form id={formId} onSubmit={handleSubmit} noValidate>
              <FormikFocusError />
              {children}
            </form>
          </DialogContent>

          {!hideFooter && (
              <DialogActions>
                <Button
                    onClick={handleClose}
                    variant="outlined"
                    color="inherit"
                    size="small"
                    disabled={formik.isSubmitting}
                >
                  Hủy
                </Button>
                {!hideSubmit && (
                    <Button
                        type="submit"
                        form={formId}
                        variant="contained"
                        color="primary"
                        size="small"
                        disabled={formik.isSubmitting}
                        startIcon={formik.isSubmitting ? <CircularProgress size={16} color="inherit" /> : null}
                    >
                      {formik.isSubmitting ? 'Đang xử lý...' : textSubmit}
                    </Button>
                )}
                {action}
              </DialogActions>
          )}
        </Dialog>
      </FormikProvider>
  );
};

export default React.memo(CommonPopupForm);