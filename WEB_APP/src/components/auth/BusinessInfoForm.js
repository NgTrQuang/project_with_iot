import React from 'react';

const BusinessInfoForm = ({ formData, handleInputChange, errors }) => {
  return (
    <fieldset className="mb-6">
      <legend className="text-lg font-semibold text-gray-700 mb-4">Thông tin doanh nghiệp/tổ chức</legend>
      <div>
        <label htmlFor="businessName" className="text-gray-600 mb-2 block">
          Tên doanh nghiệp <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="businessName"
          name="businessName"
          className="block w-full border border-gray-300 px-4 py-3 text-gray-600 text-sm rounded"
          value={formData.businessName}
          onChange={handleInputChange}
          required
        />
        {errors.businessName && <p className="text-red-500">{errors.businessName}</p>}
      </div>
      <div>
        <label htmlFor="taxId" className="text-gray-600 mb-2 block">
          Mã số thuế <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="taxId"
          name="taxId"
          className="block w-full border border-gray-300 px-4 py-3 text-gray-600 text-sm rounded"
          value={formData.taxId}
          onChange={handleInputChange}
          required
        />
        {errors.taxId && <p className="text-red-500">{errors.taxId}</p>}
      </div>
      <div>
        <label htmlFor="businessEmail" className="text-gray-600 mb-2 block">
          Email doanh nghiệp <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          id="businessEmail"
          name="businessEmail"
          className="block w-full border border-gray-300 px-4 py-3 text-gray-600 text-sm rounded"
          value={formData.businessEmail}
          onChange={handleInputChange}
          required
        />
        {errors.businessEmail && <p className="text-red-500">{errors.businessEmail}</p>}
      </div>
      <div>
        <label htmlFor="phoneNumberBusiness" className="text-gray-600 mb-2 block">
          Số điện thoại doanh nghiệp <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="phoneNumberBusiness"
          name="phoneNumberBusiness"
          className="block w-full border border-gray-300 px-4 py-3 text-gray-600 text-sm rounded"
          value={formData.phoneNumberBusiness}
          onChange={handleInputChange}
          required
        />
        {errors.phoneNumberBusiness && <p className="text-red-500">{errors.phoneNumberBusiness}</p>}
      </div>
      <div>
        <label htmlFor="addressBusiness" className="text-gray-600 mb-2 block">
          Địa chỉ doanh nghiệp <span className="text-red-500">*</span>
        <span className="text-yellow-500 ml-2 text-sm italic">
          (Vui lòng nhập địa chỉ chính xác vì đây là địa chỉ để chúng tôi có thể đến phục vụ và hỗ trợ tốt nhất cho bạn!)
        </span>
        </label>
        <input
          type="text"
          id="addressBusiness"
          name="addressBusiness"
          className="block w-full border border-gray-300 px-4 py-3 text-gray-600 text-sm rounded"
          value={formData.addressBusiness}
          onChange={handleInputChange}
          required
        />
        {errors.addressBusiness && <p className="text-red-500">{errors.addressBusiness}</p>}
      </div>
    </fieldset>
  );
};

export default BusinessInfoForm;
