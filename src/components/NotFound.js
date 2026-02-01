import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NotFound = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleGoBack = () => {
    navigate(-1);
  };

  const getRecommendedLinks = () => {
    if (!user) {
      return [
        { label: '🏠 Go Home', path: '/' },
        { label: '📚 Browse Courses', path: '/courses' },
        { label: '🔐 Login', path: '/login' }
      ];
    }

    const commonLinks = [
      { label: '📊 Dashboard', path: '/dashboard' },
      { label: '📚 Courses', path: '/courses' },
      { label: '👤 Profile', path: '/profile' }
    ];

    // Add role-specific links
    switch (user.role) {
      case 'admin':
        return [
          ...commonLinks,
          { label: '🔧 Admin Panel', path: '/admin' },
          { label: '👥 User Management', path: '/admin/users' }
        ];
      case 'teacher':
        return [
          ...commonLinks,
          { label: '➕ Create Course', path: '/create-course' },
          { label: '📋 My Classes', path: '/classes' }
        ];
      case 'parent':
        return [
          ...commonLinks,
          { label: '👨‍👩‍👧‍👦 Parent Portal', path: '/parent' },
          { label: '📊 Children Progress', path: '/parent/progress' }
        ];
      default:
        return commonLinks;
    }
  };

  const recommendedLinks = getRecommendedLinks();

  return (
    <div className="error-page not-found-page">
      <div className="error-content">
        <div className="error-icon">
          <span className="error-number">404</span>
          <div className="error-emoji">🔍</div>
        </div>
        
        <div className="error-text">
          <h1>Page Not Found</h1>
          <p className="error-message">
            Oops! The page you're looking for doesn't exist. It might have been moved, 
            deleted, or you entered the wrong URL.
          </p>
        </div>

        <div className="error-actions">
          <button onClick={handleGoBack} className="btn btn-outline">
            ← Go Back
          </button>
          <Link to="/" className="btn btn-primary">
            🏠 Go Home
          </Link>
        </div>

        <div className="helpful-links">
          <h3>Try these instead:</h3>
          <div className="link-grid">
            {recommendedLinks.map((link, index) => (
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

        <div className="search-suggestion">
          <p>
            <strong>Still can't find what you're looking for?</strong><br />
            Contact support or check our help documentation.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
