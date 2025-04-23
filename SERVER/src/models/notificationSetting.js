const mongoose = require('mongoose');

const notificationSettingsSchema = new mongoose.Schema(
  {
    recipientId: { 
      type: mongoose.Schema.Types.ObjectId, 
      refPath: 'recipientType', 
      required: true 
    }, // Người dùng hoặc doanh nghiệp
    recipientType: { 
      type: String, 
      enum: ['User', 'Business'], 
      required: true 
    }, // Loại tài khoản
    preferences: {
      maintenance: { type: Boolean, default: true }, // Nhận thông báo bảo trì
      payment: { type: Boolean, default: true }, // Nhận thông báo thanh toán
      error: { type: Boolean, default: true }, // Nhận thông báo lỗi
      general: { type: Boolean, default: true }, // Nhận thông báo chung
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('NotificationSettings', notificationSettingsSchema);
