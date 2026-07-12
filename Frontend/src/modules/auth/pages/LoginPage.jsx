import React from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { Box, Button, Link } from '@mui/material';
import CommonTextField from '@/common/components/form/CommonTextField';
import CommonPasswordInput from '@/common/components/form/CommonPasswordInput';
import { useAuthPageStore } from '@/modules/auth/store/useAuthPageStore';

const validationSchema = Yup.object({
  username: Yup.string().required('Tên đăng nhập không được để trống'),
  password: Yup.string().required('Mật khẩu không được để trống'),
});

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuthPageStore();

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const result = await login(values);
      if (result.success) {
        navigate('/dashboard');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={{ username: '', password: '' }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <Form>
          <Box sx={{ mt: 1 }}>
            <CommonTextField
              name="username"
              label="Tên đăng nhập"
              required
            />
            <CommonPasswordInput
              name="password"
              label="Mật khẩu"
              required
            />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
              <Link component={RouterLink} to="/auth/forgot-password" variant="body2" color="primary" sx={{ textDecoration: 'none' }}>
                Quên mật khẩu?
              </Link>
            </Box>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={isSubmitting}
              sx={{ mt: 1, mb: 2, height: 42 }}
            >
              Đăng nhập
            </Button>
          </Box>
        </Form>
      )}
    </Formik>
  );
};

export default LoginPage;
