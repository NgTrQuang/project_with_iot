const Device = require('../models/device');

// Tạo thiết bị mới
const createDevice = async (req, res) => {
  try {
    const newDevice = new Device({
      ...req.body,
      userId: req.user.id // Lấy userId từ token JWT hoặc session
    });

    await newDevice.save();
    res.status(201).json({
      message: 'Device created successfully.',
      device: newDevice
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while creating device.' });
  }
};

// Lấy tất cả thiết bị của người dùng
const getAllDevices = async (req, res) => {
  try {
    const { deviceType, deviceStatus } = req.query; // Lọc theo deviceType và deviceStatus
    const filters = { userId: req.user.id };

    if (deviceType) filters.deviceType = deviceType;
    if (deviceStatus) filters.deviceStatus = deviceStatus;

    const devices = await Device.find(filters);
    if (!devices || devices.length === 0) {
      return res.status(404).json({ message: 'No devices found.' });
    }

    res.status(200).json({
      mesage: 'Dữ liệu được lấy thành công!',
      data: devices,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while fetching devices.' });
  }
};

// Lấy thông tin chi tiết thiết bị theo ID
const getDeviceById = async (req, res) => {
  try {
    const device = await Device.findById(req.params.deviceId);
    if (!device) {
      return res.status(404).json({ message: 'Device not found.' });
    }

    res.status(200).json(device);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while fetching device.' });
  }
};

// Cập nhật thông tin thiết bị
const updateDevice = async (req, res) => {
  try {
    const device = await Device.findByIdAndUpdate(req.params.deviceId, req.body, { new: true });
    if (!device) {
      return res.status(404).json({ message: 'Device not found.' });
    }

    res.status(200).json({
      message: 'Device updated successfully.',
      device
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while updating device.' });
  }
};

// Xóa thiết bị
const deleteDevice = async (req, res) => {
  try {
    const device = await Device.findByIdAndDelete(req.params.deviceId);
    if (!device) {
      return res.status(404).json({ message: 'Device not found.' });
    }

    res.status(200).json({ message: 'Device deleted successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while deleting device.' });
  }
};

// Lọc thiết bị theo trạng thái
const getDevicesByStatus = async (req, res) => {
  try {
    const { deviceStatus } = req.query;
    if (!deviceStatus) {
      return res.status(400).json({ message: 'Device status is required.' });
    }

    const devices = await Device.find({
      userId: req.user.id,
      deviceStatus
    });
    if (!devices || devices.length === 0) {
      return res.status(404).json({ message: `No devices found with status: ${deviceStatus}` });
    }

    res.status(200).json(devices);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while filtering devices by status.' });
  }
};

// Tìm kiếm thiết bị theo tên hoặc mã số
const searchDevices = async (req, res) => {
  try {
    const { searchTerm } = req.query;
    if (!searchTerm) {
      return res.status(400).json({ message: 'Search term is required.' });
    }

    const devices = await Device.find({
      userId: req.user.id,
      $or: [
        { deviceName: { $regex: searchTerm, $options: 'i' } },
        { deviceSerialNumber: { $regex: searchTerm, $options: 'i' } }
      ]
    });

    if (!devices || devices.length === 0) {
      return res.status(404).json({ message: 'No devices found for the search term.' });
    }

    res.status(200).json(devices);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while searching devices.' });
  }
};

// Lọc thiết bị theo loại
const getDevicesByType = async (req, res) => {
  try {
    const { deviceType } = req.query;
    if (!deviceType) {
      return res.status(400).json({ message: 'Device type is required.' });
    }

    const devices = await Device.find({
      userId: req.user.id,
      deviceType
    });

    if (!devices || devices.length === 0) {
      return res.status(404).json({ message: `No devices found for type: ${deviceType}` });
    }

    res.status(200).json(devices);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while filtering devices by type.' });
  }
};

module.exports = {
  createDevice,
  getAllDevices,
  getDeviceById,
  updateDevice,
  deleteDevice,
  getDevicesByStatus,
  searchDevices,
  getDevicesByType
};
