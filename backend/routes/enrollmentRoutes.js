const express = require('express');
const router = express.Router();
const { enrollCourse, getMyCourses, updateProgress } = require('../controllers/enrollmentController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', protect, authorize('student'), enrollCourse);
router.get('/my-courses', protect, authorize('student'), getMyCourses);
router.put('/:id/progress', protect, authorize('student'), updateProgress);

module.exports = router;
