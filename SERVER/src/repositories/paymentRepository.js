const Payment = require('../models/payment');

class PaymentRepository {
  // Tạo một thanh toán mới
  async create(paymentData) {
    try {
      const payment = new Payment(paymentData);
      return await payment.save();
    } catch (error) {
      throw new Error(`Error creating payment: ${error.message}`);
    }
  }

  // Lấy danh sách thanh toán với phân trang
  async getAll({ page = 1, limit = 10, status }) {
    try {
      const query = status ? { status } : {};
      return await Payment.find(query)
        .populate('userId', 'name email')
        .populate('businessId', 'name')
        .sort({ paymentDate: -1 }) // Sắp xếp theo ngày thanh toán mới nhất
        .skip((page - 1) * limit)
        .limit(limit);
    } catch (error) {
      throw new Error(`Error fetching payments: ${error.message}`);
    }
  }

  // Lấy chi tiết thanh toán theo ID
  async getById(id) {
    try {
      return await Payment.findById(id)
        .populate('userId', 'name email')
        .populate('businessId', 'name');
    } catch (error) {
      throw new Error(`Error fetching payment: ${error.message}`);
    }
  }

  // Cập nhật thông tin thanh toán theo ID
  async update(id, updateData) {
    try {
      return await Payment.findByIdAndUpdate(id, updateData, { new: true });
    } catch (error) {
      throw new Error(`Error updating payment: ${error.message}`);
    }
  }

  // Xóa thanh toán theo ID
  async delete(id) {
    try {
      return await Payment.findByIdAndDelete(id);
    } catch (error) {
      throw new Error(`Error deleting payment: ${error.message}`);
    }
  }

  // Lấy danh sách thanh toán của một user
  async getByUserId(userId) {
    try {
      return await Payment.find({ userId })
        .populate('businessId', 'name')
        .sort({ paymentDate: -1 });
    } catch (error) {
      throw new Error(`Error fetching payments for user: ${error.message}`);
    }
  }

  // Cập nhật trạng thái thanh toán
  async updateStatus(id, status) {
    try {
      return await Payment.findByIdAndUpdate(id, { status }, { new: true });
    } catch (error) {
      throw new Error(`Error updating payment status: ${error.message}`);
    }
  }

  // Tìm thanh toán theo transactionId
  async getByTransactionId(transactionId) {
    try {
      return await Payment.findOne({ transactionId });
    } catch (error) {
      throw new Error(`Error fetching payment by transactionId: ${error.message}`);
    }
  }
}

module.exports = new PaymentRepository();
