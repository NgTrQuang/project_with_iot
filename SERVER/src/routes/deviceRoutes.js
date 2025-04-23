const express = require('express');
const router = express.Router();
const {
    createDevice,
    getAllDevices,
    getDeviceById,
    updateDevice,
    deleteDevice,
    getDevicesByStatus,
    searchDevices,
    getDevicesByType
} = require('../controllers/deviceController');
const protect = require('../middleware/authMiddleware'); // Middleware kiểm tra đăng nhập

// API lấy tất cả thiết bị của người dùng
router.get('/', protect, getAllDevices);

// API lấy thông tin thiết bị theo ID
router.get('/:deviceId', protect, getDeviceById);

// API lọc thiết bị theo trạng thái
router.get('/status', protect, getDevicesByStatus);

// API tìm kiếm thiết bị
router.get('/search', protect, searchDevices);

// API lọc thiết bị theo loại
router.get('/type', protect, getDevicesByType);

// API tạo thiết bị mới
router.post('/', protect, createDevice);

// API cập nhật thiết bị
router.put('/:deviceId', protect, updateDevice);

// API xóa thiết bị
router.delete('/:deviceId', protect, deleteDevice);

module.exports = router;
