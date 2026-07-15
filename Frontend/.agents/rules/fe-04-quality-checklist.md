# FRONTEND RULES — Phần 4: Permission, Performance, Anti-Patterns & Checklist

> Trigger: Khi review code, tạo module mới, hoặc hoàn thành feature.

---

## XI. PERMISSION — PHÂN QUYỀN UI

```jsx
import HasPermission from '@/common/components/auth/HasPermission';
import { UserRole } from '@/common/constants';

<HasPermission roles={[UserRole.SYSTEM_ADMIN, UserRole.FAMILY_LEADER, UserRole.FAMILY_ADMIN]}>
  <Button onClick={handleDelete}>Xoá</Button>
</HasPermission>
```

Roles **PHẢI dùng `UserRole` enum** — không hardcode string. `HasPermission` wrap UI cần giấu.

---

## XII. PERFORMANCE RULES

1. **`React.memo`**: Mọi Common Component wrap React.memo — giữ nguyên.
2. **Static style objects**: Khai báo NGOÀI component body.
   ```javascript
   // ✅ const formControlSx = { mb: 2 };  (ngoài component)
   // ❌ const MyComp = () => { const sx = { mb: 2 }; };  (trong component — tạo mới mỗi render!)
   ```
3. **`useCallback`**: Cho event handlers truyền xuống child.
4. **`useMemo`**: Cho computed values phức tạp.
5. **KHÔNG dùng index làm key** trong `.map()` — dùng unique ID.

---

## XIII. ANTI-PATTERNS — DANH SÁCH CẤM

| # | Anti-Pattern | Cách đúng |
|---|---|---|
| 1 | Import `Select`, `FormControl` từ MUI tự ráp form | Dùng `CommonSelectInput` / `CommonAutocomplete` |
| 2 | Hardcode `<MenuItem value="IN">` | Dùng Enum Options từ `constants.js` |
| 3 | `if (status === 'APPROVED')` | Dùng `TransactionStatus.APPROVED` |
| 4 | `useState` cho form values khi có Formik | Formik quản lý toàn bộ |
| 5 | Import `axios` trực tiếp | Dùng `import api from '@/services/api'` |
| 6 | `alert()`, `window.confirm()` | `CommonConfirmDialog` / `useUiStore.showNotification()` |
| 7 | Import `../../../common/...` | Dùng `@/common/...` |
| 8 | Service call trong component | Đặt trong Zustand store action |
| 9 | Tạo constants riêng trong module | Tập trung tại `@/common/constants.js` |
| 10 | `console.log` trong production | Chỉ `console.error` trong catch |

---

## XIV. CHECKLIST KHI TẠO MODULE MỚI

- [ ] Thư mục: `modules/<name>/pages/`, `services/`, `store/`
- [ ] `<Name>Page.jsx` — useEffect fetch + cleanup resetStore
- [ ] `<Name>Toolbar.jsx` — title + action buttons
- [ ] `<Name>Filter.jsx` — search + dropdown filters
- [ ] `<Name>List.jsx` — CommonTable + columns
- [ ] `<Name>Form.jsx` — CommonPopupForm + Formik + Yup
- [ ] `<name>Service.js` — CRUD qua `api` instance
- [ ] `use<Name>Store.js` — state + setters + async actions + resetStore
- [ ] Enum đã khai báo trong `@/common/constants.js`
- [ ] Select dùng `CommonSelectInput` + Options (KHÔNG hardcode)
- [ ] Autocomplete dùng `CommonAutocomplete` cho API data
- [ ] Permission dùng `HasPermission` + `UserRole` enum
- [ ] Notification dùng `useUiStore.getState().showNotification()`
- [ ] Confirm dùng `CommonConfirmDialog`
- [ ] Import path dùng `@/` alias
- [ ] Không hardcode bất kỳ string enum nào

---

## XV. FILE THAM CHIẾU

| Pattern | File |
|---|---|
| Page Orchestrator | `src/modules/funds/pages/FundsPage.jsx` |
| Toolbar + Stats | `src/modules/funds/pages/FundToolbar.jsx` |
| Filter Bar | `src/modules/funds/pages/FundFilter.jsx` |
| Table + Columns | `src/modules/funds/pages/FundList.jsx` |
| Form (CommonPopupForm) | `src/modules/members/pages/MemberForm.jsx` |
| CommonSelectInput usage | `src/modules/members/pages/MemberForm.jsx` |
| Zustand Store | `src/modules/funds/store/useFundStore.js` |
| Service | `src/modules/funds/services/fundService.js` |
| Enum + Options | `src/common/constants.js` |
