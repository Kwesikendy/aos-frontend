import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SettingsProvider } from './context/SettingsContext';
import './App.css';
import Navigation from './components/Navigation';
import Breadcrumb from './components/Breadcrumb';
import Login from './components/Login';
import Register from './components/Register';
import Profile from './components/Profile';
import Dashboard from './components/Dashboard';
import CourseList from './components/CourseList';
import CourseCreate from './components/CourseCreate';
import CourseEdit from './components/CourseEdit';
import CourseDetail from './components/CourseDetail';
import EnrollmentManagement from './components/EnrollmentManagement';
import ProtectedRoute from './components/ProtectedRoute';
import RoleProtectedRoute from './components/RoleProtectedRoute';
import NotFound from './components/NotFound';
import Unauthorized from './components/Unauthorized';
// Dashboard Components
import StudentDashboard from './components/dashboards/StudentDashboard';
import TeacherDashboard from './components/dashboards/TeacherDashboard';
import AdminDashboard from './components/dashboards/AdminDashboard';
import ParentDashboard from './components/dashboards/ParentDashboard';
import ChildDetail from './components/dashboards/ChildDetail';
import SystemAnalytics from './components/SystemAnalytics';
import Assignments from './components/Assignments';
import UserManagement from './components/admin/UserManagement';
import SystemSettings from './components/admin/SystemSettings';
import Reports from './components/admin/Reports';
import AdminTimetable from './components/admin/AdminTimetable';
import StudentCourses from './components/student/StudentCourses';
import StudentAssignments from './components/student/StudentAssignments';
import TeacherClasses from './components/teacher/TeacherClasses';
import TeacherStudents from './components/teacher/TeacherStudents';
import ClassAttendance from './components/teacher/ClassAttendance';
import ClassCreate from './components/ClassCreate';

// UI Components
import SpectacularHomePage from './components/SpectacularHomePage';
import AboutSchool from './components/AboutSchool';

const AppContent = () => {
  const { user, getMe } = useAuth();
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const isAuthPage = ['/login', '/register'].includes(location.pathname);

  useEffect(() => {
    // Check if user is logged in on app load
    const token = localStorage.getItem('token');
    if (token && !user) {
      getMe();
    }
  }, [user, getMe]);

  return (
    <div className="App">
      {!isHomePage && !isAuthPage && <Navigation />}
      {!isHomePage && !isAuthPage && <Breadcrumb />}
      <Routes>
        {/* Public Routes */}
        <Route path="/about" element={<AboutSchool />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/courses" element={<CourseList />} />
        <Route path="/courses/:id" element={<CourseDetail />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Protected Course Management Routes */}
        <Route
          path="/courses/:id/edit"
          element={
            <RoleProtectedRoute allowedRoles={['admin', 'teacher']}>
              <CourseEdit />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/courses/:courseId/enrollments"
          element={
            <RoleProtectedRoute allowedRoles={['admin', 'teacher']}>
              <EnrollmentManagement />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/create-course"
          element={
            <RoleProtectedRoute allowedRoles={['admin', 'teacher']}>
              <CourseCreate />
            </RoleProtectedRoute>
          }
        />

        {/* Role-Based Dashboard Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student"
          element={
            <RoleProtectedRoute allowedRoles={['student']}>
              <StudentDashboard />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/student/courses"
          element={
            <RoleProtectedRoute allowedRoles={['student']}>
              <StudentCourses />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/teacher"
          element={
            <RoleProtectedRoute allowedRoles={['teacher']}>
              <TeacherDashboard />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <RoleProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/parent"
          element={
            <RoleProtectedRoute allowedRoles={['parent']}>
              <ParentDashboard />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/parent/child/:id"
          element={
            <RoleProtectedRoute allowedRoles={['parent']}>
              <ChildDetail />
            </RoleProtectedRoute>
          }
        />

        {/* Admin-Only Routes */}
        <Route
          path="/admin/users"
          element={
            <RoleProtectedRoute allowedRoles={['admin']}>
              <UserManagement />
            </RoleProtectedRoute>
          }
        />

        <Route
          path="/admin/analytics"
          element={
            <RoleProtectedRoute allowedRoles={['admin']}>
              <SystemAnalytics />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/admin/settings"
          element={
            <RoleProtectedRoute allowedRoles={['admin']}>
              <SystemSettings />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/admin/reports"
          element={
            <RoleProtectedRoute allowedRoles={['admin']}>
              <Reports />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/admin/timetable"
          element={
            <RoleProtectedRoute allowedRoles={['admin']}>
              <AdminTimetable />
            </RoleProtectedRoute>
          }
        />

        {/* Teacher-Only Routes */}

        <Route
          path="/assignments"
          element={
            <RoleProtectedRoute allowedRoles={['student', 'teacher', 'admin']}>
              <Assignments />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/classes"
          element={
            <RoleProtectedRoute allowedRoles={['teacher', 'admin', 'student']}>
              <TeacherClasses />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/students"
          element={
            <RoleProtectedRoute allowedRoles={['teacher', 'admin']}>
              <TeacherStudents />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/teacher/classes/:classId/attendance"
          element={
            <RoleProtectedRoute allowedRoles={['teacher', 'admin']}>
              <ClassAttendance />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/classes/create"
          element={
            <RoleProtectedRoute allowedRoles={['teacher', 'admin']}>
              <ClassCreate />
            </RoleProtectedRoute>
          }
        />

        {/* Parent-Only Routes */}
        <Route
          path="/parent/progress"
          element={
            <RoleProtectedRoute allowedRoles={['parent']}>
              <div style={{ padding: '2rem' }}>
                <h2>📊 Children Progress</h2>
                <p>Detailed progress tracking coming soon...</p>
              </div>
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/parent/messages"
          element={
            <RoleProtectedRoute allowedRoles={['parent']}>
              <div style={{ padding: '2rem' }}>
                <h2>💬 Teacher Messages</h2>
                <p>Messaging system coming soon...</p>
              </div>
            </RoleProtectedRoute>
          }
        />

        {/* Student-Only Routes */}
        <Route
          path="/student/courses"
          element={
            <RoleProtectedRoute allowedRoles={['student']}>
              <div style={{ padding: '2rem' }}>
                <h2>📖 My Courses</h2>
                <p>Enrolled courses overview coming soon...</p>
              </div>
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/student/assignments"
          element={
            <RoleProtectedRoute allowedRoles={['student']}>
              <StudentAssignments />
            </RoleProtectedRoute>
          }
        />

        {/* General Protected Routes */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* Home Route */}
        <Route path="/" element={<SpectacularHomePage />} />

        {/* 404 Catch-All Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

function App() {
  return (
    <Router>
      <SettingsProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </SettingsProvider>
    </Router>
  );
}

export default App;
