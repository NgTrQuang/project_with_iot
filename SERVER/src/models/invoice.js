const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Người dùng được lập hóa đơn
    businessId: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true }, // Doanh nghiệp phát hành hóa đơn
    paymentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment', required: true }, // Tham chiếu đến thanh toán liên quan
    invoiceNumber: { type: String, unique: true, required: true }, // Số hóa đơn duy nhất
    issuedDate: { type: Date, default: Date.now }, // Ngày phát hành hóa đơn
    dueDate: { type: Date, required: true }, // Ngày đến hạn thanh toán
    totalAmount: { type: Number, required: true }, // Tổng số tiền
    details: [
      {
        description: { type: String, required: true }, // Mô tả (ví dụ: chi tiết dịch vụ)
        quantity: { type: Number, default: 1 }, // Số lượng
        unitPrice: { type: Number, required: true }, // Đơn giá
        total: { type: Number, required: true }, // Thành tiền (quantity * unitPrice)
      }
    ],
    status: { 
      type: String, 
      enum: ['unpaid', 'paid', 'overdue', 'cancelled'], 
      default: 'unpaid' 
    }, // Trạng thái hóa đơn
  },
  { timestamps: true }
);

module.exports = mongoose.model('Invoice', invoiceSchema);
