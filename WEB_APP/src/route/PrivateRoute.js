import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUserContext } from '../components/context/UserContext';

const PrivateRoute = ({ component: Component }) => {
  const { user } = useUserContext(); // Lấy thông tin người dùng từ context

  if (!user) {
    // Nếu không có người dùng, điều hướng đến trang đăng nhập
    return <Navigate to="/login" replace />;
  }

  // Nếu có người dùng, hiển thị component được bảo vệ
  return <Component />;
};

export default PrivateRoute;
