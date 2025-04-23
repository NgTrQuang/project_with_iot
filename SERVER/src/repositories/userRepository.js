const User = require('../models/user');

class UserRepository {

  // Lấy tất cả người dùng
  async getAllUsers() {
    try {
      return await User.find().populate('role permissions business bankAccount createdBy');
    } catch (error) {
      throw new Error('Không thể lấy danh sách người dùng');
    }
  }

  // Lấy thông tin người dùng theo ID
  async getUserById(userId) {
    try {
      return await User.findById(userId).populate('role permissions business bankAccount createdBy');
    } catch (error) {
      throw new Error(`Không tìm thấy người dùng với ID: ${userId}`);
    }
  }

  // Lấy người dùng theo email
  async getUserByEmail(email) {
    try {
      return await User.findOne({ email }).populate('role permissions business bankAccount createdBy');
    } catch (error) {
      throw new Error('Không thể tìm thấy người dùng với email này');
    }
  }

  // Lấy người dùng theo username
  async getUserByUsername(username) {
    try {
      return await User.findOne({ username }).populate('role permissions business bankAccount createdBy');
    } catch (error) {
      throw new Error('Không thể tìm thấy người dùng với tên người dùng này');
    }
  }

  // Tạo người dùng mới
  async createUser(userData) {
    try {
      const newUser = new User(userData);
      return await newUser.save();
    } catch (error) {
      throw new Error('Không thể tạo người dùng');
    }
  }

  // Cập nhật thông tin người dùng
  async updateUser(userId, updateData) {
    try {
      return await User.findByIdAndUpdate(userId, updateData, { new: true });
    } catch (error) {
      throw new Error(`Không thể cập nhật người dùng với ID: ${userId}`);
    }
  }

  // Xóa người dùng
  async deleteUser(userId) {
    try {
      return await User.findByIdAndDelete(userId);
    } catch (error) {
      throw new Error(`Không thể xóa người dùng với ID: ${userId}`);
    }
  }

  // Đánh dấu người dùng là đã xóa (soft delete)
  async softDeleteUser(userId) {
    try {
      return await User.findByIdAndUpdate(userId, { isDeleted: true, deletedAt: new Date() }, { new: true });
    } catch (error) {
      throw new Error(`Không thể đánh dấu người dùng là đã xóa với ID: ${userId}`);
    }
  }

  // Tìm người dùng theo các tiêu chí khác nhau
  async findUser(criteria) {
    try {
      return await User.findOne(criteria).populate('role permissions business bankAccount createdBy');
    } catch (error) {
      throw new Error('Không thể tìm thấy người dùng');
    }
  }
}

module.exports = new UserRepository();
