import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import api from '../../api/api';
import ReCAPTCHA from 'react-google-recaptcha'; //để xác thực captcha

const RegisterPersonal = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    // password: '',
    fullName: '',
    address: '',
    phoneNumber: '',
    gender: 'male', // default value
  });
  
  const [isProcessing, setIsProcessing] = useState(false);

  const [captchaValue, setCaptchaValue] = useState(null); // Giá trị CAPTCHA
  // const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value || ''});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    // if (!captchaValue) {
    //   toast.error('Vui lòng xác nhận CAPTCHA!', {
    //     position: 'top-right',
    //     autoClose: 3000,
    //     hideProgressBar: false,
    //     closeOnClick: true,
    //     pauseOnHover: true,
    //     draggable: true,
    //   });
    //   return;
    // }
    try {
      const response = await api.post('/api/auth/register/individual', formData); // captcha: captchaValue, gửi lên backend xác thực
      const successMessage = 'Đăng ký thành công. Bạn đã có thể đăng nhập!'
      toast.success(successMessage, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      
      setFormData({
        username: '',
        email: '',
        // password: '',
        fullName: '',
        address: '',
        phoneNumber: '',
        gender: 'male',
      });

      navigate('/successfully');
    } catch (err) {
        let errorMessage = err.response.data.message;
        if (err.response && err.response.data) {
        toast.error(errorMessage, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        } else {
        errorMessage = 'Thỉnh thoảng có lỗi. Vui lòng thử lại!';
        toast.error(errorMessage, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
      navigate('/error');
    } finally {
      setIsProcessing(false); 
    }
  };

  return (
    <div className="container py-16">
      <div className="max-w-lg mx-auto shadow px-6 py-7 rounded overflow-hidden">
        <h2 className="text-2xl uppercase font-medium mb-1">Đăng ký cá nhân</h2>
        <p className="text-gray-600 mb-6 text-sm">Chào mừng đến với chúng tôi</p>
        <form onSubmit={handleSubmit} autoComplete="off">
          <div className="space-y-2">
            <div>
              <label htmlFor="username" className="text-gray-600 mb-2 block">
                Username <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="username"
                name="username"
                className="block w-full border border-gray-300 px-4 py-3 text-gray-600 text-sm rounded focus:ring-0 focus:border-primary placeholder-gray-400"
                placeholder="username"
                value={formData.username}
                onChange={handleInputChange}
                required
              />
            </div>
            {/* <div className="relative">
              <label htmlFor="password" className="text-gray-600 mb-2 block">
                Mật khẩu <span className="text-red-500">*</span>
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                className="block w-full border border-gray-300 px-4 py-3 text-gray-600 text-sm rounded focus:ring-0 focus:border-primary placeholder-gray-400"
                placeholder="********"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
              <i
                onClick={() => setShowPassword(!showPassword)}  // Đổi trạng thái khi nhấn vào icon
                className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'} item-centers absolute right-2 top-2/3 transform -translate-y-1/2 cursor-pointer text-gray-600`}
              ></i>
            </div> */}
            <div>
              <label htmlFor="email" className="text-gray-600 mb-2 block">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="block w-full border border-gray-300 px-4 py-3 text-gray-600 text-sm rounded focus:ring-0 focus:border-primary placeholder-gray-400"
                placeholder="example@gmail.com"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label htmlFor="fullName" className="text-gray-600 mb-2 block">
                Họ và tên <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                className="block w-full border border-gray-300 px-4 py-3 text-gray-600 text-sm rounded focus:ring-0 focus:border-primary placeholder-gray-400"
                placeholder="Trần Văn A"
                value={formData.fullName}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label className="text-gray-600 mb-2 block">
                Giới tính <span className="text-red-500">*</span>
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="gender"
                    value="male"
                    checked={formData.gender === 'male'}
                    onChange={handleInputChange}
                    className="form-radio"
                    required
                  />
                  <span className="ml-2">Nam</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="gender"
                    value="female"
                    checked={formData.gender === 'female'}
                    onChange={handleInputChange}
                    className="form-radio"
                  />
                  <span className="ml-2">Nữ</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="gender"
                    value="other"
                    checked={formData.gender === 'other'}
                    onChange={handleInputChange}
                    className="form-radio"
                  />
                  <span className="ml-2">Khác</span>
                </label>
              </div>
            </div>
            <div>
              <label htmlFor="phoneNumber" className="text-gray-600 mb-2 block">
                Số điện thoại <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="phoneNumber"
                name="phoneNumber"
                className="block w-full border border-gray-300 px-4 py-3 text-gray-600 text-sm rounded focus:ring-0 focus:border-primary placeholder-gray-400"
                placeholder="0123456789"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label htmlFor="address" className="text-gray-600 mb-2 block">
                Địa chỉ <span className="text-red-500">*</span>
                <span className="text-yellow-500 ml-2 text-sm italic">
                  (Vui lòng nhập địa chỉ chính xác vì đây là địa chỉ để chúng tôi có thể đến phục vụ và hỗ trợ tốt nhất cho bạn!)
                </span>
              </label>
              <input
                type="text"
                id="address"
                name="address"
                className="block w-full border border-gray-300 px-4 py-3 text-gray-600 text-sm rounded focus:ring-0 focus:border-primary placeholder-gray-400"
                placeholder="Số 145, Điện Biên Phủ, Khóm 1, Phường 6, TP Trà Vinh, Trà Vinh"
                value={formData.address}
                onChange={handleInputChange}
                required
              />
            </div>
            {/* Thêm reCAPTCHA */}
            {/* <div className="mt-4">
              <ReCAPTCHA
                sitekey="YOUR_RECAPTCHA_SITE_KEY" // Thay bằng site key của bạn
                onChange={(value) => setCaptchaValue(value)}
              />
            </div> */}
          </div>
          <div className="mt-4">
            <button
              type="submit"
              className="block w-full py-2 text-center text-white bg-primary border border-primary rounded hover:bg-transparent hover:text-primary transition uppercase font-roboto font-medium"
            >
              {isProcessing ? "Đang xử lý..." : "Đăng ký"}
            </button>
          </div>
        </form>
        <p className="mt-4 text-center text-gray-600">
          Bạn đã có tài khoản? <a href="/login" className="text-primary">Đăng nhập ngay</a>
        </p>
      </div>
      {isProcessing && (
        <div
        style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 9999,
            cursor: "not-allowed", 
        }}
        />
      )}
      <ToastContainer />
    </div>
  );
};

export default RegisterPersonal;
