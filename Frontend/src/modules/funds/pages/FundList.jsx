import React from 'react';
import {
  Card,
  CardContent,
  Stack,
  Box,
  Typography,
  Button,
  Chip,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Info as InfoIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  TrendingUp as IncomeIcon,
  TrendingDown as OutcomeIcon,
  Check as CheckIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { useFundStore } from '@/modules/funds/store/useFundStore';
import useAuthStore from '@/stores/authStore';
import CommonTable from '@/common/components/table/CommonTable';
import CommonChip from '@/common/components/display/CommonChip';
import { UserRole, TransactionType, TransactionStatus } from '@/common/constants';
import HasPermission from '@/common/components/auth/HasPermission';

const FundList = () => {
  const {
    funds,
    selectedFundId,
    transactions,
    members,
    setOpenFundForm,
    setEditingFund,
    setDeleteFundId,
    setConfirmApprove
  } = useFundStore();

  const { user } = useAuthStore();
  const isManager = [UserRole.SYSTEM_ADMIN, UserRole.FAMILY_LEADER, UserRole.FAMILY_ADMIN].includes(user?.role);

  const currentSelectedFund = funds.find((f) => f.id === selectedFundId);

  const columns = [
    {
      accessorKey: 'transactionDate',
      header: 'Ngày thực hiện',
      Cell: ({ cell }) => (cell.getValue() ? new Date(cell.getValue()).toLocaleString('vi-VN') : '-'),
    },
    {
      accessorKey: 'profileId',
      header: 'Thành viên đóng góp/nhận',
      Cell: ({ cell }) => {
        const mId = cell.getValue();
        const member = members.find((m) => m.id === mId);
        return member ? member.fullName : 'Hội đồng dòng họ';
      },
    },
    {
      accessorKey: 'type',
      header: 'Loại',
      Cell: ({ cell }) => {
        const val = cell.getValue();
        return val === TransactionType.IN ? (
          <Chip icon={<IncomeIcon />} label="Thu (Đóng góp)" color="success" variant="outlined" size="small" />
        ) : (
          <Chip icon={<OutcomeIcon />} label="Chi (Chi tiêu)" color="error" variant="outlined" size="small" />
        );
      },
    },
    {
      accessorKey: 'amount',
      header: 'Số tiền',
      Cell: ({ cell, row }) => {
        const val = cell.getValue();
        const type = row.original.type;
        const color = type === TransactionType.IN ? 'success.main' : 'error.main';
        const prefix = type === TransactionType.IN ? '+' : '-';
        return (
          <Typography variant="body2" sx={{ fontWeight: 600, color }}>
            {prefix} {val ? val.toLocaleString('vi-VN') + ' ₫' : '0 ₫'}
          </Typography>
        );
      },
    },
    {
      accessorKey: 'status',
      header: 'Trạng thái',
      Cell: ({ cell }) => {
        const status = cell.getValue();
        let color = 'warning';
        let text = 'Chờ duyệt';
        if (status === TransactionStatus.APPROVED) {
          color = 'success';
          text = 'Đã duyệt';
        } else if (status === TransactionStatus.REJECTED) {
          color = 'error';
          text = 'Từ chối';
        }
        return <CommonChip label={text} color={color} />;
      },
    },
    {
      accessorKey: 'note',
      header: 'Nội dung chi tiết',
    },
    {
      id: 'actions',
      header: 'Thao tác duyệt',
      Cell: ({ row }) => {
        const { id, status } = row.original;
        if (status !== TransactionStatus.PENDING || !isManager) return '-';
        return (
          <Stack direction="row" spacing={1}>
            <Tooltip title="Phê duyệt">
              <IconButton
                size="small"
                color="success"
                onClick={() => setConfirmApprove({ id, status: TransactionStatus.APPROVED })}
              >
                <CheckIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Từ chối">
              <IconButton
                size="small"
                color="error"
                onClick={() => setConfirmApprove({ id, status: TransactionStatus.REJECTED })}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>
        );
      },
    },
  ];

  if (funds.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 8, color: 'text.secondary' }}>
        <Box sx={{ fontSize: 64, mb: 2, opacity: 0.4 }}>🪙</Box>
        <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
          Chưa cấu hình quỹ dòng họ
        </Typography>
        <Typography variant="body2">
          Hiện tại chưa có quỹ dòng họ nào được thiết lập. Vui lòng tạo quỹ mới để quản lý thu chi.
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {currentSelectedFund && (
        <Card sx={{ mb: 3, border: '1px solid', borderColor: 'divider', bgcolor: 'rgba(0, 0, 0, 0.01)' }} elevation={0}>
          <CardContent sx={{ py: 2, '&:last-child': { pb: 2 } }}>
            <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={2} sx={{ alignItems: { sm: 'center' } }}>
              <Box sx={{ flexGrow: 1 }}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <InfoIcon color="primary" sx={{ fontSize: '1.2rem' }} />
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    {currentSelectedFund.name}
                  </Typography>
                </Stack>
                <Typography variant="body2" color="textSecondary" sx={{ mt: 0.5 }}>
                  {currentSelectedFund.description || 'Không có mô tả chi tiết cho quỹ này.'}
                </Typography>
              </Box>
              <HasPermission roles={[UserRole.SYSTEM_ADMIN, UserRole.FAMILY_LEADER, UserRole.FAMILY_ADMIN]}>
                <Stack direction="row" spacing={1}>
                  <Button
                    size="small"
                    startIcon={<EditIcon />}
                    onClick={() => {
                      setEditingFund(currentSelectedFund);
                      setOpenFundForm(true);
                    }}
                  >
                    Sửa
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => setDeleteFundId(currentSelectedFund.id)}
                  >
                    Xóa quỹ
                  </Button>
                </Stack>
              </HasPermission>
            </Stack>
          </CardContent>
        </Card>
      )}

      <Typography variant="h6" className="serif-title" sx={{ color: 'primary.main', mb: 1.5, fontWeight: 600 }}>
        📊 Lịch sử giao dịch quỹ
      </Typography>
      <CommonTable
        columns={columns}
        data={transactions}
        mobileColumns={{
          primary: 'transactionDate',
          secondary: ['type', 'amount', 'status']
        }}
      />
    </Box>
  );
};

export default FundList;
