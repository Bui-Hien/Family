import { useState } from 'react';
import { Card, CardContent, Grid, MenuItem, TextField, Button, InputAdornment, IconButton, Tooltip, Collapse, Box } from '@mui/material';
import { Search as SearchIcon, Clear as ClearIcon, Refresh as RefreshIcon, FilterList as FilterIcon } from '@mui/icons-material';
import { useAdminStore } from '@/modules/admin/store/useAdminStore';
import { UserRole } from '@/common/constants';

const AdminFilter = () => {
  const { 
    searchObject, 
    setSearchObject, 
    applyFilters 
  } = useAdminStore();

  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleChange = (field, value) => {
    setSearchObject({ [field]: value, pageIndex: 1 });
    applyFilters();
  };

  const handleReset = () => {
    setSearchObject({
      pageIndex: 1,
      keyword: '',
      role: 'ALL'
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
          {/* Tìm kiếm tài khoản */}
          <Grid item xs={12} sm={7} md={8}>
            <TextField
              fullWidth
              size="small"
              placeholder="Tìm theo username, họ tên, email, sđt..."
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
              {/* Lọc Quyền hạn */}
              <Grid item xs={12}>
                <TextField
                  select
                  fullWidth
                  size="small"
                  label="Quyền hạn"
                  value={searchObject.role || 'ALL'}
                  onChange={(e) => handleChange('role', e.target.value)}
                >
                  <MenuItem value="ALL">Tất cả quyền hạn</MenuItem>
                  <MenuItem value={UserRole.SYSTEM_ADMIN}>Quản trị hệ thống (System Admin)</MenuItem>
                  <MenuItem value={UserRole.FAMILY_LEADER}>Trưởng họ (Family Leader)</MenuItem>
                  <MenuItem value={UserRole.FAMILY_ADMIN}>Quản trị viên dòng họ (Family Admin)</MenuItem>
                  <MenuItem value={UserRole.FAMILY_MEMBER}>Thành viên dòng họ (Family Member)</MenuItem>
                </TextField>
              </Grid>
            </Grid>
          </Box>
        </Collapse>
      </CardContent>
    </Card>
  );
};

export default AdminFilter;
