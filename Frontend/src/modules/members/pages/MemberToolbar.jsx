import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useMemberStore } from '@/modules/members/store/useMemberStore';
import CommonInputSearch from '@/common/components/form/CommonInputSearch';

const MemberToolbar = () => {
  const { handleOpenCreateEdit, setSearchObject, pagingMember } = useMemberStore();

  const handleSearch = (val) => {
    setSearchObject({ keyword: val, pageIndex: 1 });
    pagingMember();
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" className="serif-title" sx={{ fontWeight: 700, color: 'primary.main' }}>
          👥 Danh sách Thành viên Dòng họ
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenCreateEdit(null)} size="small">
          Thêm thành viên
        </Button>
      </Box>

      {/* Filter and Search */}
      <Box sx={{ mb: 2 }}>
        <CommonInputSearch onSearch={handleSearch} placeholder="Tìm theo tên thành viên..." />
      </Box>
    </Box>
  );
};

export default MemberToolbar;
