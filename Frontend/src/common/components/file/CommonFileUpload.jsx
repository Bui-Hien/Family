import React, { useCallback, useMemo, useRef, useEffect } from 'react';
import { useField } from 'formik';
import { useDropzone } from 'react-dropzone';
import { Box, Typography, List, ListItem, ListItemText, IconButton, Paper, FormHelperText } from '@mui/material';
import { CloudUpload as UploadIcon, Delete as DeleteIcon, InsertDriveFile as FileIcon } from '@mui/icons-material';

// 1. Tách cấu hình mặc định và CSS tĩnh ra ngoài bộ nhớ (Tránh cấp phát lại mỗi lần gõ phím ở form)
const DEFAULT_ACCEPTED_FILES = {
  'image/*': [],
  'application/pdf': ['.pdf']
};

const containerSx = { mb: 2 };
const uploadIconSx = { fontSize: 40, color: 'text.secondary', mb: 1 };
const listContainerSx = {
  mt: 1,
  border: '1px solid',
  borderColor: 'divider',
  borderRadius: 1,
  maxHeight: 250, // UX: Thêm thanh cuộn nếu upload quá nhiều file, tránh vỡ layout form
  overflowY: 'auto'
};
const fileIconSx = { mr: 1, color: 'action.active' };
const primaryTextProps = { fontSize: '13px', noWrap: true };
const secondaryTextProps = { fontSize: '11px' };

// Hàm tiện ích format dung lượng siêu nhẹ
const formatSize = (bytes) => (bytes ? `${(bytes / 1024).toFixed(1)} KB` : '');

// Hàm tiện ích tạo Key duy nhất cho File (Khắc phục lỗi key={idx})
const generateFileKey = (file, idx) => file?.name ? `${file.name}-${file.size}-${file.lastModified}` : `file-${idx}`;

const CommonFileUpload = ({
                            name,
                            acceptedFiles = DEFAULT_ACCEPTED_FILES,
                            maxFileSize = 5242880, // 5MB
                            filesLimit = 10,
                            showPreview = true,
                            showDelete = true,
                            disabled = false,
                            ...props // Bổ sung để dễ dàng gắn className hoặc các event khác
                          }) => {
  const [field, meta, helpers] = useField(name);
  const isError = Boolean(meta.touched && meta.error);
  const files = Array.isArray(field.value) ? field.value : [];

  // 2. Kỹ thuật "Latest Ref": Giữ mảng files mới nhất mà không làm thay đổi reference của hàm onDrop
  const filesRef = useRef(files);
  useEffect(() => {
    filesRef.current = files;
  }, [files]);

  // 3. Khóa hàm onDrop bằng useCallback, kết hợp filesRef để tránh Dropzone bị đập đi xây lại liên tục
  const onDrop = useCallback((accepted) => {
    helpers.setTouched(true); // BẮT BUỘC: Đánh dấu touched để Formik hiển thị lỗi (nếu có)

    const currentFiles = filesRef.current;
    if (currentFiles.length + accepted.length > filesLimit) {
      helpers.setError(`Vượt quá giới hạn số lượng file (Tối đa ${filesLimit} files)`);
      return;
    }
    helpers.setValue([...currentFiles, ...accepted]);
  }, [filesLimit, helpers]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedFiles,
    maxSize: maxFileSize,
    disabled,
  });

  // 4. Khóa hàm xóa file
  const handleRemove = useCallback((index) => {
    const updated = [...filesRef.current];
    updated.splice(index, 1);
    helpers.setValue(updated);
    helpers.setTouched(true);
  }, [helpers]);

  // 5. Tính toán MB một lần duy nhất thay vì tính lại sau mỗi cú click chuột
  const maxMb = useMemo(() => Math.round(maxFileSize / (1024 * 1024)), [maxFileSize]);

  // 6. Memoize CSS động của Paper để tránh tính toán lại liên tục
  const dropzoneSx = useMemo(() => ({
    p: 3,
    textAlign: 'center',
    cursor: disabled ? 'default' : 'pointer',
    borderColor: isDragActive ? 'primary.main' : isError ? 'error.main' : 'divider',
    backgroundColor: isDragActive ? 'rgba(25, 118, 210, 0.04)' : 'background.paper', // Dùng mã màu phổ quát hơn hoặc 'action.hover'
    borderStyle: 'dashed',
    transition: 'all 0.2s ease', // Thêm hiệu ứng chuyển màu mượt mà
    '&:hover': {
      borderColor: disabled ? 'divider' : 'primary.main',
    },
  }), [disabled, isDragActive, isError]);

  return (
      <Box sx={containerSx} {...props}>
        <Paper {...getRootProps()} variant="outlined" sx={dropzoneSx}>
          <input {...getInputProps()} />
          <UploadIcon sx={uploadIconSx} />
          <Typography variant="body2" color="textSecondary">
            {isDragActive ? 'Thả file vào đây...' : 'Kéo thả file vào đây, hoặc click để chọn file'}
          </Typography>
          <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mt: 0.5 }}>
            Dung lượng tối đa: {maxMb}MB. Tối đa {filesLimit} files.
          </Typography>
        </Paper>

        {isError && <FormHelperText error sx={{ mx: 1, mt: 0.5 }}>{meta.error}</FormHelperText>}

        {showPreview && files.length > 0 && (
            <List sx={listContainerSx}>
              {files.map((file, idx) => (
                  <ListItem
                      key={generateFileKey(file, idx)} // Sửa lỗi anti-pattern key={idx}
                      secondaryAction={
                          showDelete && !disabled && (
                              <IconButton edge="end" aria-label="delete" onClick={() => handleRemove(idx)}>
                                <DeleteIcon fontSize="small" color="error" />
                              </IconButton>
                          )
                      }
                  >
                    <FileIcon sx={fileIconSx} />
                    <ListItemText
                        primary={file.name || `File ${idx + 1}`}
                        secondary={formatSize(file.size)}
                        primaryTypographyProps={primaryTextProps}
                        secondaryTypographyProps={secondaryTextProps}
                    />
                  </ListItem>
              ))}
            </List>
        )}
      </Box>
  );
};

// 7. Đóng băng UI bằng React.memo
export default React.memo(CommonFileUpload);