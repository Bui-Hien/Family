import { Card, CardContent, Grid, MenuItem, TextField, Button, InputAdornment, IconButton } from '@mui/material';
import { Search as SearchIcon, Clear as ClearIcon, Refresh as RefreshIcon } from '@mui/icons-material';
import { useAdminStore } from '@/modules/admin/store/useAdminStore';
import { UserRole } from '@/common/constants';

const AdminFilter = () => {
  const { 
    searchObject, 
    setSearchObject, 
    applyFilters 
  } = useAdminStore();

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
      <CardContent sx={{ p: '16px !important' }}>
        <Grid container spacing={2} alignItems="center">
          {/* Tìm kiếm tài khoản */}
          <Grid item xs={12} sm={6}>
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
                    <IconButton size="small" onClick={() => handleChange('keyword', '')}>
                      <ClearIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ) : null
              }}
            />
          </Grid>

          {/* Lọc Quyền hạn */}
          <Grid item xs={12} sm={5}>
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

export default AdminFilter;
