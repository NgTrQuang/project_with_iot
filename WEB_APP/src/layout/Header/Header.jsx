import React from 'react';
import { useUserContext } from '../../components/context/UserContext';
import { Link } from 'react-router-dom';

const Header = () => {
  const { user } = useUserContext(); // Lấy thông tin người dùng từ context

  // const { fetchProducts, setSearchTerm } = useProductContext(); // Lấy hàm setSearchTerm từ context
  
  return (
    <header className="py-3 shadow-sm bg-white">
      <div className="container flex items-center justify-between">
        <div className="hidden md:flex w-full max-w-xl relative flex-grow">
        </div>
        {user ? (
        <div className="flex items-center space-x-3">
          <Link to="/notifications" className="text-center text-gray-700 hover:text-primary transition relative">
            <div className="text-sm">
              {/* <i className="fa-regular fa-heart"></i> */}
              <i className="fa-solid fa-bell"></i>
            </div>
            <div className="text-xs leading-3">Thông báo</div>
          </Link>
          <Link to="/settings" className="text-center text-gray-700 hover:text-primary transition relative">
            <div className="text-sm">
              <i class="fa-solid fa-gear"></i>
            </div>
            <div className="text-xs leading-3">Cài đặt</div>
          </Link>
          {/* <a href="/profile" className="text-center text-gray-700 hover:text-primary transition relative">
            <div className="text-sm">
              <i class="fa-solid fa-user"></i>
            </div>
            <div className="text-xs leading-3">{user.username}</div>
          </a> */}
        </div>
        ) : (
        <div className="flex items-center space-x-3">
          <Link to="/login" className="text-center text-gray-700 hover:text-primary transition relative">
            <div className="text-sm">
              <i className="fa-solid fa-bell"></i>
            </div>
            <div className="text-xs leading-3">Thông báo</div>
          </Link>
          <Link to="/login" className="text-center text-gray-700 hover:text-primary transition relative">
            <div className="text-sm">
              <i class="fa-solid fa-gear"></i>
            </div>
            <div className="text-xs leading-3">Cài đặt</div>
          </Link>
          {/* <a href="/login" className="text-center text-gray-700 hover:text-primary transition relative">
            <div className="text-sm">
              <i class="fa-solid fa-user"></i>
            </div>
            <div className="text-xs leading-3">Tài khoản</div>
          </a> */}
        </div>
        )}
      </div>
    </header>
  );
};

export default Header;
