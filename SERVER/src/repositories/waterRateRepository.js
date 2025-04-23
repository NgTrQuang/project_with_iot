const WaterRate = require('../models/waterRate');

class WaterRateRepository {

  // Lấy tất cả các bản ghi giá nước
  async getAllWaterRates() {
    try {
      return await WaterRate.find().populate('businessId').populate('userId');
    } catch (error) {
      throw new Error('Không thể lấy danh sách giá nước');
    }
  }

  // Lấy thông tin giá nước theo ID
  async getWaterRateById(waterRateId) {
    try {
      return await WaterRate.findById(waterRateId).populate('businessId').populate('userId');
    } catch (error) {
      throw new Error(`Không thể tìm thấy thông tin giá nước với ID: ${waterRateId}`);
    }
  }

  // Tạo mới bản ghi giá nước
  async createWaterRate(waterRateData) {
    try {
      const newWaterRate = new WaterRate(waterRateData);
      return await newWaterRate.save();
    } catch (error) {
      throw new Error('Không thể tạo bản ghi giá nước');
    }
  }

  // Cập nhật bản ghi giá nước
  async updateWaterRate(waterRateId, updateData) {
    try {
      return await WaterRate.findByIdAndUpdate(waterRateId, updateData, { new: true });
    } catch (error) {
      throw new Error(`Không thể cập nhật bản ghi giá nước với ID: ${waterRateId}`);
    }
  }

  // Xóa bản ghi giá nước
  async deleteWaterRate(waterRateId) {
    try {
      return await WaterRate.findByIdAndDelete(waterRateId);
    } catch (error) {
      throw new Error(`Không thể xóa bản ghi giá nước với ID: ${waterRateId}`);
    }
  }

  // Tính toán giá trị nước dựa trên mức sử dụng và loại giá
  async calculateWaterBill(waterUsage, waterRateId) {
    try {
      const waterRate = await WaterRate.findById(waterRateId);

      if (!waterRate) {
        throw new Error('Không tìm thấy bản ghi giá nước');
      }

      let billAmount = 0;

      if (waterRate.rateType === 'flat') {
        // Nếu là giá đồng giá
        billAmount = waterUsage * waterRate.flatRate;
      } else if (waterRate.rateType === 'tiered') {
        // Nếu là giá bậc thang
        for (let tier of waterRate.tiers) {
          const [minUsage, maxUsage] = tier.range;
          if (waterUsage >= minUsage && waterUsage <= maxUsage) {
            billAmount = waterUsage * tier.rate;
            break;
          }
        }
      }

      return billAmount;
    } catch (error) {
      throw new Error('Không thể tính toán hóa đơn nước');
    }
  }
}

module.exports = new WaterRateRepository();
