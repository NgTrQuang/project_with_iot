const express = require('express');
const { registerIndividual, registerBusinessUser, login, logout } = require('../controllers/authController');
// const protect = require('../middelware/authMiddleware');

const router = express.Router();

// Route đăng ký
router.post('/register/individual', registerIndividual);
router.post('/register/business_user', registerBusinessUser);

// Route đăng nhập
router.post('/login', login);

// Route đăng xuất
router.post('/logout', logout);

// refreshtoken
// router.post('/token', refreshToken);

// Một route yêu cầu đăng nhập
// router.get('/profile', authenticateToken, (req, res) => {
//     res.json({ message: 'Welcome to your profile', user: req.user });
//   });

module.exports = router;
