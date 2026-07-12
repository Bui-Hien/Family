import React, { useState, useCallback, useMemo } from 'react';
import { Box, Grid, IconButton, Dialog, Typography } from '@mui/material';
import {
  Delete as DeleteIcon,
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
  RotateRight as RotateIcon,
  Close as CloseIcon,
  NavigateBefore as PrevIcon,
  NavigateNext as NextIcon,
} from '@mui/icons-material';

// 1. Tách toàn bộ CSS tĩnh ra ngoài bộ nhớ để chống cấp phát lại
const imageBoxSx = {
  position: 'relative', width: '100%', paddingBottom: '100%',
  borderRadius: 2, overflow: 'hidden', cursor: 'pointer',
  border: '1px solid', borderColor: 'divider',
  '&:hover .gallery-overlay': { opacity: 1 },
};
const imageStyle = { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' };
const overlaySx = {
  position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
  bgcolor: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center',
  justifyContent: 'center', color: '#fff', opacity: 0, transition: 'opacity 0.2s',
};
const deleteBtnSx = {
  position: 'absolute', top: 8, right: 8, bgcolor: 'background.paper',
  '&:hover': { bgcolor: 'error.main', color: '#fff' },
};
const dialogPaperProps = {
  sx: { bgcolor: '#121212', color: '#fff', maxHeight: '90vh', boxShadow: 'none', overflow: 'hidden' }
};

// 2. Kỹ thuật "Chia để trị": Tạo Sub-component để đóng băng từng bức ảnh
const GalleryItem = React.memo(({ img, idx, disabled, onOpen, onRemove }) => {
  const url = typeof img === 'string' ? img : img?.url;

  const handleOpen = useCallback(() => onOpen(idx), [idx, onOpen]);
  const handleRemove = useCallback((e) => {
    e.stopPropagation();
    onRemove(img, idx);
  }, [img, idx, onRemove]);

  if (!url) return null;

  return (
      <Grid item xs={6} sm={4} md={3}>
        <Box sx={imageBoxSx} onClick={handleOpen}>
          <img src={url} alt={`Gallery ${idx}`} loading="lazy" style={imageStyle} />
          <Box className="gallery-overlay" sx={overlaySx}>
            <ZoomInIcon fontSize="large" />
          </Box>
          {!disabled && onRemove && (
              <IconButton size="small" onClick={handleRemove} sx={deleteBtnSx}>
                <DeleteIcon fontSize="small" />
              </IconButton>
          )}
        </Box>
      </Grid>
  );
});

const CommonImageGallery = ({
                              images = [],
                              onRemoveImage,
                              disabled = false,
                            }) => {
  // 3. Gộp State (State Consolidation): Giảm số lần render từ 3 xuống 1 khi thao tác với Lightbox
  const [lightbox, setLightbox] = useState({
    activeIdx: null,
    zoom: 1,
    rotation: 0,
  });

  const handleOpen = useCallback((idx) => {
    setLightbox({ activeIdx: idx, zoom: 1, rotation: 0 });
  }, []);

  const handleClose = useCallback(() => {
    setLightbox((prev) => ({ ...prev, activeIdx: null }));
  }, []);

  const handlePrev = useCallback((e) => {
    e.stopPropagation();
    setLightbox((prev) => ({
      activeIdx: prev.activeIdx > 0 ? prev.activeIdx - 1 : images.length - 1,
      zoom: 1,
      rotation: 0,
    }));
  }, [images.length]);

  const handleNext = useCallback((e) => {
    e.stopPropagation();
    setLightbox((prev) => ({
      activeIdx: prev.activeIdx < images.length - 1 ? prev.activeIdx + 1 : 0,
      zoom: 1,
      rotation: 0,
    }));
  }, [images.length]);

  const rotateImage = useCallback(() => {
    setLightbox((prev) => ({ ...prev, rotation: (prev.rotation + 90) % 360 }));
  }, []);

  const zoomIn = useCallback(() => {
    setLightbox((prev) => ({ ...prev, zoom: Math.min(prev.zoom + 0.25, 3) }));
  }, []);

  const zoomOut = useCallback(() => {
    setLightbox((prev) => ({ ...prev, zoom: Math.max(prev.zoom - 0.25, 0.5) }));
  }, []);

  // Lấy URL an toàn cho Lightbox
  const activeUrl = useMemo(() => {
    if (lightbox.activeIdx === null || !images[lightbox.activeIdx]) return '';
    const img = images[lightbox.activeIdx];
    return typeof img === 'string' ? img : img?.url;
  }, [images, lightbox.activeIdx]);

  return (
      <Box>
        <Grid container spacing={2}>
          {images.map((img, idx) => {
            // Tạo key duy nhất, tránh dùng index thuần để không bị lỗi UI khi xóa ảnh ở giữa
            const urlKey = typeof img === 'string' ? img : img?.url;
            return (
                <GalleryItem
                    key={`${urlKey}-${idx}`}
                    img={img}
                    idx={idx}
                    disabled={disabled}
                    onOpen={handleOpen}
                    onRemove={onRemoveImage}
                />
            );
          })}
        </Grid>

        <Dialog
            open={lightbox.activeIdx !== null}
            onClose={handleClose}
            maxWidth="lg"
            fullWidth
            PaperProps={dialogPaperProps}
        >
          {lightbox.activeIdx !== null && (
              <Box sx={{ position: 'relative', height: '80vh', display: 'flex', flexDirection: 'column' }}>
                {/* Thanh công cụ */}
                <Box sx={{ p: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: 'rgba(0,0,0,0.8)', zIndex: 10 }}>
                  <Typography variant="body2" sx={{ color: 'grey.400' }}>
                    Ảnh {lightbox.activeIdx + 1} / {images.length}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton onClick={zoomIn} color="inherit"><ZoomInIcon /></IconButton>
                    <IconButton onClick={zoomOut} color="inherit"><ZoomOutIcon /></IconButton>
                    <IconButton onClick={rotateImage} color="inherit"><RotateIcon /></IconButton>
                    <IconButton onClick={handleClose} color="inherit"><CloseIcon /></IconButton>
                  </Box>
                </Box>

                {/* Khung hiển thị ảnh */}
                <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative' }}>
                  {images.length > 1 && (
                      <IconButton
                          onClick={handlePrev}
                          sx={{ position: 'absolute', left: 16, color: '#fff', bgcolor: 'rgba(0,0,0,0.4)', '&:hover': { bgcolor: 'rgba(0,0,0,0.6)' }, zIndex: 5 }}
                      >
                        <PrevIcon fontSize="large" />
                      </IconButton>
                  )}

                  <Box sx={{ transform: `scale(${lightbox.zoom}) rotate(${lightbox.rotation}deg)`, transition: 'transform 0.2s', maxWidth: '90%', maxHeight: '90%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <img src={activeUrl} alt="Lightbox" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                  </Box>

                  {images.length > 1 && (
                      <IconButton
                          onClick={handleNext}
                          sx={{ position: 'absolute', right: 16, color: '#fff', bgcolor: 'rgba(0,0,0,0.4)', '&:hover': { bgcolor: 'rgba(0,0,0,0.6)' }, zIndex: 5 }}
                      >
                        <NextIcon fontSize="large" />
                      </IconButton>
                  )}
                </Box>
              </Box>
          )}
        </Dialog>
      </Box>
  );
};

// 4. Đóng băng UI để bảo vệ hiệu năng
export default React.memo(CommonImageGallery);