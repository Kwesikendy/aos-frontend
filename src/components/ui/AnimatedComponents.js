import React from 'react';
import { motion } from 'framer-motion';
import {
  BookOpen,
  GraduationCap,
  Star,
  Clock,
  Users,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  Info,
  Trophy,
  Target,
  Brain,
  Lightbulb,
  Sparkles,
  Heart,
  Zap
} from 'lucide-react';

// ========================================
// 🎨 Animation Variants
// ========================================

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

const slideIn = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 }
};

const scaleIn = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.9 }
};

const bounceIn = {
  initial: { opacity: 0, scale: 0.3 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 17
    }
  },
  exit: { opacity: 0, scale: 0.3 }
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

// ========================================
// 🚀 Loading Components
// ========================================

export const LoadingSpinner = ({ size = 'md', className = '' }) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  };

  return (
    <motion.div
      className={`inline-block ${sizes[size]} ${className}`}
      animate={{ rotate: 360 }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: "linear"
      }}
    >
      <div className="w-full h-full border-3 border-current border-t-transparent rounded-full" />
    </motion.div>
  );
};

export const PulsingDots = ({ className = '' }) => {
  return (
    <motion.div
      className={`flex items-center space-x-1 ${className}`}
      variants={stagger}
      initial="initial"
      animate="animate"
    >
      {[0, 1, 2].map((index) => (
        <motion.div
          key={index}
          className="w-2 h-2 bg-current rounded-full"
          variants={{
            initial: { opacity: 0.3, scale: 0.8 },
            animate: { opacity: 1, scale: 1 }
          }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            repeatType: "reverse",
            delay: index * 0.2
          }}
        />
      ))}
    </motion.div>
  );
};

// ========================================
// 🎓 Educational Cards
// ========================================

export const CourseCard = ({
  title,
  description,
  level,
  progress,
  instructor,
  subject,
  duration,
  enrolled,
  rating,
  onClick,
  className = ''
}) => {
  const subjectColors = {
    math: 'from-blue-500 to-blue-600',
    science: 'from-green-500 to-green-600',
    language: 'from-orange-500 to-orange-600',
    art: 'from-pink-500 to-pink-600',
    history: 'from-emerald-500 to-teal-600',
    pe: 'from-red-500 to-red-600'
  };

  const levelColors = {
    beginner: 'bg-green-100 text-green-700 border-green-200',
    intermediate: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    advanced: 'bg-red-100 text-red-700 border-red-200'
  };

  return (
    <motion.div
      className={`bg-white rounded-2xl border border-gray-200 overflow-hidden cursor-pointer group ${className}`}
      variants={fadeInUp}
      whileHover={{
        y: -8,
        boxShadow: "0 20px 40px rgba(0,0,0,0.1)"
      }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {/* Header with gradient */}
      <div className={`h-32 bg-gradient-to-r ${subjectColors[subject] || 'from-emerald-500 to-teal-600'} relative overflow-hidden`}>
        <motion.div
          className="absolute inset-0 bg-white/10"
          whileHover={{ scale: 1.1, rotate: 2 }}
          transition={{ duration: 0.3 }}
        />
        <div className="absolute top-4 left-4">
          <motion.div
            className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm"
            whileHover={{ scale: 1.1 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <BookOpen className="w-6 h-6 text-white" />
          </motion.div>
        </div>
        <div className="absolute top-4 right-4">
          {level && (
            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${levelColors[level]}`}>
              {level.charAt(0).toUpperCase() + level.slice(1)}
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-bold text-xl text-gray-900 group-hover:text-emerald-600 transition-colors line-clamp-2">
            {title}
          </h3>
          {rating && (
            <div className="flex items-center text-yellow-500 ml-2">
              <Star className="w-4 h-4 fill-current" />
              <span className="text-sm font-semibold ml-1">{rating}</span>
            </div>
          )}
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{description}</p>

        {/* Progress Bar */}
        {progress !== undefined && (
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-medium text-gray-700">Progress</span>
              <span className="text-xs font-medium text-emerald-600">{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
            </div>
          </div>
        )}

        {/* Footer Info */}
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-3">
            {instructor && (
              <div className="flex items-center">
                <GraduationCap className="w-4 h-4 mr-1" />
                <span>{instructor}</span>
              </div>
            )}
            {duration && (
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                <span>{duration}</span>
              </div>
            )}
          </div>
          {enrolled && (
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-1" />
              <span>{enrolled} students</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// ========================================
// 📊 Statistics Cards
// ========================================

export const StatCard = ({
  title,
  value,
  icon: Icon,
  trend,
  trendValue,
  color = 'blue',
  className = ''
}) => {
  const colors = {
    blue: 'from-emerald-500 to-teal-600',
    green: 'from-green-500 to-emerald-600',
    purple: 'from-teal-500 to-emerald-600',
    orange: 'from-orange-500 to-amber-600',
    red: 'from-red-500 to-rose-600',
    pink: 'from-pink-500 to-rose-600'
  };

  return (
    <motion.div
      className={`bg-white rounded-xl p-6 border border-gray-200 relative overflow-hidden ${className}`}
      variants={scaleIn}
      whileHover={{ y: -4, boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      {/* Background decoration */}
      <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${colors[color]} opacity-10 rounded-full -mr-8 -mt-8`} />

      {/* Icon */}
      <div className={`w-12 h-12 bg-gradient-to-br ${colors[color]} rounded-lg flex items-center justify-center mb-4 relative z-10`}>
        <Icon className="w-6 h-6 text-white" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
        <motion.p
          className="text-3xl font-bold text-gray-900 mb-2"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
        >
          {value}
        </motion.p>

        {trend && (
          <div className={`flex items-center text-sm ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
            <TrendingUp className={`w-4 h-4 mr-1 ${trend === 'down' ? 'rotate-180' : ''}`} />
            <span>{trendValue}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// ========================================
// 🎯 Achievement Badge
// ========================================

export const AchievementBadge = ({
  title,
  description,
  icon: Icon,
  rarity = 'common',
  earned = false,
  progress,
  className = ''
}) => {
  const rarities = {
    common: 'from-gray-400 to-gray-600',
    uncommon: 'from-green-400 to-green-600',
    rare: 'from-blue-400 to-blue-600',
    epic: 'from-purple-400 to-purple-600',
    legendary: 'from-yellow-400 to-orange-500'
  };

  return (
    <motion.div
      className={`relative p-4 rounded-xl border-2 cursor-pointer ${earned ? 'border-transparent bg-white shadow-lg' : 'border-gray-200 bg-gray-50'} ${className}`}
      variants={bounceIn}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Glow effect for earned badges */}
      {earned && (
        <motion.div
          className={`absolute inset-0 bg-gradient-to-r ${rarities[rarity]} opacity-20 rounded-xl blur-sm`}
          animate={{
            opacity: [0.2, 0.4, 0.2],
            scale: [1, 1.05, 1]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      )}

      {/* Badge icon */}
      <div className={`w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center ${earned ? `bg-gradient-to-r ${rarities[rarity]}` : 'bg-gray-300'}`}>
        <Icon className={`w-8 h-8 ${earned ? 'text-white' : 'text-gray-500'}`} />

        {/* Sparkles for earned badges */}
        {earned && (
          <>
            <motion.div
              className="absolute w-2 h-2 bg-yellow-300 rounded-full"
              style={{ top: '10%', right: '15%' }}
              animate={{
                scale: [0, 1, 0],
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: 0
              }}
            />
            <motion.div
              className="absolute w-1.5 h-1.5 bg-yellow-400 rounded-full"
              style={{ top: '25%', left: '10%' }}
              animate={{
                scale: [0, 1, 0],
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: 0.5
              }}
            />
          </>
        )}
      </div>

      {/* Content */}
      <div className="text-center">
        <h4 className={`font-semibold mb-1 ${earned ? 'text-gray-900' : 'text-gray-500'}`}>
          {title}
        </h4>
        <p className={`text-xs ${earned ? 'text-gray-600' : 'text-gray-400'}`}>
          {description}
        </p>

        {/* Progress bar for unearned badges */}
        {!earned && progress !== undefined && (
          <div className="mt-3">
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
            <span className="text-xs text-gray-500 mt-1">{progress}%</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// ========================================
// 🔔 Notification Toast
// ========================================

export const Toast = ({
  type = 'info',
  title,
  message,
  onClose,
  duration = 4000,
  className = ''
}) => {
  const types = {
    success: {
      icon: CheckCircle2,
      colors: 'bg-green-50 border-green-200 text-green-800',
      iconColor: 'text-green-500'
    },
    error: {
      icon: AlertCircle,
      colors: 'bg-red-50 border-red-200 text-red-800',
      iconColor: 'text-red-500'
    },
    warning: {
      icon: AlertCircle,
      colors: 'bg-yellow-50 border-yellow-200 text-yellow-800',
      iconColor: 'text-yellow-500'
    },
    info: {
      icon: Info,
      colors: 'bg-blue-50 border-blue-200 text-blue-800',
      iconColor: 'text-blue-500'
    }
  };

  const { icon: Icon, colors, iconColor } = types[type];

  React.useEffect(() => {
    if (duration && onClose) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  return (
    <motion.div
      className={`flex items-start p-4 border rounded-lg shadow-lg max-w-md ${colors} ${className}`}
      initial={{ opacity: 0, x: 300, scale: 0.8 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 300, scale: 0.8 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <Icon className={`w-5 h-5 mr-3 mt-0.5 flex-shrink-0 ${iconColor}`} />
      <div className="flex-1 min-w-0">
        {title && (
          <p className="font-semibold text-sm mb-1">{title}</p>
        )}
        <p className="text-sm opacity-90">{message}</p>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="ml-3 flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      )}
    </motion.div>
  );
};

// ========================================
// 🎨 Animated Button
// ========================================

export const AnimatedButton = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon: Icon,
  onClick,
  className = '',
  ...props
}) => {
  const variants = {
    primary: 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl',
    secondary: 'bg-white hover:bg-gray-50 text-gray-700 border-2 border-gray-200 hover:border-gray-300',
    success: 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl',
    danger: 'bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white shadow-lg hover:shadow-xl'
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  return (
    <motion.button
      className={`
        relative inline-flex items-center justify-center font-semibold rounded-xl
        transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
        focus:outline-none focus:ring-4 focus:ring-indigo-500/20
        ${variants[variant]} ${sizes[size]} ${className}
      `}
      variants={{
        initial: { scale: 1 },
        hover: { scale: 1.05 },
        tap: { scale: 0.95 }
      }}
      initial="initial"
      whileHover={!disabled && !loading ? "hover" : "initial"}
      whileTap={!disabled && !loading ? "tap" : "initial"}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center bg-current/10 rounded-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <LoadingSpinner size="sm" />
        </motion.div>
      )}

      <span className={`flex items-center space-x-2 ${loading ? 'opacity-0' : 'opacity-100'}`}>
        {Icon && <Icon className="w-5 h-5" />}
        <span>{children}</span>
      </span>
    </motion.button>
  );
};

// ========================================
// 📈 Progress Bar
// ========================================

export const AnimatedProgressBar = ({
  progress = 0,
  color = 'blue',
  size = 'md',
  showPercentage = true,
  label,
  className = ''
}) => {
  const colors = {
    blue: 'from-emerald-500 to-teal-600',
    green: 'from-green-500 to-emerald-600',
    purple: 'from-teal-500 to-emerald-600',
    orange: 'from-orange-500 to-amber-600'
  };

  const sizes = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4'
  };

  return (
    <div className={className}>
      {(label || showPercentage) && (
        <div className="flex justify-between items-center mb-2">
          {label && <span className="text-sm font-medium text-gray-700">{label}</span>}
          {showPercentage && (
            <span className="text-sm font-semibold text-gray-600">{progress}%</span>
          )}
        </div>
      )}

      <div className={`w-full bg-gray-200 rounded-full overflow-hidden ${sizes[size]}`}>
        <motion.div
          className={`${sizes[size]} bg-gradient-to-r ${colors[color]} rounded-full relative overflow-hidden`}
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(progress, 100)}%` }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          {/* Shimmer effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            animate={{ x: ['-100%', '200%'] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
        </motion.div>
      </div>
    </div>
  );
};

// ========================================
// 🎭 Floating Action Button
// ========================================

export const FloatingActionButton = ({
  icon: Icon,
  onClick,
  color = 'blue',
  className = ''
}) => {
  const colors = {
    blue: 'from-emerald-500 to-teal-600',
    green: 'from-green-500 to-emerald-600',
    purple: 'from-teal-500 to-emerald-600',
    orange: 'from-orange-500 to-amber-600'
  };

  return (
    <motion.button
      className={`fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r ${colors[color]} text-white rounded-full shadow-lg hover:shadow-xl flex items-center justify-center z-50 ${className}`}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20
      }}
    >
      <Icon className="w-6 h-6" />
    </motion.button>
  );
};

export default {
  LoadingSpinner,
  PulsingDots,
  CourseCard,
  StatCard,
  AchievementBadge,
  Toast,
  AnimatedButton,
  AnimatedProgressBar,
  FloatingActionButton
};
