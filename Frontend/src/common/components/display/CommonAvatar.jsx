import React, { useEffect, useState, useMemo } from 'react';
import { Avatar, Box, Typography } from '@mui/material';

// 1. Đưa hàm xử lý logic ra ngoài Component (Pure Function)
// Giúp hàm này không bị cấp phát lại bộ nhớ sau mỗi lần React render
const getInitials = (fullName) => {
    if (!fullName || typeof fullName !== 'string') return '';
    // Dùng regex /\s+/ để cắt chuỗi an toàn hơn (xử lý được trường hợp gõ 2-3 dấu cách liên tiếp)
    const parts = fullName.trim().split(/\s+/);
    if (parts.length === 0) return '';
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

// 2. Đưa các object CSS tĩnh ra ngoài
const containerSx = { display: 'inline-flex', alignItems: 'center', gap: 1 };
const nameSx = { fontWeight: 500 };
const baseAvatarSx = {
    bgcolor: 'primary.main',
    color: 'primary.contrastText',
    fontSize: '14px',
    fontWeight: 600,
};

const CommonAvatar = ({
                          name = '',
                          imgPath = '',
                          isFile = false,
                          style = {},
                          className = '',
                          includeName = false,
                      }) => {
    const [avatarUrl, setAvatarUrl] = useState('');

    // 3. Khắc phục triệt để lỗi Memory Leak khi tạo URL cho File
    useEffect(() => {
        let objectUrl = '';

        if (isFile && imgPath instanceof File) {
            objectUrl = URL.createObjectURL(imgPath);
            setAvatarUrl(objectUrl);
        } else if (typeof imgPath === 'string' && imgPath) {
            setAvatarUrl(imgPath);
        } else {
            setAvatarUrl('');
        }

        // Cleanup Function: Cực kỳ quan trọng.
        // Trình duyệt sẽ tự động thu hồi bộ nhớ của URL cũ khi component unmount hoặc khi có ảnh mới.
        return () => {
            if (objectUrl) {
                URL.revokeObjectURL(objectUrl);
            }
        };
    }, [imgPath, isFile]);

    // 4. Memoize style để tránh render lại Avatar không cần thiết
    const mergedAvatarSx = useMemo(() => ({
        ...baseAvatarSx,
        ...style,
    }), [style]);

    return (
        <Box sx={containerSx}>
            <Avatar
                src={avatarUrl || undefined}
                className={className}
                sx={mergedAvatarSx}
            >
                {!avatarUrl && getInitials(name)}
            </Avatar>

            {includeName && name && (
                <Typography variant="body2" sx={nameSx}>
                    {name}
                </Typography>
            )}
        </Box>
    );
};

// 5. Bọc React.memo để bảo vệ component nếu nó được đặt trong các danh sách dài (List/Table)
export default React.memo(CommonAvatar);