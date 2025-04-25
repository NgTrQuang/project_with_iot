import React, { useEffect } from 'react';

const PersonalInfoForm = ({ formData, handleInputChange }) => { 
  useEffect(() => {
    // Gán giá trị taxId cho username
    handleInputChange({ target: { name: 'username', value: formData.taxId } });
  }, [formData.taxId, handleInputChange]);

  return (
    <fieldset className="mb-6">
    <legend className="text-lg font-semibold text-gray-700 mb-4">Thông tin cá nhân</legend>
      <div>
        <label htmlFor="username" className="text-gray-600 mb-2 block">
          Username (là mã số thuế doanh nghiệp của bạn)<span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="username"
          name="username"
          className="block w-full border border-gray-300 px-4 py-3 text-gray-600 text-sm rounded focus:ring-0 focus:border-primary placeholder-gray-400"
          placeholder="username"
          value={formData.username}
          onChange={handleInputChange}
          readOnly
          required
        />
      </div>
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
    </fieldset>
  );
};

export default PersonalInfoForm;
