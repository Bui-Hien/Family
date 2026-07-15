# FRONTEND RULES — Phần 1: Stack, Cấu trúc, Enum & Constants

> Trigger: Khi viết hoặc review bất kỳ file Frontend nào.

---

## I. TECHNOLOGY STACK & CONVENTIONS

| Layer | Technology | Version |
|---|---|---|
| Framework | React | 18.3.x |
| Build Tool | Vite | 5.4.x |
| UI Library | MUI (Material UI) | 6.4.x |
| Form Management | Formik + Yup | formik 2.4.x, yup 1.4.x |
| State Management | Zustand | 5.0.x |
| HTTP Client | Axios | 1.7.x |
| Routing | React Router DOM | 6.26.x |
| Table | Custom CommonTable (KHÔNG phải material-react-table trực tiếp) |
| Date Picker | @mui/x-date-pickers | 7.23.x |
| i18n | react-i18next | 15.x |
| Rich Text Editor | TipTap | 3.x |
| Linting | ESLint 9 + oxlint |

### Import Path Convention
- **BẮT BUỘC** dùng alias `@/` thay cho relative path `../`.
- ESLint đã enforce rule `no-restricted-imports` cấm `../*`.

### File Extension
- Component: `.jsx` | Logic thuần (store, service, utils, constants): `.js`

---

## II. PROJECT STRUCTURE — CẤU TRÚC THƯ MỤC

```
src/
├── common/                          # Shared code dùng chung toàn dự án
│   ├── appConfig.js                 # Cấu hình app (API_ENDPOINT)
│   ├── constants.js                 # ★ ENUM + OPTIONS — SINGLE SOURCE OF TRUTH
│   ├── components/                  # Common reusable components
│   │   ├── auth/                    #   HasPermission
│   │   ├── display/                 #   CommonAvatar, CommonBadge, CommonChip, CommonLoading
│   │   ├── file/                    #   CommonDragDropFile, CommonFilePreview, CommonFileUpload, CommonImageGallery, CommonImageUpload
│   │   ├── form/                    #   ★ CommonTextField, CommonSelectInput, CommonAutocomplete, CommonNumberInput, CommonCurrencyInput, CommonDateTimePicker, CommonCheckBox, CommonRadioGroup, CommonPasswordInput, CommonEditor, CommonInputSearch
│   │   ├── layout/                  #   CommonBreadcrumb, CommonFooter, CommonHeader, CommonSidebar
│   │   ├── navigation/              #   CommonAccordion, CommonTabPanel, CommonTabs
│   │   ├── popup/                   #   ★ CommonPopupForm, CommonPopup, CommonConfirmDialog, CommonAuditLogPopup
│   │   └── table/                   #   ★ CommonTable
│   └── utils/                       # Utility functions (cookieUtils)
├── modules/                         # Feature modules — MỖI module là 1 domain
│   └── <module>/                    # pages/ + services/ + store/
├── services/                        # Global: api.js (Axios interceptors, refresh token)
├── stores/                          # Global: authStore.js, uiStore.js
├── layout/ | app/ | assets/ | styles/
└── main.jsx
```

### Quy tắc tổ chức Module

Mỗi module trong `src/modules/<module-name>/` **BẮT BUỘC** có 3 thư mục con:

| Thư mục | Chức năng | Quy tắc đặt tên |
|---|---|---|
| `pages/` | Component UI | `<Module>Page.jsx`, `<Module>Toolbar.jsx`, `<Module>Filter.jsx`, `<Module>List.jsx`, `<Module>Form.jsx` |
| `services/` | API calls | `<module>Service.js` (camelCase) |
| `store/` | Zustand store | `use<Module>Store.js` |

**TUYỆT ĐỐI KHÔNG:** Tạo file component rời rạc ngoài `pages/`, đặt service/store ngoài module, import cross-module service trực tiếp (trừ lookup).

---

## III. ENUM & CONSTANTS — TUYỆT ĐỐI KHÔNG HARDCODE

### File duy nhất: `src/common/constants.js`

Mỗi enum gồm **2 phần**:
1. **Object Enum** — dùng để so sánh logic (`if`, `===`, `switch`)
2. **Array Options** — dùng truyền vào `<CommonSelectInput options={...} />`

```javascript
export const TransactionType = { IN: 'IN', OUT: 'OUT' };
export const TransactionTypeOptions = [
  { value: TransactionType.IN, name: 'Thu (Đóng góp, tài trợ)' },
  { value: TransactionType.OUT, name: 'Chi (Chi hoạt động, giỗ chạp)' },
];
```

### Enum hiện có (PHẢI dùng, KHÔNG khai lại)

| Enum Object | Options Array | Mô tả |
|---|---|---|
| `UserRole` | `UserRoleOptions` | Vai trò người dùng |
| `Gender` | `GenderOptions` | Giới tính |
| `Visibility` | `VisibilityOptions` | Chế độ hiển thị |
| `PostCategory` | `PostCategoryOptions` | Loại bài viết |
| `PostStatus` | `PostStatusOptions` | Trạng thái bài viết |
| `EventStatus` | `EventStatusOptions` | Trạng thái sự kiện |
| `TransactionType` | `TransactionTypeOptions` | Loại giao dịch thu/chi |
| `TransactionStatus` | `TransactionStatusOptions` | Trạng thái phê duyệt |

### Quy tắc bắt buộc

1. **KHÔNG hardcode string** trong JSX hoặc logic — dùng Enum Object.
2. Thêm Enum mới → khai báo vào `constants.js`, KHÔNG tạo constants riêng trong module.
3. Options format chuẩn: `{ value: string, name: string }`.
4. Nếu Enum chưa có Options Array, phải tạo trước khi dùng cho dropdown.

```javascript
// ❌ SAI
<MenuItem value="IN">Thu</MenuItem>
if (status === 'APPROVED') { ... }

// ✅ ĐÚNG
<CommonSelectInput options={TransactionTypeOptions} />
if (status === TransactionStatus.APPROVED) { ... }
```
