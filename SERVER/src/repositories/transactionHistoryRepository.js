const TransactionHistory = require('../models/transactionHistory');

class TransactionHistoryRepository {
  // Tạo một giao dịch mới
  async create(transactionData) {
    try {
      const transaction = new TransactionHistory(transactionData);
      return await transaction.save();
    } catch (error) {
      throw new Error(`Error creating transaction: ${error.message}`);
    }
  }

  // Lấy danh sách giao dịch với phân trang và lọc theo loại giao dịch
  async getAll({ page = 1, limit = 10, transactionType }) {
    try {
      const query = transactionType ? { transactionType } : {};
      return await TransactionHistory.find(query)
        .populate('userId', 'name email')
        .populate('businessId', 'name')
        .populate('relatedPaymentId', 'transactionId amount status')
        .sort({ transactionDate: -1 }) // Sắp xếp theo ngày giao dịch mới nhất
        .skip((page - 1) * limit)
        .limit(limit);
    } catch (error) {
      throw new Error(`Error fetching transactions: ${error.message}`);
    }
  }

  // Lấy chi tiết giao dịch theo ID
  async getById(id) {
    try {
      return await TransactionHistory.findById(id)
        .populate('userId', 'name email')
        .populate('businessId', 'name')
        .populate('relatedPaymentId', 'transactionId amount status');
    } catch (error) {
      throw new Error(`Error fetching transaction: ${error.message}`);
    }
  }

  // Cập nhật thông tin giao dịch theo ID
  async update(id, updateData) {
    try {
      return await TransactionHistory.findByIdAndUpdate(id, updateData, { new: true });
    } catch (error) {
      throw new Error(`Error updating transaction: ${error.message}`);
    }
  }

  // Xóa giao dịch theo ID
  async delete(id) {
    try {
      return await TransactionHistory.findByIdAndDelete(id);
    } catch (error) {
      throw new Error(`Error deleting transaction: ${error.message}`);
    }
  }

  // Lấy danh sách giao dịch của một user
  async getByUserId(userId) {
    try {
      return await TransactionHistory.find({ userId })
        .populate('businessId', 'name')
        .populate('relatedPaymentId', 'transactionId amount status')
        .sort({ transactionDate: -1 });
    } catch (error) {
      throw new Error(`Error fetching transactions for user: ${error.message}`);
    }
  }

  // Lấy danh sách giao dịch theo doanh nghiệp
  async getByBusinessId(businessId) {
    try {
      return await TransactionHistory.find({ businessId })
        .populate('userId', 'name email')
        .populate('relatedPaymentId', 'transactionId amount status')
        .sort({ transactionDate: -1 });
    } catch (error) {
      throw new Error(`Error fetching transactions for business: ${error.message}`);
    }
  }

  // Lấy giao dịch liên quan đến một khoản thanh toán
  async getByPaymentId(paymentId) {
    try {
      return await TransactionHistory.find({ relatedPaymentId: paymentId })
        .populate('userId', 'name email')
        .populate('businessId', 'name')
        .sort({ transactionDate: -1 });
    } catch (error) {
      throw new Error(`Error fetching transactions by paymentId: ${error.message}`);
    }
  }
}

module.exports = new TransactionHistoryRepository();
