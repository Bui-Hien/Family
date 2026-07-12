import { Handle, Position } from 'reactflow';
import { Box, Card, CardContent, Typography, Avatar, Stack } from '@mui/material';
import { Gender } from '@/common/constants';

const FamilyNode = ({ data }) => {
  const { member, onNodeClick } = data;
  if (!member) return null;

  const mainGenderColor = member.gender === Gender.MALE ? 'info.main' : 'error.light';
  const spouseGenderColor = member.spouse 
    ? (member.spouse.gender === Gender.MALE ? 'info.main' : 'error.light')
    : 'grey.300';

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Handle 
        type="target" 
        position={Position.Top} 
        style={{ background: '#c5a059', width: 8, height: 8 }} 
      />

      <Stack direction="row" spacing={1.5} alignItems="center" sx={{ p: 0.5 }}>
        {/* Main Member Card */}
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
            '&:hover': {
              borderColor: 'primary.main',
            }
          }}
        >
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

        {/* Spouse Card if exists */}
        {member.spouse && (
          <>
            {/* Connection Link between Spouse */}
            <Box sx={{ width: 16, height: 2, bgcolor: 'grey.400' }} />
            
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
                '&:hover': {
                  borderColor: 'primary.main',
                }
              }}
            >
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
          </>
        )}
      </Stack>

      {member.children && member.children.length > 0 && (
        <Handle 
          type="source" 
          position={Position.Bottom} 
          style={{ background: '#c5a059', width: 8, height: 8 }} 
        />
      )}
    </Box>
  );
};

export default FamilyNode;
