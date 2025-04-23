const WaterUsage = require('../models/waterUsage');

class WaterUsageRepository {

  // Lấy tất cả các bản ghi sử dụng nước
  async getAllWaterUsage() {
    try {
      return await WaterUsage.find().populate('userId').populate('deviceId');
    } catch (error) {
      throw new Error('Không thể lấy danh sách sử dụng nước');
    }
  }

  // Lấy thông tin sử dụng nước theo ID
  async getWaterUsageById(waterUsageId) {
    try {
      return await WaterUsage.findById(waterUsageId).populate('userId').populate('deviceId');
    } catch (error) {
      throw new Error(`Không thể tìm thấy thông tin sử dụng nước với ID: ${waterUsageId}`);
    }
  }

  // Tạo mới bản ghi sử dụng nước
  async createWaterUsage(waterUsageData) {
    try {
      const newWaterUsage = new WaterUsage(waterUsageData);
      return await newWaterUsage.save();
    } catch (error) {
      throw new Error('Không thể tạo bản ghi sử dụng nước');
    }
  }

  // Cập nhật bản ghi sử dụng nước
  async updateWaterUsage(waterUsageId, updateData) {
    try {
      return await WaterUsage.findByIdAndUpdate(waterUsageId, updateData, { new: true });
    } catch (error) {
      throw new Error(`Không thể cập nhật bản ghi sử dụng nước với ID: ${waterUsageId}`);
    }
  }

  // Xóa bản ghi sử dụng nước
  async deleteWaterUsage(waterUsageId) {
    try {
      return await WaterUsage.findByIdAndDelete(waterUsageId);
    } catch (error) {
      throw new Error(`Không thể xóa bản ghi sử dụng nước với ID: ${waterUsageId}`);
    }
  }

  // Lấy thông tin sử dụng nước theo userId và deviceId
  async getWaterUsageByUserAndDevice(userId, deviceId) {
    try {
      return await WaterUsage.find({ userId, deviceId }).populate('userId').populate('deviceId');
    } catch (error) {
      throw new Error('Không thể tìm thông tin sử dụng nước cho người dùng và thiết bị này');
    }
  }

  // Lấy thông tin sử dụng nước theo thời gian
  async getWaterUsageByTimestamp(timestamp) {
    try {
      return await WaterUsage.find({ timestamp }).populate('userId').populate('deviceId');
    } catch (error) {
      throw new Error(`Không thể tìm thấy bản ghi sử dụng nước với thời gian: ${timestamp}`);
    }
  }

  // Tính toán tổng lượng nước tiêu thụ trong một khoảng thời gian cho người dùng và thiết bị
  async getTotalWaterConsumption(userId, deviceId, startTime, endTime) {
    try {
      const data = await WaterUsage.aggregate([
        {
          $match: {
            userId: mongoose.Types.ObjectId(userId),
            deviceId: mongoose.Types.ObjectId(deviceId),
            timestamp: { $gte: startTime, $lte: endTime }
          }
        },
        {
          $group: {
            _id: null,
            totalConsumption: { $sum: "$totalConsumption" }
          }
        }
      ]);
      return data[0] ? data[0].totalConsumption : 0;
    } catch (error) {
      throw new Error('Không thể tính toán tổng lượng nước tiêu thụ');
    }
  }
}

module.exports = new WaterUsageRepository();
