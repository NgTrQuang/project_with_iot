import React, { useState } from 'react';
import api from '../../api/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../context/UserContext';
import ReCAPTCHA from 'react-google-recaptcha'; //để xác thực captcha

const Login = () => {
  const navigate = useNavigate();
  const { login } = useUserContext();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [captchaValue, setCaptchaValue] = useState(null); // Giá trị CAPTCHA
  const [showPassword, setShowPassword] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('API URL:', API_URL);

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
      const response = await api.post('/api/auth/login', {
        username,
        password,
        // captcha: captchaValue, gửi lên backend xác thực
      });

      if (response.data) {
        const { token, user } = response.data;

        console.log(token);

        login(user);
        const trialExpirationDate = new Date(user.trialExpirationDate);
        const trialDateString = trialExpirationDate.toLocaleDateString();
        
        if (trialDateString){
          alert(`Chúc mừng bạn đã đăng nhập thành công! Thời gian dùng thử của bạn sẽ hết hạn vào: ${trialDateString}`);
        }
        
        navigate('/'); 
        const successMessage = 'Đăng nhập thành công, ' + user?.username;
        
        // Show success toast notification
        toast.success(successMessage, {
          position: "top-right",
          autoClose: 3000, // tự đóng sau 3 giây
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        // Optionally, redirect the user or update the state to show user info
        console.log('Người dùng đăng nhập:', user);
      }
    } catch (err) {
      let errorMessage = 'Thỉnh thoảng có lỗi. Vui lòng thử lại!';
      if (err.response && err.response.data) {
        errorMessage = err.response?.data?.message;
        toast.error(errorMessage, {
          position: "top-right",
          autoClose: 3000, // tự đóng sau 3 giây
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } else {
        errorMessage = ('Thỉnh thoảng có lỗi. Vui lòng thử lại lần nữa!');
        toast.error(errorMessage, {
          position: "top-right",
          autoClose: 3000, // tự đóng sau 3 giây
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    }
  };

  return (
    <div className="contain py-16">
      <div className="max-w-lg mx-auto shadow px-6 py-7 rounded overflow-hidden">
        <h2 className="text-2xl uppercase font-medium mb-1">Đăng nhập</h2>
        <p className="text-gray-600 mb-6 text-sm">Chào mừng trở lại</p>
        <form onSubmit={handleSubmit} autoComplete="off">
          <div className="space-y-2">
            <div>
              <label htmlFor="username" className="text-gray-600 mb-2 block">
                Tên đăng nhập
              </label>
              <input
                type="text"
                name="username"
                id="username"
                className="block w-full border border-gray-300 px-4 py-3 text-gray-600 text-sm rounded focus:ring-0 focus:border-primary placeholder-gray-400"
                placeholder="Tên đăng nhập"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className='relative'>
              <label htmlFor="password" className="text-gray-600 mb-2 block">
                Mật khẩu
              </label>
              <div className='flex items-center'>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  id="password"
                  className="block w-full border border-gray-300 px-4 py-3 text-gray-600 text-sm rounded focus:ring-0 focus:border-primary placeholder-gray-400"
                  placeholder="********"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <i
                  onClick={() => setShowPassword(!showPassword)}  // Đổi trạng thái khi nhấn vào icon
                  className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'} cursor-pointer text-gray-600 -ml-8`}   // top-2/3 absolute right-2 transform -translate-y-1/2 
                ></i>
              </div>
            </div>
            {/* Thêm reCAPTCHA */}
            <div className="mt-4">
              <ReCAPTCHA
                sitekey="YOUR_RECAPTCHA_SITE_KEY" // Thay bằng site key của bạn
                onChange={(value) => setCaptchaValue(value)}
              />
            </div>
          </div>
          {/* <div className="flex items-center justify-between mt-6">
            <div className="flex items-center">
              <input
                type="checkbox"
                name="remember"
                id="remember"
                className="text-primary focus:ring-0 rounded-sm cursor-pointer"
              />
              <label htmlFor="remember" className="text-gray-600 ml-3 cursor-pointer">
                Nhớ mật khẩu
              </label>
            </div>
            <a href="#" className="text-primary">Quên mật khẩu</a>
          </div> */}
          <div className="mt-4">
            <button
              type="submit"
              className="block w-full py-2 text-center text-white bg-primary border border-primary rounded hover:bg-transparent hover:text-primary transition uppercase font-roboto font-medium"
            >
              Đăng nhập
            </button>
          </div>
        </form>
        <p className="mt-4 text-center text-gray-600">
          Chưa có tài khoản? <a href="/register" className="text-primary">Đăng ký ở đây</a>
        </p>
      </div>    
      <ToastContainer/>
    </div>
  );
};

export default Login;
