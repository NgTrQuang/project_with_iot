import React, { useState } from 'react';
import api from '../../api/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../../components/context/UserContext';

const ChangePassword = () => {
  const { logout } = useUserContext();
  const navigate = useNavigate();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error('Mật khẩu mới và xác nhận mật khẩu không khớp!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }

    try {
      const response = await api.put('/api/users/change-password', {
        currentPassword,
        newPassword,
      });

      if (response.data) {
        handleLogout();
        // Reset fields
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (err) {
      let errorMessage = 'Có lỗi xảy ra. Vui lòng thử lại!';
      if (err.response && err.response.data) {
        errorMessage = err.response.data.message;
      }
      toast.error(errorMessage, {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const handleLogout = async () => {
    const response = await api.post('/api/auth/logout');
    logout(); // Gọi hàm logout từ context
    console.log(response.data.message);
    navigate('/login'); // Điều hướng đến trang đăng nhập
    toast.success('Đổi mật khẩu thành công vui lòng đăng nhập lại!', {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  return (
    <div className="md:col-span-2">
      <div className="bg-white shadow-md rounded-md p-6">
        <h4 className="text-lg font-medium text-gray-800 mb-4">Đổi mật khẩu</h4>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="currentPassword" className="block text-gray-600">
                Mật khẩu hiện tại
              </label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  id="currentPassword"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="input-box w-full"
                  placeholder="Nhập mật khẩu hiện tại"
                  required
                />
                <i
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className={`fa-solid ${
                    showCurrentPassword ? 'fa-eye-slash' : 'fa-eye'
                  } absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-600`}
                ></i>
              </div>
            </div>

            <div>
              <label htmlFor="newPassword" className="block text-gray-600">
                Mật khẩu mới
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="input-box w-full"
                  placeholder="Nhập mật khẩu mới"
                  required
                />
                <i
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className={`fa-solid ${
                    showNewPassword ? 'fa-eye-slash' : 'fa-eye'
                  } absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-600`}
                ></i>
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-gray-600">
                Xác nhận mật khẩu mới
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="input-box w-full"
                  placeholder="Xác nhận mật khẩu mới"
                  required
                />
                <i
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className={`fa-solid ${
                    showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'
                  } absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-600`}
                ></i>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <button
              type="submit"
              className="w-full py-2 px-4 text-white bg-primary border border-primary rounded-md hover:bg-transparent hover:text-primary transition font-medium"
            >
              Đổi mật khẩu
            </button>
          </div>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
};

export default ChangePassword;
