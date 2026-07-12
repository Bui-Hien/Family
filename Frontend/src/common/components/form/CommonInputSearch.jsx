import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { TextField, InputAdornment } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';

// 1. Đưa object tĩnh ra ngoài để tránh cấp phát lại bộ nhớ
const searchInputSx = { mb: 2 };

const CommonInputSearch = ({
                             placeholder = 'Tìm kiếm...',
                             onSearch,
                             debounceTime = 300,
                             size = 'small',
                             fullWidth = true,
                             defaultValue = '', // Bổ sung defaultValue (rất cần khi lấy keyword từ URL trên trình duyệt)
                             ...props
                           }) => {
  const [value, setValue] = useState(defaultValue);

  // 2. Kỹ thuật "Latest Ref": Giữ hàm onSearch luôn mới nhất mà không gây re-render
  const onSearchRef = useRef(onSearch);
  useEffect(() => {
    onSearchRef.current = onSearch;
  }, [onSearch]);

  const isFirstRender = useRef(true);

  useEffect(() => {
    // 3. Chặn gọi API thừa thãi ở lần render đầu tiên (Ngăn lỗi Double Fetch)
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const handler = setTimeout(() => {
      if (onSearchRef.current) {
        onSearchRef.current(value);
      }
    }, debounceTime);

    return () => {
      clearTimeout(handler);
    };
  }, [value, debounceTime]); // KHÔNG đưa onSearch vào đây nữa

  // 4. Memoize hàm onChange để tránh render lại TextField không cần thiết
  const handleChange = useCallback((e) => {
    setValue(e.target.value);
  }, []);

  // 5. Memoize InputProps chứa giao diện Icon để tối ưu DOM
  const inputPropsMemo = useMemo(() => ({
    startAdornment: (
        <InputAdornment position="start">
          <SearchIcon color="action" fontSize="small" />
        </InputAdornment>
    ),
  }), []);

  return (
      <TextField
          {...props}
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          size={size}
          fullWidth={fullWidth}
          InputProps={inputPropsMemo}
          variant="outlined"
          sx={searchInputSx}
      />
  );
};

// 6. Bọc React.memo
export default React.memo(CommonInputSearch);