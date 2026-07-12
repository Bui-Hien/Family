import { useEffect } from 'react';
import { useFormikContext } from 'formik';

// Hàm đệ quy để tìm chính xác name/id của trường lỗi đầu tiên (Hỗ trợ Object lồng nhau)
const getFirstErrorKey = (obj, prefix = '') => {
  for (const key in obj) {
    const value = obj[key];

    // Xử lý format mảng của Formik (vd: users[0].name thay vì users.0.name)
    const isArrayIndex = Array.isArray(obj) && !isNaN(key);
    const currentKey = prefix
        ? (isArrayIndex ? `${prefix}[${key}]` : `${prefix}.${key}`)
        : key;

    if (typeof value === 'object' && value !== null) {
      const nestedKey = getFirstErrorKey(value, currentKey);
      if (nestedKey) return nestedKey;
    } else {
      return currentKey;
    }
  }
  return null;
};

const FormikFocusError = () => {
  // Sử dụng submitCount thay vì isSubmitting để bắt chính xác sự kiện Submit thất bại
  const { errors, submitCount, isValidating } = useFormikContext();

  useEffect(() => {
    // Chỉ chạy khi đã bấm submit, quá trình validate đã xong, và có lỗi tồn tại
    if (submitCount > 0 && !isValidating && Object.keys(errors).length > 0) {
      const firstErrorKey = getFirstErrorKey(errors);

      if (firstErrorKey) {
        // Ưu tiên tìm theo thuộc tính name (chuẩn của Formik) rồi mới đến id
        const errorElement =
            document.querySelector(`[name="${firstErrorKey}"]`) ||
            document.getElementById(firstErrorKey);

        if (errorElement) {
          // 1. Focus nhưng cấm trình duyệt tự cuộn (tránh giật màn hình)
          errorElement.focus({ preventScroll: true });

          // 2. Tự cuộn mượt mà đưa Element vào giữa màn hình
          errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    }
  }, [submitCount, isValidating, errors]);

  return null; // Renderless Component
};

export default FormikFocusError;