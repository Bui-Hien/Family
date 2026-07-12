import React, { useEffect } from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { Download as DownloadIcon } from '@mui/icons-material';
import { useTreeStore } from '@/modules/family-tree/store/useTreeStore';
import CommonLoading from '@/common/components/display/CommonLoading';
import { useNavigate } from 'react-router-dom';
import TreeNode from './TreeNode';

const FamilyTreePage = () => {
  const navigate = useNavigate();
  const { treeData, loading, fetchTree, exportTree, resetStore } = useTreeStore();

  useEffect(() => {
    fetchTree();
    return () => {
      resetStore();
    };
  }, []);

  const handleNodeClick = (id) => {
    navigate(`/members/${id}`);
  };

  if (loading) {
    return <CommonLoading loading={loading} type="skeleton" rows={5} />;
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" className="serif-title" sx={{ fontWeight: 700, color: 'primary.main' }}>
          🌳 Sơ đồ Phả hệ Gia tộc
        </Typography>
        <Button variant="outlined" startIcon={<DownloadIcon />} onClick={exportTree} size="small">
          Xuất dữ liệu gia phả
        </Button>
      </Box>

      <Paper
        sx={{
          p: 4,
          borderRadius: 3,
          overflowX: 'auto',
          overflowY: 'auto',
          minHeight: '70vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          border: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper',
        }}
        elevation={0}
      >
        <Box sx={{ minWidth: 'max-content', display: 'flex', justifyContent: 'center', pt: 2 }}>
          {treeData ? (
            <TreeNode node={treeData} onNodeClick={handleNodeClick} />
          ) : (
            <Typography color="textSecondary" sx={{ mt: 5 }}>
              Sơ đồ gia phả chưa được thiết lập dữ liệu thành viên.
            </Typography>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default FamilyTreePage;
