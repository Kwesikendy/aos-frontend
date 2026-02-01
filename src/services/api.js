// API service for AcademyOS frontend
import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Prevent loop if already on login
      if (!window.location.pathname.includes('/login')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth API methods
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
  verifyToken: () => api.get('/auth/verify'),
};

// User API methods
export const userAPI = {
  getProfile: (userId) => api.get(`/users/${userId}`),
  updateProfile: (userId, data) => api.put(`/users/${userId}`, data),
  getMyStudents: () => api.get('/users/my-students'),
  linkChild: (studentEmail) => api.post('/users/link-child', { studentEmail }),
};

// Course API methods
export const courseAPI = {
  // Course CRUD operations
  getCourses: (params = {}) => api.get('/courses', { params }),
  getCourse: (courseId) => api.get(`/courses/${courseId}`),
  createCourse: (courseData) => api.post('/courses', courseData),
  updateCourse: (courseId, courseData) => api.put(`/courses/${courseId}`, courseData),
  deleteCourse: (courseId) => api.delete(`/courses/${courseId}`),

  // Course management
  addInstructor: (courseId, instructorId) => api.post(`/courses/${courseId}/instructors`, { instructorId }),
  getCourseStats: (courseId) => api.get(`/courses/${courseId}/stats`),

  // Role-specific course queries
  getMyCourses: () => api.get('/courses/my'), // For teachers/instructors
  getMyEnrollments: () => api.get('/courses/enrollments'), // For students
  getCoursesForManagement: () => api.get('/courses/admin'), // For admins
};

// Enrollment API methods
export const enrollmentAPI = {
  enrollInCourse: (courseId, instructorId) => api.post(`/courses/${courseId}/enroll`, { courseId, instructorId }),
  unenrollFromCourse: (courseId) => api.delete(`/courses/${courseId}/enroll`),
  getEnrollmentStatus: (courseId) => api.get(`/courses/${courseId}/enrollment-status`),
  getMyEnrollments: () => api.get('/enrollments/my'),
};

// Class API methods
export const classAPI = {
  getClasses: (params = {}) => api.get('/classes', { params }),
  getClass: (classId) => api.get(`/classes/${classId}`),
  createClass: (classData) => api.post('/classes', classData),
  updateClass: (classId, classData) => api.put(`/classes/${classId}`, classData),
  deleteClass: (classId) => api.delete(`/classes/${classId}`),
  getMyClasses: () => api.get('/classes/my'),
};

// Dashboard API methods
export const dashboardAPI = {
  getStudentDashboard: () => api.get('/dashboard/student'),
  getTeacherDashboard: () => api.get('/dashboard/teacher'),
  getAdminDashboard: () => api.get('/dashboard/admin'),
  getParentDashboard: () => api.get('/dashboard/parent'),
  getChildDetails: (childId) => api.get(`/dashboard/parent/child/${childId}`),
};

// Analytics API methods
export const analyticsAPI = {
  getSystemAnalytics: (timeframe = 'month') => api.get('/analytics', { params: { timeframe } }),
};

// Notification API methods
export const notificationAPI = {
  getNotifications: () => api.get('/notifications'),
  markRead: (id) => api.put(`/notifications/${id}/read`),
  markAllRead: () => api.put('/notifications/read-all'),
};

// Settings API methods
export const settingsAPI = {
  getSettings: () => api.get('/settings'),
  updateSettings: (data) => api.put('/settings', data),
};

// Reports API methods
export const reportsAPI = {
  getEnrollmentStats: () => api.get('/reports/enrollment'),
  getAttendanceStats: () => api.get('/reports/attendance'),
  getPerformanceStats: () => api.get('/reports/performance'),
};

// Admin API methods
export const adminAPI = {
  getUsers: (params = {}) => api.get('/users', { params }),
  getUser: (id) => api.get(`/users/${id}`),
  updateUser: (id, data) => api.put(`/users/${id}`, data),
  deleteUser: (id) => api.delete(`/users/${id}`),
  changeUserRole: (id, role) => api.patch(`/users/${id}/role`, { role }),
  getUserStats: () => api.get('/users/stats'),
};

// Assignment API methods
export const assignmentAPI = {
  getAssignments: (params = {}) => api.get('/assignments', { params }),
  getAssignment: (id) => api.get(`/assignments/${id}`),
  createAssignment: (data) => api.post('/assignments', data),
  updateAssignment: (id, data) => api.put(`/assignments/${id}`, data),
  deleteAssignment: (id) => api.delete(`/assignments/${id}`),
  submitAssignment: (id, data) => api.post(`/assignments/${id}/submissions`, data),
};

// Enrollments API methods
export const enrollmentsAPI = {
  enroll: (courseId) => api.post('/enrollments', { courseId }),
  getEnrollmentStatus: (courseId) => api.get(`/enrollments/status/${courseId}`),
  getMyEnrollments: () => api.get('/enrollments/my'),
};

// Export the base api instance for other services
export default api;
