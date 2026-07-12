import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Tooltip, IconButton, Stack } from '@mui/material';
import { Visibility as ViewIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useMemberStore } from '@/modules/members/store/useMemberStore';
import CommonTable from '@/common/components/table/CommonTable';
import { Gender } from '@/common/constants';

const formatLocalDate = (dateStr) => {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? dateStr : d.toLocaleDateString('vi-VN');
};

const MemberList = () => {
  const navigate = useNavigate();
  const {
    dataList,
    loading,
    totalElements,
    searchObject,
    setSearchObject,
    pagingMember,
    handleOpenCreateEdit,
    handleDelete
  } = useMemberStore();

  const columns = [
    {
      accessorKey: 'fullName',
      header: 'Họ và tên',
      Cell: ({ cell, row }) => (
        <Typography
          variant="body2"
          sx={{ fontWeight: 600, color: 'primary.main', cursor: 'pointer' }}
          onClick={() => navigate(`/members/${row.original.id}`)}
        >
          {cell.getValue()}
        </Typography>
      ),
    },
    {
      accessorKey: 'generation',
      header: 'Đời thứ',
      size: 100,
    },
    {
      accessorKey: 'gender',
      header: 'Giới tính',
      size: 100,
      Cell: ({ cell }) => (cell.getValue() === Gender.MALE ? 'Nam' : 'Nữ'),
    },
    {
      accessorKey: 'birthDate',
      header: 'Ngày sinh',
      Cell: ({ cell }) => formatLocalDate(cell.getValue()),
    },
    {
      accessorKey: 'deathDate',
      header: 'Trạng thái',
      Cell: ({ cell }) => (cell.getValue() ? <span style={{ color: '#d32f2f' }}>Đã mất</span> : <span style={{ color: '#2e7d32' }}>Còn sống</span>),
    },
    {
      id: 'actions',
      header: 'Thao tác',
      size: 150,
      Cell: ({ row }) => (
        <Stack direction="row" spacing={1}>
          <Tooltip title="Xem chi tiết">
            <IconButton size="small" onClick={() => navigate(`/members/${row.original.id}`)}>
              <ViewIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <IconButton size="small" onClick={() => handleOpenCreateEdit(row.original)} color="primary">
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Xóa">
            <IconButton size="small" onClick={() => handleDelete(row.original)} color="error">
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      ),
    },
  ];

  return (
    <CommonTable
      data={dataList}
      columns={columns}
      loading={loading}
      totalElements={totalElements}
      pageIndex={searchObject.pageIndex}
      pageSize={searchObject.pageSize}
      onPaginationChange={(updater) => {
        const nextState = typeof updater === 'function' ? updater({ pageIndex: searchObject.pageIndex - 1, pageSize: searchObject.pageSize }) : updater;
        setSearchObject({
          pageIndex: nextState.pageIndex + 1,
          pageSize: nextState.pageSize,
        });
        pagingMember();
      }}
    />
  );
};

export default MemberList;
