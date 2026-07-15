import { useState } from 'react';
import { Card, CardContent, Grid, MenuItem, TextField, Button, InputAdornment, IconButton, Tooltip, Collapse, Box } from '@mui/material';
import { Search as SearchIcon, Clear as ClearIcon, Refresh as RefreshIcon, FilterList as FilterIcon } from '@mui/icons-material';
import { usePostStore } from '@/modules/posts/store/usePostStore';

const PostFilter = () => {
  const { 
    searchObject, 
    setSearchObject, 
    applyFilters 
  } = usePostStore();

  const [showAdvanced, setShowAdvanced] = useState(false);

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
      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
        <Grid container spacing={2} alignItems="center">
          {/* Tìm kiếm từ khóa */}
          <Grid item xs={12} sm={7} md={8}>
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

          <Grid item xs={12} sm={5} md={4}>
            <Box sx={{ display: 'flex', gap: 1, justifyContent: { xs: 'stretch', sm: 'flex-end' } }}>
              <Button
                variant={showAdvanced ? 'contained' : 'outlined'}
                size="medium"
                startIcon={<FilterIcon />}
                onClick={() => setShowAdvanced(!showAdvanced)}
                sx={{ 
                  height: 40, 
                  borderRadius: 2, 
                  textTransform: 'none',
                  flex: { xs: 1, sm: 'initial' }
                }}
              >
                {showAdvanced ? 'Ẩn bộ lọc' : 'Bộ lọc'}
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
                  flex: { xs: 1, sm: 'initial' },
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
              {/* Lọc Danh mục */}
              <Grid item xs={12} sm={6}>
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
              <Grid item xs={12} sm={6}>
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
            </Grid>
          </Box>
        </Collapse>
      </CardContent>
    </Card>
  );
};

export default PostFilter;
