import { Handle, Position } from 'reactflow';
import { Box, Card, CardContent, Typography, Avatar, Stack, Tooltip, IconButton, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Edit as EditIcon, Add as AddIcon } from '@mui/icons-material';
import { Gender } from '@/common/constants';

const FamilyNode = ({ data }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const { member, onNodeClick, onEditClick, onAddChildClick } = data;
  if (!member) return null;

  const hasSpouse = !!member.spouse;
  // Căn chỉnh vị trí handle trùng với tâm của Card thành viên chính bên trái
  // (rộng 140px trên desktop, nửa là 70px + border = 72px; rộng 110px trên mobile, nửa là 55px + border = 57px)
  const handleLeft = hasSpouse ? (isMobile ? 57 : 72) : '50%';

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
        style={{ background: theme.palette.secondary.main, width: 8, height: 8, left: handleLeft }} 
      />

      <Stack direction="row" spacing={1.5} alignItems="center" sx={{ p: 0.5 }}>
        {/* Main Member Card */}
        <Card
          onClick={() => onNodeClick(member.id)}
          className="hover-lift"
          sx={{
            width: { xs: 110, md: 140 },
            cursor: 'pointer',
            border: '2px solid',
            borderColor: mainGenderColor,
            textAlign: 'center',
            bgcolor: 'background.paper',
            boxShadow: 1,
            position: 'relative',
            overflow: 'visible',
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
                top: -28,
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                gap: 0.5,
                opacity: { xs: 1, md: 0 },
                visibility: { xs: 'visible', md: 'hidden' },
                transition: 'opacity 0.2s, visibility 0.2s',
                bgcolor: 'background.paper',
                borderRadius: 1,
                boxShadow: 2,
                p: '2px',
                zIndex: 10,
                border: '1px solid',
                borderColor: 'divider',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  height: '10px',
                }
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

          <CardContent sx={{ p: { xs: 0.5, md: 1 }, '&:last-child': { pb: { xs: 0.5, md: 1 } } }}>
            <Avatar src={member.avatarUrl} sx={{ mx: 'auto', mb: 0.5, width: { xs: 32, md: 44 }, height: { xs: 32, md: 44 }, border: '1px solid', borderColor: 'divider' }}>
              {member.fullName ? member.fullName.charAt(0) : '?'}
            </Avatar>
            <Typography variant="body2" sx={{ fontWeight: 600, fontSize: { xs: '0.65rem', md: '0.75rem' }, color: 'text.primary' }} noWrap>
              {member.fullName}
            </Typography>
            <Typography variant="caption" color="textSecondary" sx={{ display: 'block', fontSize: { xs: '0.55rem', md: '0.65rem' } }}>
              Đời thứ {member.generation}
            </Typography>
          </CardContent>
        </Card>

        {/* Spouse Card if exists */}
        {member.spouse && (
          <>
            {/* Connection Link between Spouse */}
            <Box sx={{ width: 16, height: 2, bgcolor: 'grey.400' }} />
            
            <Card
              onClick={() => onNodeClick(member.spouse.id)}
              className="hover-lift"
              sx={{
                width: { xs: 110, md: 140 },
                cursor: 'pointer',
                border: '2px solid',
                borderColor: spouseGenderColor,
                textAlign: 'center',
                bgcolor: 'background.paper',
                boxShadow: 1,
                position: 'relative',
                overflow: 'visible',
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
                    top: -28,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    display: 'flex',
                    gap: 0.5,
                    opacity: { xs: 1, md: 0 },
                    visibility: { xs: 'visible', md: 'hidden' },
                    transition: 'opacity 0.2s, visibility 0.2s',
                    bgcolor: 'background.paper',
                    borderRadius: 1,
                    boxShadow: 2,
                    p: '2px',
                    zIndex: 10,
                    border: '1px solid',
                    borderColor: 'divider',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      right: 0,
                      height: '10px',
                    }
                  }}
                >
                  <Tooltip title="Chỉnh sửa">
                    <IconButton 
                      size="small" 
                      onClick={(e) => { e.stopPropagation(); onEditClick({ ...member.spouse, spouseId: member.id }); }} 
                      color="primary"
                      sx={{ p: 0.5 }}
                    >
                      <EditIcon sx={{ fontSize: 13 }} />
                    </IconButton>
                  </Tooltip>
                </Box>
              )}

              <CardContent sx={{ p: { xs: 0.5, md: 1 }, '&:last-child': { pb: { xs: 0.5, md: 1 } } }}>
                <Avatar src={member.spouse.avatarUrl} sx={{ mx: 'auto', mb: 0.5, width: { xs: 32, md: 44 }, height: { xs: 32, md: 44 }, border: '1px solid', borderColor: 'divider' }}>
                  {member.spouse.fullName ? member.spouse.fullName.charAt(0) : '?'}
                </Avatar>
                <Typography variant="body2" sx={{ fontWeight: 600, fontSize: { xs: '0.65rem', md: '0.75rem' }, color: 'text.primary' }} noWrap>
                  {member.spouse.fullName}
                </Typography>
                <Typography variant="caption" color="textSecondary" sx={{ display: 'block', fontSize: { xs: '0.55rem', md: '0.65rem' } }}>
                  Vợ / Chồng
                </Typography>
              </CardContent>
            </Card>
          </>
        )}
      </Stack>

      {/* Handle Source nối từ dưới Card của Main Member xuống các con */}
      {member.children && member.children.length > 0 && (
        <Handle 
          type="source" 
          position={Position.Bottom} 
          style={{ background: theme.palette.secondary.main, width: 8, height: 8, left: handleLeft }} 
        />
      )}
    </Box>
  );
};

export default FamilyNode;
