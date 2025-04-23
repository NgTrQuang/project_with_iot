const mongoose = require('mongoose');
// Thông báo hàng loạt
const broadcastSchema = new mongoose.Schema(
  {
    title: { type: String, required: true }, // Tiêu đề thông báo
    message: { type: String, required: true }, // Nội dung thông báo
    recipients: [
      {
        recipientId: { type: mongoose.Schema.Types.ObjectId, refPath: 'recipientType' },
        recipientType: { type: String, enum: ['User', 'Business'] },
      }
    ], // Danh sách người nhận
    type: { 
      type: String, 
      enum: ['error', 'maintenance', 'payment', 'general'], 
      default: 'general' 
    }, // Loại thông báo
    sentAt: { type: Date, default: Date.now }, // Thời điểm gửi
    status: { type: String, enum: ['pending', 'completed'], default: 'pending' }, // Trạng thái gửi
  },
  { timestamps: true }
);

module.exports = mongoose.model('Broadcast', broadcastSchema);
