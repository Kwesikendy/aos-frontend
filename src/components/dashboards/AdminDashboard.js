import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { courseAPI, dashboardAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import '../../styles/user-management.css';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [allCourses, setAllCourses] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCourses: 0,
    totalStudents: 0,
    totalTeachers: 0,
    totalParents: 0,
    publishedCourses: 0,
    draftCourses: 0,
    totalEnrollments: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      setError('');

      // Fetch real data from API
      const [dashboardResponse, coursesResponse] = await Promise.all([
        dashboardAPI.getAdminDashboard(),
        courseAPI.getCourses({ limit: 50 })
      ]);

      const dashboardData = dashboardResponse.data.data;
      const courses = coursesResponse.data.data.courses;

      setAllCourses(courses);
      setStats(dashboardData.stats);
      setRecentActivity(dashboardData.recentActivity || []);

    } catch (err) {
      console.error('Error in fetchAdminData:', err);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    const now = new Date();
    const activityDate = new Date(date);
    const diffTime = now - activityDate;
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffHours < 24) {
      return `${diffHours} hours ago`;
    } else {
      return `${diffDays} days ago`;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'published': return 'status-published';
      case 'draft': return 'status-draft';
      case 'archived': return 'status-archived';
      default: return 'status-unknown';
    }
  };

  if (loading) {
    return <div className="dashboard-loading">Loading admin dashboard...</div>;
  }

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h2>Admin Dashboard 🔧</h2>
        <p>System overview and management tools for {user.firstName}.</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      {/* System Stats */}
      <div className="stats-grid admin-stats">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>{stats.totalUsers}</h3>
            <p>Total Users</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📚</div>
          <div className="stat-content">
            <h3>{stats.totalCourses}</h3>
            <p>Total Courses</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🎓</div>
          <div className="stat-content">
            <h3>{stats.totalStudents}</h3>
            <p>Students</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">👩‍🏫</div>
          <div className="stat-content">
            <h3>{stats.totalTeachers}</h3>
            <p>Teachers</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>{stats.publishedCourses}</h3>
            <p>Published</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📝</div>
          <div className="stat-content">
            <h3>{stats.draftCourses}</h3>
            <p>Drafts</p>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        {/* Course Management */}
        <section className="dashboard-section">
          <div className="section-header">
            <h3>Course Management</h3>
            <div className="section-actions">
              <Link to="/create-course" className="btn btn-primary">Create Course</Link>
              <Link to="/admin/courses" className="view-all-link">Manage All</Link>
            </div>
          </div>
          <div className="courses-grid admin-courses">
            {allCourses.length > 0 ? (
              allCourses.slice(0, 6).map(course => (
                <div key={course.id} className="course-card admin-course-card">
                  <div className="course-header">
                    <h4>{course.title}</h4>
                    <span className={`status-badge ${getStatusColor(course.status)}`}>
                      {course.status}
                    </span>
                  </div>
                  <div className="course-meta">
                    <span className="course-code">{course.code}</span>
                    <span className={`level-badge level-${course.level}`}>
                      {course.level}
                    </span>
                  </div>
                  <div className="course-stats">
                    <div className="stat-item">
                      <span className="stat-number">{course.totalEnrollments || 0}</span>
                      <span className="stat-label">Enrolled</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-number">{course.instructors?.length || 0}</span>
                      <span className="stat-label">Instructors</span>
                    </div>
                  </div>
                  <div className="course-actions">
                    <Link to={`/courses/${course.id}`} className="btn btn-outline btn-sm">
                      View
                    </Link>
                    <Link to={`/courses/${course.id}/edit`} className="btn btn-primary btn-sm">
                      Edit
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <p>No courses created yet.</p>
                <Link to="/create-course" className="btn btn-primary">Create First Course</Link>
              </div>
            )}
          </div>
        </section>

        {/* User Management Summary */}
        <section className="dashboard-section">
          <div className="section-header">
            <h3>User Management</h3>
            <Link to="/admin/users" className="btn btn-primary btn-sm">
              Manage All Users
            </Link>
          </div>
          <div className="user-stats">
            <div className="user-type-card">
              <div className="user-type-icon">👨‍🎓</div>
              <div className="user-type-info">
                <h4>Students</h4>
                <span className="count">{stats.totalStudents}</span>
              </div>
              <Link to="/admin/users?role=student" className="btn btn-text btn-sm">
                View All →
              </Link>
            </div>
            <div className="user-type-card">
              <div className="user-type-icon">👩‍🏫</div>
              <div className="user-type-info">
                <h4>Teachers</h4>
                <span className="count">{stats.totalTeachers}</span>
              </div>
              <Link to="/admin/users?role=teacher" className="btn btn-text btn-sm">
                View All →
              </Link>
            </div>
            <div className="user-type-card">
              <div className="user-type-icon">👨‍👩‍👧‍👦</div>
              <div className="user-type-info">
                <h4>Parents</h4>
                <span className="count">{stats.totalParents}</span>
              </div>
              <Link to="/admin/users?role=parent" className="btn btn-text btn-sm">
                View All →
              </Link>
            </div>
          </div>
        </section>

        {/* Recent Activity */}
        <section className="dashboard-section">
          <div className="section-header">
            <h3>Recent System Activity</h3>
            <Link to="/admin/logs" className="view-all-link">View All Logs</Link>
          </div>
          <div className="activity-feed">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity, idx) => (
                <div key={idx} className="activity-item">
                  <div className="activity-icon">📚</div>
                  <div className="activity-content">
                    <p>{activity.description}</p>
                    <span className="activity-time">{formatDate(activity.time)}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="empty-state">No recent activity</p>
            )}
          </div>
        </section>

        {/* Quick Admin Actions */}
        <section className="dashboard-section">
          <h3>Admin Tools</h3>
          <div className="quick-actions admin-actions">
            <Link to="/admin/users" className="action-card">
              <div className="action-icon">👥</div>
              <h4>User Management</h4>
              <p>Manage accounts and permissions</p>
            </Link>
            <Link to="/courses" className="action-card">
              <div className="action-icon">📚</div>
              <h4>Course Oversight</h4>
              <p>Review and manage all courses</p>
            </Link>
            <Link to="/admin/analytics" className="action-card">
              <div className="action-icon">📊</div>
              <h4>System Analytics</h4>
              <p>View usage and performance metrics</p>
            </Link>
            <Link to="/admin/settings" className="action-card">
              <div className="action-icon">⚙️</div>
              <h4>System Settings</h4>
              <p>Configure system preferences</p>
            </Link>
            <Link to="/admin/timetable" className="action-card">
              <div className="action-icon">📅</div>
              <h4>Timetable</h4>
              <p>Schedule classes & notify teachers</p>
            </Link>
            <Link to="/admin/reports" className="action-card">
              <div className="action-icon">📈</div>
              <h4>Reports</h4>
              <p>Generate system reports</p>
            </Link>
            <Link to="/admin/backup" className="action-card">
              <div className="action-icon">💾</div>
              <h4>Backup & Restore</h4>
              <p>Manage system backups</p>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminDashboard;
