import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { getIn } from 'formik';
import Pagination from '@mui/material/Pagination';
import { Box, Card, CardContent, CircularProgress, Stack, Typography, useMediaQuery, useTheme } from '@mui/material';

const CommonTable = ({
    // Data & Columns
    data = [],
    columns = [],

    // Callbacks & Interaction
    onRowClick,
    doubleClick,
    chooseRow,

    // Styling & Layout
    titleNodata,
    className = '',
    style = {},
    maxHeight = '600px',
    minWidth = 'auto',
    getRowStyle = () => ({}),

    // Selection Props
    selectType, // 'single' | 'multi' | null
    selection = false, // MRT-style selection fallback
    initStateRow = [],
    handleChangeSelectedRows,
    resetSelectedRows,
    valueCompare = 'id',
    objectDisable = null,
    selectedRow = () => false,

    // Row & Footer Custom Extensions
    showOrdinalNumbers = true,
    firstDetailRow,
    rowChild,
    finalDetailRow,
    finalRow,
    finalRowDetial,
    rowEndElement,

    // Pagination Props (MRT-style Compatibility & Custom)
    loading = false,
    totalElements,
    rowCount,
    pageIndex = 0,
    pageSize = 10,
    manualPagination = false,
    onPaginationChange,
    dataPagination,
    isPaginationHeader = false,
    stylePagination = '',

    // Mobile Card Layout Props
    mobileColumns, // { primary: 'fieldName', secondary: ['field1', 'field2'] } — controls card layout
    mobileCardAction, // (row) => JSX — custom action renderer for mobile cards
    hideMobileCard = false, // force table even on mobile

    ...props
}) => {
    const { t } = useTranslation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [selectedRows, setSelectedRows] = useState(initStateRow);

    // Local pagination state for client-side pagination
    const [localPageIndex, setLocalPageIndex] = useState(0);
    const [localPageSize, setLocalPageSize] = useState(10);

    const activeSelectType = selectType || (selection ? 'multi' : null);
    const activePageIndex = manualPagination ? (pageIndex !== undefined ? pageIndex : 0) : localPageIndex;
    const activePageSize = manualPagination ? (pageSize !== undefined ? pageSize : 10) : localPageSize;

    // Resolve column definitions from both MRT style (accessorKey, header, Cell) and reference TableComponent style (field, title, render)
    const resolvedColumns = useMemo(() => {
        return columns.map((col, index) => {
            const field = col.accessorKey || col.field || col.id || `col-${index}`;
            const title = col.header !== undefined ? col.header : (typeof col.title === 'function' ? col.title() : col.title);
            const isHidden = col.isHide || col.hide || false;

            return {
                ...col,
                field,
                title,
                isHide: isHidden,
                align: col.align || 'left',
                width: col.width || col.size || 'auto'
            };
        });
    }, [columns]);

    const visibleColumnsCount = resolvedColumns.filter((col) => !col.isHide).length;
    const totalColumns = (activeSelectType ? 1 : 0) + (showOrdinalNumbers ? 1 : 0) + visibleColumnsCount;
    const align = resolvedColumns[0]?.align || 'left';

    // Selection Handlers
    const handleSelectAll = (e) => {
        if (e?.target?.checked) {
            let list = data.filter(
                (item) => !selectedRows?.find((sl) => sl?.[valueCompare] === item?.[valueCompare])
            );
            setSelectedRows([...(selectedRows || []), ...list]);
        } else {
            let list = selectedRows.filter(
                (item) => !data?.find((sl) => sl?.[valueCompare] === item?.[valueCompare])
            );
            setSelectedRows(list);
        }
    };

    const handleSelectRow = (row, isChecked) => {
        if (activeSelectType === 'multi') {
            if (isChecked) {
                setSelectedRows([...selectedRows, row]);
            } else {
                setSelectedRows(selectedRows.filter((selectedRow) => selectedRow?.[valueCompare] !== row?.[valueCompare]));
            }
        } else if (activeSelectType === 'single') {
            if (isChecked) {
                setSelectedRows([row]);
            } else {
                setSelectedRows([]);
            }
        }
    };

    useEffect(() => {
        if (initStateRow?.length > 0) {
            setSelectedRows(initStateRow);
        }
    }, [initStateRow]);

    const prevSelectedRowsRef = useRef(selectedRows);

    useEffect(() => {
        if (prevSelectedRowsRef.current !== selectedRows) {
            if (handleChangeSelectedRows) {
                handleChangeSelectedRows(selectedRows);
            }
            prevSelectedRowsRef.current = selectedRows;
        }
    }, [selectedRows, handleChangeSelectedRows]);

    useEffect(() => {
        if (resetSelectedRows && selectedRows !== initStateRow) {
            setSelectedRows(initStateRow);
        }
    }, [resetSelectedRows, selectedRows, initStateRow]);

    // Slice data if doing client-side pagination
    const paginatedData = useMemo(() => {
        if (manualPagination) {
            return data;
        }
        return data.slice(activePageIndex * activePageSize, (activePageIndex + 1) * activePageSize);
    }, [data, manualPagination, activePageIndex, activePageSize]);

    // Pagination calculations
    const totalCount = manualPagination
        ? (totalElements !== undefined ? totalElements : (rowCount !== undefined ? rowCount : data.length))
        : data.length;

    const totalPages = Math.ceil(totalCount / activePageSize);

    const defaultPagination = useMemo(() => {
        if (!manualPagination && data.length <= activePageSize) {
            return null;
        }
        return {
            count: totalPages,
            page: activePageIndex + 1,
            onChange: (event, page) => {
                const newPageIndex = page - 1;
                if (manualPagination && onPaginationChange) {
                    onPaginationChange({ pageIndex: newPageIndex, pageSize: activePageSize });
                } else {
                    setLocalPageIndex(newPageIndex);
                }
            }
        };
    }, [manualPagination, totalPages, activePageIndex, activePageSize, onPaginationChange, data.length]);

    const activePagination = dataPagination || defaultPagination;
    const finalNoDataText = titleNodata || t('noData') || 'Không có dữ liệu';

    // ============ MOBILE CARD LAYOUT ============
    const renderMobileCards = () => {
        if (paginatedData.length === 0) {
            return (
                <Box sx={{ textAlign: 'center', py: 6, color: 'text.secondary' }}>
                    <Box sx={{ fontSize: 48, mb: 1.5, opacity: 0.5 }}>📭</Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'text.primary', mb: 0.5 }}>
                        {finalNoDataText}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '13px' }}>
                        Hãy thử thay đổi bộ lọc hoặc thêm mới dữ liệu.
                    </Typography>
                </Box>
            );
        }

        // Determine primary field (shown as card title)
        const primaryField = mobileColumns?.primary || resolvedColumns.find(c => !c.isHide)?.field;
        // Determine secondary fields (shown as details)
        const secondaryFields = mobileColumns?.secondary
            || resolvedColumns.filter(c => !c.isHide && c.field !== primaryField && c.field !== 'actions' && c.id !== 'actions').map(c => c.field);

        return (
            <Stack spacing={1.5}>
                {paginatedData.map((row, index) => {
                    const primaryCol = resolvedColumns.find(c => c.field === primaryField);
                    const primaryValue = getIn(row, primaryField);

                    // Render primary cell content
                    let primaryContent;
                    if (primaryCol?.Cell) {
                        primaryContent = primaryCol.Cell({
                            cell: { getValue: () => primaryValue },
                            row: { original: row },
                            value: primaryValue,
                            index
                        });
                    } else {
                        primaryContent = primaryValue;
                    }

                    // Render action column if exists
                    const actionCol = resolvedColumns.find(c => c.id === 'actions' || c.field === 'actions');
                    let actionContent = null;
                    if (mobileCardAction) {
                        actionContent = mobileCardAction(row, index);
                    } else if (actionCol?.Cell) {
                        actionContent = actionCol.Cell({
                            cell: { getValue: () => null },
                            row: { original: row },
                            value: null,
                            index
                        });
                    }

                    return (
                        <Card
                            key={row[valueCompare] || index}
                            variant="outlined"
                            sx={{
                                borderRadius: 2,
                                transition: 'all 0.2s ease',
                                borderLeft: '3px solid transparent',
                                '&:active': { borderLeftColor: 'secondary.main', bgcolor: 'rgba(140, 29, 64, 0.02)' },
                                cursor: onRowClick ? 'pointer' : 'default',
                            }}
                            onClick={() => onRowClick && onRowClick(row)}
                        >
                            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                                {/* STT + Primary Content */}
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                                    <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                                        {showOrdinalNumbers && (
                                            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                                                #{activePageIndex * activePageSize + index + 1}
                                            </Typography>
                                        )}
                                        <Box sx={{ fontWeight: 600, fontSize: '0.95rem' }}>
                                            {primaryContent}
                                        </Box>
                                    </Box>
                                    {/* Actions */}
                                    {actionContent && (
                                        <Box sx={{ flexShrink: 0, ml: 1 }} onClick={(e) => e.stopPropagation()}>
                                            {actionContent}
                                        </Box>
                                    )}
                                </Box>

                                {/* Secondary Fields */}
                                <Stack spacing={0.5}>
                                    {secondaryFields.slice(0, 4).map((fieldName) => {
                                        const col = resolvedColumns.find(c => c.field === fieldName);
                                        if (!col || col.isHide) return null;

                                        const cellValue = getIn(row, fieldName);
                                        let cellContent;
                                        if (col.Cell) {
                                            cellContent = col.Cell({
                                                cell: { getValue: () => cellValue },
                                                row: { original: row },
                                                value: cellValue,
                                                index
                                            });
                                        } else {
                                            cellContent = cellValue;
                                        }

                                        return (
                                            <Box key={fieldName} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Typography variant="caption" color="text.secondary" sx={{ minWidth: 80, fontWeight: 500 }}>
                                                    {col.title}:
                                                </Typography>
                                                <Box sx={{ fontSize: '0.8rem', color: 'text.primary', minWidth: 0, overflow: 'hidden' }}>
                                                    {cellContent ?? '-'}
                                                </Box>
                                            </Box>
                                        );
                                    })}
                                </Stack>
                            </CardContent>
                        </Card>
                    );
                })}
            </Stack>
        );
    };

    // ============ RENDER ============
    const showMobileLayout = isMobile && !hideMobileCard;

    return (
        <div className={`table-root ${className}`} style={showMobileLayout ? { border: 'none', boxShadow: 'none', background: 'transparent' } : {}}>
            {/* Loading Indicator */}
            {loading && (
                <Box
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: (theme) => theme.palette.mode === 'dark' ? 'rgba(18, 18, 18, 0.6)' : 'rgba(255, 255, 255, 0.6)',
                        zIndex: 2,
                        backdropFilter: 'blur(2px)',
                        transition: 'all 0.3s ease',
                    }}
                >
                    <CircularProgress color="primary" />
                </Box>
            )}

            {Boolean(isPaginationHeader) && (
                <div className="flex-wrap justify-between p-2">
                    <div>
                        {selectedRows?.length > 0 && (
                            <div className="flex align-center p-2 gap-1" style={{ fontWeight: '500' }}>
                                <span className="text-blue" style={{ flexWrap: 'nowrap' }}>
                                    {selectedRows?.length}
                                </span>{' '}
                                mục đã được chọn
                            </div>
                        )}
                    </div>
                    {Boolean(activePagination) && <Pagination {...activePagination} />}
                </div>
            )}

            {/* Mobile Card View */}
            {showMobileLayout && renderMobileCards()}

            {/* Desktop Table View */}
            <div style={{ overflow: 'auto', maxHeight: maxHeight ? maxHeight : 'auto', display: showMobileLayout ? 'none' : 'block' }}>
                <table className="table-container" style={{ minWidth: minWidth ? minWidth : 'auto', ...style }}>
                    <thead>
                        <tr className="row-table-header">
                            {activeSelectType === 'multi' && (
                                <th align="center" width="28px" style={{ boxSizing: 'content-box' }}>
                                    <input
                                        type="checkbox"
                                        onChange={handleSelectAll}
                                        checked={
                                            paginatedData?.every((item) =>
                                                selectedRows?.find((sl) => sl?.[valueCompare] === item?.[valueCompare])
                                            ) && paginatedData?.length > 0
                                        }
                                    />
                                </th>
                            )}

                            {activeSelectType === 'single' && <th></th>}
                            {showOrdinalNumbers && (
                                <th align={align} width="28px" style={{ boxSizing: 'content-box' }}>
                                    STT
                                </th>
                            )}
                            {resolvedColumns.map(
                                (item, idx) =>
                                    !item?.isHide && (
                                        <th key={idx} align="center" width={item?.width} style={{ wordWrap: 'break-word' }}>
                                            {item?.title}
                                        </th>
                                    )
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedData && paginatedData.length > 0 && firstDetailRow && firstDetailRow}
                        {paginatedData && paginatedData.length > 0 ? (
                            <>
                                {paginatedData.map((row, index) => {
                                    const isRowSelected = selectedRow(row) ||
                                        selectedRows.some((selectedRow) => selectedRow?.[valueCompare] === row?.[valueCompare]);
                                    const isRowChosen = chooseRow && chooseRow?.[valueCompare] === row?.[valueCompare];

                                    return (
                                        <tr
                                            key={row[valueCompare] || index}
                                            className={clsx(
                                                'row-table-body pointer row-selection',
                                                isRowChosen && 'row-choose',
                                                isRowSelected && 'row-selected'
                                            )}
                                            onDoubleClick={() => {
                                                if (doubleClick) {
                                                    doubleClick(row, index);
                                                }
                                            }}
                                            onClick={() => {
                                                if (onRowClick) {
                                                    onRowClick(row);
                                                }
                                            }}
                                        >
                                            {activeSelectType === 'multi' && (
                                                <td
                                                    align="center"
                                                    style={getRowStyle(row)}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        const isSelected = selectedRows.some((item) => item?.[valueCompare] === row?.[valueCompare]);
                                                        const disabled = objectDisable
                                                            ? selectedRows.some(
                                                                (selectedRow) =>
                                                                    selectedRow?.[valueCompare] === row?.[valueCompare] &&
                                                                    selectedRow?.[objectDisable?.field] === objectDisable?.value
                                                            )
                                                            : false;
                                                        if (!disabled) {
                                                            handleSelectRow(row, !isSelected);
                                                        }
                                                    }}
                                                >
                                                    <input
                                                        type="checkbox"
                                                        className="pointer"
                                                        checked={selectedRows.some((selectedRow) => selectedRow?.[valueCompare] === row?.[valueCompare])}
                                                        onChange={(e) => handleSelectRow(row, e?.target?.checked)}
                                                        onClick={(e) => e.stopPropagation()}
                                                        disabled={
                                                            objectDisable
                                                                ? selectedRows.some(
                                                                    (selectedRow) =>
                                                                        selectedRow?.[valueCompare] === row?.[valueCompare] &&
                                                                        selectedRow?.[objectDisable?.field] === objectDisable?.value
                                                                )
                                                                : false
                                                        }
                                                    />
                                                </td>
                                            )}
                                            {activeSelectType === 'single' && (
                                                <td
                                                    align="center"
                                                    style={getRowStyle(row)}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        const isSelected = selectedRows.some((item) => item?.[valueCompare] === row?.[valueCompare]);
                                                        const disabled = objectDisable
                                                            ? selectedRows.some(
                                                                (selectedRow) =>
                                                                    selectedRow?.[valueCompare] === row?.[valueCompare] &&
                                                                    selectedRow?.[objectDisable?.field] === objectDisable?.value
                                                            )
                                                            : false;
                                                        if (!disabled) {
                                                            handleSelectRow(row, !isSelected);
                                                        }
                                                    }}
                                                >
                                                    <input
                                                        type="radio"
                                                        className="pointer"
                                                        checked={selectedRows?.[0]?.[valueCompare] === row?.[valueCompare]}
                                                        onChange={(e) => handleSelectRow(row, e?.target?.checked)}
                                                        onClick={(e) => e.stopPropagation()}
                                                    />
                                                </td>
                                            )}
                                            {showOrdinalNumbers && (
                                                <td align={align} style={getRowStyle(row)}>
                                                    {activePageIndex * activePageSize + index + 1}
                                                </td>
                                            )}
                                            {resolvedColumns.map((item, number) => {
                                                if (item?.isHide) return null;

                                                // Support both Cell (MRT-style) and render (reference component style)
                                                let cellContent;
                                                const cellValue = getIn(row, item?.field);

                                                if (item?.Cell) {
                                                    cellContent = item.Cell({
                                                        cell: { getValue: () => cellValue },
                                                        row: { original: row },
                                                        value: cellValue,
                                                        index
                                                    });
                                                } else if (item?.render) {
                                                    cellContent = item.render(row, index);
                                                } else {
                                                    cellContent = cellValue;
                                                }

                                                return (
                                                    <td key={number} align={item?.align} width={item?.width} style={getRowStyle(row)}>
                                                        {cellContent}
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    );
                                })}
                                {rowChild}
                                {finalRow && (
                                    <tr className="w-100 bg-green-black">
                                        <td colSpan={totalColumns || 0} align="right">
                                            <h5>
                                                <strong>{finalRow}</strong>
                                            </h5>
                                        </td>
                                    </tr>
                                )}
                                {finalDetailRow && finalDetailRow}
                            </>
                        ) : (
                            <tr className="row-table-body" style={{ background: 'transparent' }}>
                                <td colSpan={totalColumns || 0} align="center" style={{ padding: '48px 16px' }}>
                                    <Box sx={{ textAlign: 'center', color: 'text.secondary' }}>
                                        <Box sx={{ fontSize: 48, mb: 1.5, opacity: 0.5 }}>📭</Box>
                                        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'text.primary', mb: 0.5 }}>
                                            {finalNoDataText}
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '13px' }}>
                                            Hãy thử thay đổi bộ lọc hoặc thêm mới dữ liệu.
                                        </Typography>
                                    </Box>
                                </td>
                            </tr>
                        )}

                        {!!rowEndElement && rowEndElement}
                        {paginatedData && paginatedData.length > 0 && finalRowDetial && finalRowDetial}
                    </tbody>
                </table>
            </div>

            <div className={`flex-wrap justify-between align-center p-2 ${stylePagination}`}>
                <div className="flex-wrap align-center gap-1">
                    {selectedRows?.length > 0 && activeSelectType === 'multi' && (
                        <div className="flex align-center p-1 gap-1" style={{ fontWeight: '500' }}>
                            <span style={{ flexWrap: 'nowrap' }}> {selectedRows?.length}</span> mục đã chọn
                        </div>
                    )}
                    {selectedRows?.length > 0 && (
                        <b className="text-danger pointer" onClick={() => setSelectedRows([])}>
                            <i>(Bỏ chọn)</i>
                        </b>
                    )}
                </div>
                {Boolean(activePagination) && <Pagination {...activePagination} />}
            </div>
        </div>
    );
};

export default CommonTable;
