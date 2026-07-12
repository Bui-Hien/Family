import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, IconButton, Typography } from '@mui/material';
import { Close as CloseIcon, GetApp as DownloadIcon, ZoomIn as ZoomIcon } from '@mui/icons-material';

// 1. Tách toàn bộ CSS/Style tĩnh ra khỏi vòng đời Render
const containerSx = { display: 'inline-block' };
const thumbnailSx = {
    cursor: 'pointer',
    position: 'relative',
    borderRadius: 1,
    border: '1px solid',
    borderColor: 'divider',
    overflow: 'hidden',
    width: 100,
    height: 100,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    bgcolor: 'action.hover',
    '&:hover .overlay': { opacity: 1 },
};
const thumbnailImgStyle = { width: '100%', height: '100%', objectFit: 'cover' };
const thumbnailTextSx = { fontWeight: 'bold', color: 'text.secondary' };
const overlaySx = {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    bgcolor: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center',
    justifyContent: 'center', color: '#fff', opacity: 0, transition: 'opacity 0.2s',
};
const dialogTitleSx = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', pr: 2 };
const dialogContentSx = { p: 0, height: '70vh', display: 'flex', justifyContent: 'center', alignItems: 'center', bgcolor: '#f0f0f0' };
const previewImgStyle = { maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' };
const iframeStyle = { border: 'none', width: '100%', height: '100%' };

const CommonFilePreview = ({
                               file,
                               previewUrl,
                               showDownload = true,
                               showDelete = false,
                               onDelete,
                               onDownload,
                               ...props
                           }) => {
    const [open, setOpen] = useState(false);
    const [objectUrl, setObjectUrl] = useState('');

    // 2. Vá lỗi Memory Leak: Chỉ tạo Object URL 1 lần và thu hồi nó khi component unmount
    useEffect(() => {
        let newUrl = '';
        if (!previewUrl && file instanceof File) {
            newUrl = URL.createObjectURL(file);
            setObjectUrl(newUrl);
        }

        return () => {
            if (newUrl) URL.revokeObjectURL(newUrl);
        };
    }, [file, previewUrl]);

    // 3. Memoize logic tính toán siêu dữ liệu (Metadata) để tránh lặp lại
    const { url, fileName, isImage, isPdf } = useMemo(() => {
        const finalUrl = previewUrl || objectUrl || (typeof file === 'string' ? file : '');

        // Cắt bỏ query params (?token=...) để lấy đúng đuôi file
        const cleanUrl = finalUrl.toLowerCase().split('?')[0];

        let name = 'Tài liệu';
        if (file?.name) {
            name = file.name;
        } else if (typeof file === 'string') {
            name = file.split('/').pop().split('?')[0] || 'Tài liệu';
        }

        const imgCheck = file?.type?.startsWith('image/') || /\.(jpg|jpeg|png|gif|webp)$/i.test(cleanUrl);
        const pdfCheck = file?.type === 'application/pdf' || /\.pdf$/i.test(cleanUrl);

        return { url: finalUrl, fileName: name, isImage: imgCheck, isPdf: pdfCheck };
    }, [file, previewUrl, objectUrl]);

    // 4. Khóa reference các hàm xử lý sự kiện
    const handleOpen = useCallback(() => setOpen(true), []);
    const handleClose = useCallback(() => setOpen(false), []);

    const handleDelete = useCallback(() => {
        if (onDelete) onDelete();
        setOpen(false);
    }, [onDelete]);

    const handleDownload = useCallback((e) => {
        if (e) e.stopPropagation();
        if (onDownload) {
            onDownload();
            return;
        }
        if (!url) return;

        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }, [onDownload, url, fileName]);

    return (
        <Box sx={containerSx} {...props}>
            {/* Khối Thumbnail hiển thị bên ngoài */}
            <Box onClick={handleOpen} sx={thumbnailSx}>
                {isImage ? (
                    <img src={url} alt={fileName} style={thumbnailImgStyle} loading="lazy" />
                ) : (
                    <Typography variant="caption" sx={thumbnailTextSx}>
                        {isPdf ? 'PDF' : 'FILE'}
                    </Typography>
                )}
                <Box className="overlay" sx={overlaySx}>
                    <ZoomIcon fontSize="small" />
                </Box>
            </Box>

            {/* Khối Dialog Popup */}
            <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
                <DialogTitle sx={dialogTitleSx}>
                    <Typography variant="h6" noWrap sx={{ maxWidth: '80%' }} title={fileName}>
                        {fileName}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        {showDownload && (
                            <IconButton onClick={handleDownload} size="small" color="primary">
                                <DownloadIcon fontSize="small" />
                            </IconButton>
                        )}
                        <IconButton onClick={handleClose} size="small">
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    </Box>
                </DialogTitle>

                <DialogContent dividers sx={dialogContentSx}>
                    {/* 5. Tối ưu Băng thông (Lazy Render): Chỉ sinh thẻ <iframe> khi Dialog THỰC SỰ MỞ */}
                    {open && (
                        isImage ? (
                            <img src={url} alt={fileName} style={previewImgStyle} />
                        ) : isPdf ? (
                            <iframe src={url} title={fileName} style={iframeStyle} />
                        ) : (
                            <Typography variant="body1">Không hỗ trợ xem trước định dạng này</Typography>
                        )
                    )}
                </DialogContent>

                <DialogActions>
                    {showDelete && (
                        <Button color="error" onClick={handleDelete} size="small">
                            Xóa
                        </Button>
                    )}
                    <Button onClick={handleClose} variant="outlined" size="small">
                        Đóng
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

// 6. Đóng băng UI để bảo vệ Grid/List bên ngoài
export default React.memo(CommonFilePreview);