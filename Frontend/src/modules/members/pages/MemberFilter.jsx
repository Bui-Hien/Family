import { useMemo } from 'react';
import { Card, CardContent, Grid, MenuItem, TextField, Button, InputAdornment, IconButton, Tooltip } from '@mui/material';
import { Search as SearchIcon, Clear as ClearIcon, Refresh as RefreshIcon } from '@mui/icons-material';
import { useMemberStore } from '@/modules/members/store/useMemberStore';

const MemberFilter = () => {
  const { 
    searchObject, 
    setSearchObject, 
    pagingMember, 
    membersList 
  } = useMemberStore();

  // Tính toán động số lượng thế hệ (đời) hiện có từ danh sách thành viên
  const generations = useMemo(() => {
    if (!membersList || membersList.length === 0) return [];
    const maxGen = Math.max(...membersList.map(m => m.generation || 1), 1);
    const list = [];
    for (let i = 1; i <= maxGen; i++) {
      list.push(i);
    }
    return list;
  }, [membersList]);

  const handleChange = (field, value) => {
    setSearchObject({ [field]: value, pageIndex: 1 });
    pagingMember();
  };

  const handleReset = () => {
    setSearchObject({
      pageIndex: 1,
      keyword: '',
      gender: 'ALL',
      generation: 'ALL',
      status: 'ALL'
    });
    pagingMember();
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
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              size="small"
              placeholder="Tìm theo họ tên, nghề nghiệp..."
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

          {/* Lọc Giới tính */}
          <Grid item xs={12} sm={2.5}>
            <TextField
              select
              fullWidth
              size="small"
              label="Giới tính"
              value={searchObject.gender || 'ALL'}
              onChange={(e) => handleChange('gender', e.target.value)}
            >
              <MenuItem value="ALL">Tất cả giới tính</MenuItem>
              <MenuItem value="MALE">Nam</MenuItem>
              <MenuItem value="FEMALE">Nữ</MenuItem>
            </TextField>
          </Grid>

          {/* Lọc Đời thứ (Thế hệ) */}
          <Grid item xs={12} sm={2.5}>
            <TextField
              select
              fullWidth
              size="small"
              label="Thế hệ / Đời thứ"
              value={searchObject.generation || 'ALL'}
              onChange={(e) => handleChange('generation', e.target.value)}
            >
              <MenuItem value="ALL">Tất cả thế hệ</MenuItem>
              {generations.map((g) => (
                <MenuItem key={g} value={g}>
                  Đời thứ {g}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* Lọc Trạng thái sinh tử */}
          <Grid item xs={12} sm={2}>
            <TextField
              select
              fullWidth
              size="small"
              label="Trạng thái"
              value={searchObject.status || 'ALL'}
              onChange={(e) => handleChange('status', e.target.value)}
            >
              <MenuItem value="ALL">Tất cả trạng thái</MenuItem>
              <MenuItem value="ALIVE">Còn sống</MenuItem>
              <MenuItem value="DECEASED">Đã mất</MenuItem>
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

export default MemberFilter;
