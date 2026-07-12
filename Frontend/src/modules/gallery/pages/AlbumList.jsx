import React from 'react';
import { Grid, Card, CardMedia, CardContent, Typography } from '@mui/material';
import { useGalleryStore } from '@/modules/gallery/store/useGalleryStore';

const AlbumList = () => {
  const { galleries, handleOpenAlbum, getImageUrl } = useGalleryStore();

  if (galleries.length === 0) {
    return (
      <Typography color="textSecondary" sx={{ py: 5, textAlign: 'center' }}>
        Chưa có album ảnh nào được tạo.
      </Typography>
    );
  }

  return (
    <Grid container spacing={3}>
      {galleries.map((album) => (
        <Grid item xs={12} sm={6} md={4} key={album.id}>
          <Card
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              cursor: 'pointer',
              '&:hover': { boxShadow: 4 },
            }}
            onClick={() => handleOpenAlbum(album)}
          >
            <CardMedia
              component="img"
              height="180"
              image={getImageUrl(album.coverImage) || 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'}
              alt={album.name}
              sx={{ objectFit: 'cover', bgcolor: 'grey.200' }}
            />
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                {album.name}
              </Typography>
              <Typography
                variant="body2"
                color="textSecondary"
                sx={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                }}
              >
                {album.description || 'Không có mô tả.'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default AlbumList;
