const mongoose = require('mongoose');

const permissionSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // Tên quyền
  description: { type: String }, // Mô tả quyền (tùy chọn)
});

module.exports = mongoose.model('Permission', permissionSchema);
