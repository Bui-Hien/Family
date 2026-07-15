# FRONTEND RULES — Phần 2: Form Components & Patterns

> Trigger: Khi viết form, popup, select/dropdown trong Frontend.

---

## IV. FORM COMPONENTS — QUY TẮC SỬ DỤNG

### Nguyên tắc: REUSE FIRST — Dùng Common Component, KHÔNG tự viết MUI thô

**TUYỆT ĐỐI KHÔNG** import `Select`, `FormControl`, `InputLabel` từ `@mui/material` để tự ráp form field.

### Bảng ánh xạ Component

| Loại Input | Common Component | Khi nào dùng |
|---|---|---|
| Text input | `CommonTextField` | Input text, textarea (`isTextArea`) |
| Select (fixed options) | `CommonSelectInput` | ★ Dropdown từ Enum, < 20 items |
| Autocomplete (search) | `CommonAutocomplete` | Dropdown tìm kiếm, API data, danh sách lớn |
| Autocomplete (paging) | `CommonPagingAutocomplete` | Autocomplete phân trang server |
| Number input | `CommonNumberInput` | Input số (chống scroll wheel) |
| Currency input | `CommonCurrencyInput` | Tiền tệ (format dấu phẩy, suffix ₫) |
| Date/Time picker | `CommonDateTimePicker` | Chọn ngày/giờ |
| Checkbox | `CommonCheckBox` | Checkbox đơn/nhóm |
| Radio group | `CommonRadioGroup` | Chọn 1 trong nhiều |
| Password | `CommonPasswordInput` | Mật khẩu (toggle show/hide) |
| Rich text | `CommonEditor` | Soạn thảo TipTap |
| Search | `CommonInputSearch` | Ô tìm kiếm ngoài form |

Tất cả import từ `@/common/components/form/<ComponentName>`.

### ★ `CommonSelectInput` vs `CommonAutocomplete`

| Tiêu chí | `CommonSelectInput` | `CommonAutocomplete` |
|---|---|---|
| Nguồn dữ liệu | Enum cố định, < 20 items | API, danh sách lớn |
| Tìm kiếm | Không | Có search text |
| Options format | `[{ value, name }]` | `[{ id, name }]` (tuỳ chỉnh `displayLabel`, `displayValue`) |
| Use case | Giới tính, Loại GD, Trạng thái | Thành viên, Quỹ, Đơn vị |

```jsx
// ★ Select cho Enum cố định
<CommonSelectInput name="gender" label="Giới tính" required options={GenderOptions} noNullOption />

// ★ Select cho danh sách dynamic ngắn
<CommonSelectInput name="fundId" label="Quỹ" options={funds.map(f => ({ value: f.id, name: f.name }))} />

// ★ Autocomplete cho danh sách dài/API
<CommonAutocomplete name="memberId" label="Thành viên" options={membersList} displayLabel="fullName" displayValue="id" />
```

---

## V. FORM PATTERN — POPUP FORM (Create/Edit)

### BẮT BUỘC dùng `CommonPopupForm`

Đã tích hợp: FormikProvider, FormikFocusError, Draggable, Loading state, Hủy+Submit.

```jsx
import { useFormik } from 'formik';
import * as Yup from 'yup';
import CommonPopupForm from '@/common/components/popup/CommonPopupForm';

// Validation Schema khai báo NGOÀI component
const validationSchema = Yup.object({
  name: Yup.string().required('Tên không được để trống'),
  type: Yup.string().required('Loại không được để trống'),
});

const MyForm = () => {
  const { openPopup, selectedRow, handleClose, saveData } = useMyStore();

  const formik = useFormik({
    initialValues: { name: selectedRow?.name || '', type: selectedRow?.type || '' },
    enableReinitialize: true,
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try { await saveData(values); }
      catch (error) { console.error(error); }
      finally { setSubmitting(false); }
    },
  });

  return (
    <CommonPopupForm open={openPopup} handleClose={handleClose}
      title={selectedRow?.id ? 'Cập nhật' : 'Thêm mới'} formik={formik} size="md">
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <CommonTextField name="name" label="Tên" required />
        </Grid>
        <Grid item xs={12} sm={6}>
          <CommonSelectInput name="type" label="Loại" required options={SomeEnumOptions} noNullOption />
        </Grid>
      </Grid>
    </CommonPopupForm>
  );
};
```

### Quy tắc Form

1. Validation Schema khai báo ngoài component (const level).
2. `enableReinitialize: true` — BẮT BUỘC khi dùng cho Create & Edit.
3. `setSubmitting(false)` trong `finally` — BẮT BUỘC.
4. Không dùng `useState` cho form values — Formik quản lý toàn bộ.

---

## VI. FILTER/SEARCH PATTERN — BỘ LỌC NGOÀI FORM

Filter **KHÔNG dùng Formik**, dùng controlled components + Zustand store:

```jsx
const MyFilter = () => {
  const { searchObject, setSearchObject, applyFilters } = useMyStore();
  const handleChange = (field, value) => {
    setSearchObject({ [field]: value });
    applyFilters();
  };
  return (
    <Card elevation={0} sx={{ mb: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
      <CardContent sx={{ p: '16px !important' }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={5}>
            <TextField fullWidth size="small" placeholder="Tìm kiếm..."
              value={searchObject.keyword || ''} onChange={(e) => handleChange('keyword', e.target.value)} />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField select fullWidth size="small" label="Trạng thái"
              value={searchObject.status || 'ALL'} onChange={(e) => handleChange('status', e.target.value)}>
              <MenuItem value="ALL">Tất cả</MenuItem>
              {TransactionStatusOptions.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>{opt.name}</MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};
```

**Lưu ý**: Filter ĐƯỢC PHÉP dùng `<TextField select>` + `<MenuItem>` trực tiếp (không trong Formik), nhưng **MenuItem value vẫn BẮT BUỘC dùng Enum**.
