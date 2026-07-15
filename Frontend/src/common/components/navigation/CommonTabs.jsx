import React, { useMemo } from 'react';
import { Tabs, Tab, Box } from '@mui/material';

// 1. Tách cấu hình CSS tĩnh ra ngoài để tránh cấp phát lại bộ nhớ
const boxSx = { borderBottom: 1, borderColor: 'divider', mb: 2 };
const tabSx = { 
    fontWeight: 600, 
    minHeight: 48, 
    textTransform: 'none',
    fontSize: '14px',
    transition: 'all 0.2s ease',
    '&:hover': {
        color: 'primary.light',
        opacity: 0.85,
    }
};

const CommonTabs = ({
                        value,
                        onChange,
                        tabs = [],
                        variant = 'standard',
                        ...props
                    }) => {
    // 2. Tối ưu render danh sách tab
    // Bọc renderTab để đảm bảo component con được memoize nội bộ
    const renderedTabs = useMemo(() => {
        return tabs.map((tab, index) => {
            // Dùng ID nếu có, nếu không thì kết hợp label để tạo key ổn định
            const tabKey = tab.id ?? `${tab.label}-${index}`;

            return (
                <Tab
                    key={tabKey}
                    label={tab.label}
                    icon={tab.icon}
                    iconPosition="start"
                    disabled={tab.disabled}
                    sx={tabSx}
                />
            );
        });
    }, [tabs]);

    return (
        <Box sx={boxSx}>
            <Tabs
                {...props}
                value={value}
                onChange={onChange}
                variant={variant}
            >
                {renderedTabs}
            </Tabs>
        </Box>
    );
};

// 3. Đóng băng Component để tránh render lại khi các component khác trong Form thay đổi
export default React.memo(CommonTabs);