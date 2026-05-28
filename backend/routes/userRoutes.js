const express = require('express');
const router = express.Router();
const { getAllUsers, deleteUser, getAnalytics } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', protect, authorize('admin'), getAllUsers);
router.get('/analytics', protect, authorize('admin'), getAnalytics);
router.delete('/:id', protect, authorize('admin'), deleteUser);

module.exports = router;
