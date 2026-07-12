import { useState } from 'react';
import { Stack, Tooltip, IconButton, FormControl, Select, MenuItem } from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon, History as HistoryIcon } from '@mui/icons-material';
import { useAdminStore } from '@/modules/admin/store/useAdminStore';
import CommonTable from '@/common/components/table/CommonTable';
import { UserRole } from '@/common/constants';
import CommonAuditLogPopup from '@/common/components/popup/CommonAuditLogPopup';

const AdminList = () => {
  const {
    dataList,
    loading,
    totalElements,
    searchObject,
    members,
    setSearchObject,
    handleOpenCreateEdit,
    handleDelete,
    changeRole,
  } = useAdminStore();

  const [historyOpen, setHistoryOpen] = useState(false);
  const [selectedEntity, setSelectedEntity] = useState({ id: null, name: '' });

  const columns = [
    {
      accessorKey: 'username',
      header: 'Tên đăng nhập',
    },
    {
      accessorKey: 'fullName',
      header: 'Họ và tên',
    },
    {
      accessorKey: 'email',
      header: 'Email',
    },
    {
      accessorKey: 'phoneNumber',
      header: 'Số điện thoại',
      Cell: ({ cell }) => cell.getValue() || '-',
    },
    {
      accessorKey: 'profileId',
      header: 'Hồ sơ thành viên',
      Cell: ({ cell }) => {
        const pId = cell.getValue();
        const profile = members.find((m) => m.id === pId);
        return profile ? `${profile.fullName} (Đời thứ ${profile.generation})` : '-';
      },
    },
    {
      accessorKey: 'role',
      header: 'Quyền hạn',
      Cell: ({ cell, row }) => {
        const currentRole = cell.getValue();
        const handleRoleChange = (event) => {
          changeRole(row.original.id, event.target.value);
        };
        return (
          <FormControl size="small" variant="outlined" sx={{ minWidth: 180 }}>
            <Select value={currentRole || UserRole.VIEWER} onChange={handleRoleChange} sx={{ fontSize: '0.875rem' }}>
              <MenuItem value={UserRole.SYSTEM_ADMIN}>Admin hệ thống</MenuItem>
              <MenuItem value={UserRole.FAMILY_LEADER}>Trưởng họ</MenuItem>
              <MenuItem value={UserRole.FAMILY_ADMIN}>Quản trị dòng họ</MenuItem>
              <MenuItem value={UserRole.FAMILY_MEMBER}>Thành viên dòng họ</MenuItem>
              <MenuItem value={UserRole.VIEWER}>Khách xem</MenuItem>
            </Select>
          </FormControl>
        );
      }
    },
    {
      id: 'actions',
      header: 'Thao tác',
      Cell: ({ row }) => (
        <Stack direction="row" spacing={1}>
          <Tooltip title="Lịch sử thay đổi tài khoản">
            <IconButton
              size="small"
              onClick={() => {
                setSelectedEntity({ id: row.original.id, name: row.original.username });
                setHistoryOpen(true);
              }}
              color="info"
            >
              <HistoryIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Chỉnh sửa thông tin tài khoản">
            <IconButton size="small" onClick={() => handleOpenCreateEdit(row.original)} color="primary">
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Xóa tài khoản">
            <IconButton size="small" onClick={() => handleDelete(row.original)} color="error">
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      ),
    },
  ];

  return (
    <>
      <CommonTable
        data={dataList}
        columns={columns}
        loading={loading}
        totalElements={totalElements}
        pageIndex={searchObject.pageIndex - 1}
        pageSize={searchObject.pageSize}
        manualPagination
        rowCount={totalElements}
        onPaginationChange={(updater) => {
          const nextState = typeof updater === 'function'
            ? updater({ pageIndex: searchObject.pageIndex - 1, pageSize: searchObject.pageSize })
            : updater;
          setSearchObject({
            pageIndex: nextState.pageIndex + 1,
            pageSize: nextState.pageSize,
          });
        }}
      />
      <CommonAuditLogPopup
        open={historyOpen}
        handleClose={() => setHistoryOpen(false)}
        entityName="User"
        entityId={selectedEntity.id}
        entityDisplayName={selectedEntity.name}
      />
    </>
  );
};

export default AdminList;
