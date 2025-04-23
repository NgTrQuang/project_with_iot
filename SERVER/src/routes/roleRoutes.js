const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const { getRoleById, getRoles } = require('../controllers/roleController');

router.get('/', protect, getRoles);
router.get('/details/:roleId', protect, getRoleById);

module.exports = router;