import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../../api/api';
import { useNavigate } from 'react-router-dom';
import BusinessInfoForm from './BusinessInfoForm';
import PersonalInfoForm from './PersonalInfoForm';
import ReCAPTCHA from 'react-google-recaptcha'; //để xác thực captcha

const RegisterBusiness = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
      username: '',
      email: '',
      fullName: '',
      address: '',
      phoneNumber: '',
      gender: 'male', // default value
      businessName: '',
      taxId: null,
      phoneNumberBusiness: '',
      addressBusiness: '',
      businessEmail: null
    });
    const [isProcessing, setIsProcessing] = useState(false);

    const [captchaValue, setCaptchaValue] = useState(null); // Giá trị CAPTCHA

    const [step, setStep] = useState(1);

    const [errors, setErrors] = useState({
      businessName: '',
      taxId: '',
      businessEmail: '',
      phoneNumberBusiness: '',
      addressBusiness: '',
    });

    // Kiểm tra thông tin doanh nghiệp
    const validateBusinessInfo = () => {
      const newErrors = {};
      if (!formData.businessName) newErrors.businessName = 'Tên doanh nghiệp là bắt buộc';
      if (!formData.taxId) newErrors.taxId = 'Mã số thuế là bắt buộc';
      if (!formData.businessEmail) newErrors.businessEmail = 'Email doanh nghiệp là bắt buộc';
      if (!formData.phoneNumberBusiness) newErrors.phoneNumberBusiness = 'Số điện thoại doanh nghiệp là bắt buộc';
      if (!formData.addressBusiness) newErrors.addressBusiness = 'Địa chỉ doanh nghiệp là bắt buộc';

      return newErrors;
    };

    const handleNextStep = () => {
      const businessErrors = validateBusinessInfo();
      
      if (Object.keys(businessErrors).length > 0) {
        setErrors(businessErrors); // Hiển thị lỗi nếu có
      } else {
        setErrors({}); // Reset lỗi nếu không có lỗi
        setStep(2); // Chuyển sang bước 2
      }
    };
  
    const handlePrevStep = () => {
      setStep(1); // Quay lại bước 1
    };

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
      console.log("send server: ", formData);
      const response = await api.post('/api/auth/register/business_user', formData); // captcha: captchaValue, gửi lên backend xác thực
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
        fullName: '',
        address: '',
        phoneNumber: '',
        gender: 'male',
        businessName: '',
        taxId: '',
        phoneNumberBusiness: '',
        addressBusiness: '',
        businessEmail: '',
      });

      navigate('/successfully');
    } catch (err) {
      let errorMessage = err.response.data.message;
      console.log("error: ", err.response.data.error);
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
        <h2 className="text-2xl uppercase font-medium mb-1">Đăng ký doanh nghiệp/tổ chức</h2>
        <p className="text-gray-600 mb-6 text-sm">Chào mừng đến với chúng tôi</p>
        <form onSubmit={handleSubmit} autoComplete="off">
          <div className="space-y-2">
            
            {/* Các trường cá nhân */}
            {step === 1 && (
              <BusinessInfoForm formData={formData} handleInputChange={handleInputChange} errors={errors} />
            )}
            {/* Các trường doanh nghiệp */}
            {step === 2 && (
              <>
              <PersonalInfoForm formData={formData} handleInputChange={handleInputChange} />
              {/* Thêm reCAPTCHA */}
              <div className="mt-4">
                <ReCAPTCHA
                  sitekey="YOUR_RECAPTCHA_SITE_KEY" // Thay bằng site key của bạn
                  onChange={(value) => setCaptchaValue(value)}
                />
              </div>
              </>
            )}
          </div>
          {/* <div className="mt-4">
            <button
              type="submit"
              className="block w-full py-2 text-center text-white bg-primary border border-primary rounded hover:bg-transparent hover:text-primary transition uppercase font-roboto font-medium"
            >
              Đăng ký
            </button>
          </div> */}
          <div className="flex justify-between mt-4">
            {/* Hiển thị nút "Quay lại" khi ở bước 2 */}
            {step === 2 && (
              <button
                type="button"
                onClick={handlePrevStep}
                className="bg-gray-300 text-gray-700 py-2 px-4 rounded"
              >
                Quay lại
              </button>
            )}

            {/* Hiển thị nút "Tiếp theo" hoặc "Gửi" */}
            <button
              type="button"
              onClick={step === 1 ? handleNextStep : handleSubmit}
              className="bg-primary text-white py-2 px-4 rounded"
            >
              {step === 1 ? 'Tiếp theo' : isProcessing ? "Đang xử lý..." : "Đăng ký"}
              {/* {isProcessing ? "Đang xử lý..." : "Đăng ký"} */}
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

export default RegisterBusiness;
