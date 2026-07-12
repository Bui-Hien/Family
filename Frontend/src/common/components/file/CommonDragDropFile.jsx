import React, { useCallback, useMemo } from 'react';
import { useDropzone } from 'react-dropzone';
import { Box, Typography, Paper, IconButton } from '@mui/material';
import { Delete as DeleteIcon, InsertDriveFile as FileIcon, GetApp as DownloadIcon } from '@mui/icons-material';

// 1. Tách toàn bộ CSS tĩnh ra khỏi Component để trình duyệt không phải cấp phát lại bộ nhớ (Garbage Collection)
const containerSx = { mb: 2 };
const fileCardSx = {
  p: 2,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  borderColor: 'divider',
  backgroundColor: 'action.hover',
};
const fileInfoSx = { display: 'flex', alignItems: 'center', minWidth: 0, mr: 2 };
const fileIconSx = { mr: 1, color: 'primary.main', flexShrink: 0 };
const textSx = { fontSize: '13px' };
const actionsSx = { flexShrink: 0, display: 'flex' }; // Chống nút bị ép méo khi tên file quá dài

const CommonDragDropFile = ({
                              fileProp,
                              onFileUploaded,
                              onFileRemoved,
                              maxFileSize = 10485760, // 10MB
                              readOnly = false,
                              ...props // Hỗ trợ chèn class hoặc truyền ref từ form ngoài vào
                            }) => {
  const onDrop = useCallback((accepted) => {
    if (accepted.length > 0 && onFileUploaded) {
      onFileUploaded(accepted[0]);
    }
  }, [onFileUploaded]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    maxSize: maxFileSize,
    disabled: readOnly || Boolean(fileProp),
  });

  // 2. Pure Function lấy tên File an toàn (Tránh lỗi vỡ layout khi URL có tham số query ?token=...)
  const displayFileName = useMemo(() => {
    if (fileProp?.name) return fileProp.name;
    if (typeof fileProp === 'string') {
      // Ví dụ URL: https://api.com/files/document.pdf?v=123 -> Sẽ lấy đúng "document.pdf"
      return fileProp.split('/').pop().split('?')[0] || 'Tài liệu';
    }
    return 'Tài liệu';
  }, [fileProp]);

  // 3. Khắc phục triệt để lỗi Memory Leak và khóa reference bằng useCallback
  const handleDownload = useCallback((e) => {
    e.stopPropagation();
    if (!fileProp) return;

    const isFileObject = typeof fileProp !== 'string';
    const url = isFileObject ? URL.createObjectURL(fileProp) : fileProp;

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', displayFileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // DỌN DẸP BỘ NHỚ: Bắt buộc phải thu hồi URL tạm thời sau khi click tải xong
    if (isFileObject) {
      setTimeout(() => URL.revokeObjectURL(url), 100);
    }
  }, [fileProp, displayFileName]);

  const handleRemove = useCallback((e) => {
    e.stopPropagation();
    if (onFileRemoved) {
      onFileRemoved();
    }
  }, [onFileRemoved]);

  // 4. Chỉ tính toán lại Box UI thả file khi trạng thái kéo thả hoặc readOnly thay đổi
  const dropzoneSx = useMemo(() => ({
    p: 2,
    textAlign: 'center',
    cursor: readOnly ? 'default' : 'pointer',
    borderColor: isDragActive ? 'primary.main' : 'divider',
    borderStyle: 'dashed',
    transition: 'border-color 0.2s ease-in-out', // Thêm hiệu ứng chuyển màu mượt mà khi di chuột vào
  }), [readOnly, isDragActive]);

  return (
      <Box sx={containerSx} {...props}>
        {fileProp ? (
            <Paper variant="outlined" sx={fileCardSx}>
              <Box sx={fileInfoSx}>
                <FileIcon sx={fileIconSx} />
                <Typography
                    variant="body2"
                    noWrap
                    sx={textSx}
                    title={displayFileName} // Thêm title để khi tên file dài bị cắt (noWrap), user có thể hover để xem full tên
                >
                  {displayFileName}
                </Typography>
              </Box>
              <Box sx={actionsSx}>
                <IconButton onClick={handleDownload} size="small" color="primary">
                  <DownloadIcon fontSize="small" />
                </IconButton>
                {!readOnly && (
                    <IconButton onClick={handleRemove} size="small" color="error">
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                )}
              </Box>
            </Paper>
        ) : (
            <Paper
                {...getRootProps()}
                variant="outlined"
                sx={dropzoneSx}
            >
              <input {...getInputProps()} />
              <Typography variant="body2" color="textSecondary" sx={textSx}>
                {isDragActive ? 'Thả file tại đây...' : 'Kéo thả file vào đây hoặc click chọn'}
              </Typography>
            </Paper>
        )}
      </Box>
  );
};

// 5. Bọc Component bằng React.memo để ngăn re-render từ Form
export default React.memo(CommonDragDropFile);