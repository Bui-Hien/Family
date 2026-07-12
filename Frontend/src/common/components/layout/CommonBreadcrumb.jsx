import React from 'react';
import { Breadcrumbs, Link, Typography, Box, IconButton, Tooltip } from '@mui/material';
import { Home as HomeIcon, Refresh as RefreshIcon, ArrowBack as BackIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const CommonBreadcrumb = ({
  routeSegments = [],
  onRefresh,
}) => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        mb: 3,
        bgcolor: 'background.paper',
        p: 1.5,
        borderRadius: 2,
        boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
        border: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <IconButton size="small" onClick={() => navigate(-1)} sx={{ mr: 1 }}>
          <BackIcon fontSize="small" />
        </IconButton>
        
        <Breadcrumbs aria-label="breadcrumb">
          <Link
            underline="hover"
            sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', color: 'text.secondary', fontSize: '14px' }}
            onClick={() => navigate('/')}
          >
            <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
            Trang chủ
          </Link>
          {routeSegments.map((segment, index) => {
            const isLast = index === routeSegments.length - 1;
            return isLast ? (
              <Typography key={index} color="text.primary" sx={{ fontWeight: 500, fontSize: '14px' }}>
                {segment.name}
              </Typography>
            ) : (
              <Link
                key={index}
                underline="hover"
                sx={{ cursor: 'pointer', color: 'text.secondary', fontSize: '14px' }}
                onClick={() => navigate(segment.path)}
              >
                {segment.name}
              </Link>
            );
          })}
        </Breadcrumbs>
      </Box>

      {onRefresh && (
        <Tooltip title="Làm mới">
          <IconButton size="small" onClick={onRefresh} color="primary">
            <RefreshIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )}
    </Box>
  );
};

export default CommonBreadcrumb;
