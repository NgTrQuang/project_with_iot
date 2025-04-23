import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useUserContext } from '../../components/context/UserContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import api from '../../api/api';

const Sidebar = () => {
  const { user, logout } = useUserContext(); // Lấy thông tin người dùng từ context
  const navigate = useNavigate();

  const handleLogout = async () => {
    const response = await api.post('/api/auth/logout');
    logout(); // Gọi hàm logout từ context
    console.log(response.data.message);
    navigate('/login'); // Điều hướng đến trang đăng nhập
    toast.success('Log out successfully!', {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };
  
  const menuItemsForUsers = [
    { path: '/', label: 'Trang chủ', icon: 'fa-solid fa-house' },
    { path: '/electric', label: 'Quản lý điện dân dụng', icon: 'fa-solid fa-bolt' },
    { path: '/water', label: 'Quản lý nước sinh hoạt', icon: 'fa-solid fa-water' },
    { path: '/solar-energy', label: 'Năng lượng mặt trời', icon: 'fa-solid fa-solar-panel' },
    { path: '/invoices', label: 'Hóa đơn', icon: 'fa-solid fa-file-invoice-dollar' },
    { path: '/payments', label: 'Thanh toán', icon: 'fa-solid fa-credit-card' },
    { path: '/about-us', label: 'Về chúng tôi', icon: 'fa-solid fa-address-book' },
    { path: '/contact', label: 'Liên hệ', icon: 'fa-solid fa-phone' },
  ];

  const menuItemsForBusinesses = [
    { path: '/', label: 'Trang chủ', icon: 'fa-solid fa-house' },
    { path: '/users', label: 'Quản lý người dùng', icon: 'fa-solid fa-users' },
    { path: '/electric-business', label: 'Quản lý điện dân dụng', icon: 'fa-solid fa-bolt' },
    { path: '/water-business', label: 'Quản lý nước sinh hoạt', icon: 'fa-solid fa-water' },
    { path: '/solar-energy-business', label: 'Năng lượng mặt trời', icon: 'fa-solid fa-solar-panel' },
    { path: '/invoices-business', label: 'Hóa đơn', icon: 'fa-solid fa-file-invoice-dollar' },
    { path: '/about-us', label: 'Về chúng tôi', icon: 'fa-solid fa-address-book' },
    { path: '/contact', label: 'Liên hệ', icon: 'fa-solid fa-phone' },
  ];

  const menuItemsForAll = [
    { path: '/', label: 'Trang chủ', icon: 'fa-solid fa-house' },
    { path: '/users', label: 'Quản lý người dùng', icon: 'fa-solid fa-users' },
    { path: '/electric', label: 'Quản lý điện dân dụng', icon: 'fa-solid fa-bolt' },
    { path: '/water', label: 'Quản lý nước sinh hoạt', icon: 'fa-solid fa-water' },
    { path: '/solar-energy', label: 'Năng lượng mặt trời', icon: 'fa-solid fa-solar-panel' },
    { path: '/invoices', label: 'Hóa đơn', icon: 'fa-solid fa-file-invoice-dollar' },
    { path: '/broadcasts', label: 'Trạm thông báo', icon: 'fa-solid fa-bullhorn' },
    { path: '/reports', label: 'Thống kê và báo cáo', icon: 'fa-solid fa-chart-bar' },
    { path: '/about-us', label: 'Về chúng tôi', icon: 'fa-solid fa-address-book' },
    { path: '/contact', label: 'Liên hệ', icon: 'fa-solid fa-phone' },
  ];

  const authItems = user
    ? [
        { path: '/profile', label: `Tài khoản (${user.username})`, icon: 'fa-solid fa-user' },
        { path: '/login', label: 'Đăng xuất', icon: 'fa-solid fa-right-from-bracket', action: handleLogout },
      ]
    : [
        { path: '/login', label: 'Đăng nhập', icon: 'fa-solid fa-right-to-bracket' },
        { path: '/register', label: 'Đăng ký', icon: 'fa-solid fa-user-plus' },
      ];

  const getMenuItems = () => {
    switch (user?.role?.code) {
      case 0: // Người dùng cuối
        return menuItemsForUsers;
      case 3: // Doanh nghiệp/Tổ chức
      case 4:
        return menuItemsForBusinesses;
      case 1: // Admin hoặc Siêu Admin
      case 2:
        return menuItemsForAll;
      default:
        return [];
    }
  };

  return (
    <aside className="w-64 h-screen bg-gray-50 shadow-md fixed top-0 left-0">
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center justify-center py-4 border-b">
          <Link to="/" className="text-primary">
            <img src="assets/images/logo.jpg" alt="Logo" className="w-28 md:w-34" />
          </Link>
        </div>

        {/* Menu */}
        <nav className="flex-1 px-4 py-4 space-y-2">
          {getMenuItems().map((item, index) => (
            <NavLink
              key={index}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition ${
                  isActive ? 'bg-gray-100 text-primary' : 'text-gray-700'
                }`
              }
            >
              <i className={`${item.icon} text-sm`}></i>
              <span className="text-sm">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Authentication */}
        <div className="px-4 py-4 border-t">
          {authItems.map((item, index) => (
            <NavLink
              key={index}
              to={item.path}
              onClick={item.action ? item.action : undefined} // Nếu có hàm action (logout), gọi nó
              className={({ isActive }) =>
                `flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition ${
                  isActive ? 'bg-gray-100 text-primary' : 'text-gray-700'
                }`
              }
            >
              <i className={`${item.icon} text-sm`}></i>
              <span className="text-sm">{item.label}</span>
            </NavLink>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
