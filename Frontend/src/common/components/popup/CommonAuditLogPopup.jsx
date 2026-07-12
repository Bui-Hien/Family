import React, { useState, useEffect } from 'react';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, 
  Button, IconButton, Typography, Box, CircularProgress, 
  Paper, Stack, Divider 
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import HistoryIcon from '@mui/icons-material/History';
import api from '@/services/api';

const fieldNameMap = {
  // Common / Base
  id: 'ID',
  createdAt: 'Ngày tạo',
  updatedAt: 'Ngày cập nhật',
  deleted: 'Trạng thái xóa',
  active: 'Trạng thái hoạt động',

  // Profile
  fullName: 'Họ và tên',
  gender: 'Giới tính',
  birthDate: 'Ngày sinh',
  deathDate: 'Ngày mất',
  generation: 'Thế hệ (Đời thứ)',
  familyId: 'ID Dòng họ',
  branchCode: 'Chi họ',
  occupation: 'Nghề nghiệp',
  biography: 'Tiểu sử',
  achievements: 'Thành tích',
  fatherId: 'Cha',
  motherId: 'Mẹ',
  spouseId: 'Phối ngẫu',
  parentId: 'Cha/Mẹ đại diện',
  userId: 'Tài khoản liên kết',
  avatarUrl: 'Ảnh đại diện',
  additionalInfo: 'Thông tin bổ sung',

  // User
  username: 'Tên đăng nhập',
  email: 'Email',
  phoneNumber: 'Số điện thoại',
  role: 'Quyền hạn',
  enabled: 'Trạng thái hoạt động',
  locked: 'Trạng thái khóa',
};

const formatValue = (val, field) => {
  if (val === null || val === undefined || val === '') return '(trống)';
  if (val === 'true' || val === true) return 'Có / Kích hoạt';
  if (val === 'false' || val === false) return 'Không / Tắt';
  if (field === 'gender') {
    if (val === 'M' || val === 'MALE') return 'Nam';
    if (val === 'F' || val === 'FEMALE') return 'Nữ';
  }
  return String(val);
};

const CommonAuditLogPopup = ({ open, handleClose, entityName, entityId, entityDisplayName }) => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [pageIndex, setPageIndex] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const fetchLogs = async (page = 1) => {
    if (page === 1) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }
    try {
      const res = await api.post(`/audit-logs/${entityName}/${entityId}/page`, {
        pageIndex: page,
        pageSize: 5
      });
      if (res.data && res.data.success) {
        const paginatedData = res.data.data;
        const newLogs = paginatedData.content || [];
        setLogs((prev) => (page === 1 ? newLogs : [...prev, ...newLogs]));
        setHasMore(paginatedData.pageIndex < paginatedData.totalPages);
        setPageIndex(paginatedData.pageIndex);
      } else {
        if (page === 1) setLogs([]);
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error fetching audit logs', error);
      if (page === 1) setLogs([]);
      setHasMore(false);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    if (open && entityId && entityName) {
      fetchLogs(1);
    }
  }, [open, entityId, entityName]);

  const parseChanges = (data) => {
    if (!data) return [];
    try {
      const parsed = typeof data === 'string' ? JSON.parse(data) : data;
      if (parsed && Array.isArray(parsed.changes)) {
        return parsed.changes;
      }
    } catch (e) {
      // Ignore
    }
    return [];
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ pr: 6, display: 'flex', alignItems: 'center', gap: 1 }}>
        <HistoryIcon color="primary" />
        <Typography variant="h6" component="span" sx={{ fontWeight: 'bold' }}>
          Lịch sử thay đổi: {entityDisplayName || ''}
        </Typography>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{ position: 'absolute', right: 8, top: 8, color: 'grey.500' }}
          size="small"
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers sx={{ bgcolor: 'grey.50', p: 3 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress size={32} />
          </Box>
        ) : logs.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body2" color="text.secondary">
              Không có lịch sử thay đổi nào được ghi nhận.
            </Typography>
          </Box>
        ) : (
          <Stack spacing={3} sx={{ position: 'relative' }}>
            {/* Vertical timeline line helper */}
            <Box 
              sx={{ 
                position: 'absolute', 
                left: 19, 
                top: 8, 
                bottom: 8, 
                width: 2, 
                bgcolor: 'divider', 
                zIndex: 0 
              }} 
            />

            {logs.map((log) => {
              const changes = parseChanges(log.data);
              const formattedTime = new Date(log.createdAt).toLocaleString('vi-VN');
              
              return (
                <Box key={log.id} sx={{ display: 'flex', position: 'relative', zIndex: 1 }}>
                  {/* Circle dot on line */}
                  <Box 
                    sx={{ 
                      width: 40, 
                      display: 'flex', 
                      justifyContent: 'center', 
                      alignItems: 'flex-start',
                      pt: 0.5
                    }}
                  >
                    <Box 
                      sx={{ 
                        width: 10, 
                        height: 10, 
                        borderRadius: '50%', 
                        bgcolor: 'primary.main',
                        border: '2px solid white',
                        boxShadow: 1
                      }} 
                    />
                  </Box>

                  {/* Main log content */}
                  <Paper 
                    variant="outlined" 
                    sx={{ 
                      flex: 1, 
                      p: 2, 
                      ml: 1, 
                      borderRadius: 2,
                      bgcolor: 'background.paper',
                      boxShadow: '0px 1px 3px rgba(0,0,0,0.05)'
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1, flexWrap: 'wrap' }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                        Người sửa: {log.createdByName || 'Hệ thống'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {formattedTime}
                      </Typography>
                    </Box>
                    <Divider sx={{ my: 1 }} />
                    <Box sx={{ mt: 1 }}>
                      {changes.length === 0 ? (
                        <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                          Khởi tạo hoặc không có thay đổi giá trị cụ thể.
                        </Typography>
                      ) : (
                        <Stack spacing={1}>
                          {changes.map((ch, idx) => {
                            if (ch.changeType === 'NewObject') {
                              return (
                                <Typography key={idx} variant="body2" color="success.main" sx={{ fontWeight: 'bold' }}>
                                  🎉 Tạo mới đối tượng
                                </Typography>
                              );
                            }
                            if (ch.changeType === 'ObjectRemoved') {
                              return (
                                <Typography key={idx} variant="body2" color="error.main" sx={{ fontWeight: 'bold' }}>
                                  🗑️ Xóa đối tượng
                                </Typography>
                              );
                            }
                            
                            const fieldLabel = fieldNameMap[ch.property] || ch.property;
                            const oldVal = formatValue(ch.left, ch.property);
                            const newVal = formatValue(ch.right, ch.property);

                            return (
                              <Box key={idx} sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                <Typography variant="body2" sx={{ fontWeight: '600', color: 'text.secondary' }}>
                                  • {fieldLabel}:
                                </Typography>
                                <Typography variant="body2" sx={{ pl: 2, color: 'text.primary' }}>
                                  Thay đổi từ <strong style={{ color: '#d32f2f' }}>{oldVal}</strong> sang <strong style={{ color: '#2e7d32' }}>{newVal}</strong>
                                </Typography>
                              </Box>
                            );
                          })}
                        </Stack>
                      )}
                    </Box>
                  </Paper>
                </Box>
              );
            })}

            {/* Load More Button */}
            {hasMore && (
              <Box sx={{ display: 'flex', justifyContent: 'center', pt: 1, pl: 5 }}>
                <Button 
                  onClick={() => fetchLogs(pageIndex + 1)} 
                  disabled={loadingMore}
                  variant="outlined" 
                  size="small"
                  sx={{ borderRadius: 4 }}
                >
                  {loadingMore ? 'Đang tải...' : 'Xem thêm'}
                </Button>
              </Box>
            )}
          </Stack>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} variant="contained" size="small">
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CommonAuditLogPopup;
