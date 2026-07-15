import { Card, CardContent, Grid, MenuItem, TextField, Button, InputAdornment, IconButton, Tooltip } from '@mui/material';
import { Search as SearchIcon, Clear as ClearIcon, Refresh as RefreshIcon } from '@mui/icons-material';
import { useFundStore } from '@/modules/funds/store/useFundStore';

const FundFilter = () => {
  const { 
    searchObject, 
    setSearchObject, 
    applyFilters 
  } = useFundStore();

  const handleChange = (field, value) => {
    setSearchObject({ [field]: value });
    applyFilters();
  };

  const handleReset = () => {
    setSearchObject({
      keyword: '',
      type: 'ALL',
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
          {/* Tìm kiếm ghi chú / người thực hiện */}
          <Grid item xs={12} sm={5}>
            <TextField
              fullWidth
              size="small"
              placeholder="Tìm theo nội dung ghi chú, họ tên..."
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

          {/* Lọc loại giao dịch */}
          <Grid item xs={12} sm={3}>
            <TextField
              select
              fullWidth
              size="small"
              label="Loại thu chi"
              value={searchObject.type || 'ALL'}
              onChange={(e) => handleChange('type', e.target.value)}
            >
              <MenuItem value="ALL">Tất cả giao dịch</MenuItem>
              <MenuItem value="INCOME">Thu quỹ (+)</MenuItem>
              <MenuItem value="OUTCOME">Chi quỹ (-)</MenuItem>
            </TextField>
          </Grid>

          {/* Lọc trạng thái phê duyệt */}
          <Grid item xs={12} sm={3}>
            <TextField
              select
              fullWidth
              size="small"
              label="Trạng thái duyệt"
              value={searchObject.status || 'ALL'}
              onChange={(e) => handleChange('status', e.target.value)}
            >
              <MenuItem value="ALL">Tất cả trạng thái</MenuItem>
              <MenuItem value="PENDING">Chờ phê duyệt</MenuItem>
              <MenuItem value="APPROVED">Đã phê duyệt</MenuItem>
              <MenuItem value="REJECTED">Đã từ chối</MenuItem>
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
              Đặt lại
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default FundFilter;
