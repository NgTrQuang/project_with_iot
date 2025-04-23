const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({
  deviceSerialNumber: { type: String, unique: true, required: true }, // Thêm trường mã số thiết bị
  deviceName: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  businessId: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: false, default: null }, // Doanh nghiệp cung cấp thiết bị (nếu có)
  deviceType: { type: String, enum: ['electricity_meter', 'water_meter', 'other'], required: true },
  deviceStatus: { 
    type: String, 
    enum: ['active', 'inactive', 'under_maintenance', 'broken'], 
    default: 'active' 
  },
  wifiStatus: { type: String, enum: ['connected', 'disconnected', 'unknown'], default: 'unknown' },
  location: { type: String, required: false },
  coordinates: { 
    type: [Number], 
    index: '2dsphere'  // Hỗ trợ định vị GPS (nếu cần)
  },
  lastMaintenance: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
}, { timestamps: true });

// Chỉ mục hỗ trợ tìm kiếm nhanh theo user và trạng thái
deviceSchema.index({ userId: 1, deviceStatus: 1 });
deviceSchema.index({ userId: 1, businessId: 1 });

// Kiểm tra tính hợp lệ trường liên kết dữ liệu
deviceSchema.pre('save', function (next) {
  if (this.businessId && !this.userId) {
    return next(new Error('Business devices must have a userId.'));
  }
  if (!this.businessId && !this.userId) {
    return next(new Error('Personal devices must have a userId.'));
  }
  next();
});

module.exports = mongoose.model('Device', deviceSchema);
