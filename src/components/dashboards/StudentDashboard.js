import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import {
  BookOpen,
  Target,
  CheckCircle,
  BarChart3,
  User,
  Search,
  FileText,
  Calendar,
  Award,
  Play,
  Clock,
  ChevronRight
} from 'lucide-react';
import {
  LoadingSpinner,
  StatCard,
  CourseCard,
  AnimatedProgressBar
} from '../ui/AnimatedComponents';
import { dashboardAPI } from '../../services/api';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [upcomingClasses, setUpcomingClasses] = useState([]);
  const [stats, setStats] = useState({
    totalCourses: 0,
    completedCourses: 0,
    inProgressCourses: 0,
    attendanceRate: 0,
    averageGrade: 0
  });
  const [loading, setLoading] = useState(true);
  const [error] = useState('');

  useEffect(() => {
    fetchStudentData();
  }, []);


  const fetchStudentData = async () => {
    try {
      setLoading(true);
      const response = await dashboardAPI.getStudentDashboard();
      const { stats, enrolledCourses, upcomingClasses } = response.data.data;

      // Transform Backend Data to Frontend Model
      const formattedCourses = enrolledCourses.map(e => ({
        ...e.course,
        _id: e.course._id,
        instructor: e.course.instructors?.[0] ? `${e.course.instructors[0].firstName} ${e.course.instructors[0].lastName}` : 'TBA',
        progress: e.progress || 0,
        grade: e.grade,
        status: e.status
      }));

      setEnrolledCourses(formattedCourses);
      setUpcomingClasses(upcomingClasses || []);

      setStats({
        totalCourses: stats.totalCourses || 0,
        completedCourses: stats.completedCourses || 0,
        inProgressCourses: (stats.totalCourses || 0) - (stats.completedCourses || 0),
        attendanceRate: stats.attendanceRate || 0,
        pendingAssignmentsCount: stats.pendingAssignmentsCount || 0,
        averageGrade: parseFloat(stats.averageGrade) || 0
      });



    } catch (err) {
      console.error('Error fetching student data:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <LoadingSpinner size="xl" className="text-emerald-600 mb-4" />
        <p className="text-gray-500 font-medium">Loading your dashboard...</p>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <motion.div
      className="min-h-screen bg-gray-50 pb-20"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Welcome Section */}
        <motion.div
          className="py-8"
          variants={itemVariants}
        >
          <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 text-white shadow-xl relative overflow-hidden">
            {/* Decorative Circles */}
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white/10 rounded-full blur-3xl opacity-50"></div>
            <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-teal-500/30 rounded-full blur-2xl"></div>

            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-sm font-medium mb-4 border border-white/10"
                >
                  <Award className="w-4 h-4 text-yellow-300" />
                  <span>Student Portal</span>
                </motion.div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 tracking-tight">
                  Hello, {user.firstName}! 👋
                </h1>
                <p className="text-emerald-50 text-base sm:text-lg max-w-2xl leading-relaxed">
                  Welcome to your dashboard. You have <span className="font-bold text-white">{stats.pendingAssignmentsCount} assignments</span> due soon and <span className="font-bold text-white">{upcomingClasses[0]?.course?.title || 'No upcoming classes'}</span> is your next class.
                </p>
              </div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-emerald-600 px-6 py-3 rounded-xl font-bold shadow-lg flex items-center gap-2 hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => window.location.href = '/assignments'}
              >
                <FileText className="w-5 h-5" />
                View Homework
              </motion.div>
            </div>
          </div>
        </motion.div>

        {error && (
          <motion.div
            className="mb-8 p-4 bg-red-50 text-red-600 rounded-xl border border-red-200 flex items-center gap-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            {error}
          </motion.div>
        )}

        {/* Stats Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
          variants={itemVariants}
        >
          <StatCard
            title="My Subjects"
            value={stats.totalCourses}
            icon={BookOpen}
            color="emerald"
            trend="neutral"
            trendValue="Core & Electives"
          />
          <StatCard
            title="Enrolled"
            value={stats.inProgressCourses}
            icon={Calendar}
            color="orange"
            trend="neutral"
            trendValue="Active Courses"
          />
          <StatCard
            title="Avg. Grade"
            value={`${stats.averageGrade || 0}%`}
            icon={Award}
            color="blue"
            trend="neutral"
            trendValue="Overall"
          />
          <StatCard
            title="Attendance"
            value={`${stats.attendanceRate}%`}
            icon={BarChart3}
            color="purple"
            trend={stats.attendanceRate >= 90 ? 'up' : stats.attendanceRate >= 75 ? 'neutral' : 'down'}
            trendValue={stats.attendanceRate >= 90 ? 'Excellent' : stats.attendanceRate >= 75 ? 'Good' : 'Needs Improvement'}
          />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Main Content Area (2/3 width) */}
          <div className="lg:col-span-2 space-y-10">

            {/* My Courses Section */}
            <motion.section variants={itemVariants}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                  <BookOpen className="w-6 h-6 text-emerald-600" />
                  My Subjects
                </h2>
                <Link to="/courses" className="text-sm font-medium text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors">
                  View All <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {enrolledCourses.length > 0 ? (
                  enrolledCourses.map((course, index) => (
                    <CourseCard
                      key={course._id}
                      title={course.title}
                      description={course.description}
                      level={course.level}
                      progress={course.progress}
                      instructor={course.instructor}
                      duration={course.duration}
                      subject={course.category ? course.category.toLowerCase() : 'science'}
                      rating={null} // Hide stars
                      onClick={() => window.location.href = `/courses/${course._id}`}
                    />
                  ))
                ) : (
                  <div className="col-span-full bg-white rounded-2xl p-8 border border-dashed border-gray-300 text-center">
                    <p className="text-gray-500 mb-4">You're not enrolled in any courses yet.</p>
                    <Link to="/courses" className="text-indigo-600 font-semibold hover:underline">
                      Browse Catalog
                    </Link>
                  </div>
                )}
              </div>
            </motion.section>

            {/* Quick Actions */}
            <motion.section variants={itemVariants}>
              <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {[
                  { title: "Browse Courses", desc: "Discover new skills", icon: Search, color: "blue", link: "/courses" },
                  { title: "My Profile", desc: "Manage account", icon: User, color: "green", link: "/profile" },
                  { title: "Assignments", desc: "Check pending tasks", icon: FileText, color: "purple", link: "/assignments" }
                ].map((action, idx) => (
                  <Link
                    key={idx}
                    to={action.link}
                    className="group bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center"
                  >
                    <div className={`w - 14 h - 14 rounded - 2xl flex items - center justify - center mb - 4 bg - ${action.color} -50 group - hover: bg - ${action.color} -100 transition - colors`}>
                      <action.icon className={`w - 7 h - 7 text - ${action.color} -600`} />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-1">{action.title}</h3>
                    <p className="text-sm text-gray-500">{action.desc}</p>
                  </Link>
                ))}
              </div>
            </motion.section>

          </div>

          {/* Sidebar Area (1/3 width) */}
          <div className="space-y-8">

            {/* Upcoming Classes */}
            <motion.section
              variants={itemVariants}
              className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-lg text-gray-900">Class Timetable</h3>
                <Link to="/classes" className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors">
                  <Calendar className="w-5 h-5" />
                </Link>
              </div>

              <div className="space-y-4">
                {upcomingClasses.length > 0 ? (
                  upcomingClasses.map((item, idx) => (
                    <div key={idx} className="group flex items-start gap-4 p-4 rounded-2xl bg-gray-50 border border-transparent hover:bg-white hover:border-indigo-100 hover:shadow-md transition-all duration-200 cursor-pointer">
                      <div className="flex-shrink-0 flex flex-col items-center bg-white rounded-xl p-2 min-w-[3.5rem] shadow-sm group-hover:bg-indigo-50 transition-colors">
                        <span className="text-xs font-bold text-gray-900 uppercase">{item.date.toLocaleDateString('en-US', { month: 'short' })}</span>
                        <span className="text-xl font-bold text-indigo-600">{item.date.getDate()}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <h4 className="font-semibold text-gray-900 truncate pr-2">{item.className}</h4>
                          <span className="text-xs font-medium px-2 py-0.5 rounded bg-green-100 text-green-700">{item.type}</span>
                        </div>
                        <p className="text-xs text-gray-500 truncate mb-2">{item.courseTitle}</p>
                        <div className="flex items-center gap-3 text-xs text-gray-400">
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {item.time}</span>
                          <span className="flex items-center gap-1"><User className="w-3 h-3" /> {item.instructor}</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 py-8">No upcoming classes.</p>
                )}
              </div>
            </motion.section>

            {/* School Notice Widget (Green Theme) */}
            <motion.section
              variants={itemVariants}
              className="bg-gradient-to-br from-emerald-900 to-teal-900 rounded-3xl p-6 text-white text-center relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Award className="w-32 h-32" />
              </div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 border border-white/20 shadow-inner">
                  <FileText className="w-8 h-8 text-yellow-300" />
                </div>
                <h3 className="font-bold text-lg mb-1">Term Reports</h3>
                <p className="text-emerald-100 text-sm mb-4">Mid-term reports are now available for download.</p>

                <button className="w-full py-2.5 bg-white text-emerald-900 rounded-xl font-bold text-sm hover:bg-gray-100 transition-colors shadow-lg">
                  View Report Card
                </button>
              </div>
            </motion.section>

          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default StudentDashboard;
