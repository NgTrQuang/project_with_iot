const express = require('express');
const router = express.Router();
const {
    getAllBankAccounts, 
    getBankAccountById, 
    createBankAccount, 
    updateBankAccount, 
    deleteBankAccount, 
} = require('../controllers/bankAccountController');

const protect = require('../middleware/authMiddleware');

// Lấy danh sách tất cả tài khoản ngân hàng
router.get('/', protect, getAllBankAccounts);

// Lấy chi tiết một tài khoản ngân hàng
router.get('/:id', protect, getBankAccountById);

// Tạo tài khoản ngân hàng mới
router.post('/', protect, createBankAccount);

// Cập nhật thông tin tài khoản ngân hàng
router.put('/:id', protect, updateBankAccount);

// Xóa tài khoản ngân hàng
router.delete('/:id', protect, deleteBankAccount);

module.exports = router;
