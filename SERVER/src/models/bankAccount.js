const mongoose = require('mongoose');

const bankValidationRules = {
  MB: {
    accountNumber: { 
      match: /^(?:\d{9}|\d{10}|\d{12}|\d{13})$/, // Chỉ chấp nhận số tài khoản là chuỗi 9, 10, 12 hoặc 13 chữ số
    },
    accountName: {
      match: /^[A-Za-z\s]+$/, // Tên chủ tài khoản chỉ chứa chữ cái và khoảng trắng
    }
  },
  OCB: {
    accountNumber: { 
      match: /^\d{13}$/, // Chỉ chấp nhận số tài khoản có 13 chữ số
    },
    accountName: {
      match: /^[A-Za-z\s]+$/, // Tên chủ tài khoản chỉ chứa chữ cái và khoảng trắng
    }
  },
  STB: {
    accountNumber: { 
      match: /^\d{12}$/, // Chỉ chấp nhận số tài khoản có 12 chữ số
    },
    accountName: {
      match: /^[A-Za-z\s]+$/, // Tên chủ tài khoản chỉ chứa chữ cái và khoảng trắng
    }
  },
  VCB: {
    accountNumber: { 
      match: /^\d{13}$/, // Chỉ chấp nhận số tài khoản có 13 chữ số
    },
    accountName: {
      match: /^[A-Za-z\s]+$/, // Tên chủ tài khoản chỉ chứa chữ cái và khoảng trắng
    }
  },
  AGR: {
    accountNumber: { 
      match: /^\d{13}$/, // Chỉ chấp nhận số tài khoản có 13 chữ số
    },
    accountName: {
      match: /^[A-Za-z\s]+$/, // Tên chủ tài khoản chỉ chứa chữ cái và khoảng trắng
    }
  },
};

const bankAccountSchema = new mongoose.Schema(
  {
    accountHolder: { 
      type: mongoose.Schema.Types.ObjectId, 
      required: true, 
      refPath: 'accountHolderType' // Sử dụng refPath để tham chiếu đến cả User và Business
    },
    accountHolderType: {
      type: String,
      required: true,
      enum: ['User', 'Business'], // Chỉ định loại tài khoản holder có thể là 'User' hoặc 'Business'
    },
    accountNumber: { 
      type: String, 
      required: true,
      validate: {
        validator: function(value) {
          const rules = bankValidationRules[this.bankId]; // Lấy quy tắc xác thực theo bankId
          if (rules && rules.accountNumber) {
            return rules.accountNumber.match.test(value);
          }
          return true; // Nếu không có quy tắc, cho phép tiếp tục
        },
        message: 'Số tài khoản không hợp lệ cho ngân hàng này'
      },
    }, // Số tài khoản
    bankName: { 
      type: String, 
      required: true,
      match: [/^[A-Za-z\s]+$/, 'Tên ngân hàng chỉ được chứa chữ cái và khoảng trắng'] // Kiểm tra tên ngân hàng hợp lệ
    }, // Tên ngân hàng
    bankId: { 
      type: String, 
      required: true, 
      enum: Object.keys(bankValidationRules), // Sử dụng danh sách ngân hàng từ bankValidationRules
    }, // Mã ngân hàng (ví dụ: MB, VCB)
    accountName: { 
      type: String, 
      required: true,
      validate: {
        validator: function(value) {
          const rules = bankValidationRules[this.bankId]; // Lấy quy tắc xác thực ngân hàng theo bankId
          if (rules) {
            return rules.accountName.match.test(value); // Kiểm tra tên chủ tài khoản theo quy tắc ngân hàng
          }
          return true; // Nếu không có quy tắc, cho phép tiếp tục
        },
        message: 'Tên chủ tài khoản không hợp lệ'
      },
    }, // Tên chủ tài khoản
    // branch: { type: String, default: null }, // Chi nhánh ngân hàng
    // accountType: { type: String, enum: ['business', 'personal'], required: true }, // Loại tài khoản (doanh nghiệp hoặc cá nhân)
    swiftCode: { type: String, required: false, default: null }, // Mã SWIFT nếu có (dành cho giao dịch quốc tế)
    // isActive: { type: Boolean, default: true }, // Trạng thái tài khoản
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model('BankAccount', bankAccountSchema);
