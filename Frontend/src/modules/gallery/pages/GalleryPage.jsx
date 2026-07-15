import { useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Add as AddIcon, PhotoLibrary as PhotoLibraryIcon } from '@mui/icons-material';
import { useGalleryStore } from '@/modules/gallery/store/useGalleryStore';
import CommonLoading from '@/common/components/display/CommonLoading';
import HasPermission from '@/common/components/auth/HasPermission';
import { UserRole } from '@/common/constants';
import AlbumList from './AlbumList';
import GalleryFilter from './GalleryFilter';
import AlbumDetail from './AlbumDetail';
import AlbumForm from './AlbumForm';

const GalleryPage = () => {
  const {
    loading,
    selectedAlbum,
    fetchGalleries,
    setOpenAlbumForm,
    resetStore,
  } = useGalleryStore();

  useEffect(() => {
    fetchGalleries();
    return () => {
      resetStore();
    };
  }, []);

  if (loading) {
    return <CommonLoading loading={loading} type="skeleton" rows={5} />;
  }

  // Album detail view
  if (selectedAlbum) {
    return <AlbumDetail />;
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'stretch', sm: 'flex-start' }, mb: 3, gap: 2 }}>
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="h4" className="serif-title" sx={{ color: 'primary.main', mb: 0.5, fontSize: { xs: '1.5rem', md: '2.125rem' }, display: 'flex', alignItems: 'center', gap: 1 }}>
            <PhotoLibraryIcon sx={{ fontSize: { xs: '1.75rem', md: '2.25rem' } }} /> Thư viện ảnh Gia tộc
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Lưu giữ những khoảnh khắc, hình ảnh ý nghĩa của các thành viên và dòng họ
          </Typography>
        </Box>
        <HasPermission roles={[UserRole.SYSTEM_ADMIN, UserRole.FAMILY_LEADER, UserRole.FAMILY_ADMIN]}>
          <Box sx={{ display: 'flex', justifyContent: { xs: 'flex-start', sm: 'flex-end' } }}>
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpenAlbumForm(true)} size="medium">
              Tạo Album mới
            </Button>
          </Box>
        </HasPermission>
      </Box>

      <GalleryFilter />
      <AlbumList />
      <AlbumForm />
    </Box>
  );
};

export default GalleryPage;
