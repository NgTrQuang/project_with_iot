const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');

const { 
    getUserFromToken, 
    getUsers, 
    getUsersByBusiness, 
    getUserById, 
    createUser, 
    addUsersFromExcel, 
    changePassword, 
    updateUser, 
    updateUserById, 
    restoreUser, 
    softDeleteUser,  
} = require('../controllers/userController');
const protect = require('../middleware/authMiddleware');


router.get('/me', protect, getUserFromToken);
router.get('/user_business', protect, getUsersByBusiness); // lấy người dùng thuộc doanh nghiệp
router.get('/', protect, getUsers);  // Lấy danh sách người dùng
router.get('/:id', protect, getUserById);  // Lấy thông tin người dùng
router.post('/create', protect, createUser); // Tạo người dùng mới
router.post('/upload-users', protect, upload.single('file'), addUsersFromExcel);
router.put('/change-password', protect, changePassword);  // Thay đổi mật khẩu
router.put('/me', protect, updateUser);  // Cập nhật tài khoản
router.put('/:id', protect, updateUserById);  // Cập nhật người dùng bởi id
router.put('/:id/restore', protect, restoreUser);  // Cập nhật khôi phục người dùng
router.put('/:id/delete', protect, softDeleteUser);  // Cập nhật khôi phục người dùng
// router.delete('/:id', protect, deleteUser);  // Xóa người dùng

module.exports = router;
// sắp xếp thứ tự get, post, put, patch, delete từ trên xuống tránh lỗi vặt