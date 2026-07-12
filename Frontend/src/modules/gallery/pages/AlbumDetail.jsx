import React from 'react';
import { Box, Typography, Card, CardContent, Button } from '@mui/material';
import { Upload as UploadIcon, ArrowBack as BackIcon } from '@mui/icons-material';
import { useGalleryStore } from '@/modules/gallery/store/useGalleryStore';
import CommonLoading from '@/common/components/display/CommonLoading';
import CommonImageGallery from '@/common/components/file/CommonImageGallery';
import CommonConfirmDialog from '@/common/components/popup/CommonConfirmDialog';
import HasPermission from '@/common/components/auth/HasPermission';
import { UserRole } from '@/common/constants';
import useAuthStore from '@/stores/authStore';

const AlbumDetail = () => {
  const {
    selectedAlbum,
    albumMedia,
    mediaLoading,
    confirmDeleteMediaId,
    handleBackToAlbums,
    uploadMedia,
    deleteMedia,
    setConfirmDeleteMediaId,
    getImageUrl,
  } = useGalleryStore();

  const { user } = useAuthStore();
  const isManager = [UserRole.SYSTEM_ADMIN, UserRole.FAMILY_LEADER, UserRole.FAMILY_ADMIN].includes(user?.role);

  const handleFileUpload = (event) => {
    const files = event.target.files;
    uploadMedia(files);
  };

  const formattedImages = albumMedia.map((m) => ({
    url: getImageUrl(m.largeUrl || m.mediumUrl || m.smallUrl),
    id: m.id,
  }));

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Button startIcon={<BackIcon />} onClick={handleBackToAlbums} color="inherit">
          Quay lại album
        </Button>
        <HasPermission roles={[UserRole.SYSTEM_ADMIN, UserRole.FAMILY_LEADER, UserRole.FAMILY_ADMIN]}>
          <Button variant="contained" component="label" startIcon={<UploadIcon />} size="small">
            Tải ảnh lên
            <input type="file" multiple accept="image/*" hidden onChange={handleFileUpload} />
          </Button>
        </HasPermission>
      </Box>

      <Card sx={{ mb: 4, bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider' }} elevation={0}>
        <CardContent>
          <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main', mb: 1 }}>
            🖼️ {selectedAlbum.name}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {selectedAlbum.description || 'Không có mô tả cho album này.'}
          </Typography>
        </CardContent>
      </Card>

      {mediaLoading ? (
        <CommonLoading loading={mediaLoading} type="skeleton" rows={3} />
      ) : formattedImages.length === 0 ? (
        <Typography color="textSecondary" sx={{ py: 5, textAlign: 'center' }}>
          Album này chưa có ảnh nào. {isManager && 'Nhấn nút "Tải ảnh lên" để thêm hình ảnh.'}
        </Typography>
      ) : (
        <CommonImageGallery
          images={formattedImages}
          onRemoveImage={isManager ? (img) => setConfirmDeleteMediaId(img.id) : null}
          disabled={!isManager}
        />
      )}

      <CommonConfirmDialog
        open={!!confirmDeleteMediaId}
        onClose={() => setConfirmDeleteMediaId(null)}
        onConfirm={deleteMedia}
        title="Xóa hình ảnh"
        text="Bạn có chắc muốn xóa hình ảnh này khỏi album?"
      />
    </Box>
  );
};

export default AlbumDetail;
