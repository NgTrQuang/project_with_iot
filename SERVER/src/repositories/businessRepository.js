const Business = require('../models/business');

class BusinessRepository {

  // Lấy tất cả doanh nghiệp
  async getAllBusinesses() {
    try {
      return await Business.find().populate('electricityRate waterRate businessManager bankAccount');
    } catch (error) {
      throw new Error('Không thể lấy danh sách doanh nghiệp');
    }
  }

  // Lấy doanh nghiệp theo ID
  async getBusinessById(businessId) {
    try {
      return await Business.findById(businessId).populate('electricityRate waterRate businessManager bankAccount');
    } catch (error) {
      throw new Error(`Không thể tìm thấy doanh nghiệp với ID: ${businessId}`);
    }
  }

  // Tạo mới doanh nghiệp
  async createBusiness(businessData) {
    try {
      const newBusiness = new Business(businessData);
      return await newBusiness.save();
    } catch (error) {
      throw new Error('Không thể tạo doanh nghiệp mới');
    }
  }

  // Cập nhật doanh nghiệp
  async updateBusiness(businessId, updateData) {
    try {
      return await Business.findByIdAndUpdate(businessId, updateData, { new: true });
    } catch (error) {
      throw new Error(`Không thể cập nhật doanh nghiệp với ID: ${businessId}`);
    }
  }

  // Xóa doanh nghiệp
  async deleteBusiness(businessId) {
    try {
      return await Business.findByIdAndDelete(businessId);
    } catch (error) {
      throw new Error(`Không thể xóa doanh nghiệp với ID: ${businessId}`);
    }
  }

  // Tìm doanh nghiệp theo tên
  async getBusinessByName(businessName) {
    try {
      return await Business.findOne({ businessName }).populate('electricityRate waterRate businessManager bankAccount');
    } catch (error) {
      throw new Error(`Không thể tìm doanh nghiệp với tên: ${businessName}`);
    }
  }

  // Cập nhật trạng thái hoạt động của doanh nghiệp
  async updateBusinessStatus(businessId, isActive) {
    try {
      return await Business.findByIdAndUpdate(businessId, { isActive }, { new: true });
    } catch (error) {
      throw new Error(`Không thể cập nhật trạng thái doanh nghiệp với ID: ${businessId}`);
    }
  }
}

module.exports = new BusinessRepository();
