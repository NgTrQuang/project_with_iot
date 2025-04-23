const mongoose = require('mongoose');

const businessSchema = new mongoose.Schema(
  {
    businessName: { type: String, required: true, unique: true }, // Tên doanh nghiệp
    taxId: { type: String, unique: true, default: null }, // Mã số thuế
    address: { type: String, required: true }, // Địa chỉ
    phoneNumber: { type: String, required: true }, // Số điện thoại
    email: { type: String, default: null }, // Email liên hệ
    electricityRate: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'ElectricityRate', 
      default: null 
    }, // Liên kết với model ElectricityRate để xác định giá điện của doanh nghiệp
    waterRate: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'WaterRate', 
      default: null 
    }, // Liên kết với model WaterRate để xác định giá nước của doanh nghiệp
    businessManager: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: null 
    },
    bankAccount: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'BankAccount', 
      default: null 
    }, // Tham chiếu đến BankAccount
    isActive: { type: Boolean, default: true }, // Trạng thái hoạt động của doanh nghiệp
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Business', businessSchema);
