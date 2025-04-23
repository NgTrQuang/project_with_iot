const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Người dùng thực hiện thanh toán
    businessId: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true }, // Doanh nghiệp nhận thanh toán
    amount: { type: Number, required: true }, // Số tiền thanh toán
    paymentDate: { type: Date, default: Date.now }, // Ngày thực hiện thanh toán
    paymentMethod: { 
      type: String, 
      enum: ['bank_transfer', 'credit_card', 'paypal', 'cash'], 
      default: 'bank_transfer' 
    }, // Phương thức thanh toán
    status: { 
      type: String, 
      enum: ['pending', 'completed', 'failed', 'refunded'], 
      default: 'pending' 
    }, // Trạng thái thanh toán
    transactionId: { type: String, unique: true }, // Mã giao dịch thanh toán
    description: { type: String }, // Ghi chú thêm (nếu có)
  },
  { timestamps: true }
);

module.exports = mongoose.model('Payment', paymentSchema);
