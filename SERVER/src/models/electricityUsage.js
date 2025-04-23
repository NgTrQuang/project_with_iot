const mongoose = require('mongoose');

const electricityUsageSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  deviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Device', required: true },
  timestamp: { type: String, required: true, index: true }, // Thêm chỉ mục cho trường timestamp
  power: { type: Number, required: true }, // Công suất tiêu thụ (W)
  voltage: { type: Number, required: true }, // Điện áp (Volt)
  current: { type: Number, required: true }, // Dòng điện (Ampere)
  frequency: { type: Number, require: false }, // Tần số
  energy: { type: Number, required: true }, // Năng lượng tiêu thụ (kWh)
  extraData: { type: mongoose.Schema.Types.Mixed, required: false }, // Các dữ liệu bổ sung (JSON)
  voltageRange: { type: String, required: false }, // Dải điện áp
  currentRange: { type: String, required: false }, // Dải dòng điện
  unitOfMeasurement: { type: String, enum: ['W', 'kWh', 'Ampere'], default: 'kWh' }, // Đơn vị đo lường
}, { timestamps: true });

// Chỉ mục cho userId và deviceId để truy vấn nhanh
electricityUsageSchema.index({ userId: 1, deviceId: 1 });
electricityUsageSchema.index({ timestamp: -1 });

module.exports = mongoose.model('ElectricityUsage', electricityUsageSchema);
