import React, { useCallback, useEffect, useRef, useState, useMemo } from 'react';
import { useField, useFormikContext } from 'formik';
import { Autocomplete, CircularProgress, TextField } from '@mui/material';
import RequiredLabel from './RequiredLabel';

const PAGE_SIZE = 20;
const DEBOUNCE_MS = 400;

// ─── Custom Hook: Giữ stable reference cho searchObject tránh re-render vô tận ────
function useStableObject(obj) {
    const ref = useRef(obj);
    if (JSON.stringify(obj) !== JSON.stringify(ref.current)) {
        ref.current = obj;
    }
    return ref.current;
}

const CommonPagingAutocomplete = ({
                                      name,
                                      label,
                                      required = false,
                                      api,
                                      searchObject = {},
                                      allowLoadOptions = true,
                                      clearOptionOnClose = false,
                                      displayLabel = 'name',
                                      displayValue = 'id',
                                      multiple = false,
                                      disabled = false,
                                      readOnly = false,
                                      size = 'small',
                                      fullWidth = true,
                                      handleChange,
                                      getOptionDisabled,
                                      ...otherProps
                                  }) => {
    // 1. Dùng chuẩn useField thay vì FastField cồng kềnh
    const [field, meta] = useField(name);
    const { setFieldValue } = useFormikContext();

    const [options, setOptions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [keyword, setKeyword] = useState('');

    // 2. Gom toàn bộ State dùng cho Scroll vào 1 Ref duy nhất (Triệt tiêu re-render thừa)
    const scrollState = useRef({
        page: 1,
        totalPage: 1,
        loading: false,
        keyword: '',
        didOpen: false
    });

    const debounceRef = useRef(null);
    const stableSearchObject = useStableObject(searchObject);
    const isError = Boolean(meta.touched && meta.error);

    // ─── Normalize API Response ───────────────────────────────────────────────
    const extractPage = useCallback((response) => {
        const data = response?.data?.content !== undefined ? response.data : response?.data?.data;
        return {
            content: data?.content ?? [],
            totalPages: data?.totalPages ?? 1,
        };
    }, []);

    // ─── Fetch API Core ───────────────────────────────────────────────────────
    const fetchOptions = useCallback(
        async (isNextPage = false, kw = '') => {
            if (!api || !allowLoadOptions) return;

            const currentPage = isNextPage ? scrollState.current.page + 1 : 1;

            setLoading(true);
            scrollState.current.loading = true;

            try {
                const res = await api({
                    ...stableSearchObject,
                    pageIndex: currentPage,
                    pageSize: PAGE_SIZE,
                    keyword: kw
                });

                const { content, totalPages } = extractPage(res);

                setOptions(prev => isNextPage ? [...prev, ...content] : content);
                scrollState.current.page = currentPage;
                scrollState.current.totalPage = totalPages;

            } catch (error) {
                console.error("Lỗi tải options:", error);
                if (!isNextPage) setOptions([]);
            } finally {
                setLoading(false);
                scrollState.current.loading = false;
            }
        },
        [api, allowLoadOptions, stableSearchObject, extractPage]
    );

    // ─── Effect: Re-fetch khi keyword thay đổi ─────────────────────────────
    useEffect(() => {
        if (open && allowLoadOptions) {
            scrollState.current.keyword = keyword;
            fetchOptions(false, keyword);
        }
    }, [keyword, open, stableSearchObject, fetchOptions, allowLoadOptions]);

    // ─── Handlers Mở/Đóng ─────────────────────────────────────────────────────
    const handleOpen = useCallback(() => {
        if (readOnly) return;
        setOpen(true);
        if (!scrollState.current.didOpen && allowLoadOptions) {
            fetchOptions(false, scrollState.current.keyword);
            scrollState.current.didOpen = true;
        }
    }, [readOnly, allowLoadOptions, fetchOptions]);

    const handleClose = useCallback(() => {
        setOpen(false);
        if (debounceRef.current) clearTimeout(debounceRef.current);
        setKeyword('');
        scrollState.current.keyword = '';

        if (clearOptionOnClose) {
            setOptions([]);
            scrollState.current.page = 1;
            scrollState.current.totalPage = 1;
            scrollState.current.didOpen = false;
        }
    }, [clearOptionOnClose]);

    // ─── Handler Nhập liệu (Debounce) ─────────────────────────────────────────
    const handleInputChange = useCallback((_, value) => {
        if (readOnly) return;
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            setKeyword(value ?? '');
        }, DEBOUNCE_MS);
    }, [readOnly]);

    // ─── Tối ưu Scroll: Dùng biến từ scrollState Ref để tránh tái tạo hàm ────
    const handleScroll = useCallback((event) => {
        const el = event.currentTarget;
        const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight <= 8;

        const { page, totalPage, loading: isRefLoading, keyword: currentKw } = scrollState.current;

        if (atBottom && page < totalPage && !isRefLoading) {
            fetchOptions(true, currentKw);
        }
    }, [fetchOptions]);

    useEffect(() => () => { if (debounceRef.current) clearTimeout(debounceRef.current); }, []);

    // 3. Resolve Value (Kỹ thuật Mock Object: Fix lỗi trống input khi chưa load xong API)
    const resolvedValue = useMemo(() => {
        if (multiple) {
            const vals = Array.isArray(field.value) ? field.value : [];
            return vals.map(val => {
                const found = options.find(o => o[displayValue] === val);
                return found || { [displayValue]: val, [displayLabel]: '' };
            });
        }
        if (field.value == null || field.value === '') return null;
        const found = options.find(o => o[displayValue] === field.value);
        return found || { [displayValue]: field.value, [displayLabel]: '' };
    }, [field.value, multiple, options, displayValue, displayLabel]);

    // ─── Handler Submit ───────────────────────────────────────────────────────
    const defaultHandleChange = useCallback((_, newValue) => {
        if (readOnly) return;

        if (multiple) {
            const newValues = newValue ? newValue.map(item => typeof item === 'object' ? item[displayValue] : item) : [];
            setFieldValue(name, newValues);
        } else {
            const val = newValue ? (typeof newValue === 'object' ? newValue[displayValue] : newValue) : null;
            setFieldValue(name, val);
        }
    }, [readOnly, multiple, name, displayValue, setFieldValue]);

    const getOptionLabel = useCallback((option) => {
        if (!option) return '';
        if (typeof option === 'object') return String(option[displayLabel] ?? '');

        const match = options.find((o) => o[displayValue] === option);
        return match ? String(match[displayLabel]) : '';
    }, [displayLabel, displayValue, options]);

    // 4. Memoize khung TextField để tránh vẽ lại giao diện khi gõ phím
    const renderInput = useCallback((params) => (
        <TextField
            {...params}
            label={label ? <RequiredLabel label={label} required={required} /> : null}
            error={isError}
            helperText={isError ? meta.error : ''}
            size={size}
            fullWidth={fullWidth}
            InputLabelProps={{ shrink: true }}
            inputProps={{
                ...params.inputProps,
                autoComplete: 'off',
                readOnly,
                ...(readOnly && {
                    style: { color: 'rgba(0,0,0,0.87)', cursor: 'text', opacity: 1 }
                }),
            }}
            InputProps={{
                ...params.InputProps,
                ...(readOnly && {
                    style: { color: 'rgba(0,0,0,0.87)', backgroundColor: 'rgba(0,0,0,0.02)' }
                }),
                endAdornment: (
                    <>
                        {loading && !readOnly ? <CircularProgress color="inherit" size={18} /> : null}
                        {params.InputProps.endAdornment}
                    </>
                ),
            }}
            sx={{
                '& .MuiInputLabel-root': { backgroundColor: 'background.paper', px: 0.5 },
            }}
        />
    ), [label, required, isError, meta.error, size, fullWidth, readOnly, loading]);

    return (
        <Autocomplete
            id={name}
            multiple={multiple}
            open={readOnly ? false : open}
            onOpen={handleOpen}
            onClose={handleClose}
            options={options}
            loading={loading && !readOnly}
            disabled={disabled || readOnly}
            getOptionLabel={getOptionLabel}
            value={resolvedValue}
            onInputChange={handleInputChange}
            onChange={handleChange ?? defaultHandleChange}
            onBlur={field.onBlur}
            isOptionEqualToValue={(option, val) => {
                const a = typeof option === 'object' ? option[displayValue] : option;
                const b = typeof val === 'object' ? val[displayValue] : val;
                return a === b;
            }}
            getOptionDisabled={readOnly ? () => true : getOptionDisabled}
            noOptionsText="Không có dữ liệu"
            onKeyDown={(e) => {
                if (e.key === 'Enter') {
                    e.stopPropagation();
                    e.preventDefault();
                }
            }}
            ListboxProps={{ onScroll: handleScroll }}
            sx={{
                '& .MuiAutocomplete-inputRoot': { pt: '0 !important', pb: '0 !important' },
            }}
            {...otherProps}
            renderInput={renderInput}
        />
    );
};

// 5. Đóng băng UI khỏi các re-render thừa của Form
export default React.memo(CommonPagingAutocomplete);