import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    BookOpen,
    Users,
    Award,
    Globe,
    Clock,
    Heart,
    Target,
    Sparkles,
    ChevronRight,
    MapPin,
    Calendar,
    CheckCircle,
    Coffee
} from 'lucide-react';

const AboutSchool = () => {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 1.1]);
    const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

    const stats = [
        { number: "30+", label: "Years of Heritage", icon: Clock, color: "text-amber-500", bg: "bg-amber-100" },
        { number: "2.5k+", label: "Active Students", icon: Users, color: "text-emerald-500", bg: "bg-emerald-100" },
        { number: "100%", label: "University Acceptance", icon: Award, color: "text-blue-500", bg: "bg-blue-100" },
        { number: "50+", label: "Global Partners", icon: Globe, color: "text-purple-500", bg: "bg-purple-100" }
    ];

    const values = [
        {
            title: "Innovation First",
            description: "We believe in pushing boundaries and embracing new technologies to enhance learning.",
            icon: Sparkles,
            gradient: "from-pink-500 to-rose-500"
        },
        {
            title: "Student Centered",
            description: "Every decision we make is focused on the well-being and success of our students.",
            icon: Heart,
            gradient: "from-purple-500 to-indigo-500"
        },
        {
            title: "Global Perspective",
            description: "Preparing students to be responsible citizens in an interconnected world.",
            icon: Globe,
            gradient: "from-cyan-500 to-blue-500"
        },
        {
            title: "Excellence Always",
            description: "Striving for the highest standards in academics, character, and community service.",
            icon: Target,
            gradient: "from-amber-400 to-orange-500"
        }
    ];

    const timeline = [
        { year: "1994", title: "Foundation", description: "AcademyOS opened its doors with just 50 students and a vision." },
        { year: "2005", title: "Expansion", description: "Added the Science Wing and Arts Center to our expanding campus." },
        { year: "2015", title: "Digital Leap", description: "Integrated smart classrooms and 1:1 device learning for all grades." },
        { year: "2024", title: "Global recognition", description: "Awarded 'Best Digital Innovation' in Education." }
    ];

    return (
        <div ref={containerRef} className="min-h-screen bg-gray-50 overflow-hidden">
            {/* Hero Section */}
            <div className="relative h-[80vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900 z-0"></div>

                {/* Animated Background Particles */}
                <div className="absolute inset-0 z-0 opacity-30">
                    {[...Array(20)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute bg-white rounded-full opacity-20"
                            style={{
                                width: Math.random() * 300 + 50,
                                height: Math.random() * 300 + 50,
                                top: `${Math.random() * 100}%`,
                                left: `${Math.random() * 100}%`,
                                filter: 'blur(60px)'
                            }}
                            animate={{
                                y: [0, -50, 0],
                                x: [0, 30, 0],
                                scale: [1, 1.2, 1]
                            }}
                            transition={{
                                duration: 10 + Math.random() * 10,
                                repeat: Infinity,
                                ease: "linear"
                            }}
                        />
                    ))}
                </div>

                <motion.div
                    style={{ scale: heroScale, opacity: heroOpacity }}
                    className="relative z-10 text-center px-4 max-w-5xl mx-auto"
                >
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="inline-block px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-emerald-200 font-medium mb-6">
                            Established 1994
                        </span>
                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-8 tracking-tight leading-tight">
                            Shaping the <br />
                            <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
                                Future of Learning
                            </span>
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                            We are more than just a school. We are a community dedicated to sparking curiosity,
                            fostering creativity, and building the leaders of tomorrow.
                        </p>
                    </motion.div>
                </motion.div>

                {/* Scroll Indicator */}
                <motion.div
                    className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/50"
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                >
                    <div className="w-6 h-10 border-2 border-current rounded-full flex justify-center p-2">
                        <div className="w-1 h-3 bg-current rounded-full" />
                    </div>
                </motion.div>
            </div>

            {/* Stats Section */}
            <div className="max-w-7xl mx-auto px-4 -mt-20 relative z-20">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -5 }}
                            className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border border-gray-100 flex flex-col items-center text-center group"
                        >
                            <div className={`w-16 h-16 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                                <stat.icon className="w-8 h-8" />
                            </div>
                            <h3 className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</h3>
                            <p className="text-gray-500 font-medium">{stat.label}</p>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Our Story Section */}
            <section className="py-20 md:py-32 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">
                                A Tradition of <br />
                                <span className="text-emerald-600">Academic Excellence</span>
                            </h2>
                            <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
                                <p>
                                    Founded over three decades ago, AcademyOS began with a simple mission: to provide education
                                    that empowers students to not just survive, but thrive in a rapidly changing world.
                                </p>
                                <p>
                                    Today, we stand at the forefront of educational innovation. Our campus is a living laboratory
                                    where tradition serves as the foundation for future-forward learning. From our state-of-the-art
                                    laboratories to our vibrant arts studios, every corner of our school is designed to inspire.
                                </p>
                                <div className="flex items-center gap-4 pt-4">
                                    <div className="flex -space-x-4">
                                        {[1, 2, 3, 4].map((i) => (
                                            <div key={i} className="w-12 h-12 rounded-full border-2 border-white bg-gray-200 overflow-hidden">
                                                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`} alt="Avatar" className="w-full h-full" />
                                            </div>
                                        ))}
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900">Trusted by Families</p>
                                        <p className="text-sm text-gray-500">Across 20+ countries</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        <div className="relative">
                            {/* Timeline */}
                            <div className="absolute left-8 top-0 bottom-0 w-px bg-gray-200"></div>
                            <div className="space-y-12">
                                {timeline.map((item, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: 50 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.2 }}
                                        className="relative pl-20"
                                    >
                                        <div className="absolute left-6 top-0 w-4 h-4 bg-emerald-500 rounded-full border-4 border-white shadow-lg -translate-x-1/2"></div>
                                        <span className="text-emerald-600 font-bold text-lg mb-2 block">{item.year}</span>
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                                        <p className="text-gray-500">{item.description}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Core Values Section */}
            <section className="py-20 bg-gray-900 text-white relative overflow-hidden">
                {/* Decorative Gradients */}
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-emerald-900/20 to-transparent pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-teal-900/20 rounded-full blur-3xl pointer-events-none"></div>

                <div className="max-w-7xl mx-auto px-4 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold mb-6">Our Core Values</h2>
                        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                            The principles that guide our community and shape our students' character.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {values.map((value, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ scale: 1.02 }}
                                className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-colors group"
                            >
                                <div className={`w-14 h-14 bg-gradient-to-r ${value.gradient} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                                    <value.icon className="w-7 h-7 text-white" />
                                </div>
                                <h3 className="text-2xl font-bold mb-4">{value.title}</h3>
                                <p className="text-gray-400 leading-relaxed text-lg">
                                    {value.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Modern CTA Section */}
            <section className="py-24 px-4">
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-[2.5rem] p-12 md:p-20 text-center text-white relative overflow-hidden shadow-2xl"
                    >
                        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-emerald-900/20 rounded-full blur-3xl"></div>

                        <div className="relative z-10 max-w-3xl mx-auto">
                            <h2 className="text-4xl md:text-6xl font-bold mb-8 tracking-tight">
                                Ready to Join Us?
                            </h2>
                            <p className="text-xl md:text-2xl text-emerald-50 mb-12 font-light">
                                Discover a place where potential meets opportunity. Applications for the next academic year are now open.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link to="/register">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="bg-white text-emerald-700 px-10 py-5 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all flex items-center gap-2 mx-auto sm:mx-0"
                                    >
                                        Apply Now <ChevronRight className="w-5 h-5" />
                                    </motion.button>
                                </Link>
                                <a href="#contact">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="bg-emerald-800/50 backdrop-blur-sm border border-emerald-400/30 text-white px-10 py-5 rounded-2xl font-bold text-lg hover:bg-emerald-800/70 transition-all mx-auto sm:mx-0"
                                    >
                                        Contact Us
                                    </motion.button>
                                </a>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Footer Minimal */}
            <footer className="bg-gray-50 py-12 text-center border-t border-gray-200">
                <p className="text-gray-500">© 2024 AcademyOS. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default AboutSchool;
