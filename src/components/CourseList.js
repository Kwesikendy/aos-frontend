import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { courseAPI } from '../services/api';

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    search: '',
    status: '',
    level: ''
  });

  useEffect(() => {
    fetchCourses();
  }, [filters]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchCourses = async () => {
    try {
      setLoading(true);
      console.log('Fetching courses with filters:', filters);
      const response = await courseAPI.getCourses(filters);
      console.log('Courses API response:', response);
      console.log('Response status:', response.status);
      console.log('Response data:', response.data);
      setCourses(response.data.data.courses);
      setError(''); // Clear any previous errors
    } catch (err) {
      console.error('Error fetching courses:', err);
      console.error('Error response:', err.response);
      console.error('Error status:', err.response?.status);
      console.error('Error data:', err.response?.data);
      setError(`Failed to fetch courses: ${err.response?.data?.message || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  if (loading) {
    return <div className="loading">Loading courses...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="course-list-container">
      <div className="course-header">
        <h2>Available Courses</h2>
        <div className="filters">
          <input
            type="text"
            placeholder="Search courses..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="search-input"
          />
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="filter-select"
          >
            <option value="">All Status</option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
          <select
            value={filters.level}
            onChange={(e) => handleFilterChange('level', e.target.value)}
            className="filter-select"
          >
            <option value="">All Levels</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
      </div>

      <div className="courses-grid">
        {courses.map((course) => (
          <div key={course.id} className="course-card">
            <div className="course-header">
              <h3 className="course-title">{course.title}</h3>
              <span className="course-code">{course.code}</span>
            </div>

            <p className="course-description">
              {course.shortDescription || course.description.substring(0, 100)}...
            </p>

            <div className="course-details">
              <div className="course-meta">
                <span className={`level-badge level-${course.level}`}>
                  {course.level}
                </span>
                <span className="credits">{course.credits} credits</span>
                <span className={`status status-${course.status}`}>
                  {course.status}
                </span>
              </div>

              <div className="course-instructors">
                <strong>Instructors:</strong>
                {course.instructors.map(instructor => (
                  <span key={instructor.id} className="instructor">
                    {instructor.firstName} {instructor.lastName}
                  </span>
                ))}
              </div>

              <div className="course-pricing">
                {course.isFree ? (
                  <span className="free">Free</span>
                ) : (
                  <span className="price">
                    ₵{course.price}
                  </span>
                )}
              </div>
            </div>

            <div className="course-actions">
              <Link to={`/courses/${course.id}`} className="btn btn-primary">
                View Details
              </Link>
              {course.status === 'published' && (
                <button className="btn btn-secondary">
                  Enroll Now
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {courses.length === 0 && !loading && (
        <div className="no-courses">
          <p>No courses found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

export default CourseList;
