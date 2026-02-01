import React from 'react';
import { motion } from 'framer-motion';

// ========================================
// 🎭 Micro-Interaction Components
// ========================================

// Hover scale effect for buttons and interactive elements
export const ScaleOnHover = ({ children, scale = 1.05, ...props }) => (
  <motion.div
    whileHover={{ scale }}
    whileTap={{ scale: 0.95 }}
    transition={{ type: "spring", stiffness: 400, damping: 10 }}
    {...props}
  >
    {children}
  </motion.div>
);

// Lift effect for cards and containers
export const LiftOnHover = ({ children, lift = -8, ...props }) => (
  <motion.div
    whileHover={{ 
      y: lift, 
      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
    }}
    transition={{ type: "spring", stiffness: 400, damping: 30 }}
    {...props}
  >
    {children}
  </motion.div>
);

// Bounce effect for icons and small elements
export const BounceOnHover = ({ children, ...props }) => (
  <motion.div
    whileHover={{ scale: 1.2, rotate: 5 }}
    whileTap={{ scale: 0.8 }}
    transition={{ type: "spring", stiffness: 600, damping: 10 }}
    {...props}
  >
    {children}
  </motion.div>
);

// Rotate effect for circular elements
export const RotateOnHover = ({ children, rotation = 360, duration = 0.6, ...props }) => (
  <motion.div
    whileHover={{ rotate: rotation }}
    transition={{ duration }}
    {...props}
  >
    {children}
  </motion.div>
);

// Glow effect for important elements
export const GlowOnHover = ({ children, glowColor = "rgba(99, 102, 241, 0.4)", ...props }) => (
  <motion.div
    whileHover={{ 
      boxShadow: `0 0 20px ${glowColor}, 0 0 40px ${glowColor}`,
      scale: 1.02
    }}
    transition={{ duration: 0.3 }}
    {...props}
  >
    {children}
  </motion.div>
);

// Slide in from direction
export const SlideIn = ({ children, direction = "left", distance = 50, delay = 0 }) => {
  const variants = {
    hidden: {
      opacity: 0,
      x: direction === "left" ? -distance : direction === "right" ? distance : 0,
      y: direction === "up" ? -distance : direction === "down" ? distance : 0,
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
    },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={variants}
      transition={{ 
        duration: 0.6, 
        delay,
        type: "spring",
        stiffness: 100,
        damping: 15
      }}
    >
      {children}
    </motion.div>
  );
};

// Fade in with stagger for lists
export const FadeInStagger = ({ children, staggerDelay = 0.1 }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {React.Children.map(children, (child, index) => (
        <motion.div key={index} variants={itemVariants}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
};

// Pulse animation for notifications and alerts
export const Pulse = ({ children, scale = 1.05, duration = 1, ...props }) => (
  <motion.div
    animate={{ scale: [1, scale, 1] }}
    transition={{ 
      duration, 
      repeat: Infinity, 
      ease: "easeInOut" 
    }}
    {...props}
  >
    {children}
  </motion.div>
);

// Shake animation for errors
export const Shake = ({ children, trigger, ...props }) => (
  <motion.div
    animate={trigger ? { x: [-10, 10, -10, 10, 0] } : {}}
    transition={{ duration: 0.5 }}
    {...props}
  >
    {children}
  </motion.div>
);

// Typewriter effect for text
export const Typewriter = ({ text, delay = 0, speed = 0.05 }) => {
  const [displayText, setDisplayText] = React.useState('');
  
  React.useEffect(() => {
    const timeout = setTimeout(() => {
      let currentIndex = 0;
      const interval = setInterval(() => {
        if (currentIndex <= text.length) {
          setDisplayText(text.substring(0, currentIndex));
          currentIndex++;
        } else {
          clearInterval(interval);
        }
      }, speed * 1000);
      
      return () => clearInterval(interval);
    }, delay * 1000);
    
    return () => clearTimeout(timeout);
  }, [text, delay, speed]);
  
  return (
    <span>
      {displayText}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.5, repeat: Infinity }}
      >
        |
      </motion.span>
    </span>
  );
};

// Floating animation for background elements
export const FloatingElement = ({ children, amplitude = 10, duration = 3, ...props }) => (
  <motion.div
    animate={{
      y: [-amplitude, amplitude],
      rotate: [-2, 2],
    }}
    transition={{
      duration,
      repeat: Infinity,
      repeatType: "reverse",
      ease: "easeInOut"
    }}
    {...props}
  >
    {children}
  </motion.div>
);

// Progress reveal animation
export const ProgressReveal = ({ children, progress = 0, direction = "left" }) => {
  const clipPath = direction === "left" 
    ? `inset(0 ${100 - progress}% 0 0)`
    : direction === "right"
    ? `inset(0 0 0 ${100 - progress}%)`
    : direction === "top"
    ? `inset(${100 - progress}% 0 0 0)`
    : `inset(0 0 ${100 - progress}% 0)`;

  return (
    <motion.div
      style={{ clipPath }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  );
};

// Magnetic effect for buttons
export const MagneticButton = ({ children, strength = 0.3, ...props }) => {
  const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = React.useState(false);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    setMousePosition({
      x: (e.clientX - centerX) * strength,
      y: (e.clientY - centerY) * strength,
    });
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    setMousePosition({ x: 0, y: 0 });
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      animate={{
        x: isHovered ? mousePosition.x : 0,
        y: isHovered ? mousePosition.y : 0,
      }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Morphing shapes for background decoration
export const MorphingShape = ({ paths, duration = 5, ...props }) => (
  <motion.div {...props}>
    <svg viewBox="0 0 200 200" className="w-full h-full">
      <motion.path
        d={paths[0]}
        animate={{ d: paths }}
        transition={{
          duration,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        fill="currentColor"
      />
    </svg>
  </motion.div>
);

// Particle system for celebration effects
export const ParticleExplosion = ({ trigger, particleCount = 20, colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7'] }) => {
  const [particles, setParticles] = React.useState([]);

  React.useEffect(() => {
    if (trigger) {
      const newParticles = Array.from({ length: particleCount }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 10 + 5,
        velocity: {
          x: (Math.random() - 0.5) * 200,
          y: (Math.random() - 0.5) * 200,
        }
      }));
      
      setParticles(newParticles);
      
      // Clear particles after animation
      setTimeout(() => setParticles([]), 2000);
    }
  }, [trigger, particleCount, colors]);

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
          initial={{ scale: 0, opacity: 1 }}
          animate={{
            scale: [0, 1, 0],
            opacity: [1, 0.8, 0],
            x: particle.velocity.x,
            y: particle.velocity.y,
          }}
          transition={{ duration: 2, ease: "easeOut" }}
        />
      ))}
    </div>
  );
};

// Interactive cursor follower
export const CursorFollower = ({ size = 20, color = "rgba(99, 102, 241, 0.3)" }) => {
  const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 });

  React.useEffect(() => {
    const updateMousePosition = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', updateMousePosition);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
    };
  }, []);

  return (
    <motion.div
      className="fixed pointer-events-none z-50 rounded-full"
      style={{
        backgroundColor: color,
        width: size,
        height: size,
        left: mousePosition.x - size / 2,
        top: mousePosition.y - size / 2,
      }}
      transition={{ type: "spring", stiffness: 500, damping: 28 }}
    />
  );
};

// Loading skeleton with shimmer effect
export const LoadingSkeleton = ({ width = "100%", height = "20px", className = "" }) => (
  <div 
    className={`bg-gray-200 rounded overflow-hidden relative ${className}`}
    style={{ width, height }}
  >
    <motion.div
      className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-60"
      animate={{ x: ['-100%', '200%'] }}
      transition={{ 
        duration: 1.5, 
        repeat: Infinity, 
        ease: "linear" 
      }}
    />
  </div>
);

// Text highlight on scroll
export const HighlightOnScroll = ({ children, color = "#fbbf24" }) => {
  const [isVisible, setIsVisible] = React.useState(false);
  const ref = React.useRef(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <span ref={ref} className="relative">
      {children}
      <motion.span
        className="absolute inset-0 -z-10"
        style={{ backgroundColor: color, opacity: 0.3 }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: isVisible ? 1 : 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        transformOrigin="left"
      />
    </span>
  );
};

export default {
  ScaleOnHover,
  LiftOnHover,
  BounceOnHover,
  RotateOnHover,
  GlowOnHover,
  SlideIn,
  FadeInStagger,
  Pulse,
  Shake,
  Typewriter,
  FloatingElement,
  ProgressReveal,
  MagneticButton,
  MorphingShape,
  ParticleExplosion,
  CursorFollower,
  LoadingSkeleton,
  HighlightOnScroll
};
