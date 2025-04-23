const express = require('express');
const router = express.Router();
const { 
    getBusinessById, 
    getBusinesses, 
    getUsersByBusinessId, 
    searchBusinesses, 
    filterBusinesses, 
    filterAndSearchBusinesses, 
    getBusinessesByStatus, 
    createBusiness, 
    getAllBusinesses, 
    updateBusiness, 
    deleteBusiness, 
} = require('../controllers/businessController');
const protect = require('../middleware/authMiddleware'); // Middleware xác thực

// Lấy doanh nghiệp theo quyền người dùng
router.get('/', protect, getBusinesses);

// API lấy tất cả doanh nghiệp
router.get('/all', protect, getAllBusinesses);

// Lấy danh sách người dùng theo doanh nghiệp
router.get('/:businessId', protect, getUsersByBusinessId);

// Lấy thông tin doanh nghiệp theo id
router.get('/details/:businessId', protect, getBusinessById);

// API lọc doanh nghiệp theo trạng thái hoạt động
router.get('/status', protect, getBusinessesByStatus);

// API tìm kiếm doanh nghiệp theo tên và các thông tin liên quan
router.get('/search', protect, searchBusinesses);

// Filter API
router.get('/filter', filterBusinesses);

// API lọc và tìm kiếm kết hợp
router.get('/filter-search', protect, filterAndSearchBusinesses);

// API tạo doanh nghiệp mới
router.post('/', protect, createBusiness);

// API cập nhật thông tin doanh nghiệp
router.put('/:businessId', protect, updateBusiness);

// API xóa vĩnh viễn doanh nghiệp
router.delete('/:businessId', protect, deleteBusiness);



module.exports = router;
