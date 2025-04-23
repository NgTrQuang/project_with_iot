const Role = require('../models/role');

class RoleRepository {

  // Lấy tất cả các vai trò
  async getAllRoles() {
    try {
      return await Role.find();
    } catch (error) {
      throw new Error('Không thể lấy danh sách vai trò');
    }
  }

  // Lấy vai trò theo ID
  async getRoleById(roleId) {
    try {
      return await Role.findById(roleId);
    } catch (error) {
      throw new Error(`Không tìm thấy vai trò với ID: ${roleId}`);
    }
  }

  // Lấy vai trò theo tên
  async getRoleByName(name) {
    try {
      return await Role.findOne({ name });
    } catch (error) {
      throw new Error(`Không tìm thấy vai trò với tên: ${name}`);
    }
  }

  // Lấy vai trò theo mã code
  async getRoleByCode(code) {
    try {
      return await Role.findOne({ code });
    } catch (error) {
      throw new Error(`Không tìm thấy vai trò với mã code: ${code}`);
    }
  }

  // Tạo vai trò mới
  async createRole(roleData) {
    try {
      const newRole = new Role(roleData);
      return await newRole.save();
    } catch (error) {
      throw new Error('Không thể tạo vai trò');
    }
  }

  // Cập nhật thông tin vai trò
  async updateRole(roleId, updateData) {
    try {
      return await Role.findByIdAndUpdate(roleId, updateData, { new: true });
    } catch (error) {
      throw new Error(`Không thể cập nhật vai trò với ID: ${roleId}`);
    }
  }

  // Xóa vai trò
  async deleteRole(roleId) {
    try {
      return await Role.findByIdAndDelete(roleId);
    } catch (error) {
      throw new Error(`Không thể xóa vai trò với ID: ${roleId}`);
    }
  }

  // Tìm vai trò theo các tiêu chí khác nhau
  async findRole(criteria) {
    try {
      return await Role.findOne(criteria);
    } catch (error) {
      throw new Error('Không thể tìm thấy vai trò');
    }
  }
}

module.exports = new RoleRepository();
