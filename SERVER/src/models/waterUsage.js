const mongoose = require('mongoose');
const { Schema } = mongoose; 

const waterUsageSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    deviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Device', required: true },
    timestamp: { type: Date, required: true, index: true }, // Thêm chỉ mục cho trường timestamp
    flowRate: { type: Number, required: true }, // Lưu lượng nước tiêu thụ (L/min)
    totalConsumption: { type: Number, required: true }, // Tổng lượng nước tiêu thụ (L)
    extraData: { type: Schema.Types.Mixed, required: false }, // Các dữ liệu bổ sung (JSON)
    flowRateRange: { type: String, required: false }, // Dải lưu lượng nước (low, medium, high)
    unitOfMeasurement: { type: String, enum: ['L/min', 'm³/min'], default: 'L/min' }, // Đơn vị đo lường
}, { timestamps: true });

// Chỉ mục cho userId và deviceId
waterUsageSchema.index({ userId: 1, deviceId: 1 });

module.exports = mongoose.model('WaterUsage', waterUsageSchema);
