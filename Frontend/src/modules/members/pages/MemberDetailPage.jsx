import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Card, CardContent, Typography, Grid, Avatar, Button, Divider, List, ListItem, ListItemText, Stack } from '@mui/material';
import { ArrowBack as BackIcon, Edit as EditIcon } from '@mui/icons-material';
import memberService from '@/modules/members/services/memberService';
import useUiStore from '@/stores/uiStore';
import CommonLoading from '@/common/components/display/CommonLoading';
import CommonBreadcrumb from '@/common/components/layout/CommonBreadcrumb';
import { Gender } from '@/common/constants';

const formatLocalDate = (dateStr) => {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? dateStr : d.toLocaleDateString('vi-VN');
};

const MemberDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [father, setFather] = useState(null);
  const [mother, setMother] = useState(null);
  const [spouse, setSpouse] = useState(null);
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfileData = async () => {
      setLoading(true);
      try {
        const res = await memberService.getById(id);
        if (res.success && res.data) {
          const currentProfile = res.data;
          setProfile(currentProfile);

          // Fetch father
          if (currentProfile.fatherId) {
            const fRes = await memberService.getById(currentProfile.fatherId).catch(() => null);
            if (fRes && fRes.success) setFather(fRes.data);
          } else if (currentProfile.parentId) {
            // Legacy fallback
            const pRes = await memberService.getById(currentProfile.parentId).catch(() => null);
            if (pRes && pRes.success) {
              if (pRes.data.gender === Gender.MALE) {
                setFather(pRes.data);
              } else {
                setMother(pRes.data);
              }
            }
          } else {
            setFather(null);
          }

          // Fetch mother
          if (currentProfile.motherId) {
            const mRes = await memberService.getById(currentProfile.motherId).catch(() => null);
            if (mRes && mRes.success) setMother(mRes.data);
          } else {
            setMother(null);
          }

          // Fetch spouse
          if (currentProfile.spouseId) {
            const sRes = await memberService.getById(currentProfile.spouseId).catch(() => null);
            if (sRes && sRes.success) setSpouse(sRes.data);
          } else {
            setSpouse(null);
          }

          // Fetch children (filter from all profiles locally)
          const allRes = await memberService.getLookup().catch(() => ({ success: false, data: [] }));
          if (allRes.success && allRes.data) {
            const kids = allRes.data.filter((p) => p.parentId === currentProfile.id);
            setChildren(kids);
          }
        }
      } catch (error) {
        useUiStore.getState().showNotification('Lỗi khi tải chi tiết thành viên', 'error');
      } finally {
        setLoading(false);
      }
    };

    loadProfileData();
  }, [id]);

  if (loading) {
    return <CommonLoading loading={loading} type="skeleton" rows={5} />;
  }

  if (!profile) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="error">Không tìm thấy thành viên này.</Typography>
        <Button startIcon={<BackIcon />} onClick={() => navigate('/members')} sx={{ mt: 2 }}>
          Quay lại danh sách
        </Button>
      </Box>
    );
  }

  const breadcrumbs = [
    { name: 'Thành viên', path: '/members' },
    { name: profile.fullName, path: `/members/${id}` },
  ];

  return (
    <Box>
      <CommonBreadcrumb routeSegments={breadcrumbs} />

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mt: 1.5, mb: 3 }}>
        <Box>
          <Typography variant="h4" className="serif-title" sx={{ color: 'primary.main', mb: 0.5 }}>
            🏛️ {profile.fullName}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Thông tin chi tiết thành viên dòng họ
          </Typography>
        </Box>
        <Button variant="outlined" startIcon={<BackIcon />} onClick={() => navigate('/members')}>
          Quay lại
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Profile Card */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 3 }}>
              <Avatar
                src={profile.avatarUrl}
                sx={{ width: 150, height: 150, mb: 2, border: '4px solid', borderColor: 'primary.light' }}
              >
                {profile.fullName.charAt(0)}
              </Avatar>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5, textAlign: 'center' }}>
                {profile.fullName}
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                Đời thứ {profile.generation} (Thế hệ {profile.generation})
              </Typography>

              <Divider sx={{ width: '100%', my: 2 }} />

              <Stack spacing={1.5} sx={{ width: '100%' }}>
                <Box>
                  <Typography variant="caption" color="textSecondary" sx={{ display: 'block' }}>
                    Giới tính
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {profile.gender === Gender.MALE ? 'Nam' : 'Nữ'}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="textSecondary" sx={{ display: 'block' }}>
                    Ngày sinh
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {formatLocalDate(profile.birthDate)}
                  </Typography>
                </Box>
                {profile.deathDate && (
                  <Box>
                    <Typography variant="caption" color="textSecondary" sx={{ display: 'block' }}>
                      Ngày mất
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500, color: 'error.main' }}>
                      {formatLocalDate(profile.deathDate)}
                    </Typography>
                  </Box>
                )}
                <Box>
                  <Typography variant="caption" color="textSecondary" sx={{ display: 'block' }}>
                    Nghề nghiệp
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {profile.occupation || '-'}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Biography & Relationships */}
        <Grid item xs={12} md={8}>
          <Stack spacing={3}>
            {/* Biography */}
            <Card>
              <CardContent>
                <Typography variant="h6" className="serif-title" sx={{ mb: 2, color: 'primary.main', fontWeight: 600 }}>
                  📖 Tiểu sử & Cuộc đời
                </Typography>
                <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                  {profile.biography || 'Chưa cập nhật tiểu sử chi tiết.'}
                </Typography>

                {profile.achievements && (
                  <>
                    <Divider sx={{ my: 3 }} />
                    <Typography variant="h6" className="serif-title" sx={{ mb: 2, color: 'primary.main', fontWeight: 600 }}>
                      🏆 Thành tích & Đóng góp nổi bật
                    </Typography>
                    <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                      {profile.achievements}
                    </Typography>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Additional Info */}
            {profile.additionalInfo && Object.keys(profile.additionalInfo).length > 0 && (
              <Card>
                <CardContent>
                  <Typography variant="h6" className="serif-title" sx={{ mb: 2, color: 'primary.main', fontWeight: 600 }}>
                    ℹ️ Thông tin bổ sung đặc biệt
                  </Typography>
                  <Grid container spacing={2}>
                    {Object.entries(profile.additionalInfo).map(([key, val]) => (
                      <Grid item xs={12} sm={6} key={key}>
                        <Typography variant="caption" color="textSecondary" sx={{ display: 'block', textTransform: 'capitalize' }}>
                          {key}
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {typeof val === 'object' ? JSON.stringify(val) : String(val)}
                        </Typography>
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </Card>
            )}

            {/* Relationships */}
            <Card>
              <CardContent>
                <Typography variant="h6" className="serif-title" sx={{ mb: 2, color: 'primary.main', fontWeight: 600 }}>
                  👪 Quan hệ gia đình
                </Typography>
                <Grid container spacing={2}>
                  {/* Cha */}
                  <Grid item xs={12} sm={3}>
                    <Typography variant="subtitle2" color="textSecondary" sx={{ mb: 1 }}>
                      Cha
                    </Typography>
                    {father ? (
                      <Button
                        variant="outlined"
                        fullWidth
                        sx={{ justifyContent: 'flex-start', py: 1 }}
                        onClick={() => navigate(`/members/${father.id}`)}
                      >
                        <Avatar sx={{ mr: 1, width: 32, height: 32, fontSize: '12px' }}>{father.fullName.charAt(0)}</Avatar>
                        <Box sx={{ textAlign: 'left', minWidth: 0 }}>
                          <Typography variant="body2" noWrap sx={{ fontWeight: 600 }}>{father.fullName}</Typography>
                          <Typography variant="caption" color="textSecondary">Thế hệ {father.generation}</Typography>
                        </Box>
                      </Button>
                    ) : (
                      <Typography variant="body2" color="textSecondary">Chưa có thông tin</Typography>
                    )}
                  </Grid>

                  {/* Mẹ */}
                  <Grid item xs={12} sm={3}>
                    <Typography variant="subtitle2" color="textSecondary" sx={{ mb: 1 }}>
                      Mẹ
                    </Typography>
                    {mother ? (
                      <Button
                        variant="outlined"
                        fullWidth
                        sx={{ justifyContent: 'flex-start', py: 1 }}
                        onClick={() => navigate(`/members/${mother.id}`)}
                      >
                        <Avatar sx={{ mr: 1, width: 32, height: 32, fontSize: '12px' }}>{mother.fullName.charAt(0)}</Avatar>
                        <Box sx={{ textAlign: 'left', minWidth: 0 }}>
                          <Typography variant="body2" noWrap sx={{ fontWeight: 600 }}>{mother.fullName}</Typography>
                          <Typography variant="caption" color="textSecondary">Thế hệ {mother.generation}</Typography>
                        </Box>
                      </Button>
                    ) : (
                      <Typography variant="body2" color="textSecondary">Chưa có thông tin</Typography>
                    )}
                  </Grid>

                  {/* Vợ/Chồng */}
                  <Grid item xs={12} sm={3}>
                    <Typography variant="subtitle2" color="textSecondary" sx={{ mb: 1 }}>
                      Vợ / Chồng
                    </Typography>
                    {spouse ? (
                      <Button
                        variant="outlined"
                        fullWidth
                        sx={{ justifyContent: 'flex-start', py: 1 }}
                        onClick={() => navigate(`/members/${spouse.id}`)}
                      >
                        <Avatar sx={{ mr: 1, width: 32, height: 32, fontSize: '12px' }}>{spouse.fullName.charAt(0)}</Avatar>
                        <Box sx={{ textAlign: 'left', minWidth: 0 }}>
                          <Typography variant="body2" noWrap sx={{ fontWeight: 600 }}>{spouse.fullName}</Typography>
                          <Typography variant="caption" color="textSecondary">Thế hệ {spouse.generation}</Typography>
                        </Box>
                      </Button>
                    ) : (
                      <Typography variant="body2" color="textSecondary">Chưa có thông tin</Typography>
                    )}
                  </Grid>

                  {/* Con cái */}
                  <Grid item xs={12} sm={3}>
                    <Typography variant="subtitle2" color="textSecondary" sx={{ mb: 1 }}>
                      Con cái ({children.length})
                    </Typography>
                    {children.length > 0 ? (
                      <List disablePadding>
                        {children.map((child) => (
                          <ListItem key={child.id} disableGutters sx={{ py: 0.5 }}>
                            <Button
                              variant="outlined"
                              fullWidth
                              sx={{ justifyContent: 'flex-start', py: 1 }}
                              onClick={() => navigate(`/members/${child.id}`)}
                            >
                              <Avatar sx={{ mr: 1, width: 32, height: 32, fontSize: '12px' }}>{child.fullName.charAt(0)}</Avatar>
                              <Box sx={{ textAlign: 'left', minWidth: 0 }}>
                                <Typography variant="body2" noWrap sx={{ fontWeight: 600 }}>{child.fullName}</Typography>
                                <Typography variant="caption" color="textSecondary">Thế hệ {child.generation}</Typography>
                              </Box>
                            </Button>
                          </ListItem>
                        ))}
                      </List>
                    ) : (
                      <Typography variant="body2" color="textSecondary">Chưa có thông tin</Typography>
                    )}
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};

export default MemberDetailPage;
