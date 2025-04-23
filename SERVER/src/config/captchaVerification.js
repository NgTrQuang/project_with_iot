const axios = require('axios');

// Hàm xác thực reCAPTCHA
const verifyCaptcha = async (captchaValue) => {
  const SECRET_KEY = 'YOUR_GOOGLE_RECAPTCHA_SECRET_KEY';  // Thay thế bằng secret key của bạn
  try {
    const response = await axios.post(`https://www.google.com/recaptcha/api/siteverify`, null, {
      params: {
        secret: SECRET_KEY,
        response: captchaValue,
      }
    });

    return response.data.success;  // Trả về true nếu CAPTCHA hợp lệ, false nếu không
  } catch (error) {
    console.error('Error verifying CAPTCHA:', error);
    return false;
  }
};

module.exports = verifyCaptcha; // Export hàm để sử dụng ở nơi khác
