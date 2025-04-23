const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    recipientId: { 
      type: mongoose.Schema.Types.ObjectId, 
      refPath: 'recipientType', 
      required: true 
    }, // Người nhận (có thể là User hoặc Business)
    recipientType: { 
      type: String, 
      enum: ['User', 'Business'], 
      required: true 
    }, // Loại người nhận (người dùng hoặc doanh nghiệp)
    title: { type: String, required: true }, // Tiêu đề thông báo
    message: { type: String, required: true }, // Nội dung thông báo
    type: { 
      type: String, 
      enum: ['error', 'maintenance', 'payment', 'general'], 
      default: 'general' 
    }, // Loại thông báo
    status: { 
      type: String, 
      enum: ['unread', 'read'], 
      default: 'unread' 
    }, // Trạng thái thông báo
    sentAt: { type: Date, default: Date.now }, // Thời điểm gửi
    relatedData: { type: mongoose.Schema.Types.Mixed }, // Dữ liệu liên quan (nếu có, ví dụ: lỗi, số tiền chưa thanh toán)
  },
  { timestamps: true }
);

module.exports = mongoose.model('Notification', notificationSchema);
