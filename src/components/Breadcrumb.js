import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Home,
  ChevronRight,
  LayoutDashboard,
  BookOpen,
  PlusCircle,
  Edit3,
  User,
  Settings,
  Users,
  BarChart3,
  GraduationCap
} from 'lucide-react';

const Breadcrumb = () => {
  const location = useLocation();
  const { user } = useAuth();

  // Define breadcrumb mappings for different routes
  const getBreadcrumbItems = (pathname) => {
    const paths = pathname.split('/').filter(Boolean);
    const breadcrumbs = [];

    // Always start with home
    breadcrumbs.push({
      label: 'Home',
      icon: Home,
      path: '/',
      active: pathname === '/'
    });

    // Build breadcrumb path
    let currentPath = '';

    for (let i = 0; i < paths.length; i++) {
      const segment = paths[i];
      currentPath += `/${segment}`;
      const isLast = i === paths.length - 1;

      // Custom breadcrumb labels based on route segments
      let label = segment.charAt(0).toUpperCase() + segment.slice(1);
      let Icon = ChevronRight;

      switch (segment) {
        case 'dashboard':
          label = 'Dashboard';
          Icon = LayoutDashboard;
          break;
        case 'courses':
          label = 'Courses';
          Icon = BookOpen;
          break;
        case 'create-course':
          label = 'Create Course';
          Icon = PlusCircle;
          break;
        case 'edit':
          label = 'Edit Course';
          Icon = Edit3;
          break;
        case 'profile':
          label = 'Profile';
          Icon = User;
          break;
        case 'admin':
          label = 'Admin';
          Icon = Settings;
          break;
        case 'parent':
          label = 'Parent Portal';
          Icon = Users;
          break;
        case 'settings':
          label = 'Settings';
          Icon = Settings;
          break;
        case 'users':
          label = 'User Management';
          Icon = Users;
          break;
        case 'analytics':
          label = 'Analytics';
          Icon = BarChart3;
          break;
        default:
          // Handle dynamic segments like course IDs
          if (segment.length === 24) { // MongoDB ObjectId length
            label = 'Details';
            Icon = BookOpen;
          }
          break;
      }

      breadcrumbs.push({
        label: label,
        icon: Icon,
        path: currentPath,
        active: isLast
      });
    }

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbItems(location.pathname);

  // Don't show breadcrumbs on login/register pages
  if (['/login', '/register'].includes(location.pathname)) {
    return null;
  }

  // Don't show breadcrumbs if only home
  if (breadcrumbs.length <= 1) {
    return null;
  }

  return (
    <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        {breadcrumbs.map((breadcrumb, index) => {
          const Icon = breadcrumb.icon;
          return (
            <li key={breadcrumb.path} className="flex items-center">
              {index > 0 && (
                <ChevronRight className="w-4 h-4 text-gray-400 mx-2" />
              )}
              {breadcrumb.active ? (
                <div className="flex items-center text-sm font-medium text-gray-900 bg-white shadow-sm border border-gray-100 px-3 py-1 rounded-full">
                  <Icon className="w-4 h-4 mr-2 text-emerald-600" />
                  {breadcrumb.label}
                </div>
              ) : (
                <Link
                  to={breadcrumb.path}
                  className="flex items-center text-sm font-medium text-gray-500 hover:text-emerald-600 transition-colors"
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {breadcrumb.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
