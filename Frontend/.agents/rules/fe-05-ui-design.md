# FRONTEND RULES — Phần 5: UI Design, Layout & Visual Guidelines

> Trigger: Khi viết bất kỳ component JSX nào có giao diện (page, form, card, dashboard...).

---

## I. DESIGN PHILOSOPHY — TRIẾT LÝ THIẾT KẾ

Ứng dụng "Quản lý Dòng họ" cần toát lên phong cách **sang trọng, truyền thống nhưng hiện đại** (Heritage Premium).

| Nguyên tắc | Mô tả |
|---|---|
| **Heritage Premium** | Kết hợp Burgundy (#8C1D40) + Antique Gold (#C5A059) + Warm Ivory (#FAF8F5) — toát lên sự trang trọng, gia tộc |
| **Visual Hierarchy** | Mỗi page phải có rõ ràng: Page Title → Section → Content → Actions |
| **Breathing Space** | Luôn có khoảng trống thở. Không nhồi nhét. Spacing phải nhất quán |
| **Micro-interactions** | Mọi phần tử tương tác (button, card, row) phải có hover/focus effect |
| **Consistency** | Cùng loại component → cùng style. Không mỗi nơi mỗi kiểu |

---

## II. COLOR PALETTE — SỬ DỤNG MÀU SẮC

### Primary Palette (từ `theme.js`)
| Token | Light | Dark | Dùng cho |
|---|---|---|---|
| `primary.main` | `#8C1D40` | `#E6A3B8` | CTA buttons, active states, links, page title |
| `primary.light` | `#B23B68` | — | Hover states, gradient secondary |
| `primary.dark` | `#5E0E27` | — | Gradient backgrounds, pressed states |
| `secondary.main` | `#C5A059` | `#F1D592` | Accents, badges, highlights, icon backgrounds |
| `background.default` | `#FAF8F5` | `#121212` | Page background |
| `background.paper` | `#FFFFFF` | `#1E1E1E` | Cards, dialogs, paper surfaces |

### Quy tắc màu sắc

```javascript
// ❌ SAI — Hardcode hex color trực tiếp
<Typography sx={{ color: '#8C1D40' }}>Title</Typography>
<Box sx={{ bgcolor: '#FAF8F5' }}>...</Box>

// ✅ ĐÚNG — Dùng MUI theme token
<Typography sx={{ color: 'primary.main' }}>Title</Typography>
<Box sx={{ bgcolor: 'background.default' }}>...</Box>
```

### Semantic Colors cho trạng thái

| Trạng thái | Light | Dark | MUI token |
|---|---|---|---|
| Success (Còn sống, Đã duyệt) | `#2E7D32` | `#81C784` | `success.main` |
| Error (Đã mất, Từ chối) | `#D32F2F` | `#F44336` | `error.main` |
| Warning (Chờ duyệt) | `#ED6C02` | `#FFB74D` | `warning.main` |
| Info (Lịch sử, Ghi chú) | `#0288D1` | `#4FC3F7` | `info.main` |

**KHÔNG dùng raw hex cho status** — dùng `<CommonChip>` hoặc MUI theme token.

---

## III. TYPOGRAPHY — KIỂU CHỮ

### Font Hierarchy

| Cấp | Font | Weight | Khi nào dùng |
|---|---|---|---|
| Page Title (h4) | Playfair Display (serif) | 700 | Tiêu đề chính mỗi trang |
| Section Title (h6) | Playfair Display (serif) | 600 | Tiêu đề từng section/card |
| Body | Inter (sans-serif) | 400-500 | Nội dung, mô tả |
| Label / Caption | Inter (sans-serif) | 600 | Labels, table headers |
| Button | Inter (sans-serif) | 600 | Buttons (textTransform: none) |

### Quy tắc Typography

```jsx
// Page Title — BẮT BUỘC có ở đầu mỗi page
<Typography variant="h4" className="serif-title" sx={{ color: 'primary.main', mb: 1 }}>
  Quản lý thành viên
</Typography>
<Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
  Xem và quản lý danh sách thành viên trong dòng họ
</Typography>

// Section Title — Đầu mỗi card/section
<Typography variant="h6" className="serif-title" sx={{ color: 'primary.main', mb: 2 }}>
  📊 Số liệu chung
</Typography>
```

**KHÔNG dùng `variant="h1"` hoặc `variant="h2"`** trong page content — chỉ dùng từ h4 trở xuống.

---

## IV. SPACING & LAYOUT — KHOẢNG CÁCH & BỐ CỤC

### Spacing Scale (MUI theme spacing: 1 = 8px)

| Token | px | Khi nào dùng |
|---|---|---|
| `0.5` | 4px | Icon gap, chip padding |
| `1` | 8px | Giữa các inline elements, compact spacing |
| `1.5` | 12px | Giữa form fields cùng row |
| `2` | 16px | Giữa card content sections |
| `3` | 24px | Giữa các sections, Grid spacing |
| `4` | 32px | Page padding, major section gaps |

### Page Layout Pattern — BẮT BUỘC

Mỗi page PHẢI tuân theo cấu trúc sau:

```jsx
const ExamplePage = () => {
  return (
    <Box>
      {/* 1. PAGE HEADER — Title + Subtitle + Action buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
        <Box>
          <Typography variant="h4" className="serif-title" sx={{ color: 'primary.main', mb: 0.5 }}>
            Tiêu đề trang
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Mô tả ngắn gọn chức năng của trang
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          {/* Action Buttons */}
        </Box>
      </Box>

      {/* 2. FILTER SECTION (nếu có) — Nằm trong Card riêng */}
      <Card sx={{ mb: 3, p: 2 }}>
        {/* Filter components */}
      </Card>

      {/* 3. MAIN CONTENT — Table / Grid / Detail */}
      <Card>
        {/* Content */}
      </Card>
    </Box>
  );
};
```

### Grid Layout

```jsx
// Dashboard — 3 cột đều trên desktop, 1 cột trên mobile
<Grid container spacing={3}>
  <Grid item xs={12} md={4}>...</Grid>
  <Grid item xs={12} md={4}>...</Grid>
  <Grid item xs={12} md={4}>...</Grid>
</Grid>

// Form — 2 cột trên desktop, 1 cột trên mobile
<Grid container spacing={2}>
  <Grid item xs={12} sm={6}>...</Grid>
  <Grid item xs={12} sm={6}>...</Grid>
</Grid>

// Detail — Content 8 | Sidebar 4
<Grid container spacing={3}>
  <Grid item xs={12} md={8}>...</Grid>
  <Grid item xs={12} md={4}>...</Grid>
</Grid>
```

---

## V. CARD & SURFACE — THẺ & BỀ MẶT

### Card Types

#### 1. Standard Card (Default)
Dùng cho: Bọc content sections, filter, table.
```jsx
<Card>
  <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
    {/* Theme tự động áp dụng borderRadius: 12, border, shadow */}
    {content}
  </CardContent>
</Card>
```

#### 2. Hero / Banner Card
Dùng cho: Welcome banner, page header nổi bật.
```jsx
<Card
  sx={{
    mb: 4,
    background: (theme) => `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
    color: '#ffffff',
    borderRadius: 3,
    border: 'none',
  }}
>
  <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
    <Typography variant="h4" className="serif-title" sx={{ mb: 1 }}>
      🏛️ Title
    </Typography>
    <Typography variant="body1" sx={{ opacity: 0.9 }}>
      Description
    </Typography>
  </CardContent>
</Card>
```

#### 3. Stats / Metric Card
Dùng cho: Hiển thị số liệu thống kê nổi bật.
```jsx
<Card className="hover-lift" sx={{ cursor: 'default' }}>
  <CardContent sx={{ p: 3, textAlign: 'center' }}>
    <Avatar sx={{ bgcolor: 'rgba(140, 29, 64, 0.08)', color: 'primary.main', mx: 'auto', mb: 2, width: 56, height: 56 }}>
      <PeopleIcon fontSize="large" />
    </Avatar>
    <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
      {count}
    </Typography>
    <Typography variant="body2" color="textSecondary">
      Tổng thành viên
    </Typography>
  </CardContent>
</Card>
```

### Card Rules

1. **KHÔNG dùng `elevation` cao** — Dùng subtle shadow từ theme (đã override `MuiCard`).
2. Card content padding: `p: { xs: 2, sm: 3 }` — responsive.
3. Card có hover interaction → thêm `className="hover-lift"`.
4. **KHÔNG nest Card trong Card** — Dùng `Box` hoặc `Paper` cho inner sections.

---

## VI. BUTTON & ACTION — NÚT BẤM & HÀNH ĐỘNG

### Button Hierarchy

| Priority | Variant | Khi nào dùng | Example |
|---|---|---|---|
| Primary | `contained` color="primary" | CTA chính: Thêm mới, Lưu, Gửi | `<Button variant="contained">Thêm mới</Button>` |
| Secondary | `outlined` color="primary" | Hành động phụ: Hủy, Xuất Excel | `<Button variant="outlined">Hủy</Button>` |
| Tertiary | `text` color="primary" | Hành động nhẹ: Xem thêm, Bỏ qua | `<Button variant="text">Xem thêm</Button>` |
| Danger | `contained` color="error" | Xóa, Hủy bỏ (destructive) | `<Button variant="contained" color="error">Xóa</Button>` |

### Button Rules

```jsx
// ❌ SAI — Button không có icon, text quá dài
<Button variant="contained">Thêm mới thành viên vào danh sách dòng họ</Button>

// ✅ ĐÚNG — Có startIcon, text ngắn gọn
<Button variant="contained" startIcon={<AddIcon />}>Thêm mới</Button>

// ❌ SAI — Dùng raw IconButton không có Tooltip
<IconButton onClick={handleEdit}><EditIcon /></IconButton>

// ✅ ĐÚNG — IconButton luôn kèm Tooltip
<Tooltip title="Chỉnh sửa">
  <IconButton size="small" onClick={handleEdit} color="primary">
    <EditIcon fontSize="small" />
  </IconButton>
</Tooltip>
```

### Action Bar Pattern (Toolbar)

```jsx
// Toolbar chuẩn cho List Page
<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
  <Typography variant="h4" className="serif-title" sx={{ color: 'primary.main' }}>
    Danh sách thành viên
  </Typography>
  <Box sx={{ display: 'flex', gap: 1 }}>
    <Button variant="outlined" startIcon={<FilterListIcon />}>Bộ lọc</Button>
    <Button variant="contained" startIcon={<AddIcon />}>Thêm mới</Button>
  </Box>
</Box>
```

---

## VII. MICRO-ANIMATIONS & TRANSITIONS

### Các hiệu ứng BẮT BUỘC

| Element | Effect | Implementation |
|---|---|---|
| Card (clickable) | Lift on hover | `className="hover-lift"` (đã có trong globals.css) |
| Table row | Background color on hover | Đã có trong `.row-table-body:hover` |
| Button | Smooth transition | MUI default + `boxShadow: 'none'` từ theme |
| Sidebar menu | Active highlight | `backgroundColor: 'primary.main'` + `borderRadius: 2` |
| Dialog | Slide/Fade | MUI default TransitionComponent |
| Loading | Skeleton | `<CommonLoading type="skeleton" />` |

### Transition Values

```jsx
// Dùng cho custom transitions
sx={{
  transition: 'all 0.2s ease',           // Quick — hover effects
  transition: 'all 0.3s ease',           // Standard — expand/collapse
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',  // Smooth — page transitions
}}
```

### KHÔNG ĐƯỢC:
- Dùng animation quá lố (bounce, shake, spin không đúng ngữ cảnh).
- Để duration > 500ms cho hover effects.
- Dùng `!important` để override transition.

---

> **Tiếp tục tại** `fe-06-ui-layouts.md`: Empty/Loading States, Responsive Design, Iconography, Page-specific Layouts, Anti-patterns.

