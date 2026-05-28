const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');

// @desc    Enroll in a course
// @route   POST /api/enrollments
// @access  Private (Student)
const enrollCourse = async (req, res) => {
  try {
    const { courseId } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: 'Course not found' });
    }

    if (!course.isPublished) {
      return res
        .status(400)
        .json({ success: false, message: 'This course is not available for enrollment' });
    }

    const existingEnrollment = await Enrollment.findOne({
      student: req.user._id,
      course: courseId,
    });

    if (existingEnrollment) {
      return res
        .status(400)
        .json({ success: false, message: 'You are already enrolled in this course' });
    }

    const enrollment = await Enrollment.create({
      student: req.user._id,
      course: courseId,
    });

    // Increment totalStudents count
    await Course.findByIdAndUpdate(courseId, { $inc: { totalStudents: 1 } });

    await enrollment.populate('course', 'title thumbnail description instructor');

    res.status(201).json({ success: true, enrollment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get my enrolled courses
// @route   GET /api/enrollments/my-courses
// @access  Private (Student)
const getMyCourses = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ student: req.user._id })
      .populate({
        path: 'course',
        populate: { path: 'instructor', select: 'name avatar' },
      })
      .sort({ createdAt: -1 });

    res.json({ success: true, count: enrollments.length, enrollments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update lesson progress
// @route   PUT /api/enrollments/:id/progress
// @access  Private (Student)
const updateProgress = async (req, res) => {
  try {
    const { lessonId } = req.body;
    const enrollment = await Enrollment.findById(req.params.id);

    if (!enrollment) {
      return res
        .status(404)
        .json({ success: false, message: 'Enrollment not found' });
    }

    if (enrollment.student.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    if (!enrollment.completedLessons.includes(lessonId)) {
      enrollment.completedLessons.push(lessonId);
    }

    const course = await Course.findById(enrollment.course);
    if (course && course.lessons.length > 0) {
      enrollment.progress = Math.round(
        (enrollment.completedLessons.length / course.lessons.length) * 100
      );
    }

    if (enrollment.progress === 100) enrollment.status = 'completed';

    await enrollment.save();
    res.json({ success: true, enrollment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { enrollCourse, getMyCourses, updateProgress };
