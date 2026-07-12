import { useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
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

  // Albums grid view
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" className="serif-title" sx={{ fontWeight: 700, color: 'primary.main' }}>
          🖼️ Thư viện ảnh Gia tộc
        </Typography>
        <HasPermission roles={[UserRole.SYSTEM_ADMIN, UserRole.FAMILY_LEADER, UserRole.FAMILY_ADMIN]}>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpenAlbumForm(true)} size="small">
            Tạo Album mới
          </Button>
        </HasPermission>
      </Box>

      <GalleryFilter />
      <AlbumList />
      <AlbumForm />
    </Box>
  );
};

export default GalleryPage;
