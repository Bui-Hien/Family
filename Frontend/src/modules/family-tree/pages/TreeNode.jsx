import React from 'react';
import { Box, Card, CardContent, Typography, Avatar, Stack } from '@mui/material';
import { Gender } from '@/common/constants';

const TreeNode = ({ node, onNodeClick }) => {
  if (!node) return null;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mx: 2 }}>
      {/* Node Card */}
      <Stack direction="row" spacing={1} alignItems="center" sx={{ position: 'relative' }}>
        {/* Main Member Card */}
        <Card
          onClick={() => onNodeClick(node.id)}
          sx={{
            minWidth: 150,
            cursor: 'pointer',
            border: '2px solid',
            borderColor: node.gender === Gender.MALE ? 'info.main' : 'error.light',
            textAlign: 'center',
            '&:hover': {
              boxShadow: 4,
            },
          }}
        >
          <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
            <Avatar src={node.avatarUrl} sx={{ mx: 'auto', mb: 1, width: 48, height: 48 }}>
              {node.fullName.charAt(0)}
            </Avatar>
            <Typography variant="body2" sx={{ fontWeight: 600 }} noWrap>
              {node.fullName}
            </Typography>
            <Typography variant="caption" color="textSecondary" sx={{ display: 'block' }}>
              Đời thứ {node.generation}
            </Typography>
          </CardContent>
        </Card>

        {/* Spouse Card if exists */}
        {node.spouse && (
          <>
            <Box sx={{ width: 15, height: 2, bgcolor: 'grey.400' }} />
            <Card
              onClick={() => onNodeClick(node.spouse.id)}
              sx={{
                minWidth: 150,
                cursor: 'pointer',
                border: '2px solid',
                borderColor: node.spouse.gender === Gender.MALE ? 'info.main' : 'error.light',
                textAlign: 'center',
                '&:hover': {
                  boxShadow: 4,
                },
              }}
            >
              <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                <Avatar src={node.spouse.avatarUrl} sx={{ mx: 'auto', mb: 1, width: 48, height: 48 }}>
                  {node.spouse.fullName.charAt(0)}
                </Avatar>
                <Typography variant="body2" sx={{ fontWeight: 600 }} noWrap>
                  {node.spouse.fullName}
                </Typography>
                <Typography variant="caption" color="textSecondary" sx={{ display: 'block' }}>
                  Vợ / Chồng
                </Typography>
              </CardContent>
            </Card>
          </>
        )}
      </Stack>

      {/* Children connector lines & recursive children rendering */}
      {node.children && node.children.length > 0 && (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 2 }}>
          <Box sx={{ width: 2, height: 20, bgcolor: 'grey.400' }} />

          <Box sx={{ display: 'flex', position: 'relative' }}>
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: `calc(100% / ${node.children.length * 2})`,
                right: `calc(100% / ${node.children.length * 2})`,
                height: 2,
                bgcolor: 'grey.400',
              }}
            />
            <Box sx={{ display: 'flex', pt: 2 }}>
              {node.children.map((child) => (
                <Box key={child.id} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Box sx={{ width: 2, height: 20, bgcolor: 'grey.400', mt: -2 }} />
                  <TreeNode node={child} onNodeClick={onNodeClick} />
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default TreeNode;
