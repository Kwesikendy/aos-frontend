import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  GraduationCap,
  Users,
  Trophy,
  Star,
  Play,
  ChevronRight,
  Sparkles,
  Target,
  Brain,
  Rocket,
  Gift,
  TrendingUp,
  Clock,
  Globe,
  Palette,
  Music,
  Code,
  Microscope,
  Calculator
} from 'lucide-react';

const SpectacularHomePage = () => {
  const { user } = useAuth();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [currentFeature, setCurrentFeature] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const containerRef = useRef(null);
  const { scrollY } = useScroll();

  // Parallax transforms
  const heroY = useTransform(scrollY, [0, 500], [0, -150]);
  const backgroundY = useTransform(scrollY, [0, 500], [0, -200]);

  useEffect(() => {
    setIsLoaded(true);

    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Auto-rotate features
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: GraduationCap,
      title: "Academic Excellence",
      description: "Comprehensive curriculum for all grade levels",
      color: "from-emerald-600 to-teal-600",
      bgColor: "bg-emerald-100",
      particles: 20
    },
    {
      icon: Users,
      title: "Student Community",
      description: "Fostering collaboration and social growth",
      color: "from-teal-600 to-cyan-600",
      bgColor: "bg-teal-100",
      particles: 15
    },
    {
      icon: Trophy,
      title: "Extracurriculars",
      description: "Sports, Arts, and Leadership programs",
      color: "from-yellow-500 to-orange-500",
      bgColor: "bg-yellow-100",
      particles: 25
    },
    {
      icon: Rocket,
      title: "Holistic Development",
      description: "Nurturing mind, body, and character",
      color: "from-green-500 to-emerald-600",
      bgColor: "bg-green-100",
      particles: 18
    }
  ];

  const subjects = [
    { icon: Calculator, name: "Mathematics", color: "text-emerald-600", bg: "bg-emerald-100" },
    { icon: Microscope, name: "Science", color: "text-teal-600", bg: "bg-teal-100" },
    { icon: Globe, name: "Geography", color: "text-cyan-600", bg: "bg-cyan-100" },
    { icon: Palette, name: "Arts", color: "text-amber-600", bg: "bg-amber-100" },
    { icon: Music, name: "Music", color: "text-lime-600", bg: "bg-lime-100" },
    { icon: Code, name: "Programming", color: "text-orange-600", bg: "bg-orange-100" },
  ];

  const stats = [
    { number: "2,500+", label: "Enrolled Students", icon: Users },
    { number: "120+", label: "Qualified Staff", icon: GraduationCap },
    { number: "100%", label: "Pass Rate", icon: TrendingUp },
    { number: "30+", label: "Years of Excellence", icon: Clock }
  ];

  // Floating particles animation
  const FloatingParticles = ({ count = 50, color = "bg-white" }) => {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(count)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute w-1 h-1 ${color} rounded-full opacity-60`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, Math.random() * 20 - 10, 0],
              scale: [0.8, 1.2, 0.8],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
    );
  };

  // 3D Card Component
  const Card3D = ({ children, className = "" }) => {
    const [rotateX, setRotateX] = useState(0);
    const [rotateY, setRotateY] = useState(0);

    const handleMouseMove = (e) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const rotateXValue = (e.clientY - centerY) / 10;
      const rotateYValue = (centerX - e.clientX) / 10;

      setRotateX(rotateXValue);
      setRotateY(rotateYValue);
    };

    const handleMouseLeave = () => {
      setRotateX(0);
      setRotateY(0);
    };

    return (
      <motion.div
        className={`transform-gpu perspective-1000 ${className}`}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        animate={{
          rotateX: rotateX,
          rotateY: rotateY,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        style={{
          transformStyle: "preserve-3d",
        }}
      >
        {children}
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-teal-900 overflow-hidden relative">
      {/* Animated Background */}
      <motion.div
        style={{ y: backgroundY }}
        className="absolute inset-0 opacity-30"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/20 to-teal-600/20 animate-pulse" />
        <FloatingParticles count={100} color="bg-white" />
      </motion.div>

      {/* Mouse follower */}
      <motion.div
        className="fixed w-4 h-4 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full pointer-events-none z-50 mix-blend-screen"
        animate={{
          x: mousePosition.x * 0.02 * window.innerWidth / 100,
          y: mousePosition.y * 0.02 * window.innerHeight / 100,
        }}
        transition={{ type: "spring", stiffness: 150, damping: 15 }}
      />

      <div ref={containerRef} className="relative z-10">
        {/* Hero Section */}
        <motion.section
          style={{ y: heroY }}
          className="min-h-screen flex items-center justify-center relative px-4"
        >
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: isLoaded ? 1 : 0, x: isLoaded ? 0 : -100 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="text-center lg:text-left"
            >
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-3 mb-8"
              >
                <Sparkles className="w-5 h-5 text-yellow-400" />
                <span className="text-white font-medium">Welcome to AcademyOS</span>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Star className="w-4 h-4 text-yellow-400" />
                </motion.div>
              </motion.div>

              {/* Main Heading */}
              <motion.h1
                className="text-6xl lg:text-8xl font-bold mb-8 bg-gradient-to-r from-white via-emerald-100 to-teal-100 bg-clip-text text-transparent leading-tight"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.8 }}
              >
                Empowering
                <br />
                <motion.span
                  className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent"
                  animate={{
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  Educational
                </motion.span>
                <br />
                Excellence
              </motion.h1>

              <motion.p
                className="text-xl lg:text-2xl text-gray-300 mb-12 max-w-2xl leading-relaxed"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.6 }}
              >
                A comprehensive management system designed for students, teachers, and parents to foster a connected and thriving school community.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1, duration: 0.6 }}
              >
                {!user ? (
                  <>
                    <Card3D>
                      <Link to="/register" className="group relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl blur opacity-75 group-hover:opacity-100 transition-opacity"></div>
                        <motion.button
                          className="relative bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-2xl transform-gpu group-hover:scale-105 transition-all duration-300"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <span className="flex items-center space-x-2">
                            <Rocket className="w-6 h-6" />
                            <span>Student Portal</span>
                            <motion.div
                              animate={{ x: [0, 5, 0] }}
                              transition={{ duration: 1.5, repeat: Infinity }}
                            >
                              <ChevronRight className="w-5 h-5" />
                            </motion.div>
                          </span>
                        </motion.button>
                      </Link>
                    </Card3D>

                    <Card3D>
                      <Link to="/about" className="group">
                        <motion.button
                          className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-white/20 transition-all duration-300 transform-gpu group-hover:scale-105"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <span className="flex items-center space-x-2">
                            <Play className="w-5 h-5" />
                            <span>About Our School</span>
                          </span>
                        </motion.button>
                      </Link>
                    </Card3D>
                  </>
                ) : (
                  <>
                    <Card3D>
                      <Link to="/dashboard" className="group relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl blur opacity-75 group-hover:opacity-100 transition-opacity"></div>
                        <motion.button
                          className="relative bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-2xl transform-gpu group-hover:scale-105 transition-all duration-300"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <span className="flex items-center space-x-2">
                            <Target className="w-6 h-6" />
                            <span>Continue Learning</span>
                            <ChevronRight className="w-5 h-5" />
                          </span>
                        </motion.button>
                      </Link>
                    </Card3D>
                  </>
                )}
              </motion.div>
            </motion.div>

            {/* Right Side - 3D Interactive Feature */}
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: isLoaded ? 1 : 0, x: isLoaded ? 0 : 100 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="relative h-96 lg:h-[600px]"
            >
              <div className="relative w-full h-full">
                {/* Central Feature Card */}
                <AnimatePresence mode="wait">
                  <Card3D key={currentFeature} className="absolute inset-0">
                    <motion.div
                      initial={{ opacity: 0, rotateY: 90, scale: 0.8 }}
                      animate={{ opacity: 1, rotateY: 0, scale: 1 }}
                      exit={{ opacity: 0, rotateY: -90, scale: 0.8 }}
                      transition={{ duration: 0.8 }}
                      className={`w-full h-full ${features[currentFeature].bgColor} backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl relative overflow-hidden`}
                    >
                      {/* Background particles for current feature */}
                      <FloatingParticles count={features[currentFeature].particles} color="bg-white" />

                      <div className="relative z-10 h-full flex flex-col justify-center items-center text-center">
                        <motion.div
                          animate={{
                            rotate: 360,
                            scale: [1, 1.1, 1]
                          }}
                          transition={{
                            rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                            scale: { duration: 2, repeat: Infinity }
                          }}
                          className={`w-24 h-24 bg-gradient-to-r ${features[currentFeature].color} rounded-2xl flex items-center justify-center mb-8 shadow-2xl`}
                        >
                          {React.createElement(features[currentFeature].icon, { className: "w-12 h-12 text-white" })}
                        </motion.div>

                        <motion.h3
                          className="text-3xl font-bold text-gray-800 mb-4"
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.2 }}
                        >
                          {features[currentFeature].title}
                        </motion.h3>

                        <motion.p
                          className="text-lg text-gray-600"
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.4 }}
                        >
                          {features[currentFeature].description}
                        </motion.p>
                      </div>

                      {/* Glow effect */}
                      <div className={`absolute inset-0 bg-gradient-to-r ${features[currentFeature].color} opacity-10 rounded-3xl animate-pulse`} />
                    </motion.div>
                  </Card3D>
                </AnimatePresence>

                {/* Orbiting Feature Icons */}
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    className="absolute w-16 h-16 cursor-pointer"
                    style={{
                      top: `${50 + 35 * Math.cos((index * Math.PI * 2) / features.length)}%`,
                      left: `${50 + 35 * Math.sin((index * Math.PI * 2) / features.length)}%`,
                      transform: 'translate(-50%, -50%)'
                    }}
                    animate={{
                      rotate: 360,
                    }}
                    transition={{
                      duration: 20,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                    onClick={() => setCurrentFeature(index)}
                  >
                    <motion.div
                      animate={{
                        rotate: -360,
                        scale: index === currentFeature ? 1.2 : 1,
                      }}
                      transition={{
                        rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                        scale: { duration: 0.3 }
                      }}
                      className={`w-full h-full bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center shadow-lg hover:shadow-2xl transition-shadow ${index === currentFeature ? 'ring-4 ring-white/50' : ''
                        }`}
                    >
                      {React.createElement(feature.icon, { className: "w-8 h-8 text-white" })}
                    </motion.div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Scroll Indicator */}
          <motion.div
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
              <motion.div
                className="w-1 h-3 bg-white/50 rounded-full mt-2"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
          </motion.div>
        </motion.section>

        {/* Stats Section */}
        <motion.section
          className="py-20 relative"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <Card3D key={index}>
                  <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.6 }}
                    viewport={{ once: true }}
                    className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 text-center hover:bg-white/20 transition-all duration-300"
                  >
                    <motion.div
                      animate={{
                        rotate: [0, 10, -10, 0],
                        scale: [1, 1.05, 1]
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        delay: index * 0.5
                      }}
                      className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center mx-auto mb-4"
                    >
                      <stat.icon className="w-8 h-8 text-white" />
                    </motion.div>

                    <motion.h3
                      className="text-4xl font-bold text-white mb-2"
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      transition={{ delay: index * 0.1 + 0.3, type: "spring", stiffness: 200 }}
                      viewport={{ once: true }}
                    >
                      {stat.number}
                    </motion.h3>

                    <p className="text-gray-300">{stat.label}</p>
                  </motion.div>
                </Card3D>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Subjects Section */}
        <motion.section
          className="py-20 relative"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="max-w-7xl mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-5xl font-bold text-white mb-6">
                Explore Every
                <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent"> Subject</span>
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                From mathematics to music, discover courses tailored to your interests and career goals
              </p>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {subjects.map((subject, index) => (
                <Card3D key={index}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8, y: 30 }}
                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    viewport={{ once: true }}
                    whileHover={{ y: -10 }}
                    className={`${subject.bg} backdrop-blur-sm border border-white/20 rounded-2xl p-6 text-center cursor-pointer hover:shadow-2xl transition-all duration-300 group`}
                  >
                    <motion.div
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      transition={{ duration: 0.6 }}
                      className={`w-16 h-16 ${subject.color} bg-white rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:shadow-lg transition-shadow`}
                    >
                      <subject.icon className="w-8 h-8" />
                    </motion.div>

                    <h3 className="font-semibold text-gray-800 group-hover:text-gray-900 transition-colors">
                      {subject.name}
                    </h3>
                  </motion.div>
                </Card3D>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Final CTA */}
        <motion.section
          className="py-32 relative"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="max-w-4xl mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-6xl font-bold text-white mb-8">
                Ready to
                <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent"> Transform </span>
                Your Future?
              </h2>

              <p className="text-2xl text-gray-300 mb-12">
                Join our vibrant academic community today.
              </p>

              {!user && (
                <Card3D>
                  <Link to="/register" className="group relative inline-block">
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-3xl blur-lg opacity-75 group-hover:opacity-100 transition-opacity"></div>
                    <motion.button
                      className="relative bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-12 py-6 rounded-3xl font-bold text-2xl shadow-2xl transform-gpu group-hover:scale-105 transition-all duration-300"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span className="flex items-center space-x-3">
                        <Gift className="w-8 h-8" />
                        <span>Apply Now</span>
                        <motion.div
                          animate={{ x: [0, 8, 0] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <ChevronRight className="w-6 h-6" />
                        </motion.div>
                      </span>
                    </motion.button>
                  </Link>
                </Card3D>
              )}
            </motion.div>
          </div>

          {/* Background decoration */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <FloatingParticles count={30} color="bg-yellow-400" />
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default SpectacularHomePage;
