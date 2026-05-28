const express = require('express');
const router = express.Router();
const {
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
  addLesson,
  getInstructorCourses,
} = require('../controllers/courseController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', getCourses);
router.get('/my-courses', protect, authorize('instructor', 'admin'), getInstructorCourses);
router.get('/:id', getCourse);
router.post('/', protect, authorize('instructor', 'admin'), createCourse);
router.put('/:id', protect, authorize('instructor', 'admin'), updateCourse);
router.delete('/:id', protect, authorize('instructor', 'admin'), deleteCourse);
router.post('/:id/lessons', protect, authorize('instructor', 'admin'), addLesson);

module.exports = router;
