const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');

// @desc    Get all published courses
// @route   GET /api/courses
// @access  Public
const getCourses = async (req, res) => {
  try {
    const { category, search, level } = req.query;
    const filter = { isPublished: true };

    if (category) filter.category = category;
    if (level) filter.level = level;
    if (search) filter.title = { $regex: search, $options: 'i' };

    const courses = await Course.find(filter)
      .populate('instructor', 'name avatar')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: courses.length, courses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single course
// @route   GET /api/courses/:id
// @access  Public
const getCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate(
      'instructor',
      'name avatar bio'
    );
    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: 'Course not found' });
    }
    res.json({ success: true, course });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create course
// @route   POST /api/courses
// @access  Private (Instructor, Admin)
const createCourse = async (req, res) => {
  try {
    const { title, description, category, price, thumbnail, level } = req.body;

    const course = await Course.create({
      title,
      description,
      category,
      price: price || 0,
      thumbnail,
      level,
      instructor: req.user._id,
    });

    res.status(201).json({ success: true, course });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update course
// @route   PUT /api/courses/:id
// @access  Private (Instructor who owns it, Admin)
const updateCourse = async (req, res) => {
  try {
    let course = await Course.findById(req.params.id);
    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: 'Course not found' });
    }

    // Only the instructor or admin can update
    if (
      course.instructor.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res
        .status(403)
        .json({ success: false, message: 'Not authorized to update this course' });
    }

    course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({ success: true, course });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete course
// @route   DELETE /api/courses/:id
// @access  Private (Instructor who owns it, Admin)
const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: 'Course not found' });
    }

    if (
      course.instructor.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res
        .status(403)
        .json({ success: false, message: 'Not authorized to delete this course' });
    }

    await course.deleteOne();
    await Enrollment.deleteMany({ course: req.params.id });

    res.json({ success: true, message: 'Course deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add lesson to course
// @route   POST /api/courses/:id/lessons
// @access  Private (Instructor who owns it)
const addLesson = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: 'Course not found' });
    }

    if (
      course.instructor.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res
        .status(403)
        .json({ success: false, message: 'Not authorized' });
    }

    const { title, content, videoUrl, duration } = req.body;
    course.lessons.push({
      title,
      content,
      videoUrl,
      duration,
      order: course.lessons.length,
    });

    await course.save();
    res.status(201).json({ success: true, course });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get instructor's own courses
// @route   GET /api/courses/my-courses
// @access  Private (Instructor)
const getInstructorCourses = async (req, res) => {
  try {
    const courses = await Course.find({ instructor: req.user._id }).sort({
      createdAt: -1,
    });
    res.json({ success: true, count: courses.length, courses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
  addLesson,
  getInstructorCourses,
};
