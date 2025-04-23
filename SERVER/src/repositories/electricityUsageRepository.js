const ElectricityUsage = require('../models/electricityUsage');

class ElectricityUsageRepository {

  // Lấy tất cả các bản ghi sử dụng điện
  async getAllElectricityUsage() {
    try {
      return await ElectricityUsage.find().populate('userId').populate('deviceId');
    } catch (error) {
      throw new Error('Không thể lấy danh sách sử dụng điện');
    }
  }

  // Lấy thông tin sử dụng điện theo ID
  async getElectricityUsageById(electricityUsageId) {
    try {
      return await ElectricityUsage.findById(electricityUsageId).populate('userId').populate('deviceId');
    } catch (error) {
      throw new Error(`Không thể tìm thấy thông tin sử dụng điện với ID: ${electricityUsageId}`);
    }
  }

  // Tạo mới bản ghi sử dụng điện
  async createElectricityUsage(electricityUsageData) {
    try {
      const newElectricityUsage = new ElectricityUsage(electricityUsageData);
      return await newElectricityUsage.save();
    } catch (error) {
      throw new Error('Không thể tạo bản ghi sử dụng điện');
    }
  }

  // Cập nhật bản ghi sử dụng điện
  async updateElectricityUsage(electricityUsageId, updateData) {
    try {
      return await ElectricityUsage.findByIdAndUpdate(electricityUsageId, updateData, { new: true });
    } catch (error) {
      throw new Error(`Không thể cập nhật bản ghi sử dụng điện với ID: ${electricityUsageId}`);
    }
  }

  // Xóa bản ghi sử dụng điện
  async deleteElectricityUsage(electricityUsageId) {
    try {
      return await ElectricityUsage.findByIdAndDelete(electricityUsageId);
    } catch (error) {
      throw new Error(`Không thể xóa bản ghi sử dụng điện với ID: ${electricityUsageId}`);
    }
  }

  // Lấy thông tin sử dụng điện theo userId và deviceId
  async getElectricityUsageByUserAndDevice(userId, deviceId) {
    try {
      return await ElectricityUsage.find({ userId, deviceId }).populate('userId').populate('deviceId');
    } catch (error) {
      throw new Error('Không thể tìm thông tin sử dụng điện cho người dùng và thiết bị này');
    }
  }

  // Lấy thông tin sử dụng điện theo thời gian
  async getElectricityUsageByTimestamp(timestamp) {
    try {
      return await ElectricityUsage.find({ timestamp }).populate('userId').populate('deviceId');
    } catch (error) {
      throw new Error(`Không thể tìm thấy bản ghi sử dụng điện với thời gian: ${timestamp}`);
    }
  }

  // Tính toán tổng năng lượng tiêu thụ trong một khoảng thời gian cho người dùng và thiết bị
  async getTotalEnergyConsumption(userId, deviceId, startTime, endTime) {
    try {
      const data = await ElectricityUsage.aggregate([
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
            totalEnergy: { $sum: "$energy" }
          }
        }
      ]);
      return data[0] ? data[0].totalEnergy : 0;
    } catch (error) {
      throw new Error('Không thể tính toán tổng năng lượng tiêu thụ');
    }
  }
}

module.exports = new ElectricityUsageRepository();
