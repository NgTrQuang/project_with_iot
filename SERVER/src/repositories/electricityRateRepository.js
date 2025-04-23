const ElectricityRate = require('../models/electricityRate');

class ElectricityRateRepository {

  // Lấy tất cả các bản ghi giá điện
  async getAllElectricityRates() {
    try {
      return await ElectricityRate.find().populate('businessId').populate('userId');
    } catch (error) {
      throw new Error('Không thể lấy danh sách giá điện');
    }
  }

  // Lấy thông tin giá điện theo ID
  async getElectricityRateById(electricityRateId) {
    try {
      return await ElectricityRate.findById(electricityRateId).populate('businessId').populate('userId');
    } catch (error) {
      throw new Error(`Không thể tìm thấy thông tin giá điện với ID: ${electricityRateId}`);
    }
  }

  // Tạo mới bản ghi giá điện
  async createElectricityRate(electricityRateData) {
    try {
      const newElectricityRate = new ElectricityRate(electricityRateData);
      return await newElectricityRate.save();
    } catch (error) {
      throw new Error('Không thể tạo bản ghi giá điện');
    }
  }

  // Cập nhật bản ghi giá điện
  async updateElectricityRate(electricityRateId, updateData) {
    try {
      return await ElectricityRate.findByIdAndUpdate(electricityRateId, updateData, { new: true });
    } catch (error) {
      throw new Error(`Không thể cập nhật bản ghi giá điện với ID: ${electricityRateId}`);
    }
  }

  // Xóa bản ghi giá điện
  async deleteElectricityRate(electricityRateId) {
    try {
      return await ElectricityRate.findByIdAndDelete(electricityRateId);
    } catch (error) {
      throw new Error(`Không thể xóa bản ghi giá điện với ID: ${electricityRateId}`);
    }
  }

  // Tính toán giá trị điện dựa trên mức sử dụng và loại giá
  async calculateElectricityBill(electricityUsage, electricityRateId) {
    try {
      const electricityRate = await ElectricityRate.findById(electricityRateId);

      if (!electricityRate) {
        throw new Error('Không tìm thấy bản ghi giá điện');
      }

      let billAmount = 0;

      if (electricityRate.rateType === 'flat') {
        // Nếu là giá đồng giá
        billAmount = electricityUsage * electricityRate.flatRate;
      } else if (electricityRate.rateType === 'tiered') {
        // Nếu là giá bậc thang
        for (let tier of electricityRate.tiers) {
          const [minUsage, maxUsage] = tier.range;
          if (electricityUsage >= minUsage && electricityUsage <= maxUsage) {
            billAmount = electricityUsage * tier.rate;
            break;
          }
        }
      }

      return billAmount;
    } catch (error) {
      throw new Error('Không thể tính toán hóa đơn điện');
    }
  }
}

module.exports = new ElectricityRateRepository();
