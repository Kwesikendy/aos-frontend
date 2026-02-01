import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  GraduationCap,
  BookOpen,
  Users,
  Trophy,
  Target,
  Brain,
  Lightbulb,
  Sparkles,
  ChevronRight,
  Play,
  Star,
  TrendingUp,
  Clock,
  Award
} from 'lucide-react';
import { AnimatedButton } from './AnimatedComponents';

const EducationalHero = ({ user }) => {
  const floatingVariants = {
    initial: { y: 0, rotate: 0 },
    animate: {
      y: [-10, 10, -10],
      rotate: [0, 5, -5, 0],
      transition: {
        y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
        rotate: { duration: 6, repeat: Infinity, ease: "easeInOut" }
      }
    }
  };

  const pulseVariants = {
    initial: { scale: 1, opacity: 0.8 },
    animate: {
      scale: [1, 1.1, 1],
      opacity: [0.8, 1, 0.8],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const slideUpVariants = {
    initial: { opacity: 0, y: 30 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const features = [
    {
      icon: BookOpen,
      title: "Interactive Learning",
      description: "Engage with dynamic content and multimedia resources"
    },
    {
      icon: Users,
      title: "Collaborative Environment",
      description: "Connect with peers and learn together in virtual classrooms"
    },
    {
      icon: Trophy,
      title: "Achievement System",
      description: "Earn badges and certificates as you progress through courses"
    },
    {
      icon: Brain,
      title: "Personalized Learning",
      description: "AI-powered recommendations tailored to your learning style"
    }
  ];

  const stats = [
    { number: "10,000+", label: "Students", icon: Users },
    { number: "500+", label: "Courses", icon: BookOpen },
    { number: "98%", label: "Success Rate", icon: TrendingUp },
    { number: "24/7", label: "Support", icon: Clock }
  ];

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-50 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Floating Shapes */}
        <motion.div
          variants={floatingVariants}
          initial="initial"
          animate="animate"
          className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full opacity-20 blur-xl"
        />
        <motion.div
          variants={floatingVariants}
          initial="initial"
          animate="animate"
          className="absolute top-40 right-20 w-32 h-32 bg-gradient-to-r from-teal-400 to-emerald-500 rounded-full opacity-20 blur-xl"
          style={{ animationDelay: '1s' }}
        />
        <motion.div
          variants={floatingVariants}
          initial="initial"
          animate="animate"
          className="absolute bottom-40 left-1/4 w-24 h-24 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full opacity-20 blur-xl"
          style={{ animationDelay: '2s' }}
        />

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="min-h-screen flex items-center justify-between">
          {/* Main Content */}
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="flex-1 max-w-3xl"
          >
            {/* Badge */}
            <motion.div variants={slideUpVariants} className="inline-flex items-center mb-6">
              <div className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-200 rounded-full">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span className="text-sm font-semibold text-emerald-600">
                  Welcome to the Future of Learning
                </span>
              </div>
            </motion.div>

            {/* Main Heading */}
            <motion.div variants={slideUpVariants} className="mb-8">
              <h1 className="text-5xl md:text-7xl font-bold mb-6">
                <span className="bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 bg-clip-text text-transparent">
                  Learn Without
                </span>
                <br />
                <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  Limits
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 leading-relaxed max-w-2xl">
                Discover a world of knowledge with our cutting-edge learning platform.
                Engage, explore, and excel with personalized education tailored just for you.
              </p>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div variants={slideUpVariants} className="flex flex-col sm:flex-row gap-4 mb-12">
              {!user ? (
                <>
                  <AnimatedButton
                    variant="primary"
                    size="lg"
                    icon={GraduationCap}
                    className="group"
                  >
                    <Link to="/register" className="flex items-center space-x-2">
                      <span>Start Learning Today</span>
                      <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </AnimatedButton>

                  <AnimatedButton
                    variant="secondary"
                    size="lg"
                    icon={Play}
                    className="group"
                  >
                    <Link to="/courses" className="flex items-center space-x-2">
                      <span>Explore Courses</span>
                    </Link>
                  </AnimatedButton>
                </>
              ) : (
                <>
                  <AnimatedButton
                    variant="primary"
                    size="lg"
                    icon={BookOpen}
                    className="group"
                  >
                    <Link to="/dashboard" className="flex items-center space-x-2">
                      <span>Go to Dashboard</span>
                      <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </AnimatedButton>

                  <AnimatedButton
                    variant="secondary"
                    size="lg"
                    icon={Target}
                  >
                    <Link to="/courses">Continue Learning</Link>
                  </AnimatedButton>
                </>
              )}
            </motion.div>

            {/* Stats */}
            <motion.div variants={slideUpVariants}>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    className="text-center"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <div className="mb-2 mx-auto w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
                      {stat.number}
                    </div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Right Side Illustration */}
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hidden lg:flex flex-1 justify-center items-center"
          >
            <div className="relative">
              {/* Central Hub */}
              <motion.div
                variants={pulseVariants}
                initial="initial"
                animate="animate"
                className="w-64 h-64 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center shadow-2xl"
              >
                <GraduationCap className="w-24 h-24 text-white" />
              </motion.div>

              {/* Orbiting Elements */}
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  className="absolute w-20 h-20 bg-white rounded-full shadow-lg flex items-center justify-center"
                  style={{
                    top: `${50 + 40 * Math.cos((index * Math.PI * 2) / features.length - Math.PI / 2)}%`,
                    left: `${50 + 40 * Math.sin((index * Math.PI * 2) / features.length - Math.PI / 2)}%`,
                    transform: 'translate(-50%, -50%)'
                  }}
                  animate={{
                    rotate: 360,
                    transition: {
                      duration: 20,
                      repeat: Infinity,
                      ease: "linear"
                    }
                  }}
                >
                  <motion.div
                    animate={{
                      rotate: -360,
                      transition: {
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear"
                      }
                    }}
                    className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center"
                  >
                    <feature.icon className="w-6 h-6 text-white" />
                  </motion.div>
                </motion.div>
              ))}

              {/* Connecting Lines */}
              <svg className="absolute inset-0 w-full h-full" style={{ zIndex: -1 }}>
                {features.map((_, index) => (
                  <motion.line
                    key={index}
                    x1="50%"
                    y1="50%"
                    x2={`${50 + 40 * Math.sin((index * Math.PI * 2) / features.length - Math.PI / 2)}%`}
                    y2={`${50 + 40 * Math.cos((index * Math.PI * 2) / features.length - Math.PI / 2)}%`}
                    stroke="url(#gradient)"
                    strokeWidth="2"
                    strokeOpacity="0.3"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 2, delay: index * 0.2 }}
                  />
                ))}
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20"
      >
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Why Choose AcademyOS?
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Experience learning like never before with our innovative features designed to maximize your potential
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300"
            >
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center mb-6"
              >
                <feature.icon className="w-8 h-8 text-white" />
              </motion.div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default EducationalHero;
