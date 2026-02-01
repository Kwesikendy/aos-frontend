import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import {
  BookOpen,
  Users,
  FileEdit,
  Calendar,
  PlusCircle,
  BarChart2,
  Clock,
  ChevronRight,
  GraduationCap
} from 'lucide-react';
import {
  LoadingSpinner,
  StatCard,
} from '../ui/AnimatedComponents';
import { dashboardAPI } from '../../services/api';

const TeacherDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalStudents: 0,
    pendingGrading: 0,
    upcomingClasses: 0
  });
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await dashboardAPI.getTeacherDashboard();
      const { stats, recentActivity } = response.data.data;

      setStats(stats);
      if (recentActivity) {
        // You might want to format recentActivity to match the UI expectations if needed
        // The current UI map looks for { studentName, courseName, time }
        // The API returns this format.
        // State for recent activity needs to be added or `setStats` extended?
        // Looking at the component, there is a hardcoded map on lines 164-177.
        // We should create a state for `activities` and use it.
      }
      setActivities(recentActivity || []);
    } catch (error) {
      console.error("Failed to fetch teacher dashboard", error);
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <LoadingSpinner size="xl" className="text-emerald-600 mb-4" />
        <p className="text-gray-500 font-medium">Loading teacher portal...</p>
      </div>
    );
  }

  return (
    <motion.div
      className="min-h-screen bg-gray-50 pb-20"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Welcome Section */}
        <motion.div className="py-8" variants={itemVariants}>
          <div className="bg-gradient-to-r from-emerald-700 to-teal-800 rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white/10 rounded-full blur-3xl opacity-50"></div>

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 bg-emerald-900/40 backdrop-blur-md px-4 py-1.5 rounded-full text-sm font-medium mb-4 border border-emerald-500/30">
                <GraduationCap className="w-4 h-4 text-emerald-200" />
                <span>Instructor Portal</span>
              </div>
              <h1 className="text-4xl font-bold mb-4">
                Welcome, {user.firstName}! 👨‍🏫
              </h1>
              <p className="text-emerald-100 text-lg max-w-2xl">
                You have <span className="font-bold text-white">{stats.pendingGrading} assignments</span> waiting for review and <span className="font-bold text-white">{stats.upcomingClasses} classes</span> upcoming.
              </p>

              <div className="flex flex-wrap gap-4 mt-8">
                {/* <Link to="/assignments/create" className="bg-white text-emerald-800 px-6 py-3 rounded-xl font-bold shadow-lg flex items-center gap-2 hover:bg-gray-50 transition-colors">
                  <PlusCircle className="w-5 h-5" />
                  Create Assignment
                </Link> */}
                <Link to="/attendance/record" className="bg-emerald-800/50 text-white border border-emerald-500/50 px-6 py-3 rounded-xl font-bold hover:bg-emerald-800/70 transition-colors flex items-center gap-2">
                  <FileEdit className="w-5 h-5" />
                  Record Attendance
                </Link>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
          variants={itemVariants}
        >
          <StatCard
            title="Active Courses"
            value={stats.totalCourses}
            icon={BookOpen}
            color="green"
            trend="up"
            trendValue="View All"
          />
          <StatCard
            title="Total Students"
            value={stats.totalStudents}
            icon={Users}
            color="blue"
            trend="up"
            trendValue="+12 this week"
          />
          <StatCard
            title="Pending Review"
            value={stats.pendingGrading}
            icon={FileEdit}
            color="orange"
            trend="down"
            trendValue="Needs Attention"
          />
          <StatCard
            title="Upcoming Classes"
            value={stats.upcomingClasses}
            icon={Calendar}
            color="purple"
            trend="neutral"
            trendValue="Next: Today 2PM"
          />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">

            {/* Recent Activity */}
            <motion.section variants={itemVariants} className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-emerald-600" />
                  Recent Activity
                </h2>
              </div>

              <div className="space-y-6">
                {activities.length > 0 ? (
                  activities.map((activity, i) => (
                    <div key={i} className="flex gap-4 items-start pb-6 border-b border-gray-100 last:border-0 last:pb-0">
                      <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                        <Users className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div>
                        {activity.type === 'enrollment' ? (
                          <>
                            <p className="text-gray-900 font-medium">New student enrollment</p>
                            <p className="text-sm text-gray-500 mt-1">
                              {activity.studentName} enrolled in <span className="text-emerald-600 font-medium">{activity.courseName}</span>
                            </p>
                          </>
                        ) : (
                          <p className="text-gray-900 font-medium">{activity.description || 'New activity'}</p>
                        )}
                        <p className="text-xs text-gray-400 mt-2">{new Date(activity.time).toLocaleString()}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">No recent activity.</p>
                )}
              </div>
            </motion.section>

          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <motion.section variants={itemVariants} className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-4">Quick Links</h3>
              <div className="space-y-2">
                {[
                  { label: 'Gradebook', icon: BarChart2 },
                  { label: 'Student Directory', icon: Users },
                  { label: 'Course Resources', icon: BookOpen },
                  { label: 'System Settings', icon: FileEdit }
                ].map((link, i) => (
                  <button key={i} className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 text-gray-600 hover:text-emerald-700 transition-colors group">
                    <div className="flex items-center gap-3">
                      <link.icon className="w-5 h-5 text-gray-400 group-hover:text-emerald-500" />
                      <span className="font-medium">{link.label}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-emerald-500" />
                  </button>
                ))}
              </div>
            </motion.section>
          </div>

        </div>
      </div>
    </motion.div>
  );
};

export default TeacherDashboard;
