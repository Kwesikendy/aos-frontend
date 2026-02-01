import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { courseAPI, enrollmentAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const EnrollmentManagement = () => {
  const { courseId } = useParams();
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const [stats, setStats] = useState({
    totalEnrolled: 0,
    activeEnrollments: 0,
    pendingEnrollments: 0,
    completedEnrollments: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedEnrollments, setSelectedEnrollments] = useState([]);

  useEffect(() => {
    if (courseId) {
      fetchEnrollmentData();
    }
  }, [courseId]);

  const fetchEnrollmentData = async () => {
    try {
      setLoading(true);
      setError('');

      // Fetch course details
      const courseResponse = await courseAPI.getCourse(courseId);
      const courseData = courseResponse.data.data.course;
      setCourse(courseData);

      // Check if user has permission to manage this course
      const canManage = user.role === 'admin' || 
                       courseData.createdBy._id === user._id ||
                       courseData.instructors?.some(instructor => instructor._id === user._id);
      
      if (!canManage) {
        setError('You do not have permission to manage enrollments for this course.');
        return;
      }

      // Mock enrollment data (replace with real API when available)
      const mockEnrollments = [
        {
          id: 1,
          student: {
            _id: 'student1',
            firstName: 'Alice',
            lastName: 'Johnson',
            email: 'alice.johnson@email.com',
            avatar: null
          },
          enrolledDate: new Date('2025-01-15'),
          status: 'active',
          progress: 65,
          lastActivity: new Date('2025-08-20'),
          completedAssignments: 8,
          totalAssignments: 12,
          grade: 'B+'
        },
        {
          id: 2,
          student: {
            _id: 'student2',
            firstName: 'Bob',
            lastName: 'Smith',
            email: 'bob.smith@email.com',
            avatar: null
          },
          enrolledDate: new Date('2025-01-20'),
          status: 'active',
          progress: 82,
          lastActivity: new Date('2025-08-22'),
          completedAssignments: 10,
          totalAssignments: 12,
          grade: 'A-'
        },
        {
          id: 3,
          student: {
            _id: 'student3',
            firstName: 'Carol',
            lastName: 'Davis',
            email: 'carol.davis@email.com',
            avatar: null
          },
          enrolledDate: new Date('2025-02-01'),
          status: 'pending',
          progress: 15,
          lastActivity: new Date('2025-08-18'),
          completedAssignments: 2,
          totalAssignments: 12,
          grade: 'C'
        },
        {
          id: 4,
          student: {
            _id: 'student4',
            firstName: 'David',
            lastName: 'Wilson',
            email: 'david.wilson@email.com',
            avatar: null
          },
          enrolledDate: new Date('2025-01-10'),
          status: 'completed',
          progress: 100,
          lastActivity: new Date('2025-08-15'),
          completedAssignments: 12,
          totalAssignments: 12,
          grade: 'A+'
        }
      ];

      setEnrollments(mockEnrollments);

      // Calculate stats
      const stats = {
        totalEnrolled: mockEnrollments.length,
        activeEnrollments: mockEnrollments.filter(e => e.status === 'active').length,
        pendingEnrollments: mockEnrollments.filter(e => e.status === 'pending').length,
        completedEnrollments: mockEnrollments.filter(e => e.status === 'completed').length
      };
      setStats(stats);

    } catch (err) {
      console.error('Error fetching enrollment data:', err);
      setError(err.response?.data?.message || 'Failed to load enrollment data');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectEnrollment = (enrollmentId) => {
    setSelectedEnrollments(prev => 
      prev.includes(enrollmentId) 
        ? prev.filter(id => id !== enrollmentId)
        : [...prev, enrollmentId]
    );
  };

  const handleSelectAll = () => {
    if (selectedEnrollments.length === enrollments.length) {
      setSelectedEnrollments([]);
    } else {
      setSelectedEnrollments(enrollments.map(e => e.id));
    }
  };

  const handleBulkAction = async (action) => {
    if (selectedEnrollments.length === 0) {
      alert('Please select at least one enrollment');
      return;
    }

    const confirmMessage = `Are you sure you want to ${action} ${selectedEnrollments.length} enrollment(s)?`;
    if (!window.confirm(confirmMessage)) {
      return;
    }

    try {
      console.log(`Performing ${action} on enrollments:`, selectedEnrollments);
      // TODO: Implement actual bulk actions when API is available
      alert(`${action} completed for ${selectedEnrollments.length} enrollment(s)`);
      setSelectedEnrollments([]);
    } catch (err) {
      console.error(`Error performing ${action}:`, err);
      setError(`Failed to ${action} enrollments`);
    }
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'status-active';
      case 'pending': return 'status-pending';
      case 'completed': return 'status-completed';
      case 'dropped': return 'status-dropped';
      default: return 'status-unknown';
    }
  };

  const getProgressColor = (progress) => {
    if (progress >= 90) return 'progress-excellent';
    if (progress >= 70) return 'progress-good';
    if (progress >= 50) return 'progress-fair';
    return 'progress-poor';
  };

  if (loading) {
    return (
      <div className="enrollment-management-container">
        <div className="loading">Loading enrollment data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="enrollment-management-container">
        <div className="error-message">
          <p>{error}</p>
          <Link to="/courses" className="btn btn-primary">Back to Courses</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="enrollment-management-container">
      {/* Breadcrumb */}
      <nav className="breadcrumb">
        <Link to="/courses">Courses</Link>
        <span> / </span>
        <Link to={`/courses/${courseId}`}>{course?.title}</Link>
        <span> / </span>
        <span>Enrollments</span>
      </nav>

      {/* Header */}
      <div className="enrollment-header">
        <div className="header-info">
          <h2>Course Enrollments</h2>
          <p className="course-title">{course?.title} ({course?.code})</p>
        </div>
        <div className="header-actions">
          <Link to={`/courses/${courseId}`} className="btn btn-outline">
            Back to Course
          </Link>
          <button className="btn btn-primary" onClick={() => window.print()}>
            Export Report
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="enrollment-stats">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>{stats.totalEnrolled}</h3>
            <p>Total Enrolled</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🎯</div>
          <div className="stat-content">
            <h3>{stats.activeEnrollments}</h3>
            <p>Active Students</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⏳</div>
          <div className="stat-content">
            <h3>{stats.pendingEnrollments}</h3>
            <p>Pending</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>{stats.completedEnrollments}</h3>
            <p>Completed</p>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      <div className="bulk-actions">
        <div className="selection-info">
          <label className="select-all">
            <input
              type="checkbox"
              checked={selectedEnrollments.length === enrollments.length && enrollments.length > 0}
              onChange={handleSelectAll}
            />
            Select All ({selectedEnrollments.length} selected)
          </label>
        </div>
        <div className="action-buttons">
          <button
            className="btn btn-outline"
            onClick={() => handleBulkAction('approve')}
            disabled={selectedEnrollments.length === 0}
          >
            Approve Selected
          </button>
          <button
            className="btn btn-outline btn-warning"
            onClick={() => handleBulkAction('suspend')}
            disabled={selectedEnrollments.length === 0}
          >
            Suspend Selected
          </button>
          <button
            className="btn btn-outline btn-danger"
            onClick={() => handleBulkAction('remove')}
            disabled={selectedEnrollments.length === 0}
          >
            Remove Selected
          </button>
        </div>
      </div>

      {/* Enrollments Table */}
      <div className="enrollments-table-container">
        <table className="enrollments-table">
          <thead>
            <tr>
              <th>Select</th>
              <th>Student</th>
              <th>Enrolled Date</th>
              <th>Status</th>
              <th>Progress</th>
              <th>Assignments</th>
              <th>Grade</th>
              <th>Last Activity</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {enrollments.map((enrollment) => (
              <tr key={enrollment.id} className={selectedEnrollments.includes(enrollment.id) ? 'selected' : ''}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedEnrollments.includes(enrollment.id)}
                    onChange={() => handleSelectEnrollment(enrollment.id)}
                  />
                </td>
                <td>
                  <div className="student-info">
                    <div className="student-avatar">
                      {enrollment.student.avatar ? (
                        <img src={enrollment.student.avatar} alt={enrollment.student.firstName} />
                      ) : (
                        <div className="avatar-placeholder">
                          {enrollment.student.firstName[0]}{enrollment.student.lastName[0]}
                        </div>
                      )}
                    </div>
                    <div className="student-details">
                      <strong>{enrollment.student.firstName} {enrollment.student.lastName}</strong>
                      <p className="student-email">{enrollment.student.email}</p>
                    </div>
                  </div>
                </td>
                <td>{formatDate(enrollment.enrolledDate)}</td>
                <td>
                  <span className={`status-badge ${getStatusColor(enrollment.status)}`}>
                    {enrollment.status}
                  </span>
                </td>
                <td>
                  <div className="progress-container">
                    <div className={`progress-bar ${getProgressColor(enrollment.progress)}`}>
                      <div 
                        className="progress-fill" 
                        style={{ width: `${enrollment.progress}%` }}
                      ></div>
                    </div>
                    <span className="progress-text">{enrollment.progress}%</span>
                  </div>
                </td>
                <td>
                  <span className="assignments-count">
                    {enrollment.completedAssignments}/{enrollment.totalAssignments}
                  </span>
                </td>
                <td>
                  <span className="grade">{enrollment.grade}</span>
                </td>
                <td>{formatDate(enrollment.lastActivity)}</td>
                <td>
                  <div className="action-buttons">
                    <button className="btn btn-sm btn-outline" title="View Details">
                      👁️
                    </button>
                    <button className="btn btn-sm btn-outline" title="Send Message">
                      ✉️
                    </button>
                    <button className="btn btn-sm btn-outline btn-danger" title="Remove">
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {enrollments.length === 0 && (
        <div className="empty-state">
          <h3>No Enrollments Yet</h3>
          <p>No students have enrolled in this course yet.</p>
          <Link to={`/courses/${courseId}`} className="btn btn-primary">
            Back to Course
          </Link>
        </div>
      )}
    </div>
  );
};

export default EnrollmentManagement;
