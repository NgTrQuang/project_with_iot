const mongoose = require('mongoose');

const transactionHistorySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Người dùng
    businessId: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true }, // Doanh nghiệp
    amount: { type: Number, required: true }, // Số tiền giao dịch
    transactionType: { 
      type: String, 
      enum: ['payment', 'refund', 'adjustment'], 
      required: true 
    }, // Loại giao dịch
    transactionDate: { type: Date, default: Date.now }, // Ngày giao dịch
    description: { type: String }, // Ghi chú giao dịch
    relatedPaymentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment' }, // Tham chiếu đến thanh toán liên quan (nếu có)
  },
  { timestamps: true }
);

module.exports = mongoose.model('TransactionHistory', transactionHistorySchema);
