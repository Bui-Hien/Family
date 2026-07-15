# Family Frontend — Agent Rules

## Quy tắc chung

- Luôn đọc các file trong `rules/` trước khi viết bất kỳ code Frontend nào.
- Tuân thủ 100% — không được bỏ qua.
- Khi tạo module mới, chạy Checklist tại `fe-04-quality-checklist.md` mục XIV.

## Cấu trúc Rules (6 files)

| File | Nội dung | Khi nào trigger |
|---|---|---|
| `fe-01-structure-enums.md` | Tech stack, cấu trúc thư mục, Enum/Constants | Luôn bật |
| `fe-02-form-patterns.md` | Form components, Select vs Autocomplete, Popup Form, Filter | Khi viết form/popup/dropdown |
| `fe-03-store-service-page.md` | Table, Zustand Store, Service, Page orchestrator | Khi viết store/service/page |
| `fe-04-quality-checklist.md` | Permission, Performance, Anti-patterns, Checklist | Khi review/hoàn thành feature |
| `fe-05-ui-design.md` | Design System: Colors, Typography, Spacing, Cards, Buttons, Animations | Khi viết component JSX có giao diện |
| `fe-06-ui-layouts.md` | Page Layouts, Responsive, Empty/Loading States, Icons, Anti-patterns | Khi tạo page mới hoặc xử lý UX states |

## Quy tắc ưu tiên (TOP 5)

1. **Enum**: Mọi status/type/role PHẢI dùng Enum từ `src/common/constants.js`. KHÔNG hardcode.
2. **Component**: PHẢI dùng Common Components (`CommonSelectInput`, `CommonTextField`, `CommonPopupForm`, `CommonTable`...). KHÔNG tự ráp MUI thô.
3. **Import**: Luôn dùng alias `@/` — KHÔNG dùng relative path `../`.
4. **Store**: State management qua Zustand. API calls trong store actions, KHÔNG trong component.
5. **Notification**: Dùng `useUiStore.getState().showNotification()` — KHÔNG `alert()`.
