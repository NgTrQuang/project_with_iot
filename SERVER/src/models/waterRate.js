const mongoose = require('mongoose');

const waterRateSchema = new mongoose.Schema(
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
          type: [Number], // Dải mức sử dụng nước (ví dụ: [0, 100] nghĩa là từ 0 đến 100m³)
          required: true,
        },
        rate: {
          type: Number, // Đơn giá cho mức sử dụng nước trong dải mức
          required: true,
        },
      },
    ],
    billingCycleEnd: {
      type: Date, // Ngày chốt chỉ số nước (Ngày kết thúc chu kỳ thanh toán)
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

module.exports = mongoose.model('WaterRate', waterRateSchema);
