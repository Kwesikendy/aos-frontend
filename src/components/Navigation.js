import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import {
  GraduationCap,
  Menu,
  X,
  User,
  LogOut,
  BookOpen,
  Users,
  PlusCircle,
  Calendar,
  BarChart3,
  Settings,
  MessageCircle,
  TrendingUp,
  Home
} from 'lucide-react';
import NotificationBell from './ui/NotificationBell';

const Navigation = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      setIsMobileMenuOpen(false);
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const isActive = (path) => location.pathname === path;

  const roleBasedMenu = {
    student: [
      { path: '/student', label: 'My Dashboard', icon: Home },
      { path: '/student/courses', label: 'My Courses', icon: BookOpen },
      { path: '/student/assignments', label: 'Assignments', icon: BookOpen },
      { path: '/courses', label: 'Browse Courses', icon: BookOpen }
    ],
    teacher: [
      { path: '/teacher', label: 'Teacher Dashboard', icon: Home },
      { path: '/courses', label: 'All Courses', icon: BookOpen },
      { path: '/classes', label: 'Classes', icon: Calendar },
      { path: '/students', label: 'Students', icon: Users }
    ],
    admin: [
      { path: '/admin', label: 'Admin Dashboard', icon: Home },
      { path: '/courses', label: 'Manage Courses', icon: BookOpen },
      { path: '/admin/users', label: 'Users', icon: Users },
      { path: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
      { path: '/admin/settings', label: 'Settings', icon: Settings }
    ],
    parent: [
      { path: '/parent', label: 'Parent Dashboard', icon: Home },
      { path: '/parent/progress', label: 'Children Progress', icon: TrendingUp },
      { path: '/parent/messages', label: 'Messages', icon: MessageCircle }
    ]
  };

  const getMenuItems = () => {
    if (!user) return [];
    return roleBasedMenu[user.role] || [];
  };

  const NavLink = ({ to, children, icon: Icon, onClick, isButton = false }) => {
    const active = isActive(to);

    return (
      <motion.div
        whileHover={{ y: -2 }}
        whileTap={{ y: 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
      >
        {isButton ? (
          <motion.button
            onClick={onClick}
            className={`
              relative flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium
              transition-all duration-200 group
              ${active
                ? 'text-white bg-white/20 shadow-lg backdrop-blur-sm'
                : 'text-gray-200 hover:text-white hover:bg-white/10'
              }
            `}
          >
            {Icon && <Icon className="w-4 h-4" />}
            <span className="hidden md:block">{children}</span>
            {active && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-xl opacity-20"
                layoutId="navHighlight"
                initial={false}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
          </motion.button>
        ) : (
          <Link
            to={to}
            onClick={() => setIsMobileMenuOpen(false)}
            className={`
              relative flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium
              transition-all duration-200 group
              ${active
                ? 'text-white bg-white/20 shadow-lg backdrop-blur-sm'
                : 'text-gray-200 hover:text-white hover:bg-white/10'
              }
            `}
          >
            {Icon && <Icon className="w-4 h-4" />}
            <span className="hidden md:block">{children}</span>
            {active && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-xl opacity-20"
                layoutId="navHighlight"
                initial={false}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
          </Link>
        )}
      </motion.div>
    );
  };

  return (
    <>
      {location.pathname === '/' ? null : (
        <>
          <motion.nav
            className="
              sticky top-0 z-50 w-full
              bg-gradient-to-r from-slate-900 via-emerald-900 to-slate-900
              backdrop-blur-xl border-b border-white/10
              shadow-xl shadow-emerald-500/10
            "
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                {/* Logo */}
                <motion.div
                  className="flex items-center gap-3"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <Link to="/" className="flex items-center gap-3 group">
                    <motion.div
                      className="
                        w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 
                        rounded-xl flex items-center justify-center
                        shadow-lg shadow-emerald-500/20
                      "
                      whileHover={{ rotate: 10, scale: 1.1 }}
                    >
                      <GraduationCap className="w-6 h-6 text-white" />
                    </motion.div>
                    <div className="flex flex-col">
                      <h1 className="text-xl font-bold bg-gradient-to-r from-white to-emerald-100 bg-clip-text text-transparent leading-none">
                        AcademyOS
                      </h1>
                      <span className="text-xs font-medium text-emerald-200 tracking-wide">
                        LMS Platform
                      </span>
                    </div>
                  </Link>
                </motion.div>

                {/* Desktop Navigation */}
                <div className="hidden lg:flex items-center space-x-2">
                  {user && (
                    <>
                      {getMenuItems().map((item) => (
                        <NavLink key={item.path} to={item.path} icon={item.icon}>
                          {item.label}
                        </NavLink>
                      ))}
                    </>
                  )}
                  {!user && (
                    <>
                      <NavLink to="/courses" icon={BookOpen}>
                        Courses
                      </NavLink>
                      <NavLink to="/login">
                        Login
                      </NavLink>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Link
                          to="/register"
                          className="
                            px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600
                            text-white font-medium rounded-xl shadow-lg hover:shadow-xl
                            hover:from-indigo-600 hover:to-purple-700
                            transition-all duration-200
                          "
                        >
                          Get Started
                        </Link>
                      </motion.div>
                    </>
                  )}
                </div>

                {/* User Menu & Mobile Toggle */}
                <div className="flex items-center space-x-3">
                  {user && (
                    <div className="hidden lg:flex items-center space-x-2">
                      <NavLink to="/profile" icon={User}>
                        Profile
                      </NavLink>
                      <NavLink onClick={handleLogout} icon={LogOut} isButton>
                        Logout
                      </NavLink>
                    </div>
                  )}

                  {/* Mobile menu button */}
                  <motion.button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="lg:hidden p-2 rounded-xl text-gray-200 hover:text-white hover:bg-white/10 transition-colors"
                    whileTap={{ scale: 0.95 }}
                  >
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={isMobileMenuOpen ? 'close' : 'menu'}
                        initial={{ rotate: -90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: 90, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        {isMobileMenuOpen ? (
                          <X className="w-6 h-6" />
                        ) : (
                          <Menu className="w-6 h-6" />
                        )}
                      </motion.div>
                    </AnimatePresence>
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.nav>

          {/* Mobile Navigation Menu */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <>
                {/* Backdrop */}
                <motion.div
                  className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsMobileMenuOpen(false)}
                />

                {/* Notifications */}
                <NotificationBell />

                {/* Mobile Menu */}
                <motion.div
                  className="
                    fixed top-16 left-0 right-0 z-50 lg:hidden
                    bg-gradient-to-b from-slate-900 to-purple-900
                    border-b border-white/10 shadow-2xl
                  "
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                >
                  <div className="px-4 py-6 space-y-2">
                    {user && (
                      <>
                        <div className="mb-4 p-4 bg-white/5 rounded-xl border border-white/10">
                          <p className="text-white font-medium">Welcome, {user.firstName}!</p>
                          <p className="text-gray-300 text-sm capitalize">{user.role}</p>
                        </div>

                        {getMenuItems().map((item) => (
                          <NavLink key={item.path} to={item.path} icon={item.icon}>
                            {item.label}
                          </NavLink>
                        ))}
                        <NavLink to="/profile" icon={User}>
                          Profile
                        </NavLink>
                        <NavLink onClick={handleLogout} icon={LogOut} isButton>
                          Logout
                        </NavLink>
                      </>
                    )}
                    {!user && (
                      <>
                        <NavLink to="/courses" icon={BookOpen}>
                          Browse Courses
                        </NavLink>
                        <NavLink to="/login">
                          Login
                        </NavLink>
                        <div className="pt-2">
                          <Link
                            to="/register"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="
                              w-full flex items-center justify-center px-4 py-3
                              bg-gradient-to-r from-indigo-500 to-purple-600
                              text-white font-medium rounded-xl shadow-lg
                              hover:from-indigo-600 hover:to-purple-700
                              transition-all duration-200
                            "
                          >
                            Get Started
                          </Link>
                        </div>
                      </>
                    )}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </>
      )}
    </>
  );
};

export default Navigation;
