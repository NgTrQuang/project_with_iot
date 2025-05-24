const express = require('express');
const router = express.Router();
const { 
    getElectricityUsage, 
    getElectricityUsageCurrent, 
    getElectricityUsageSummary, 
    getElectricityUsageByDateRange, 
    createElectricityUsage, 
    deleteElectricityUsage,
} = require('../controllers/electricityUsageController');
const protect = require('../middleware/authMiddleware');

// Truy vấn dữ liệu sử dụng điện của một người dùng và thiết bị theo ID và trả về tối đa 100 bản ghi gần nhất
router.get('/:userId', protect, getElectricityUsage);

// Truy vấn dữ liệu của bản ghi hiện tại (gần nhất)
router.get('/:userId/current', protect, getElectricityUsageCurrent);

// Tổng hợp thông tin về tổng năng lượng, công suất, dòng điện và điện áp cho người dùng và thiết bị trong một thời gian
router.get('/summary/:userId', protect, getElectricityUsageSummary);

// Truy vấn dữ liệu sử dụng điện trong một khoảng thời gian cho người dùng và thiết bị
router.get('/:userId/range', protect, getElectricityUsageByDateRange);

// Thêm dữ liệu sử dụng điện
router.post('/:username/receive', createElectricityUsage); // protect,

// Xóa dữ liệu sử dụng điện
router.delete('/:id', protect, deleteElectricityUsage);

module.exports = router;
