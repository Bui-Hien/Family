# FRONTEND RULES — Phần 6: Page Layouts, Responsive & UX States

> Trigger: Khi viết page mới, xử lý empty/loading state, hoặc responsive layout.
> Đọc kèm: `fe-05-ui-design.md` (Design System, Colors, Typography, Spacing, Cards, Buttons, Animations).

---

## VIII. EMPTY & LOADING STATES

### Empty State Pattern

Khi data trống, **KHÔNG để trang trắng**. PHẢI hiển thị empty state:

```jsx
// Empty state chuẩn
<Box sx={{ textAlign: 'center', py: 8, color: 'text.secondary' }}>
  <Box sx={{ fontSize: 64, mb: 2, opacity: 0.4 }}>📭</Box>
  <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
    Chưa có dữ liệu
  </Typography>
  <Typography variant="body2" sx={{ mb: 3 }}>
    Hiện tại chưa có thành viên nào trong danh sách.
  </Typography>
  <Button variant="contained" startIcon={<AddIcon />}>
    Thêm thành viên đầu tiên
  </Button>
</Box>
```

### Loading State

```jsx
// ❌ SAI — Không có loading indicator
if (loading) return null;

// ✅ ĐÚNG — Dùng CommonLoading
if (loading) return <CommonLoading loading={loading} type="skeleton" rows={5} />;
```

---

## IX. RESPONSIVE DESIGN

### Breakpoints (MUI defaults)

| Key | Min Width | Thiết bị |
|---|---|---|
| `xs` | 0px | Mobile |
| `sm` | 600px | Tablet portrait |
| `md` | 900px | Tablet landscape |
| `lg` | 1200px | Desktop |
| `xl` | 1536px | Large desktop |

### Responsive Rules

```jsx
// Padding responsive
sx={{ p: { xs: 2, sm: 3, md: 4 } }}

// Hide/Show theo breakpoint
sx={{ display: { xs: 'none', md: 'block' } }}   // Ẩn trên mobile
sx={{ display: { xs: 'block', md: 'none' } }}    // Chỉ hiện trên mobile

// Font size responsive
sx={{ fontSize: { xs: '1.25rem', md: '1.5rem' } }}

// Grid columns responsive
<Grid item xs={12} sm={6} md={4}>...</Grid>
```

### Mobile-First Rules
1. **Sidebar**: `variant="temporary"` trên mobile, `variant="permanent"` trên desktop.
2. **Table**: Phải cuộn ngang (horizontal scroll) — đã handle trong CommonTable.
3. **Form fields**: 1 cột trên mobile (`xs={12}`), 2 cột trên desktop (`sm={6}`).
4. **Action buttons**: Stack dọc trên mobile, ngang trên desktop.

---

## X. ICONOGRAPHY — BIỂU TƯỢNG

### Icon Rules

1. **BẮT BUỘC** import từ `@mui/icons-material` — KHÔNG dùng icon library khác.
2. Icon size trong Table actions: `fontSize="small"`.
3. Icon size trong Avatar: `fontSize="large"` hoặc default.
4. **Emoji** chỉ dùng cho Section Title decorative (📊, 🏛️, 📅...) — KHÔNG dùng emoji thay thế icon trong buttons.

### Icon-Text Pairing

```jsx
// ❌ SAI — Icon không liên quan, hoặc thiếu icon
<Button variant="contained">Thêm mới</Button>

// ✅ ĐÚNG — Icon phù hợp với action
<Button variant="contained" startIcon={<AddIcon />}>Thêm mới</Button>
<Button variant="outlined" startIcon={<SearchIcon />}>Tìm kiếm</Button>
<Button variant="outlined" startIcon={<FileDownloadIcon />}>Xuất Excel</Button>
```

---

## XI. PAGE-SPECIFIC LAYOUTS

### A. Dashboard Page

```
┌────────────────────────────────────────────────┐
│  🏛️ Hero Banner (gradient primary)             │
│  Welcome message + subtitle                    │
├───────────────┬───────────────┬────────────────┤
│  Stats Card   │  Stats Card   │  Stats Card    │  ← Metric cards (hover-lift)
│  (icon+number)│  (icon+number)│  (icon+number) │
├───────────────┴───────────────┴────────────────┤
│  Grid 2-col: Upcoming Events | Featured Posts  │  ← Content cards
└────────────────────────────────────────────────┘
```

### B. List Page (Members, Events, Posts...)

```
┌────────────────────────────────────────────────┐
│  Page Title          [Filter] [+ Thêm mới]     │  ← Header + Actions
├────────────────────────────────────────────────┤
│  Filter Card (expandable)                      │  ← Collapsible filter
│  [Search] [Select] [DateRange] [Apply] [Reset] │
├────────────────────────────────────────────────┤
│  Table Card                                     │
│  ┌──────┬─────┬──────┬─────┬──────────────┐    │
│  │ Col  │ Col │ Col  │ Col │ Actions      │    │  ← CommonTable
│  ├──────┼─────┼──────┼─────┼──────────────┤    │
│  │ row  │     │      │     │ 👁 ✏️ 🗑     │    │
│  └──────┴─────┴──────┴─────┴──────────────┘    │
│  Pagination                                     │
└────────────────────────────────────────────────┘
```

### C. Detail Page

```
┌────────────────────────────────────────────────┐
│  ← Breadcrumb                                  │
│  Page Title              [Edit] [Delete]        │
├─────────────────────────┬──────────────────────┤
│  Main Content (md=8)    │  Sidebar Info (md=4) │
│                         │                      │
│  Section 1              │  Quick Stats Card    │
│  ┌────────────────────┐ │  ┌──────────────────┐│
│  │ Info Grid          │ │  │ Avatar           ││
│  │ Label: Value       │ │  │ Name             ││
│  │ Label: Value       │ │  │ Role Badge       ││
│  └────────────────────┘ │  └──────────────────┘│
│                         │                      │
│  Section 2              │  Related Links Card  │
│  ┌────────────────────┐ │                      │
│  │ Timeline / History │ │                      │
│  └────────────────────┘ │                      │
└─────────────────────────┴──────────────────────┘
```

### D. Form (trong Popup — CommonPopupForm)

```
┌──── Dialog ─────────────────────────────────────┐
│  Title                               [X Close]  │
├─────────────────────────────────────────────────┤
│  ┌─────────────────┬─────────────────┐          │
│  │  Field (sm=6)   │  Field (sm=6)   │          │  ← 2 cột
│  ├─────────────────┼─────────────────┤          │
│  │  Field (sm=6)   │  Field (sm=6)   │          │
│  ├─────────────────┴─────────────────┤          │
│  │  Field Full Width (xs=12)         │          │  ← 1 cột cho textarea
│  └───────────────────────────────────┘          │
├─────────────────────────────────────────────────┤
│                          [Hủy]  [Lưu thay đổi] │  ← Action bar
└─────────────────────────────────────────────────┘
```

---

## XII. ANTI-PATTERNS — NHỮNG ĐIỀU KHÔNG ĐƯỢC LÀM

| ❌ Anti-pattern | ✅ Correct | Lý do |
|---|---|---|
| Trang trắng khi không có data | Empty state component | UX confusion |
| Card trong Card | Box/Paper cho inner sections | Visual noise |
| Hardcode hex color | Dùng MUI theme token | Không hỗ trợ dark mode |
| Button không có icon | startIcon cho CTA buttons | Thiếu visual cue |
| IconButton không có Tooltip | Luôn wrap trong Tooltip | Accessibility |
| Inline style `style={{}}` | MUI `sx={{}}` prop | Theme-aware, responsive |
| `margin`/`padding` pixel cứng | MUI spacing (1=8px) | Nhất quán với design system |
| Font không thuộc palette | Inter hoặc Playfair Display | Phá vỡ brand identity |
| Dùng `<table>` HTML raw | `<CommonTable>` | Thiếu pagination, sort, style |
| Form không validate trước submit | Formik + Yup schema | Data integrity |
| Dialog không có loading state | Disable button + CircularProgress | Double-submit |
