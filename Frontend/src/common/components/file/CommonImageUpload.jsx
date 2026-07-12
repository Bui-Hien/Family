import React, { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import { useField } from 'formik';
import { Box, Avatar, IconButton, FormHelperText } from '@mui/material';
import { PhotoCamera as PhotoCameraIcon, Delete as DeleteIcon } from '@mui/icons-material';

// 1. Tách cấu hình CSS tĩnh ra ngoài bộ nhớ
const containerSx = { display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 };
const actionsBoxSx = {
  position: 'absolute',
  bottom: 0,
  right: 0,
  display: 'flex',
  gap: 0.5,
  bgcolor: 'background.paper',
  borderRadius: '20px',
  boxShadow: 1,
  p: '2px',
};

const CommonImageUpload = ({
                             name,
                             imagePath,
                             onChange,
                             wrapperAvatarStyle = {},
                             disabled = false,
                             ...props
                           }) => {
  const [field, meta, helpers] = useField(name);
  const isError = Boolean(meta.touched && meta.error);

  // 2. Dùng Ref để điều khiển trực tiếp thẻ Input File
  const inputRef = useRef(null);
  const [objectUrl, setObjectUrl] = useState('');

  // 3. Xử lý Memory Leak và tối ưu tốc độ render bằng createObjectURL
  useEffect(() => {
    let newUrl = '';
    if (field.value instanceof File) {
      newUrl = URL.createObjectURL(field.value);
      setObjectUrl(newUrl);
    } else {
      setObjectUrl(''); // Reset nếu field.value bị xóa hoặc truyền URL string
    }

    // Cleanup function: Dọn sạch bộ nhớ ngay lập tức
    return () => {
      if (newUrl) URL.revokeObjectURL(newUrl);
    };
  }, [field.value]);

  // 4. Single Source of Truth: Ưu tiên objectUrl (ảnh vừa chọn),
  // sau đó đến URL string lưu trong Formik, cuối cùng là imagePath fallback
  const displayUrl = objectUrl || (typeof field.value === 'string' ? field.value : imagePath) || '';

  const handleFileChange = useCallback((event) => {
    const file = event.target.files[0];
    helpers.setTouched(true); // Báo cho Formik biết field này đã bị thao tác

    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB
        helpers.setError('Kích thước ảnh tối đa là 2MB');
        // Trả input về rỗng để user có thể chọn lại chính file đó nếu muốn
        if (inputRef.current) inputRef.current.value = '';
        return;
      }
      helpers.setValue(file);
      if (onChange) onChange(file);
    }
  }, [helpers, onChange]);

  const handleRemove = useCallback(() => {
    helpers.setValue('');
    helpers.setTouched(true);

    // Vá lỗi UX chí mạng: Reset DOM input value để tránh lỗi "chọn lại file cũ không nhận"
    if (inputRef.current) {
      inputRef.current.value = '';
    }

    if (onChange) onChange(null);
  }, [helpers, onChange]);

  // 5. Tránh khởi tạo lại CSS của Avatar nếu không cần thiết
  const avatarSx = useMemo(() => ({
    width: 120,
    height: 120,
    border: '2px solid',
    borderColor: isError ? 'error.main' : 'divider',
    ...wrapperAvatarStyle,
  }), [isError, wrapperAvatarStyle]);

  return (
      <Box sx={containerSx} {...props}>
        <Box sx={{ position: 'relative' }}>
          <Avatar src={displayUrl} sx={avatarSx} />

          {!disabled && (
              <Box sx={actionsBoxSx}>
                <IconButton color="primary" component="label" size="small">
                  <input
                      ref={inputRef} // Gắn Ref vào input
                      hidden
                      accept="image/*"
                      type="file"
                      onChange={handleFileChange}
                  />
                  <PhotoCameraIcon fontSize="small" />
                </IconButton>

                {displayUrl && (
                    <IconButton color="error" size="small" onClick={handleRemove}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                )}
              </Box>
          )}
        </Box>

        {isError && (
            <FormHelperText error sx={{ mt: 1 }}>
              {meta.error}
            </FormHelperText>
        )}
      </Box>
  );
};

// 6. Đóng băng UI
export default React.memo(CommonImageUpload);