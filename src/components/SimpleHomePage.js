import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  GraduationCap,
  Users,
  Trophy,
  Star,
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
import './SimpleHomePage.css';

const SimpleHomePage = () => {
  const { user } = useAuth();
  const [currentFeature, setCurrentFeature] = useState(0);

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Learning",
      description: "Smart algorithms adapt to your learning style"
    },
    {
      icon: Users,
      title: "Collaborative Education", 
      description: "Learn together in virtual classrooms"
    },
    {
      icon: Trophy,
      title: "Gamified Experience",
      description: "Earn badges and compete with peers"
    },
    {
      icon: Rocket,
      title: "Accelerated Growth",
      description: "Fast-track your educational journey"
    }
  ];

  const stats = [
    { number: "50,000+", label: "Active Students", icon: Users },
    { number: "1,200+", label: "Expert Teachers", icon: GraduationCap },
    { number: "98%", label: "Success Rate", icon: TrendingUp },
    { number: "24/7", label: "Support", icon: Clock }
  ];

  const subjects = [
    { icon: Calculator, name: "Mathematics" },
    { icon: Microscope, name: "Science" },
    { icon: Globe, name: "Geography" },
    { icon: Palette, name: "Arts" },
    { icon: Music, name: "Music" },
    { icon: Code, name: "Programming" }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [features.length]);

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-left">
            {/* AcademyOS Logo/Brand */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="academy-brand"
            >
              <GraduationCap size={40} className="brand-icon" />
              <span className="brand-text">AcademyOS</span>
            </motion.div>

            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="hero-badge"
            >
              <Sparkles size={20} />
              <span>Welcome to the Future of Education</span>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Star size={16} />
              </motion.div>
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              className="hero-title"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
            >
              Learn<br />
              <span className="hero-title-accent">Beyond</span><br />
              Limits
            </motion.h1>

            <motion.p
              className="hero-description"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.6 }}
            >
              Embark on an extraordinary educational journey with cutting-edge technology, 
              personalized learning paths, and a global community of learners.
            </motion.p>

            {/* CTA Buttons - Removed to improve look */}
            <motion.div
              className="hero-buttons"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 0.6 }}
            >
              {!user ? (
                <>
                  <Link to="/register" className="btn btn-primary">
                    <Rocket size={24} />
                    <span>Get Started</span>
                    <ChevronRight size={20} />
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/dashboard" className="btn btn-primary">
                    <Target size={24} />
                    <span>Go to Dashboard</span>
                    <ChevronRight size={20} />
                  </Link>
                </>
              )}
            </motion.div>
          </div>

          <div className="hero-right">
            {/* Feature Card */}
            <motion.div
              key={currentFeature}
              className="feature-card"
              initial={{ opacity: 0, rotateY: 90 }}
              animate={{ opacity: 1, rotateY: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="feature-icon">
                {React.createElement(features[currentFeature].icon, { size: 48 })}
              </div>
              <h3>{features[currentFeature].title}</h3>
              <p>{features[currentFeature].description}</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="stat-card"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
              >
                <div className="stat-icon">
                  {React.createElement(stat.icon, { size: 32 })}
                </div>
                <h3 className="stat-number">{stat.number}</h3>
                <p className="stat-label">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Subjects Section */}
      <section className="subjects-section">
        <div className="container">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2>Explore Every <span className="accent">Subject</span></h2>
            <p>From mathematics to music, discover courses tailored to your interests and career goals</p>
          </motion.div>

          <div className="subjects-grid">
            {subjects.map((subject, index) => (
              <motion.div
                key={index}
                className="subject-card"
                initial={{ opacity: 0, scale: 0.8, y: 30 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
              >
                <div className="subject-icon">
                  {React.createElement(subject.icon, { size: 32 })}
                </div>
                <h3>{subject.name}</h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="cta-section">
        <div className="container">
          <motion.div
            className="cta-content"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2>Ready to <span className="accent">Transform</span> Your Future?</h2>
            <p>Join millions of learners worldwide and unlock your potential with AcademyOS</p>

            {!user ? (
              <Link to="/register" className="btn btn-cta">
                <Gift size={32} />
                <span>Get Started</span>
                <ChevronRight size={24} />
              </Link>
            ) : (
              <Link to="/dashboard" className="btn btn-cta">
                <Target size={32} />
                <span>Go to Dashboard</span>
                <ChevronRight size={24} />
              </Link>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default SimpleHomePage;
