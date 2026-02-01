import React from 'react';
import { useAuth } from '../context/AuthContext';
import StudentDashboard from './dashboards/StudentDashboard';
import TeacherDashboard from './dashboards/TeacherDashboard';
import AdminDashboard from './dashboards/AdminDashboard';
import ParentDashboard from './dashboards/ParentDashboard';

const Dashboard = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="dashboard-container">
        <div className="loading">Loading dashboard...</div>
      </div>
    );
  }

  // Route to role-specific dashboard components
  switch (user.role) {
    case 'student':
      return <StudentDashboard />;
    case 'teacher':
      return <TeacherDashboard />;
    case 'admin':
      return <AdminDashboard />;
    case 'parent':
      return <ParentDashboard />;
    default:
      return (
        <div className="dashboard-container">
          <h2>Welcome, {user.firstName}!</h2>
          <div className="dashboard-content">
            <div className="error-message">
              <p>Unknown user role: {user.role}</p>
              <p>Please contact the administrator to resolve this issue.</p>
            </div>
          </div>
        </div>
      );
  }
};

export default Dashboard;
