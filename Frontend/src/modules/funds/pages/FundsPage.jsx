import { useEffect } from 'react';
import { Box } from '@mui/material';
import { useFundStore } from '@/modules/funds/store/useFundStore';
import FundToolbar from './FundToolbar';
import FundFilter from './FundFilter';
import FundList from './FundList';
import FundForm from './FundForm';
import TransactionForm from './TransactionForm';
import CommonLoading from '@/common/components/display/CommonLoading';
import CommonConfirmDialog from '@/common/components/popup/CommonConfirmDialog';
import { TransactionStatus } from '@/common/constants';

const FundsPage = () => {
  const {
    loading,
    funds,
    fetchInitialData,
    resetStore,
    openFundForm,
    openTxForm,
    confirmApprove,
    deleteFundId,
    setConfirmApprove,
    setDeleteFundId,
    handleApproveTx,
    handleDeleteFund
  } = useFundStore();

  useEffect(() => {
    fetchInitialData();
    return () => {
      resetStore();
    };
  }, []);

  const onApproveConfirm = () => {
    handleApproveTx();
  };

  const onDeleteFundConfirm = () => {
    handleDeleteFund();
  };

  if (loading && funds.length === 0) {
    return <CommonLoading loading={loading} type="skeleton" rows={5} />;
  }

  return (
    <Box>
      <FundToolbar />
      <FundFilter />
      <FundList />

      {/* Forms */}
      {openFundForm && <FundForm />}
      {openTxForm && <TransactionForm />}

      {/* Confirm dialogues */}
      <CommonConfirmDialog
        open={!!confirmApprove.id}
        onClose={() => setConfirmApprove({ id: null, status: null })}
        onConfirm={onApproveConfirm}
        title={confirmApprove.status === TransactionStatus.APPROVED ? 'Phê duyệt giao dịch' : 'Từ chối giao dịch'}
        text={
          confirmApprove.status === TransactionStatus.APPROVED
            ? 'Bạn có chắc chắn duyệt giao dịch này? Số dư của quỹ sẽ được cập nhật tương ứng.'
            : 'Bạn có chắc chắn từ chối giao dịch này? Yêu cầu giao dịch sẽ bị loại bỏ.'
        }
      />

      <CommonConfirmDialog
        open={!!deleteFundId}
        onClose={() => setDeleteFundId(null)}
        onConfirm={onDeleteFundConfirm}
        title="Xóa quỹ dòng họ"
        text="Bạn có chắc chắn muốn xóa quỹ dòng họ này? Hành động này sẽ loại bỏ quỹ ra khỏi hệ thống nhưng không xóa lịch sử giao dịch. Thao tác không thể hoàn tác."
      />
    </Box>
  );
};

export default FundsPage;
