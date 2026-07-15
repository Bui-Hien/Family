import { useState } from 'react';
import { Card, CardContent, Grid, MenuItem, TextField, Button, InputAdornment, IconButton, Tooltip, Collapse, Box } from '@mui/material';
import { Search as SearchIcon, Clear as ClearIcon, Refresh as RefreshIcon, FilterList as FilterIcon } from '@mui/icons-material';
import { useGalleryStore } from '@/modules/gallery/store/useGalleryStore';

const GalleryFilter = () => {
  const { 
    searchObject, 
    setSearchObject, 
    applyFilters 
  } = useGalleryStore();

  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleChange = (field, value) => {
    setSearchObject({ [field]: value });
    applyFilters();
  };

  const handleReset = () => {
    setSearchObject({
      keyword: '',
      visibility: 'ALL'
    });
    applyFilters();
  };

  return (
    <Card 
      elevation={0} 
      sx={{ 
        mb: 3, 
        borderRadius: 3, 
        border: '1px solid', 
        borderColor: 'divider',
        bgcolor: 'background.paper',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.02)'
      }}
    >
      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
        <Grid container spacing={2} alignItems="center">
          {/* Tìm kiếm tên album */}
          <Grid item xs={12} sm={7} md={8}>
            <TextField
              fullWidth
              size="small"
              placeholder="Tìm theo tên album hoặc mô tả..."
              value={searchObject.keyword || ''}
              onChange={(e) => handleChange('keyword', e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" color="action" />
                  </InputAdornment>
                ),
                endAdornment: searchObject.keyword ? (
                  <InputAdornment position="end">
                    <Tooltip title="Xóa tìm kiếm">
                      <IconButton size="small" onClick={() => handleChange('keyword', '')}>
                        <ClearIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </InputAdornment>
                ) : null
              }}
            />
          </Grid>

          {/* Cụm nút bấm điều khiển */}
          <Grid item xs={12} sm={5} md={4}>
            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
              <Button
                variant={showAdvanced ? 'contained' : 'outlined'}
                size="medium"
                startIcon={<FilterIcon />}
                onClick={() => setShowAdvanced(!showAdvanced)}
                sx={{ 
                  height: 40, 
                  borderRadius: 2, 
                  textTransform: 'none',
                }}
              >
                {showAdvanced ? 'Ẩn bộ lọc' : 'Bộ lọc nâng cao'}
              </Button>
              <Button
                variant="outlined"
                size="medium"
                startIcon={<RefreshIcon />}
                onClick={handleReset}
                sx={{ 
                  height: 40, 
                  borderRadius: 2, 
                  textTransform: 'none',
                  borderColor: 'divider',
                  color: 'text.secondary',
                  '&:hover': {
                    borderColor: 'primary.main',
                    color: 'primary.main'
                  }
                }}
              >
                Đặt lại
              </Button>
            </Box>
          </Grid>
        </Grid>

        {/* Bộ lọc nâng cao */}
        <Collapse in={showAdvanced} timeout="auto" unmountOnExit>
          <Box sx={{ mt: 2, pt: 2, borderTop: '1px dashed', borderColor: 'divider' }}>
            <Grid container spacing={2}>
              {/* Lọc Quyền riêng tư */}
              <Grid item xs={12}>
                <TextField
                  select
                  fullWidth
                  size="small"
                  label="Quyền xem"
                  value={searchObject.visibility || 'ALL'}
                  onChange={(e) => handleChange('visibility', e.target.value)}
                >
                  <MenuItem value="ALL">Tất cả quyền xem</MenuItem>
                  <MenuItem value="PUBLIC">Công khai (Public)</MenuItem>
                  <MenuItem value="MEMBER">Chỉ thành viên dòng họ (Member)</MenuItem>
                  <MenuItem value="PRIVATE">Chỉ ban quản trị (Private)</MenuItem>
                </TextField>
              </Grid>
            </Grid>
          </Box>
        </Collapse>
      </CardContent>
    </Card>
  );
};

export default GalleryFilter;
