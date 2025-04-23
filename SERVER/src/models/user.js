const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true, match: [/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/, 'Please provide a valid email']},
    password: { type: String, required: true, }, //match: [/^[a-zA-Z0-9]+$/, 'Username can only contain alphanumeric characters']
    fullName: { type: String },
    address: { type: String, default: null },
    phoneNumber: { type: String, default: null },
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
    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Role',
    },
    permissions: [{ 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Permission' 
    }], // Nếu cần gán quyền trực tiếp cho người dùng
    isDisabled: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    avatar: { 
      type: String, 
      default: function() {
        // Avatar mặc định dựa trên giới tính
        return this.gender === 'female' 
          ? 'https://via.placeholder.com/40?text=F'  // Avatar nữ
          : 'https://via.placeholder.com/40?text=M'; // Avatar nam
      }
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
      default: 'male',  // Giới tính mặc định là nam
    },
    type: { type: String, enum: ['individual', 'business_user'], default: 'individual' },
    business: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Business', // Nếu người dùng có liên quan đến một doanh nghiệp
      default: null,
    },
    token: { type: String, default: null },
    bankAccount: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'BankAccount', 
      default: null 
    }, // Tham chiếu đến BankAccount
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },  // Thêm trường này để liên kết với người tạo
    createdAt: { type: Date, default: Date.now },
    trialExpirationDate: { type: Date },
    updatedAt: { type: Date, default: Date.now },
    deletedAt: { type: Date, default: null },
  },
  {
    timestamps: true,
  }
);

// TTL Index: Xóa sau 30 ngày (30 * 24 * 60 * 60 giây)
userSchema.index({ deletedAt: 1 }, { expireAfterSeconds: 30 * 24 * 60 * 60 });

userSchema.pre('save', async function(next) {
  // Nếu là tài khoản mới, tính toán ngày hết hạn dùng thử
  if (this.isNew && !this.trialExpirationDate) {
    this.trialExpirationDate = new Date();  // Ngày tạo tài khoản
    this.trialExpirationDate.setFullYear(this.trialExpirationDate.getFullYear() + 1);  // Cộng thêm 1 năm
  }
  next();
});

// Mã hóa mật khẩu trước khi lưu vào cơ sở dữ liệu
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// So sánh mật khẩu khi người dùng đăng nhập
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);
