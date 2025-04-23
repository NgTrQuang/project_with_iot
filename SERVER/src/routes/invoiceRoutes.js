const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const { 
    filterAndSearchInvoices, 
    getInvoiceById, 
    addInvoice, 
    updateInvoice, 
    deleteInvoice, 
} = require('../controllers/invoiceController');

// Lọc và tìm kiếm hóa đơn
router.get('/', protect, filterAndSearchInvoices);

// Lấy chi tiết một hóa đơn
router.get('/:id', protect, getInvoiceById);

// Thêm mới hóa đơn
router.post('/', protect, addInvoice);

// Cập nhật hóa đơn
router.put('/:id', protect, updateInvoice);

// Xóa hóa đơn
router.delete('/:id', protect, deleteInvoice);

module.exports = router;