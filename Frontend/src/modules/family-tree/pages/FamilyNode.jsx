import { Handle, Position } from 'reactflow';
import { Box, Card, CardContent, Typography, Avatar, Stack, Tooltip, IconButton } from '@mui/material';
import { Edit as EditIcon, Add as AddIcon } from '@mui/icons-material';
import { Gender } from '@/common/constants';

const FamilyNode = ({ data }) => {
  const { member, onNodeClick, onEditClick, onAddChildClick } = data;
  if (!member) return null;

  const hasSpouse = !!member.spouse;
  // Căn chỉnh vị trí handle trùng với tâm của Card thành viên chính bên trái (rộng 140px, nửa là 70px + border = 72px)
  const handleLeft = hasSpouse ? 72 : '50%';

  const mainGenderColor = member.gender === Gender.MALE ? 'info.main' : 'error.light';
  const spouseGenderColor = member.spouse 
    ? (member.spouse.gender === Gender.MALE ? 'info.main' : 'error.light')
    : 'grey.300';

  // Chuỗi thông tin cha mẹ hiển thị khi hover
  const parentTooltip = (m) => {
    if (m.fatherName && m.motherName) return `Cha: ${m.fatherName} | Mẹ: ${m.motherName}`;
    if (m.fatherName) return `Cha: ${m.fatherName}`;
    if (m.motherName) return `Mẹ: ${m.motherName}`;
    return 'Không có thông tin cha mẹ';
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
      {/* Handle Target cắm thẳng vào Card của Main Member */}
      <Handle 
        type="target" 
        position={Position.Top} 
        style={{ background: '#c5a059', width: 8, height: 8, left: handleLeft }} 
      />

      <Stack direction="row" spacing={1.5} alignItems="center" sx={{ p: 0.5 }}>
        {/* Main Member Card */}
        <Tooltip title={parentTooltip(member)} arrow placement="top">
          <Card
            onClick={() => onNodeClick(member.id)}
            className="hover-lift"
            sx={{
              width: 140,
              cursor: 'pointer',
              border: '2px solid',
              borderColor: mainGenderColor,
              textAlign: 'center',
              bgcolor: 'background.paper',
              boxShadow: 1,
              position: 'relative',
              '&:hover': {
                borderColor: 'primary.main',
              },
              '&:hover .node-actions-main': {
                opacity: 1,
                visibility: 'visible',
              }
            }}
          >
            {/* Action buttons overlay */}
            {onEditClick && onAddChildClick && (
              <Box
                className="node-actions-main"
                sx={{
                  position: 'absolute',
                  top: -30,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  display: 'flex',
                  gap: 0.5,
                  opacity: 0,
                  visibility: 'hidden',
                  transition: 'opacity 0.2s, visibility 0.2s',
                  bgcolor: 'background.paper',
                  borderRadius: 1,
                  boxShadow: 2,
                  p: '2px',
                  zIndex: 10,
                  border: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <Tooltip title="Chỉnh sửa">
                  <IconButton 
                    size="small" 
                    onClick={(e) => { e.stopPropagation(); onEditClick(member); }} 
                    color="primary"
                    sx={{ p: 0.5 }}
                  >
                    <EditIcon sx={{ fontSize: 13 }} />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Thêm con">
                  <IconButton 
                    size="small" 
                    onClick={(e) => { e.stopPropagation(); onAddChildClick(member); }} 
                    color="success"
                    sx={{ p: 0.5 }}
                  >
                    <AddIcon sx={{ fontSize: 13 }} />
                  </IconButton>
                </Tooltip>
              </Box>
            )}

            <CardContent sx={{ p: 1, '&:last-child': { pb: 1 } }}>
              <Avatar src={member.avatarUrl} sx={{ mx: 'auto', mb: 0.5, width: 44, height: 44, border: '1px solid #eae3d2' }}>
                {member.fullName ? member.fullName.charAt(0) : '?'}
              </Avatar>
              <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.75rem', color: 'text.primary' }} noWrap>
                {member.fullName}
              </Typography>
              <Typography variant="caption" color="textSecondary" sx={{ display: 'block', fontSize: '0.65rem' }}>
                Đời thứ {member.generation}
              </Typography>
            </CardContent>
          </Card>
        </Tooltip>

        {/* Spouse Card if exists */}
        {member.spouse && (
          <>
            {/* Connection Link between Spouse */}
            <Box sx={{ width: 16, height: 2, bgcolor: 'grey.400' }} />
            
            <Tooltip title={parentTooltip(member.spouse)} arrow placement="top">
              <Card
                onClick={() => onNodeClick(member.spouse.id)}
                className="hover-lift"
                sx={{
                  width: 140,
                  cursor: 'pointer',
                  border: '2px solid',
                  borderColor: spouseGenderColor,
                  textAlign: 'center',
                  bgcolor: 'background.paper',
                  boxShadow: 1,
                  position: 'relative',
                  '&:hover': {
                    borderColor: 'primary.main',
                  },
                  '&:hover .node-actions-spouse': {
                    opacity: 1,
                    visibility: 'visible',
                  }
                }}
              >
                {/* Spouse Action buttons overlay */}
                {onEditClick && (
                  <Box
                    className="node-actions-spouse"
                    sx={{
                      position: 'absolute',
                      top: -30,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      display: 'flex',
                      gap: 0.5,
                      opacity: 0,
                      visibility: 'hidden',
                      transition: 'opacity 0.2s, visibility 0.2s',
                      bgcolor: 'background.paper',
                      borderRadius: 1,
                      boxShadow: 2,
                      p: '2px',
                      zIndex: 10,
                      border: '1px solid',
                      borderColor: 'divider',
                    }}
                  >
                    <Tooltip title="Chỉnh sửa">
                      <IconButton 
                        size="small" 
                        onClick={(e) => { e.stopPropagation(); onEditClick(member.spouse); }} 
                        color="primary"
                        sx={{ p: 0.5 }}
                      >
                        <EditIcon sx={{ fontSize: 13 }} />
                      </IconButton>
                    </Tooltip>
                  </Box>
                )}

                <CardContent sx={{ p: 1, '&:last-child': { pb: 1 } }}>
                  <Avatar src={member.spouse.avatarUrl} sx={{ mx: 'auto', mb: 0.5, width: 44, height: 44, border: '1px solid #eae3d2' }}>
                    {member.spouse.fullName ? member.spouse.fullName.charAt(0) : '?'}
                  </Avatar>
                  <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.75rem', color: 'text.primary' }} noWrap>
                    {member.spouse.fullName}
                  </Typography>
                  <Typography variant="caption" color="textSecondary" sx={{ display: 'block', fontSize: '0.65rem' }}>
                    Vợ / Chồng
                  </Typography>
                </CardContent>
              </Card>
            </Tooltip>
          </>
        )}
      </Stack>

      {/* Handle Source nối từ dưới Card của Main Member xuống các con */}
      {member.children && member.children.length > 0 && (
        <Handle 
          type="source" 
          position={Position.Bottom} 
          style={{ background: '#c5a059', width: 8, height: 8, left: handleLeft }} 
        />
      )}
    </Box>
  );
};

export default FamilyNode;
