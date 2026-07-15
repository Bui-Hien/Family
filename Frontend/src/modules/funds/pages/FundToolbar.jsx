import React from 'react';
import { Box, Typography, Stack, Button, Grid, Card, CardContent, Tabs, Tab } from '@mui/material';
import {
  Add as AddIcon,
  AccountBalanceWallet as WalletIcon,
  TrendingUp as IncomeIcon,
  TrendingDown as OutcomeIcon
} from '@mui/icons-material';
import { useFundStore } from '@/modules/funds/store/useFundStore';
import { UserRole } from '@/common/constants';
import HasPermission from '@/common/components/auth/HasPermission';

const FundToolbar = () => {
  const {
    report,
    funds,
    selectedFundId,
    setSelectedFundId,
    setOpenFundForm,
    setOpenTxForm,
    setEditingFund
  } = useFundStore();

  const handleOpenAddTx = () => {
    setOpenTxForm(true);
  };

  const handleOpenAddFund = () => {
    setEditingFund(null);
    setOpenFundForm(true);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography variant="h4" className="serif-title" sx={{ color: 'primary.main', mb: 0.5, fontSize: { xs: '1.5rem', md: '2.125rem' }, display: 'flex', alignItems: 'center', gap: 1 }}>
            <WalletIcon sx={{ fontSize: { xs: '1.75rem', md: '2.25rem' } }} /> Quỹ đóng góp dòng họ
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Quản lý ngân quỹ dòng tộc, các khoản thu đóng góp đóng quỹ và chi tiêu hoạt động
          </Typography>
        </Box>
        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
          <HasPermission roles={[UserRole.SYSTEM_ADMIN, UserRole.FAMILY_LEADER, UserRole.FAMILY_ADMIN]}>
            <Button variant="outlined" startIcon={<AddIcon />} onClick={handleOpenAddFund} size="medium">
              Tạo quỹ mới
            </Button>
          </HasPermission>
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenAddTx} size="medium">
            Thực hiện giao dịch
          </Button>
        </Stack>
      </Box>

      {/* Overview stats cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <Card className="hover-lift" sx={{ borderLeft: '5px solid', borderColor: 'primary.main' }}>
            <CardContent sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <WalletIcon sx={{ fontSize: 40, color: 'primary.main' }} />
              <Box>
                <Typography variant="body2" color="textSecondary">Tổng số dư ngân quỹ</Typography>
                <Typography variant="h5" sx={{ fontWeight: 700, mt: 0.5, color: 'primary.main' }}>
                  {report?.totalBalance ? report.totalBalance.toLocaleString('vi-VN') + ' ₫' : '0 ₫'}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card className="hover-lift" sx={{ borderLeft: '5px solid', borderColor: 'success.main' }}>
            <CardContent sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <IncomeIcon sx={{ fontSize: 40, color: 'success.main' }} />
              <Box>
                <Typography variant="body2" color="textSecondary">Tổng thu đóng đóng góp</Typography>
                <Typography variant="h5" sx={{ fontWeight: 700, mt: 0.5, color: 'success.main' }}>
                  {report?.totalIncome ? report.totalIncome.toLocaleString('vi-VN') + ' ₫' : '0 ₫'}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card className="hover-lift" sx={{ borderLeft: '5px solid', borderColor: 'error.main' }}>
            <CardContent sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <OutcomeIcon sx={{ fontSize: 40, color: 'error.main' }} />
              <Box>
                <Typography variant="body2" color="textSecondary">Tổng chi tiêu, hoạt động</Typography>
                <Typography variant="h5" sx={{ fontWeight: 700, mt: 0.5, color: 'error.main' }}>
                  {report?.totalOutcome ? report.totalOutcome.toLocaleString('vi-VN') + ' ₫' : '0 ₫'}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Funds selection tabs */}
      {funds.length > 0 && (
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
          <Tabs
            value={selectedFundId}
            onChange={(e, val) => setSelectedFundId(val)}
            variant="scrollable"
            scrollButtons="auto"
          >
            {funds.map((f) => (
              <Tab
                key={f.id}
                label={`${f.name} (${f.currentBalance ? f.currentBalance.toLocaleString('vi-VN') : '0'} ₫)`}
                value={f.id}
              />
            ))}
          </Tabs>
        </Box>
      )}
    </Box>
  );
};

export default FundToolbar;
