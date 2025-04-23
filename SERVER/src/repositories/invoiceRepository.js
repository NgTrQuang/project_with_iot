const Invoice = require('../models/invoice');

class InvoiceRepository {
  // Tạo một hóa đơn mới
  async create(invoiceData) {
    try {
      const invoice = new Invoice(invoiceData);
      return await invoice.save();
    } catch (error) {
      throw new Error(`Lỗi tạo invoice: ${error.message}`);
    }
  }

  // Lấy danh sách hóa đơn với phân trang
  async getAll({ page = 1, limit = 10, status }) {
    try {
      const query = status ? { status } : {};
      return await Invoice.find(query)
        .populate('userId', 'name email') // Lấy thông tin user
        .populate('businessId', 'name') // Lấy tên doanh nghiệp
        .populate('paymentId') // Tham chiếu đến thanh toán
        .sort({ issuedDate: -1 }) // Sắp xếp mới nhất
        .skip((page - 1) * limit)
        .limit(limit);
    } catch (error) {
      throw new Error(`Lỗi lấy dữ liệu các invoices: ${error.message}`);
    }
  }

  // Lấy hóa đơn theo ID
  async getById(id) {
    try {
      return await Invoice.findById(id)
        .populate('userId', 'name email')
        .populate('businessId', 'name')
        .populate('paymentId');
    } catch (error) {
      throw new Error(`Lỗi lấy dữ liệu invoice: ${error.message}`);
    }
  }

  // Cập nhật hóa đơn theo ID
  async update(id, updateData) {
    try {
      return await Invoice.findByIdAndUpdate(id, updateData, { new: true });
    } catch (error) {
      throw new Error(`Lỗi cập nhật invoice: ${error.message}`);
    }
  }

  // Xóa hóa đơn theo ID
  async delete(id) {
    try {
      return await Invoice.findByIdAndDelete(id);
    } catch (error) {
      throw new Error(`Lỗi xóa invoice: ${error.message}`);
    }
  }

  // Tìm hóa đơn theo userId
  async getByUserId(userId) {
    try {
      return await Invoice.find({ userId })
        .populate('businessId', 'name')
        .sort({ issuedDate: -1 });
    } catch (error) {
      throw new Error(`Lỗi lấy invoices theo người dùng: ${error.message}`);
    }
  }

  // Cập nhật trạng thái hóa đơn
  async updateStatus(id, status) {
    try {
      return await Invoice.findByIdAndUpdate(id, { status }, { new: true });
    } catch (error) {
      throw new Error(`Lỗi cập nhật trạng thái invoice: ${error.message}`);
    }
  }
}

module.exports = new InvoiceRepository();
