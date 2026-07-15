import { Box, Typography, Button } from '@mui/material';
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
        <Box>
          <Typography variant="h4" className="serif-title" sx={{ color: 'primary.main', mb: 0.5 }}>
            🖼️ {selectedAlbum.name}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {selectedAlbum.description || 'Không có mô tả cho album này.'}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="outlined" startIcon={<BackIcon />} onClick={handleBackToAlbums}>
            Quay lại
          </Button>
          <HasPermission roles={[UserRole.SYSTEM_ADMIN, UserRole.FAMILY_LEADER, UserRole.FAMILY_ADMIN]}>
            <Button variant="contained" component="label" startIcon={<UploadIcon />} size="medium">
              Tải ảnh lên
              <input type="file" multiple accept="image/*" hidden onChange={handleFileUpload} />
            </Button>
          </HasPermission>
        </Box>
      </Box>

      {mediaLoading ? (
        <CommonLoading loading={mediaLoading} type="skeleton" rows={3} />
      ) : formattedImages.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8, color: 'text.secondary' }}>
          <Box sx={{ fontSize: 64, mb: 2, opacity: 0.4 }}>📷</Box>
          <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
            Chưa có hình ảnh
          </Typography>
          <Typography variant="body2">
            Album này hiện chưa có hình ảnh nào. {isManager && 'Hãy nhấn nút "Tải ảnh lên" ở trên để thêm hình ảnh đầu tiên.'}
          </Typography>
        </Box>
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
