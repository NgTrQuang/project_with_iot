const Device = require('../models/device');

class DeviceRepository {

  // Lấy tất cả thiết bị của người dùng theo trạng thái
  async getAllDevicesByUserId(userId, deviceStatus = null) {
    try {
      const query = { userId };
      if (deviceStatus) {
        query.deviceStatus = deviceStatus;
      }
      return await Device.find(query);
    } catch (error) {
      throw new Error('Không thể lấy danh sách thiết bị của người dùng');
    }
  }

  // Lấy thiết bị theo ID
  async getDeviceById(deviceId) {
    try {
      return await Device.findById(deviceId);
    } catch (error) {
      throw new Error(`Không tìm thấy thiết bị với ID: ${deviceId}`);
    }
  }

  // Lấy thiết bị theo mã số thiết bị (deviceSerialNumber)
  async getDeviceBySerialNumber(deviceSerialNumber) {
    try {
      return await Device.findOne({ deviceSerialNumber });
    } catch (error) {
      throw new Error(`Không tìm thấy thiết bị với mã số: ${deviceSerialNumber}`);
    }
  }

  // Tạo thiết bị mới
  async createDevice(deviceData) {
    try {
      const newDevice = new Device(deviceData);
      return await newDevice.save();
    } catch (error) {
      throw new Error('Không thể tạo thiết bị mới');
    }
  }

  // Cập nhật thiết bị
  async updateDevice(deviceId, updateData) {
    try {
      return await Device.findByIdAndUpdate(deviceId, updateData, { new: true });
    } catch (error) {
      throw new Error(`Không thể cập nhật thiết bị với ID: ${deviceId}`);
    }
  }

  // Xóa thiết bị
  async deleteDevice(deviceId) {
    try {
      return await Device.findByIdAndDelete(deviceId);
    } catch (error) {
      throw new Error(`Không thể xóa thiết bị với ID: ${deviceId}`);
    }
  }

  // Lấy tất cả thiết bị theo doanh nghiệp
  async getAllDevicesByBusinessId(businessId) {
    try {
      return await Device.find({ businessId });
    } catch (error) {
      throw new Error('Không thể lấy danh sách thiết bị theo doanh nghiệp');
    }
  }

  // Cập nhật trạng thái thiết bị
  async updateDeviceStatus(deviceId, status) {
    try {
      return await Device.findByIdAndUpdate(deviceId, { deviceStatus: status }, { new: true });
    } catch (error) {
      throw new Error(`Không thể cập nhật trạng thái thiết bị với ID: ${deviceId}`);
    }
  }
}

module.exports = new DeviceRepository();
