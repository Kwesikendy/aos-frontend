import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { courseAPI, enrollmentAPI, dashboardAPI, userAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { UserPlus, X } from 'lucide-react';

const ParentDashboard = () => {
  const { user } = useAuth();
  const [children, setChildren] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [stats, setStats] = useState({
    totalChildren: 0,
    totalCourses: 0,
    averageGrade: 0,
    attendanceRate: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkEmail, setLinkEmail] = useState('');
  const [linkLoading, setLinkLoading] = useState(false);
  const [linkMessage, setLinkMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchParentData();
  }, []);

  const fetchParentData = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await dashboardAPI.getParentDashboard();
      if (response.data.success) {
        const { stats, children, recentActivity } = response.data.data;
        setStats(stats);
        setChildren(children);
        setRecentActivity(recentActivity);
      }
    } catch (err) {
      console.error('Error fetching parent data:', err);
      // Fallback or Error display
      setError(err.response?.status === 404 ? 'Dashboard endpoint not found.' : 'Failed to load family data.');
    } finally {
      setLoading(false);
    }
  };

  const handleLinkChild = async (e) => {
    e.preventDefault();
    if (!linkEmail) return;

    setLinkLoading(true);
    setLinkMessage({ type: '', text: '' });

    try {
      const response = await userAPI.linkChild(linkEmail);
      if (response.data.success) {
        setLinkMessage({ type: 'success', text: 'Child linked successfully!' });
        setLinkEmail('');
        // Refresh data after short delay
        setTimeout(() => {
          setShowLinkModal(false);
          setLinkMessage({ type: '', text: '' });
          fetchParentData();
        }, 1500);
      }
    } catch (err) {
      console.error('Link child error:', err);
      setLinkMessage({
        type: 'error',
        text: err.response?.data?.message || 'Failed to link child'
      });
    } finally {
      setLinkLoading(false);
    }
  };

  const convertGradeToNumber = (grade) => {
    const gradeMap = {
      'A+': 4.0, 'A': 3.7, 'A-': 3.3,
      'B+': 3.0, 'B': 2.7, 'B-': 2.3,
      'C+': 2.0, 'C': 1.7, 'C-': 1.3,
      'D+': 1.0, 'D': 0.7, 'F': 0.0
    };
    return gradeMap[grade] || 0;
  };

  const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    const now = new Date();
    const diffTime = now - d;
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffHours < 24) {
      return `${diffHours} hours ago`;
    } else {
      return `${diffDays} days ago`;
    }
  };

  const formatNextClassDate = (date) => {
    if (!date) return 'TBD';
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const getProgressColor = (progress) => {
    if (progress >= 90) return 'progress-excellent';
    if (progress >= 80) return 'progress-good';
    if (progress >= 70) return 'progress-fair';
    return 'progress-needs-improvement';
  };

  if (loading) {
    return <div className="dashboard-loading">Loading parent dashboard...</div>;
  }

  return (
    <div className="parent-dashboard">
      <div className="dashboard-header">
        <h2>Parent Dashboard 👨‍👩‍👧‍👦</h2>
        <p>Monitor your children's academic progress and stay connected with their learning journey.</p>
      </div>

      <div className="flex justify-end mb-6">
        <button
          onClick={() => setShowLinkModal(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-indigo-700 transition-colors shadow-sm"
        >
          <UserPlus className="w-5 h-5" />
          Link Child
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {/* Family Stats */}
      <div className="stats-grid parent-stats">
        <div className="stat-card">
          <div className="stat-icon">👶</div>
          <div className="stat-content">
            <h3>{stats.totalChildren}</h3>
            <p>Children</p>
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
          <div className="stat-icon">🎯</div>
          <div className="stat-content">
            <h3>{stats.averageGrade}</h3>
            <p>Average GPA</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <h3>{stats.attendanceRate}%</h3>
            <p>Attendance</p>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        {/* Children Overview */}
        <section className="dashboard-section">
          <div className="section-header">
            <h3>My Children</h3>
            <Link to="/parent/children" className="view-all-link">View Details</Link>
          </div>
          <div className="children-grid">
            {children.map(child => (
              <div key={child.id} className="child-card">
                <div className="child-header">
                  <div className="child-avatar">
                    {child.avatar ? (
                      <img src={child.avatar} alt={child.name} />
                    ) : (
                      <div className="avatar-placeholder">
                        {child.name.split(' ').map(n => n[0]).join('')}
                      </div>
                    )}
                  </div>
                  <div className="child-info">
                    <h4>{child.name}</h4>
                    <p className="child-grade">{child.grade}</p>
                  </div>
                </div>

                <div className="child-stats">
                  <div className="stat-item">
                    <span className="stat-label">Attendance:</span>
                    <span className={`stat-value ${child.attendance >= 95 ? 'excellent' : child.attendance >= 90 ? 'good' : 'needs-attention'}`}>
                      {child.attendance}%
                    </span>
                  </div>
                </div>

                <div className="child-courses">
                  <h5>Current Courses</h5>
                  {child.courses.map(course => (
                    <div key={course.id} className="course-progress-item">
                      <div className="course-info">
                        <span className="course-name">{course.name}</span>
                        <span className="course-grade">{course.grade}</span>
                      </div>
                      <div className="progress-container">
                        <div className={`progress-bar ${getProgressColor(course.progress)}`}>
                          <div
                            className="progress-fill"
                            style={{ width: `${course.progress}%` }}
                          ></div>
                        </div>
                        <span className="progress-text">{course.progress}%</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="next-class">
                  <h5>Next Class</h5>
                  <p>
                    <strong>{child.nextClass.subject}</strong><br />
                    {formatNextClassDate(child.nextClass.date)} at {child.nextClass.time}
                  </p>
                </div>

                <div className="child-actions">
                  <Link to={`/parent/child/${child.id}`} className="btn btn-primary btn-sm">
                    View Details
                  </Link>
                  <Link to={`/parent/child/${child.id}/message`} className="btn btn-outline btn-sm">
                    Message Teachers
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Recent Activity */}
        <section className="dashboard-section">
          <div className="section-header">
            <h3>Recent Activity</h3>
            <Link to="/parent/activity" className="view-all-link">View All</Link>
          </div>
          <div className="activity-feed">
            {recentActivity.map(activity => (
              <div key={activity.id} className="activity-item">
                <div className="activity-icon">{activity.icon}</div>
                <div className="activity-content">
                  <p>
                    <strong>{activity.childName}:</strong> {activity.description}
                  </p>
                  <span className="activity-time">{formatDate(activity.time)}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Quick Actions */}
        <section className="dashboard-section">
          <h3>Parent Tools</h3>
          <div className="quick-actions parent-actions">
            <Link to="/parent/attendance" className="action-card">
              <div className="action-icon">📅</div>
              <h4>Attendance Reports</h4>
              <p>View detailed attendance records</p>
            </Link>
            <Link to="/parent/grades" className="action-card">
              <div className="action-icon">📊</div>
              <h4>Grade Reports</h4>
              <p>Track academic performance</p>
            </Link>
            <Link to="/parent/messages" className="action-card">
              <div className="action-icon">💬</div>
              <h4>Teacher Messages</h4>
              <p>Communicate with teachers</p>
            </Link>
            <Link to="/parent/schedule" className="action-card">
              <div className="action-icon">🗓️</div>
              <h4>Class Schedule</h4>
              <p>View upcoming classes</p>
            </Link>
            <Link to="/parent/assignments" className="action-card">
              <div className="action-icon">📝</div>
              <h4>Assignment Tracker</h4>
              <p>Monitor homework and projects</p>
            </Link>
            <Link to="/parent/events" className="action-card">
              <div className="action-icon">🎉</div>
              <h4>School Events</h4>
              <p>Stay updated on school activities</p>
            </Link>
          </div>
        </section>

        {/* Communication Center */}
        <section className="dashboard-section">
          <h3>Communication Center</h3>
          <div className="communication-summary">
            <div className="comm-item">
              <div className="comm-icon">📧</div>
              <div className="comm-content">
                <h4>Unread Messages</h4>
                <p>2 new messages from teachers</p>
                <Link to="/parent/messages" className="comm-link">Read Messages</Link>
              </div>
            </div>
            <div className="comm-item">
              <div className="comm-icon">📋</div>
              <div className="comm-content">
                <h4>Forms to Sign</h4>
                <p>1 permission slip pending</p>
                <Link to="/parent/forms" className="comm-link">View Forms</Link>
              </div>
            </div>
            <div className="comm-item">
              <div className="comm-icon">🎯</div>
              <div className="comm-content">
                <h4>Parent-Teacher Conferences</h4>
                <p>Schedule your meetings</p>
                <Link to="/parent/conferences" className="comm-link">Schedule</Link>
              </div>
            </div>
          </div>
        </section>
      </div>
      {/* Link Child Modal */}
      {showLinkModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-gray-900">Link Verified Student</h3>
              <button onClick={() => setShowLinkModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleLinkChild} className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Student Email Address</label>
                <input
                  type="email"
                  required
                  value={linkEmail}
                  onChange={(e) => setLinkEmail(e.target.value)}
                  placeholder="student@example.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                />
                <p className="text-xs text-gray-500 mt-2">Enter the email address your child used to register.</p>
              </div>

              {linkMessage.text && (
                <div className={`mb-4 p-3 rounded-lg text-sm ${linkMessage.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                  {linkMessage.text}
                </div>
              )}

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowLinkModal(false)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={linkLoading}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-70 flex items-center gap-2"
                >
                  {linkLoading ? 'Linking...' : 'Link Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ParentDashboard;
