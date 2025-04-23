const Permission = require('../models/permission');

class PermissionRepository {

  // Lấy tất cả các quyền
  async getAllPermissions() {
    try {
      return await Permission.find();
    } catch (error) {
      throw new Error('Không thể lấy danh sách quyền');
    }
  }

  // Lấy quyền theo ID
  async getPermissionById(permissionId) {
    try {
      return await Permission.findById(permissionId);
    } catch (error) {
      throw new Error(`Không tìm thấy quyền với ID: ${permissionId}`);
    }
  }

  // Lấy quyền theo tên
  async getPermissionByName(name) {
    try {
      return await Permission.findOne({ name });
    } catch (error) {
      throw new Error(`Không tìm thấy quyền với tên: ${name}`);
    }
  }

  // Tạo quyền mới
  async createPermission(permissionData) {
    try {
      const newPermission = new Permission(permissionData);
      return await newPermission.save();
    } catch (error) {
      throw new Error('Không thể tạo quyền');
    }
  }

  // Cập nhật quyền
  async updatePermission(permissionId, updateData) {
    try {
      return await Permission.findByIdAndUpdate(permissionId, updateData, { new: true });
    } catch (error) {
      throw new Error(`Không thể cập nhật quyền với ID: ${permissionId}`);
    }
  }

  // Xóa quyền
  async deletePermission(permissionId) {
    try {
      return await Permission.findByIdAndDelete(permissionId);
    } catch (error) {
      throw new Error(`Không thể xóa quyền với ID: ${permissionId}`);
    }
  }

  // Tìm quyền theo các tiêu chí
  async findPermission(criteria) {
    try {
      return await Permission.findOne(criteria);
    } catch (error) {
      throw new Error('Không thể tìm thấy quyền');
    }
  }
}

module.exports = new PermissionRepository();
