import React from 'react';
import { Link } from 'react-router-dom';

const CourseCard = ({ course }) => {
  const price = course.price === 0 ? 'Free' : `$${course.price}`;
  return (
    <div className="card course-card">
      <div className="course-thumb">
        {course.thumbnail
          ? <img src={course.thumbnail} alt={course.title} />
          : <div className="thumb-placeholder">📚</div>
        }
        <span className="badge badge-primary course-level">{course.level}</span>
      </div>
      <div className="course-body">
        <span className="badge badge-warning" style={{ marginBottom:'0.5rem', display:'inline-block' }}>{course.category}</span>
        <h3 className="course-title">{course.title}</h3>
        <p className="course-desc">{course.description?.substring(0, 90)}...</p>
        <div className="course-meta">
          <span>👨‍🏫 {course.instructor?.name || 'Instructor'}</span>
          <span>📖 {course.lessons?.length || 0} lessons</span>
        </div>
        <div className="course-footer">
          <span className="course-price">{price}</span>
          <Link to={`/courses/${course._id}`} className="btn btn-primary btn-sm">View Course</Link>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
