import React from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { Box, Button, Link } from '@mui/material';
import CommonTextField from '@/common/components/form/CommonTextField';
import { useAuthPageStore } from '@/modules/auth/store/useAuthPageStore';

const validationSchema = Yup.object({
  email: Yup.string().email('Email không đúng định dạng').required('Email không được để trống'),
});

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const { forgotPassword } = useAuthPageStore();

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const result = await forgotPassword(values.email);
      if (result.success) {
        navigate('/auth/login');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={{ email: '' }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <Form>
          <Box sx={{ mt: 1 }}>
            <CommonTextField
              name="email"
              label="Địa chỉ Email"
              required
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={isSubmitting}
              sx={{ mt: 2, mb: 2, height: 42 }}
            >
              Gửi yêu cầu
            </Button>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
              <Link component={RouterLink} to="/auth/login" variant="body2" color="primary" sx={{ textDecoration: 'none' }}>
                Quay lại Đăng nhập
              </Link>
            </Box>
          </Box>
        </Form>
      )}
    </Formik>
  );
};

export default ForgotPasswordPage;
