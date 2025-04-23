const mongoose = require('mongoose');

const electricityRateSchema = new mongoose.Schema(
  {
    rateType: {
      type: String,
      enum: ['flat', 'tiered'], // Đồng giá hoặc giá bậc thang
      required: true,
    },
    flatRate: {
      type: Number,
      required: function() {
        return this.rateType === 'flat'; // Nếu là giá đồng giá thì chỉ định giá đồng giá
      },
    },
    tiers: [
      {
        range: {
          type: [Number], // Dải mức sử dụng điện (ví dụ: [0, 100] nghĩa là từ 0 đến 100 kWh)
          required: true,
        },
        rate: {
          type: Number, // Đơn giá cho mức sử dụng điện trong dải mức
          required: true,
        },
      },
    ],
    billingCycleEnd: {
      type: Date, // Ngày chốt chỉ số điện (Ngày kết thúc chu kỳ thanh toán)
      required: true,
    },
    businessId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Business',
      required: false, // Có thể liên kết với một doanh nghiệp, nếu có
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false, // Có thể liên kết với người dùng, nếu có
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ElectricityRate', electricityRateSchema);
