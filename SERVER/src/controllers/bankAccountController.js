const BankAccount = require('../models/bankAccount');

// Lấy danh sách tất cả tài khoản ngân hàng
const getAllBankAccounts = async (req, res) => {
    try {
      const accounts = await BankAccount.find();
      res.status(200).json(accounts);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
};
  
// Lấy chi tiết một tài khoản ngân hàng
const getBankAccountById = async (req, res) => {
    try {
        const account = await BankAccount.findById(req.params.id);
        if (!account) return res.status(404).json({ message: 'Tài khoản không tồn tại' });
        res.status(200).json(account);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Tạo tài khoản ngân hàng mới
const createBankAccount = async (req, res) => {
  try {
    const bankAccount = new BankAccount(req.body);
    const savedAccount = await bankAccount.save();
    res.status(201).json(savedAccount);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Cập nhật thông tin tài khoản ngân hàng
const updateBankAccount = async (req, res) => {
  try {
    const updatedAccount = await BankAccount.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedAccount) return res.status(404).json({ message: 'Tài khoản không tồn tại' });
    res.status(200).json(updatedAccount);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Xóa tài khoản ngân hàng
const deleteBankAccount = async (req, res) => {
  try {
    const deletedAccount = await BankAccount.findByIdAndDelete(req.params.id);
    if (!deletedAccount) return res.status(404).json({ message: 'Tài khoản không tồn tại' });
    res.status(200).json({ message: 'Tài khoản đã được xóa' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
    getAllBankAccounts, 
    getBankAccountById, 
    createBankAccount, 
    updateBankAccount, 
    deleteBankAccount, 
};