const BankAccount = require('../models/BankAccount');

class BankAccountRepository {

  // Lấy tất cả tài khoản ngân hàng
  async getAllBankAccounts() {
    try {
      return await BankAccount.find().populate('accountHolder');
    } catch (error) {
      throw new Error('Không thể lấy danh sách tài khoản ngân hàng');
    }
  }

  // Lấy tài khoản ngân hàng theo ID
  async getBankAccountById(bankAccountId) {
    try {
      return await BankAccount.findById(bankAccountId).populate('accountHolder');
    } catch (error) {
      throw new Error(`Không thể tìm thấy tài khoản ngân hàng với ID: ${bankAccountId}`);
    }
  }

  // Tạo mới tài khoản ngân hàng
  async createBankAccount(bankAccountData) {
    try {
      const newBankAccount = new BankAccount(bankAccountData);
      return await newBankAccount.save();
    } catch (error) {
      throw new Error('Không thể tạo tài khoản ngân hàng mới');
    }
  }

  // Cập nhật tài khoản ngân hàng
  async updateBankAccount(bankAccountId, updateData) {
    try {
      return await BankAccount.findByIdAndUpdate(bankAccountId, updateData, { new: true });
    } catch (error) {
      throw new Error(`Không thể cập nhật tài khoản ngân hàng với ID: ${bankAccountId}`);
    }
  }

  // Xóa tài khoản ngân hàng
  async deleteBankAccount(bankAccountId) {
    try {
      return await BankAccount.findByIdAndDelete(bankAccountId);
    } catch (error) {
      throw new Error(`Không thể xóa tài khoản ngân hàng với ID: ${bankAccountId}`);
    }
  }

  // Tìm tài khoản ngân hàng theo accountHolder (có thể là User hoặc Business)
  async getBankAccountsByAccountHolder(accountHolderId, accountHolderType) {
    try {
      return await BankAccount.find({ accountHolder: accountHolderId, accountHolderType })
        .populate('accountHolder');
    } catch (error) {
      throw new Error(`Không thể tìm tài khoản ngân hàng cho chủ tài khoản: ${accountHolderId}`);
    }
  }

  // Kiểm tra tính hợp lệ của số tài khoản và tên chủ tài khoản
  async validateBankAccount(bankAccountData) {
    try {
      const { bankId, accountNumber, accountName } = bankAccountData;
      const rules = bankValidationRules[bankId];
      if (!rules) {
        throw new Error('Ngân hàng không hợp lệ');
      }

      if (!rules.accountNumber.match.test(accountNumber)) {
        throw new Error('Số tài khoản không hợp lệ');
      }

      if (!rules.accountName.match.test(accountName)) {
        throw new Error('Tên chủ tài khoản không hợp lệ');
      }

      return true;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

module.exports = new BankAccountRepository();
