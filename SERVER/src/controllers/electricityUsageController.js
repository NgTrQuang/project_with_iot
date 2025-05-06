const mongoose = require('mongoose');
const Device = require('../models/device');
const ElectricityUsage = require('../models/electricityUsage');
const User = require('../models/user');
const moment = require('moment');

// Truy vấn dữ liệu sử dụng điện của một người dùng và thiết bị theo ID và trả về tối đa 12 bản ghi gần nhất ~ 1h
const getElectricityUsage = async (req, res) => {
  try {
    const { userId } = req.params;
    // const { limit = 100, page = 1 } = req.query;
    console.log('User ID:', userId);
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'ID người dùng không hợp lệ.' });
    }

    const electricityUsageRecords = await ElectricityUsage.find({ userId })
      .sort({ timestamp: -1 })
      .limit(12)
      .populate('deviceId');

    if (!electricityUsageRecords || electricityUsageRecords.length === 0) {
      return res.status(404).json({ message: 'Không có dữ liệu.' });
    }

    console.log(electricityUsageRecords);
    return res.status(200).json({
      message: 'Dữ liệu đã được tải thành công',
      data: electricityUsageRecords,
    });
  } catch (error) {
    console.error('Lỗi khi truy vấn dữ liệu:', error);
    return res.status(500).json({ message: 'Lỗi server khi truy vấn dữ liệu.' });
  }
};

// Lấy thông tin dữ liệu sử dụng điện của người dùng id đang đăng nhập hiện tại
const getElectricityUsageCurrent = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log('User ID:', userId);
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'ID người dùng không hợp lệ.' });
    }

    const electricityUsageRecords = await ElectricityUsage.findOne({ userId })
    .sort({ timestamp: -1 })
    .populate('deviceId');

    if (!electricityUsageRecords || electricityUsageRecords.length === 0) {
      return res.status(404).json({ message: 'Không có dữ liệu.' });
    }

    console.log(electricityUsageRecords);
    return res.status(200).json({
      message: 'Dữ liệu đã được tải thành công',
      data: electricityUsageRecords,
    });
  } catch (error) {
    console.error('Lỗi khi truy vấn dữ liệu:', error);
    return res.status(500).json({ message: 'Lỗi server khi truy vấn dữ liệu.' });
  }
};

// Tổng hợp thông tin về tổng năng lượng, công suất, dòng điện và điện áp cho người dùng và thiết bị trong một thời gian
const getElectricityUsageSummary = async (req, res) => {
  try {
    const { userId } = req.params;

    const summary = await ElectricityUsage.aggregate([
      { $match: { userId: mongoose.Types.ObjectId(userId) } },
      {
        $lookup: {
          from: 'devices',  // Tên của collection chứa thông tin thiết bị
          localField: 'deviceId',  // Trường tham chiếu đến thiết bị
          foreignField: '_id',  // Trường `_id` trong collection devices
          as: 'deviceInfo'  // Kết quả sẽ được lưu vào trường `deviceInfo`
        }
      },
      {
        $group: {
          _id: null,
          totalPower: { $sum: "$power" },
          totalEnergy: { $sum: "$energy" },
          avgVoltage: { $avg: "$voltage" },
          avgCurrent: { $avg: "$current" },
          count: { $count: {} },
          deviceName: { $first: "$deviceInfo.deviceName" },  // Lấy tên thiết bị
          deviceSerialNumber: { $first: "$deviceInfo.deviceSerialNumber" }  // Lấy serial number thiết bị
        }
      },
      {
        $project: {
          totalPower: 1,
          totalEnergy: 1,
          avgVoltage: 1,
          avgCurrent: 1,
          count: 1,
          deviceName: 1,
          deviceSerialNumber: 1,
        }
      }
    ]);

    if (!summary || summary.length === 0) {
      return res.status(404).json({ message: 'Không có dữ liệu để tổng hợp.' });
    }

    return res.status(200).json({
      message: 'Tổng hợp dữ liệu thành công.',
      data: summary[0],
    });
  } catch (error) {
    console.error('Lỗi khi tổng hợp dữ liệu:', error);
    return res.status(500).json({ message: 'Lỗi server khi tổng hợp dữ liệu.' });
  }
};

// Truy vấn dữ liệu sử dụng điện trong một khoảng thời gian cho người dùng và thiết bị
const getElectricityUsageByDateRange = async (req, res) => {
  try {
    const { userId } = req.params;
    const { startDate, endDate } = req.query;

    // Kiểm tra giá trị ngày
    if (!startDate || !endDate || isNaN(new Date(startDate)) || isNaN(new Date(endDate))) {
      return res.status(400).json({ message: 'Ngày bắt đầu hoặc ngày kết thúc không hợp lệ.', data: null });
    }

    console.log(startDate);
    console.log(endDate);
    const electricityUsageRecords = await ElectricityUsage.find(
      { 
        userId,
        timestamp: { $gte: startDate, $lt: endDate }
      })
        .populate('deviceId')
        .sort({ timestamp: -1 });

    if (!electricityUsageRecords || electricityUsageRecords.length === 0) {
      return res.status(404).json({ message: 'Không có dữ liệu trong khoảng thời gian này.', data: null });
    }

    return res.status(200).json({
      message: 'Dữ liệu trong khoảng thời gian đã được tải thành công.',
      data: electricityUsageRecords,
    });
  } catch (error) {
    console.error('Lỗi khi truy vấn dữ liệu theo khoảng thời gian:', error);
    return res.status(500).json({ message: 'Lỗi server khi truy vấn dữ liệu theo khoảng thời gian.', data: null });
  }
};

// Thêm dữ liệu sử dụng điện bởi thiết bị 8266
const createElectricityUsage = async (req, res) => {
  try {
    const { _id, busCode, deviceSerialNumber, power, voltage, current, frequency, power_cos, energy } = req.body;

    const device = await Device.findOne({ deviceSerialNumber: deviceSerialNumber });

    if (!device) {
      return res.status(404).json({ message: 'Mã thiết bị chưa đúng.' });
    }

    // (Tùy chọn) tìm userId từ busCode nếu cần
    const user = await User.findOne({ busCode }); // Nếu bạn muốn lấy userId
    if (!user) {
      return errorResponse(res, 'Không tìm thấy người dùng với busCode.', 404);
    }

    const newElectricityUsage = new ElectricityUsage({
      userId: user._id,
      deviceId: device._id,
      timestamp: new Date().toISOString(),
      power: Number(power),
      voltage: Number(voltage),
      current: Number(current),
      frequency: Number(frequency),
      energy: Number(energy),
      extraData: {
        busName,
        power_cos: Number(power_cos),
        rawId: _id
      },
    });

    await newElectricityUsage.save();
    return res.status(201).json({ message: 'ok', data: newElectricityUsage });
  } catch (error) {
    console.error('Lỗi khi lưu dữ liệu:', error);
    return res.status(500).json({ message: 'Lỗi server khi lưu dữ liệu.' });
  }
};

// Xóa dữ liệu điện
const deleteElectricityUsage = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedUsage = await ElectricityUsage.findByIdAndDelete(id);

    if (!deletedUsage) {
      return res.status(404).json({ message: 'Electricity usage data not found.' });
    }

    res.status(200).json({ message: 'Electricity usage data deleted successfully.', data: deletedUsage });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while deleting electricity usage data.' });
  }
};

module.exports = { 
  getElectricityUsage, 
  getElectricityUsageCurrent, 
  getElectricityUsageSummary, 
  getElectricityUsageByDateRange, 
  createElectricityUsage, 
  deleteElectricityUsage, 
};
