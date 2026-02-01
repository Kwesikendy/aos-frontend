import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Unauthorized = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleGoBack = () => {
    navigate(-1);
  };

  const getRoleSpecificMessage = () => {
    if (!user) {
      return {
        title: 'Login Required',
        message: 'You need to be logged in to access this page.',
        suggestion: 'Please log in to your account to continue.'
      };
    }

    switch (user.role) {
      case 'student':
        return {
          title: 'Student Access Only',
          message: 'This page is restricted to student accounts.',
          suggestion: 'You currently have student access. Contact your administrator if you need different permissions.'
        };
      case 'teacher':
        return {
          title: 'Teacher Access Only',
          message: 'This page is restricted to teacher accounts.',
          suggestion: 'You currently have teacher access. Some features may be limited to administrators or other roles.'
        };
      case 'admin':
        return {
          title: 'Administrator Access Only',
          message: 'This page is restricted to administrator accounts.',
          suggestion: 'You have administrative access. This might be a system error if you\'re seeing this message.'
        };
      case 'parent':
        return {
          title: 'Parent Access Only',
          message: 'This page is restricted to parent accounts.',
          suggestion: 'You currently have parent access. Contact support if you need access to different features.'
        };
      default:
        return {
          title: 'Access Restricted',
          message: 'You don\'t have permission to access this page.',
          suggestion: 'Your account role doesn\'t allow access to this feature.'
        };
    }
  };

  const getAccessibleLinks = () => {
    if (!user) {
      return [
        { label: '🔐 Login', path: '/login' },
        { label: '📝 Register', path: '/register' },
        { label: '🏠 Home', path: '/' },
        { label: '📚 Browse Courses', path: '/courses' }
      ];
    }

    const baseLinks = [
      { label: '📊 Dashboard', path: '/dashboard' },
      { label: '📚 Courses', path: '/courses' },
      { label: '👤 Profile', path: '/profile' }
    ];

    switch (user.role) {
      case 'admin':
        return [
          ...baseLinks,
          { label: '🔧 Admin Dashboard', path: '/admin' },
          { label: '👥 User Management', path: '/admin/users' },
          { label: '📈 Analytics', path: '/admin/analytics' }
        ];
      case 'teacher':
        return [
          ...baseLinks,
          { label: '➕ Create Course', path: '/create-course' },
          { label: '📋 My Classes', path: '/classes' },
          { label: '👥 My Students', path: '/students' }
        ];
      case 'parent':
        return [
          ...baseLinks,
          { label: '👨‍👩‍👧‍👦 Parent Dashboard', path: '/parent' },
          { label: '📊 Children Progress', path: '/parent/progress' },
          { label: '💬 Messages', path: '/parent/messages' }
        ];
      case 'student':
      default:
        return [
          ...baseLinks,
          { label: '📖 My Courses', path: '/student/courses' },
          { label: '📝 Assignments', path: '/student/assignments' },
          { label: '📊 Progress', path: '/student/progress' }
        ];
    }
  };

  const roleInfo = getRoleSpecificMessage();
  const accessibleLinks = getAccessibleLinks();

  return (
    <div className="error-page unauthorized-page">
      <div className="error-content">
        <div className="error-icon">
          <span className="error-number">403</span>
          <div className="error-emoji">🚫</div>
        </div>
        
        <div className="error-text">
          <h1>{roleInfo.title}</h1>
          <p className="error-message">
            {roleInfo.message}
          </p>
          <p className="error-suggestion">
            {roleInfo.suggestion}
          </p>
        </div>

        {user && (
          <div className="user-info">
            <p>
              <strong>Current User:</strong> {user.firstName} {user.lastName}<br />
              <strong>Role:</strong> {user.role.charAt(0).toUpperCase() + user.role.slice(1)}<br />
              <strong>Email:</strong> {user.email}
            </p>
          </div>
        )}

        <div className="error-actions">
          <button onClick={handleGoBack} className="btn btn-outline">
            ← Go Back
          </button>
          <Link to="/dashboard" className="btn btn-primary">
            📊 Dashboard
          </Link>
        </div>

        <div className="helpful-links">
          <h3>Pages you can access:</h3>
          <div className="link-grid">
            {accessibleLinks.map((link, index) => (
              <Link 
                key={index} 
                to={link.path} 
                className="helpful-link"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="contact-support">
          <p>
            <strong>Need different access?</strong><br />
            Contact your administrator or support team to request permission changes.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
