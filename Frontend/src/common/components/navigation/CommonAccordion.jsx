import React from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Typography, Box } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

// 1. Tách toàn bộ CSS tĩnh ra ngoài vòng đời Component
// Giúp trình duyệt không phải tạo ra hàng chục Object CSS mới mỗi khi render lại mảng items
const accordionSx = {
  mb: 1.5,
  borderRadius: '8px !important',
  '&:before': { display: 'none' }, // Ẩn đường kẻ mặc định khá xấu của MUI
  border: '1px solid',
  borderColor: 'divider',
  boxShadow: 'none',
  transition: 'all 0.2s ease',
  '&.Mui-expanded': {
    borderLeft: '4px solid',
    borderLeftColor: 'secondary.main',
  },
  // Bo góc an toàn
  '&:first-of-type': { borderTopLeftRadius: 8, borderTopRightRadius: 8 },
  '&:last-of-type': { borderBottomLeftRadius: 8, borderBottomRightRadius: 8 },
};

const summarySx = {
  backgroundColor: 'background.paper',
  minHeight: 48,
  borderRadius: '8px !important',
  transition: 'background-color 0.2s ease',
  '&:hover': {
    backgroundColor: 'action.hover',
  },
  // Vá lỗi "Giật khung hình" (Jumping UI) của MUI khi mở Accordion
  '& .MuiAccordionSummary-content': { my: 1.5 },
  '& .MuiAccordionSummary-content.Mui-expanded': { my: 1.5 },
};

const titleSx = { fontWeight: 600, fontFamily: '"Inter", sans-serif' };
const detailsSx = { borderTop: '1px solid', borderColor: 'divider', p: 2, backgroundColor: 'background.paper', borderRadius: '0 0 8px 8px' };

const CommonAccordion = ({
                           items = [],
                           accordionProps = {}, // Tách riêng props cho Accordion
                           ...props // Các props còn lại (như sx, className) sẽ dành cho Container bên ngoài
                         }) => {
  if (!items || items.length === 0) return null;

  return (
      <Box {...props}>
        {items.map((item, index) => {
          // 2. Định danh an toàn: Ưu tiên dùng ID từ database, fallback về index nếu không có
          const safeId = item.id != null ? String(item.id) : `accordion-item-${index}`;

          return (
              <Accordion
                  key={safeId}
                  defaultExpanded={Boolean(item.defaultExpanded)}
                  disableGutters // 3. Cực kỳ quan trọng: Tắt margin mặc định của MUI để UI không bị giật lên xuống
                  sx={accordionSx}
                  {...accordionProps}
              >
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    // Hỗ trợ trợ năng (Accessibility) chuẩn xác dựa trên safeId
                    aria-controls={`panel-${safeId}-content`}
                    id={`panel-${safeId}-header`}
                    sx={summarySx}
                >
                  <Typography variant="body2" sx={titleSx}>
                    {item.title}
                  </Typography>
                </AccordionSummary>

                <AccordionDetails sx={detailsSx}>
                  {item.content}
                </AccordionDetails>
              </Accordion>
          );
        })}
      </Box>
  );
};

// 4. Đóng băng UI để bảo vệ Component khỏi các tác động re-render thừa từ Parent
export default React.memo(CommonAccordion);