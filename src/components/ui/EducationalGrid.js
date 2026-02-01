import React from 'react';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Users,
  Clock,
  Star,
  Award,
  Target,
  TrendingUp,
  Calendar,
  FileText,
  Video,
  Download,
  ExternalLink
} from 'lucide-react';

// ========================================
// 📐 Responsive Grid System
// ========================================

// Main grid container
export const EducationalGrid = ({
  children,
  columns = { sm: 1, md: 2, lg: 3, xl: 4 },
  gap = 6,
  className = '',
  ...props
}) => {
  const gridClasses = `
    grid gap-${gap}
    grid-cols-${columns.sm}
    md:grid-cols-${columns.md}
    lg:grid-cols-${columns.lg}
    xl:grid-cols-${columns.xl}
    ${className}
  `;

  return (
    <motion.div
      className={gridClasses}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Course grid item
export const CourseGridItem = ({
  course,
  index = 0,
  onClick,
  showProgress = true,
  showEnrollment = true,
  variant = 'default' // 'default', 'compact', 'detailed'
}) => {
  const subjectColors = {
    math: 'from-blue-500 to-blue-600',
    science: 'from-green-500 to-green-600',
    language: 'from-orange-500 to-orange-600',
    art: 'from-pink-500 to-pink-600',
    history: 'from-purple-500 to-purple-600',
    technology: 'from-indigo-500 to-indigo-600',
    default: 'from-gray-500 to-gray-600'
  };

  const levelColors = {
    beginner: 'bg-green-100 text-green-700 border-green-200',
    intermediate: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    advanced: 'bg-red-100 text-red-700 border-red-200',
    expert: 'bg-purple-100 text-purple-700 border-purple-200'
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, delay: index * 0.1 }
    }
  };

  if (variant === 'compact') {
    return (
      <motion.div
        variants={itemVariants}
        className="bg-white rounded-xl border border-gray-200 p-4 cursor-pointer hover:shadow-lg transition-all duration-300"
        whileHover={{ y: -4 }}
        onClick={onClick}
      >
        <div className="flex items-center space-x-3">
          <div className={`w-12 h-12 bg-gradient-to-r ${subjectColors[course.subject] || subjectColors.default} rounded-lg flex items-center justify-center`}>
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 line-clamp-1">{course.title}</h3>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Clock className="w-4 h-4" />
              <span>{course.duration}</span>
              {course.rating && (
                <>
                  <Star className="w-4 h-4 text-yellow-500 fill-current ml-2" />
                  <span>{course.rating}</span>
                </>
              )}
            </div>
          </div>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${levelColors[course.level]}`}>
            {course.level}
          </span>
        </div>
      </motion.div>
    );
  }

  if (variant === 'detailed') {
    return (
      <motion.div
        variants={itemVariants}
        className="bg-white rounded-2xl border border-gray-200 overflow-hidden cursor-pointer group hover:shadow-2xl transition-all duration-500"
        whileHover={{ y: -8 }}
        onClick={onClick}
      >
        {/* Header Image */}
        <div className={`h-48 bg-gradient-to-r ${subjectColors[course.subject] || subjectColors.default} relative overflow-hidden`}>
          <motion.div
            className="absolute inset-0 bg-black/20"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.5 }}
          />
          <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${levelColors[course.level]} bg-white`}>
              {course.level}
            </span>
            {course.rating && (
              <div className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center space-x-1">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span className="text-sm font-medium">{course.rating}</span>
              </div>
            )}
          </div>
          <div className="absolute bottom-4 left-4">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-4">
            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
              {course.title}
            </h3>
            <p className="text-gray-600 text-sm line-clamp-2">{course.description}</p>
          </div>

          {/* Course Details */}
          <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
            <div className="flex items-center space-x-2 text-gray-500">
              <Users className="w-4 h-4" />
              <span>{course.enrolled || 0} students</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-500">
              <Clock className="w-4 h-4" />
              <span>{course.duration}</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-500">
              <Award className="w-4 h-4" />
              <span>{course.instructor}</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-500">
              <Calendar className="w-4 h-4" />
              <span>{course.startDate || 'Flexible'}</span>
            </div>
          </div>

          {/* Progress Bar */}
          {showProgress && course.progress !== undefined && (
            <div className="mb-4">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-medium text-gray-700">Progress</span>
                <span className="text-xs font-medium text-indigo-600">{course.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  className="h-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${course.progress}%` }}
                  transition={{ duration: 1, delay: index * 0.1 }}
                />
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between">
            <div className="text-lg font-bold text-gray-900">
              {course.price === 0 ? 'Free' : `₵${course.price}`}
            </div>
            <motion.button
              className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:from-indigo-600 hover:to-purple-700 transition-all duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {course.enrolled ? 'Continue' : 'Enroll Now'}
            </motion.button>
          </div>
        </div>
      </motion.div>
    );
  }

  // Default variant
  return (
    <motion.div
      variants={itemVariants}
      className="bg-white rounded-xl border border-gray-200 p-6 cursor-pointer hover:shadow-lg transition-all duration-300"
      whileHover={{ y: -4 }}
      onClick={onClick}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 bg-gradient-to-r ${subjectColors[course.subject] || subjectColors.default} rounded-lg flex items-center justify-center`}>
          <BookOpen className="w-6 h-6 text-white" />
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${levelColors[course.level]}`}>
          {course.level}
        </span>
      </div>

      {/* Content */}
      <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{course.title}</h3>
      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{course.description}</p>

      {/* Meta Info */}
      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
        <div className="flex items-center space-x-1">
          <Clock className="w-4 h-4" />
          <span>{course.duration}</span>
        </div>
        {course.rating && (
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 text-yellow-500 fill-current" />
            <span>{course.rating}</span>
          </div>
        )}
      </div>

      {/* Progress */}
      {showProgress && course.progress !== undefined && (
        <div className="mb-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="h-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${course.progress}%` }}
              transition={{ duration: 1, delay: index * 0.1 }}
            />
          </div>
          <span className="text-xs text-gray-500 mt-1">{course.progress}% Complete</span>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-500">{course.instructor}</span>
        <span className="font-semibold text-indigo-600">
          {course.price === 0 ? 'Free' : `₵${course.price}`}
        </span>
      </div>
    </motion.div>
  );
};

// Assignment grid item
export const AssignmentGridItem = ({ assignment, index = 0, onClick }) => {
  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    submitted: 'bg-blue-100 text-blue-700 border-blue-200',
    graded: 'bg-green-100 text-green-700 border-green-200',
    overdue: 'bg-red-100 text-red-700 border-red-200'
  };

  const priorityColors = {
    low: 'text-green-500',
    medium: 'text-yellow-500',
    high: 'text-red-500'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-white rounded-xl border border-gray-200 p-6 cursor-pointer hover:shadow-lg transition-all duration-300"
      whileHover={{ y: -2 }}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{assignment.title}</h3>
            <p className="text-sm text-gray-500">{assignment.course}</p>
          </div>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${statusColors[assignment.status]}`}>
          {assignment.status}
        </span>
      </div>

      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{assignment.description}</p>

      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span className="text-gray-500">Due: {assignment.dueDate}</span>
          </div>
          <div className={`flex items-center space-x-1 ${priorityColors[assignment.priority]}`}>
            <Target className="w-4 h-4" />
            <span className="capitalize">{assignment.priority}</span>
          </div>
        </div>
        {assignment.grade && (
          <div className="font-semibold text-green-600">
            {assignment.grade}%
          </div>
        )}
      </div>
    </motion.div>
  );
};

// Resource grid item
export const ResourceGridItem = ({ resource, index = 0, onClick }) => {
  const typeIcons = {
    video: Video,
    document: FileText,
    download: Download,
    link: ExternalLink
  };

  const typeColors = {
    video: 'from-red-500 to-red-600',
    document: 'from-blue-500 to-blue-600',
    download: 'from-green-500 to-green-600',
    link: 'from-purple-500 to-purple-600'
  };

  const Icon = typeIcons[resource.type] || FileText;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="bg-white rounded-xl border border-gray-200 p-4 cursor-pointer hover:shadow-lg transition-all duration-300 group"
      whileHover={{ y: -2, scale: 1.02 }}
      onClick={onClick}
    >
      <div className="flex items-center space-x-3">
        <div className={`w-12 h-12 bg-gradient-to-r ${typeColors[resource.type]} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-gray-900 group-hover:text-indigo-600 transition-colors">
            {resource.title}
          </h3>
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <span className="capitalize">{resource.type}</span>
            {resource.size && <span>{resource.size}</span>}
            {resource.duration && <span>{resource.duration}</span>}
          </div>
        </div>
        <motion.div
          className="text-gray-400 group-hover:text-indigo-500"
          whileHover={{ x: 5 }}
        >
          <ExternalLink className="w-4 h-4" />
        </motion.div>
      </div>
    </motion.div>
  );
};

// Statistics grid item
export const StatsGridItem = ({ stat, index = 0 }) => {
  const colors = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
    orange: 'from-orange-500 to-orange-600',
    red: 'from-red-500 to-red-600'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-white rounded-xl border border-gray-200 p-6 relative overflow-hidden hover:shadow-lg transition-all duration-300"
      whileHover={{ y: -2 }}
    >
      {/* Background decoration */}
      <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${colors[stat.color]} opacity-10 rounded-full -mr-8 -mt-8`} />

      {/* Icon */}
      <div className={`w-12 h-12 bg-gradient-to-br ${colors[stat.color]} rounded-lg flex items-center justify-center mb-4 relative z-10`}>
        <stat.icon className="w-6 h-6 text-white" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <motion.p
          className="text-3xl font-bold text-gray-900 mb-1"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 + (index * 0.1), type: "spring", stiffness: 300 }}
        >
          {stat.value}
        </motion.p>
        <p className="text-sm font-medium text-gray-600 mb-2">{stat.label}</p>

        {stat.trend && (
          <div className={`flex items-center text-sm ${stat.trend.type === 'up' ? 'text-green-600' : 'text-red-600'}`}>
            <TrendingUp className={`w-4 h-4 mr-1 ${stat.trend.type === 'down' ? 'rotate-180' : ''}`} />
            <span>{stat.trend.value}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// Empty state component
export const EmptyState = ({
  icon: Icon = BookOpen,
  title = "No items found",
  description = "Try adjusting your filters or search terms",
  actionLabel,
  onAction,
  className = ""
}) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    className={`text-center py-12 px-6 ${className}`}
  >
    <motion.div
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6"
    >
      <Icon className="w-12 h-12 text-gray-400" />
    </motion.div>
    <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-600 mb-6 max-w-md mx-auto">{description}</p>
    {actionLabel && onAction && (
      <motion.button
        className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:from-indigo-600 hover:to-purple-700 transition-all duration-200"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onAction}
      >
        {actionLabel}
      </motion.button>
    )}
  </motion.div>
);

export default {
  EducationalGrid,
  CourseGridItem,
  AssignmentGridItem,
  ResourceGridItem,
  StatsGridItem,
  EmptyState
};
