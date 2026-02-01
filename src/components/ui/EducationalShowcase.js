import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  BookOpen,
  Users,
  Trophy,
  Star,
  Play,
  Pause,
  Volume2,
  Heart,
  Share2,
  Download,
  Calendar,
  Clock,
  Award,
  Target,
  TrendingUp,
  Lightbulb,
  Brain,
  Rocket,
  Gift,
  Zap,
  CheckCircle
} from 'lucide-react';

// Showcase component demonstrating all our educational enhancements
const EducationalShowcase = () => {
  const [activeDemo, setActiveDemo] = useState('animations');
  const [celebrationTrigger, setCelebrationTrigger] = useState(false);

  const demoSections = {
    animations: {
      title: '🎭 Smooth Animations',
      description: 'Delightful motion design that brings the interface to life',
      content: (
        <div className="space-y-6">
          {/* Animated Cards Demo */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.1 } }
            }}
          >
            {[
              { icon: BookOpen, title: 'Interactive Learning', color: 'from-emerald-500 to-teal-600' },
              { icon: Users, title: 'Collaborative Study', color: 'from-green-500 to-emerald-600' },
              { icon: Trophy, title: 'Achievement System', color: 'from-yellow-500 to-orange-600' }
            ].map((item, index) => (
              <motion.div
                key={index}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}
                whileHover={{
                  y: -8,
                  boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
                  transition: { type: "spring", stiffness: 300 }
                }}
                className="bg-white p-6 rounded-xl border border-gray-200 cursor-pointer"
              >
                <div className={`w-12 h-12 bg-gradient-to-r ${item.color} rounded-lg flex items-center justify-center mb-4`}>
                  <item.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">Experience smooth, engaging animations</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Floating Elements Demo */}
          <div className="relative h-32 bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl overflow-hidden">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-6 h-6 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"
                style={{
                  left: `${20 + i * 15}%`,
                  top: '40%'
                }}
                animate={{
                  y: [-10, 10, -10],
                  rotate: [0, 180, 360],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 2 + i * 0.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            ))}
            <div className="absolute inset-0 flex items-center justify-center">
              <h4 className="text-lg font-semibold text-gray-800">Floating Background Elements</h4>
            </div>
          </div>
        </div>
      )
    },

    colors: {
      title: '🌈 Educational Color Scheme',
      description: 'Vibrant, accessible colors designed for learning environments',
      content: (
        <div className="space-y-6">
          {/* Color Palette */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'Math Blue', class: 'bg-blue-500', desc: 'Logic & Analysis' },
              { name: 'Science Green', class: 'bg-green-500', desc: 'Growth & Discovery' },
              { name: 'Language Orange', class: 'bg-orange-500', desc: 'Communication' },
              { name: 'Art Pink', class: 'bg-pink-500', desc: 'Creativity' },
              { name: 'History Purple', class: 'bg-purple-500', desc: 'Knowledge' },
              { name: 'PE Red', class: 'bg-red-500', desc: 'Energy & Vitality' },
              { name: 'Success', class: 'bg-emerald-500', desc: 'Achievement' },
              { name: 'Warning', class: 'bg-amber-500', desc: 'Attention' }
            ].map((color, index) => (
              <motion.div
                key={index}
                className="text-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className={`w-full h-20 ${color.class} rounded-lg mb-2 shadow-lg relative overflow-hidden`}>
                  <motion.div
                    className="absolute inset-0 bg-white/20"
                    whileHover={{ scale: 1.2, rotate: 45 }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                <h4 className="font-medium text-gray-900 text-sm">{color.name}</h4>
                <p className="text-gray-500 text-xs">{color.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Gradient Examples */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="h-24 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center text-white font-semibold">
              Primary Gradient
            </div>
            <div className="h-24 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg flex items-center justify-center text-white font-semibold">
              Success Gradient
            </div>
            <div className="h-24 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center text-white font-semibold">
              Achievement Gradient
            </div>
          </div>
        </div>
      )
    },

    typography: {
      title: '✍️ Modern Typography',
      description: 'Clear, readable fonts optimized for educational content',
      content: (
        <div className="space-y-8">
          {/* Font Hierarchy */}
          <div className="space-y-4">
            <motion.h1
              className="text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              Heading 1 - Display
            </motion.h1>
            <motion.h2
              className="text-3xl font-semibold text-gray-800"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              Heading 2 - Section Title
            </motion.h2>
            <motion.h3
              className="text-xl font-medium text-gray-700"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Heading 3 - Subsection
            </motion.h3>
            <motion.p
              className="text-base text-gray-600 leading-relaxed max-w-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Body text is optimized for readability with proper line height and spacing.
              This ensures students can focus on learning without eye strain during extended reading sessions.
            </motion.p>
            <motion.p
              className="text-sm text-gray-500"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Small text for captions and meta information maintains clarity at reduced sizes.
            </motion.p>
          </div>

          {/* Font Showcase */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <h4 className="font-heading text-lg font-semibold mb-2">Poppins</h4>
              <p className="text-sm text-gray-600">Headings & Titles</p>
              <p className="font-heading text-xl mt-2">Aa Bb Cc 123</p>
            </div>
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <h4 className="font-primary text-lg font-semibold mb-2">Inter</h4>
              <p className="text-sm text-gray-600">Body Text</p>
              <p className="font-primary text-xl mt-2">Aa Bb Cc 123</p>
            </div>
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <h4 className="font-display text-lg font-semibold mb-2">Space Grotesk</h4>
              <p className="text-sm text-gray-600">Display Text</p>
              <p className="font-display text-xl mt-2">Aa Bb Cc 123</p>
            </div>
          </div>
        </div>
      )
    },

    components: {
      title: '🧩 Interactive Components',
      description: 'Reusable UI elements with built-in animations and accessibility',
      content: (
        <div className="space-y-8">
          {/* Progress Bars */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-800">Animated Progress Bars</h4>
            {[
              { label: 'Mathematics', progress: 85, color: 'blue' },
              { label: 'Science', progress: 92, color: 'green' },
              { label: 'Literature', progress: 78, color: 'orange' }
            ].map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">{item.label}</span>
                  <span className="text-sm font-semibold text-gray-600">{item.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <motion.div
                    className={`h-3 bg-gradient-to-r ${item.color === 'blue' ? 'from-emerald-500 to-teal-600' :
                        item.color === 'green' ? 'from-green-500 to-emerald-600' :
                          'from-orange-500 to-amber-600'
                      } rounded-full relative overflow-hidden`}
                    initial={{ width: 0 }}
                    animate={{ width: `${item.progress}%` }}
                    transition={{ duration: 1.5, delay: index * 0.2, ease: "easeOut" }}
                  >
                    {/* Shimmer effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                      animate={{ x: ['-100%', '200%'] }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "linear",
                        delay: index * 0.2 + 1.5
                      }}
                    />
                  </motion.div>
                </div>
              </div>
            ))}
          </div>

          {/* Buttons */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-800">Interactive Buttons</h4>
            <div className="flex flex-wrap gap-4">
              {[
                { label: 'Primary Action', variant: 'primary' },
                { label: 'Secondary', variant: 'secondary' },
                { label: 'Success', variant: 'success' },
                { label: 'Celebration', variant: 'celebration' }
              ].map((btn, index) => (
                <motion.button
                  key={index}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${btn.variant === 'primary' ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg hover:shadow-xl' :
                      btn.variant === 'secondary' ? 'bg-white text-gray-700 border-2 border-gray-200 hover:border-gray-300' :
                        btn.variant === 'success' ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg hover:shadow-xl' :
                          'bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg hover:shadow-xl'
                    }`}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    if (btn.variant === 'celebration') {
                      setCelebrationTrigger(!celebrationTrigger);
                    }
                  }}
                >
                  {btn.variant === 'celebration' ? (
                    <span className="flex items-center space-x-2">
                      <Sparkles className="w-4 h-4" />
                      <span>{btn.label}</span>
                    </span>
                  ) : btn.label}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Achievement Badges */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-800">Achievement Badges</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { title: 'First Course', icon: BookOpen, earned: true, rarity: 'common' },
                { title: 'Perfect Score', icon: Star, earned: true, rarity: 'rare' },
                { title: 'Speed Learner', icon: Zap, earned: false, progress: 75, rarity: 'uncommon' },
                { title: 'Master Student', icon: Award, earned: true, rarity: 'legendary' }
              ].map((badge, index) => (
                <motion.div
                  key={index}
                  className={`relative p-4 rounded-xl border-2 cursor-pointer ${badge.earned ? 'border-transparent bg-white shadow-lg' : 'border-gray-200 bg-gray-50'
                    }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {/* Glow effect for earned badges */}
                  {badge.earned && (
                    <motion.div
                      className={`absolute inset-0 bg-gradient-to-r ${badge.rarity === 'legendary' ? 'from-yellow-400 to-orange-500' :
                          badge.rarity === 'rare' ? 'from-blue-400 to-blue-600' :
                            'from-green-400 to-green-600'
                        } opacity-20 rounded-xl blur-sm`}
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

                  {/* Badge content */}
                  <div className={`w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center ${badge.earned ?
                      `bg-gradient-to-r ${badge.rarity === 'legendary' ? 'from-yellow-400 to-orange-500' :
                        badge.rarity === 'rare' ? 'from-blue-400 to-blue-600' :
                          'from-green-400 to-green-600'
                      }` : 'bg-gray-300'
                    }`}>
                    <badge.icon className={`w-8 h-8 ${badge.earned ? 'text-white' : 'text-gray-500'}`} />
                  </div>

                  <div className="text-center">
                    <h4 className={`font-semibold mb-1 ${badge.earned ? 'text-gray-900' : 'text-gray-500'}`}>
                      {badge.title}
                    </h4>

                    {!badge.earned && badge.progress && (
                      <div className="mt-2">
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <motion.div
                            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${badge.progress}%` }}
                            transition={{ duration: 1, delay: index * 0.1 }}
                          />
                        </div>
                        <span className="text-xs text-gray-500 mt-1">{badge.progress}%</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )
    },

    features: {
      title: '🚀 Key Features',
      description: 'Comprehensive educational platform capabilities',
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            {
              category: 'Learning Experience',
              items: [
                'Interactive course content',
                'Progress tracking',
                'Achievement system',
                'Personalized learning paths'
              ]
            },
            {
              category: 'User Interface',
              items: [
                'Smooth animations',
                'Responsive design',
                'Accessibility features',
                'Modern typography'
              ]
            },
            {
              category: 'Educational Tools',
              items: [
                'Assignment management',
                'Grade tracking',
                'Resource library',
                'Virtual classrooms'
              ]
            },
            {
              category: 'Social Features',
              items: [
                'Collaborative learning',
                'Discussion forums',
                'Peer reviews',
                'Study groups'
              ]
            }
          ].map((category, index) => (
            <motion.div
              key={index}
              className="bg-white p-6 rounded-xl border border-gray-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -4, boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}
            >
              <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center mr-3">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
                {category.category}
              </h4>
              <ul className="space-y-2">
                {category.items.map((item, itemIndex) => (
                  <motion.li
                    key={itemIndex}
                    className="flex items-center text-gray-600"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 + itemIndex * 0.05 }}
                  >
                    <div className="w-2 h-2 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full mr-3" />
                    {item}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      )
    }
  };

  // Celebration particles effect
  const CelebrationParticles = () => {
    const [particles, setParticles] = useState([]);

    React.useEffect(() => {
      if (celebrationTrigger) {
        const newParticles = Array.from({ length: 30 }, (_, i) => ({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          color: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7'][Math.floor(Math.random() * 5)],
          size: Math.random() * 8 + 4
        }));

        setParticles(newParticles);
        setTimeout(() => setParticles([]), 3000);
      }
    }, [celebrationTrigger]);

    return (
      <div className="fixed inset-0 pointer-events-none z-50">
        {particles.map(particle => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full"
            style={{
              backgroundColor: particle.color,
              width: particle.size,
              height: particle.size,
              left: `${particle.x}%`,
              top: `${particle.y}%`,
            }}
            initial={{ scale: 0, opacity: 1, rotate: 0 }}
            animate={{
              scale: [0, 1, 0],
              opacity: [1, 0.8, 0],
              rotate: 360,
              x: (Math.random() - 0.5) * 300,
              y: (Math.random() - 0.5) * 300,
            }}
            transition={{ duration: 3, ease: "easeOut" }}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-50">
      <CelebrationParticles />

      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
              🎓 AcademyOS Design System
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A comprehensive showcase of modern educational interface design with smooth animations,
              vibrant colors, and engaging micro-interactions
            </p>
          </motion.div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {Object.entries(demoSections).map(([key, section]) => (
            <motion.button
              key={key}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${activeDemo === key
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveDemo(key)}
            >
              {section.title}
            </motion.button>
          ))}
        </div>

        {/* Demo Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeDemo}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8"
          >
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {demoSections[activeDemo].title}
              </h2>
              <p className="text-lg text-gray-600">
                {demoSections[activeDemo].description}
              </p>
            </div>

            <div className="demo-content">
              {demoSections[activeDemo].content}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="bg-gradient-to-r from-emerald-900 to-teal-900 text-white py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold mb-4">Ready to Transform Education?</h3>
            <p className="text-lg text-emerald-200 mb-6 max-w-2xl mx-auto">
              Experience the future of learning with our modern, animated, and engaging educational platform.
            </p>
            <motion.button
              className="bg-white text-emerald-900 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-colors inline-flex items-center space-x-2"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Rocket className="w-5 h-5" />
              <span>Get Started Today</span>
            </motion.button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default EducationalShowcase;
