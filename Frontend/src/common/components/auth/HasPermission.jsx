import React from 'react';
import useAuthStore from '@/stores/authStore';

const HasPermission = ({ roles = [], children }) => {
  const { user } = useAuthStore();

  if (!user || !user.role) {
    return null;
  }

  const hasRole = roles.includes(user.role);
  if (!hasRole) {
    return null;
  }

  return <>{children}</>;
};

export default HasPermission;
