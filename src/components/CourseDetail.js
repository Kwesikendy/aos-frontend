import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { courseAPI, enrollmentAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [enrollmentStatus, setEnrollmentStatus] = useState(null);

  const [enrolling, setEnrolling] = useState(false);
  const [selectedInstructor, setSelectedInstructor] = useState('');

  useEffect(() => {
    fetchCourseDetails();
  }, [id]);

  const fetchCourseDetails = async () => {
    try {
      setLoading(true);
      setError('');

      console.log('Fetching course details for ID:', id);
      const response = await courseAPI.getCourse(id);
      console.log('Course details response:', response.data);

      setCourse(response.data.data.course);

      // Check enrollment status if user is logged in
      if (user) {
        checkEnrollmentStatus(response.data.data.course);
      }
    } catch (err) {
      console.error('Error fetching course details:', err);
      setError(err.response?.data?.message || 'Failed to fetch course details');
    } finally {
      setLoading(false);
    }
  };

  const checkEnrollmentStatus = async (courseData) => {
    if (!user || user.role !== 'student') {
      setEnrollmentStatus('not-applicable');
      return;
    }

    try {
      // Check enrollment status via API
      const response = await enrollmentAPI.getEnrollmentStatus(courseData.id);
      setEnrollmentStatus(response.data.enrolled ? 'enrolled' : 'not-enrolled');
    } catch (err) {
      // If API doesn't exist yet, fall back to checking enrolledStudents array
      const isEnrolled = courseData.enrolledStudents?.some(
        student => student.id === user.id
      );
      setEnrollmentStatus(isEnrolled ? 'enrolled' : 'not-enrolled');
    }
  };

  const handleEnroll = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (user.role !== 'student') {
      setError('Only students can enroll in courses');
      return;
    }

    try {
      setEnrolling(true);
      setError('');

      console.log('Enrolling in course:', id);

      // Try to enroll via API
      try {
        if (course.instructors && course.instructors.length > 1 && !selectedInstructor) {
          setError('Please select an instructor to enroll with.');
          setEnrolling(false);
          return;
        }
        await enrollmentAPI.enrollInCourse(id, selectedInstructor);
        setEnrollmentStatus('enrolled');
        // Refresh course data to show updated enrollment count
        fetchCourseDetails();
      } catch (apiErr) {
        // If enrollment API doesn't exist, simulate for now
        if (apiErr.response?.status === 404) {
          console.log('Enrollment API not implemented yet, simulating enrollment');
          setTimeout(() => {
            setEnrollmentStatus('enrolled');
            setEnrolling(false);
            fetchCourseDetails();
          }, 1000);
          return;
        } else {
          throw apiErr;
        }
      }
    } catch (err) {
      console.error('Error enrolling in course:', err);
      const errorMsg = err.response?.data?.message || 'Failed to enroll in course';
      setError(errorMsg);
    } finally {
      setEnrolling(false);
    }
  };

  const handleUnenroll = async () => {
    if (!window.confirm('Are you sure you want to unenroll from this course?')) {
      return;
    }

    try {
      setEnrolling(true);
      setError('');

      console.log('Unenrolling from course:', id);

      // Try to unenroll via API
      try {
        await enrollmentAPI.unenrollFromCourse(id);
        setEnrollmentStatus('not-enrolled');
        fetchCourseDetails();
      } catch (apiErr) {
        // If API doesn't exist, simulate for now
        if (apiErr.response?.status === 404) {
          console.log('Unenrollment API not implemented yet, simulating unenrollment');
          setTimeout(() => {
            setEnrollmentStatus('not-enrolled');
            setEnrolling(false);
            fetchCourseDetails();
          }, 1000);
          return;
        } else {
          throw apiErr;
        }
      }
    } catch (err) {
      console.error('Error unenrolling from course:', err);
      const errorMsg = err.response?.data?.message || 'Failed to unenroll from course';
      setError(errorMsg);
    } finally {
      setEnrolling(false);
    }
  };

  const formatPrice = (price, currency, isFree) => {
    if (isFree) return 'Free';
    return new Intl.NumberFormat('en-GH', {
      style: 'currency',
      currency: currency || 'GHS'
    }).format(price);
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'published': return 'status-published';
      case 'draft': return 'status-draft';
      case 'archived': return 'status-archived';
      case 'closed': return 'status-closed';
      default: return 'status-unknown';
    }
  };

  const getLevelBadgeClass = (level) => {
    switch (level) {
      case 'beginner': return 'level-beginner';
      case 'intermediate': return 'level-intermediate';
      case 'advanced': return 'level-advanced';
      case 'expert': return 'level-expert';
      default: return 'level-unknown';
    }
  };

  if (loading) {
    return (
      <div className="course-detail-container">
        <div className="loading">Loading course details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="course-detail-container">
        <div className="error-message">
          <p>{error}</p>
          <Link to="/courses" className="btn btn-primary">
            Back to Courses
          </Link>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="course-detail-container">
        <div className="error-message">
          <p>Course not found</p>
          <Link to="/courses" className="btn btn-primary">
            Back to Courses
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="course-detail-container">
      {/* Breadcrumb Navigation */}
      <nav className="breadcrumb">
        <Link to="/courses">Courses</Link>
        <span> / </span>
        <span>{course.title}</span>
      </nav>

      {/* Course Header */}
      <div className="course-header">
        <div className="course-title-section">
          <h1 className="course-title">{course.title}</h1>
          <div className="course-meta">
            <span className={`status-badge ${getStatusBadgeClass(course.status)}`}>
              {course.status}
            </span>
            <span className={`level-badge ${getLevelBadgeClass(course.level)}`}>
              {course.level}
            </span>
            <span className="course-code">{course.code}</span>
          </div>
        </div>

        <div className="course-actions">
          {/* Show enrollment actions only for students */}
          {user && user.role === 'student' && (
            <>
              {enrollmentStatus === 'enrolled' ? (
                <div className="enrolled-actions">
                  <button className="btn btn-success" disabled>
                    ✅ Enrolled
                  </button>
                  <button
                    className="btn btn-outline btn-danger"
                    onClick={handleUnenroll}
                    disabled={enrolling}
                  >
                    {enrolling ? 'Processing...' : 'Unenroll'}
                  </button>
                </div>
              ) : (
                <button
                  className="btn btn-primary"
                  onClick={handleEnroll}
                  disabled={enrolling || course.status !== 'published'}
                >
                  {enrolling ? 'Enrolling...' : 'Enroll Now'}
                </button>
              )}
            </>
          )}

          {/* Show management actions for teachers/admins */}
          {user && (user.role === 'admin' ||
            course.createdBy.id === user.id ||
            course.instructors?.some(instructor => instructor.id === user.id)) && (
              <Link to={`/courses/${course.id}/edit`} className="btn btn-primary">
                Edit Course
              </Link>
            )}

          <Link to="/courses" className="btn btn-secondary">
            Back to Courses
          </Link>
        </div>
      </div>

      {/* Course Content */}
      <div className="course-content">
        <div className="course-main">
          {/* Course Description */}
          <section className="course-section">
            <h2>Course Description</h2>
            <p className="course-description">{course.description}</p>

            {course.shortDescription && (
              <div className="short-description">
                <h3>Overview</h3>
                <p>{course.shortDescription}</p>
              </div>
            )}
          </section>

          {/* Course Details */}
          <section className="course-section">
            <h2>Course Details</h2>
            <div className="details-grid">
              <div className="detail-item">
                <span className="detail-label">Duration:</span>
                <span className="detail-value">{course.duration}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Credits:</span>
                <span className="detail-value">{course.credits}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Max Students:</span>
                <span className="detail-value">{course.maxStudents}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Price:</span>
                <span className="detail-value">
                  {formatPrice(course.price, course.currency, course.isFree)}
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Enrolled Students:</span>
                <span className="detail-value">
                  {course.enrolledStudents?.length || 0} / {course.maxStudents}
                </span>
              </div>
            </div>
          </section>

          {/* Instructors */}
          {course.instructors && course.instructors.length > 0 && (
            <section className="course-section">
              <h2>Instructors</h2>
              <div className="instructors-grid">
                {course.instructors.map((instructor) => (
                  <div key={instructor.id} className="instructor-card">
                    <div className="instructor-avatar">
                      {instructor.firstName?.[0]}{instructor.lastName?.[0]}
                    </div>
                    <div className="instructor-info">
                      <h4>{instructor.firstName} {instructor.lastName}</h4>
                      {instructor.email && (
                        <p className="instructor-email">{instructor.email}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar */}
        <div className="course-sidebar">
          <div className="sidebar-card">
            <h3>Quick Info</h3>
            <div className="quick-info">
              <div className="info-item">
                <span className="info-label">Level:</span>
                <span className="info-value">{course.level}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Status:</span>
                <span className="info-value">{course.status}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Credits:</span>
                <span className="info-value">{course.credits}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Price:</span>
                <span className="info-value">
                  {formatPrice(course.price, course.currency, course.isFree)}
                </span>
              </div>
            </div>
          </div>

          {/* Enrollment Status - Only show for students */}
          {user && user.role === 'student' && (
            <div className="sidebar-card">
              <h3>Your Enrollment</h3>
              {enrollmentStatus === 'enrolled' ? (
                <div className="enrollment-status enrolled">
                  <p>✅ You are enrolled in this course</p>
                  <div className="enrollment-actions">
                    <button className="btn btn-outline">
                      View Classes
                    </button>
                    <button
                      className="btn btn-outline btn-sm btn-danger"
                      onClick={handleUnenroll}
                      disabled={enrolling}
                    >
                      {enrolling ? 'Processing...' : 'Unenroll'}
                    </button>
                  </div>
                </div>
              ) : enrollmentStatus === 'not-enrolled' ? (
                <div className="enrollment-status not-enrolled">
                  <p>You are not enrolled yet</p>
                  {course.instructors && course.instructors.length > 1 && (
                    <div className="instructor-selection" style={{ marginBottom: '1rem' }}>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Select Your Instructor:</label>
                      <select
                        className="form-control"
                        value={selectedInstructor}
                        onChange={(e) => setSelectedInstructor(e.target.value)}
                        style={{ width: '100%', padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid #e5e7eb' }}
                      >
                        <option value="">-- Choose Instructor --</option>
                        {course.instructors.map(inst => (
                          <option key={inst.id} value={inst.id}>
                            {inst.firstName} {inst.lastName}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <button
                    className="btn btn-primary"
                    onClick={handleEnroll}
                    disabled={enrolling || course.status !== 'published' || (course.instructors?.length > 1 && !selectedInstructor)}
                  >
                    {enrolling ? 'Enrolling...' : 'Enroll Now'}
                  </button>
                  {course.status !== 'published' && (
                    <p className="enrollment-note">
                      Course must be published before enrollment
                    </p>
                  )}
                </div>
              ) : null}
            </div>
          )}

          {/* Course Management - Only show for teachers/admins */}
          {user && (user.role === 'admin' ||
            course.createdBy.id === user.id ||
            course.instructors?.some(instructor => instructor.id === user.id)) && (
              <div className="sidebar-card">
                <h3>Course Management</h3>
                <div className="management-actions">
                  <Link to={`/courses/${course.id}/edit`} className="btn btn-primary btn-block">
                    Edit Course
                  </Link>
                  <button className="btn btn-outline btn-block">
                    View Students ({course.totalEnrollments || 0})
                  </button>
                  <button className="btn btn-outline btn-block">
                    Manage Classes
                  </button>
                </div>
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
