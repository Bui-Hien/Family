import { Card, CardContent, Grid, MenuItem, TextField, Button, InputAdornment, IconButton } from '@mui/material';
import { Search as SearchIcon, Clear as ClearIcon, Refresh as RefreshIcon } from '@mui/icons-material';
import { usePostStore } from '@/modules/posts/store/usePostStore';

const PostFilter = () => {
  const { 
    searchObject, 
    setSearchObject, 
    applyFilters 
  } = usePostStore();

  const handleChange = (field, value) => {
    setSearchObject({ [field]: value });
    applyFilters();
  };

  const handleReset = () => {
    setSearchObject({
      keyword: '',
      category: 'ALL',
      status: 'ALL'
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
      <CardContent sx={{ p: '16px !important' }}>
        <Grid container spacing={2} alignItems="center">
          {/* Tìm kiếm từ khóa */}
          <Grid item xs={12} sm={5}>
            <TextField
              fullWidth
              size="small"
              placeholder="Tìm theo tiêu đề, tóm tắt, nội dung..."
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
                    <IconButton size="small" onClick={() => handleChange('keyword', '')}>
                      <ClearIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ) : null
              }}
            />
          </Grid>

          {/* Lọc Danh mục */}
          <Grid item xs={12} sm={3}>
            <TextField
              select
              fullWidth
              size="small"
              label="Danh mục"
              value={searchObject.category || 'ALL'}
              onChange={(e) => handleChange('category', e.target.value)}
            >
              <MenuItem value="ALL">Tất cả danh mục</MenuItem>
              <MenuItem value="TIN_TUC">Tin tức dòng họ</MenuItem>
              <MenuItem value="GIA_PHE">Lịch sử & Gia phả</MenuItem>
              <MenuItem value="THONG_BAO">Thông báo chung</MenuItem>
            </TextField>
          </Grid>

          {/* Lọc Trạng thái */}
          <Grid item xs={12} sm={3}>
            <TextField
              select
              fullWidth
              size="small"
              label="Trạng thái"
              value={searchObject.status || 'ALL'}
              onChange={(e) => handleChange('status', e.target.value)}
            >
              <MenuItem value="ALL">Tất cả trạng thái</MenuItem>
              <MenuItem value="PUBLISHED">Đã phát hành</MenuItem>
              <MenuItem value="DRAFT">Bản nháp</MenuItem>
            </TextField>
          </Grid>

          {/* Nút Reset */}
          <Grid item xs={12} sm={1}>
            <Button
              fullWidth
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
              Reset
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default PostFilter;
