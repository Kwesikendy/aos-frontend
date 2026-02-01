import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Users, Clock, Video, MapPin, Search, Filter, CheckSquare, PlusCircle } from 'lucide-react';
import { classAPI } from '../../services/api';
import { LoadingSpinner } from '../ui/AnimatedComponents';

const TeacherClasses = () => {
    const navigate = useNavigate();
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('upcoming'); // upcoming, all, past
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchClasses();
    }, []);

    const fetchClasses = async () => {
        try {
            setLoading(true);
            // Fetch classes for this instructor. 
            // Ideally the backend filters by 'me' based on token, or we pass instructor ID if known.
            // Assuming getClasses with no params returns all, or we need to filter?
            // Step 2238 showed getClasses accepts `instructor` query.
            // However, usually `getMyClasses` is better.
            // `classAPI` has `getMyClasses`. Let's use that if available or getClasses.
            // api.js Step 2211 has `getMyClasses`.
            const response = await classAPI.getMyClasses();
            if (response.data.success) {
                setClasses(response.data.data.classes || []);
            }
        } catch (error) {
            console.error('Failed to fetch classes:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredClasses = classes.filter(cls => {
        const matchesSearch = cls.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            cls.course?.title.toLowerCase().includes(searchTerm.toLowerCase());

        // Simple date filtering (assuming startTime is ISO string)
        const now = new Date();
        const classTime = new Date(cls.startTime);
        const isPast = classTime < now;

        if (filter === 'upcoming') return matchesSearch && !isPast;
        if (filter === 'past') return matchesSearch && isPast;
        return matchesSearch;
    });

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    return (
        <motion.div
            className="p-6 max-w-7xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                        <Calendar className="w-8 h-8 text-emerald-600" />
                        My Classes
                    </h1>
                    <p className="text-gray-500 mt-1">Manage your schedule and upcoming sessions</p>
                </div>

                <div className="flex gap-3 bg-white p-2 rounded-xl border border-gray-200 shadow-sm">
                    <button
                        onClick={() => navigate('/classes/create')}
                        className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors flex items-center gap-2"
                    >
                        <PlusCircle className="w-4 h-4" /> Schedule Class
                    </button>
                    {['upcoming', 'all', 'past'].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === f
                                ? 'bg-emerald-100 text-emerald-700'
                                : 'text-gray-600 hover:bg-gray-50'
                                } capitalize`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <LoadingSpinner />
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    {filteredClasses.length > 0 ? (
                        filteredClasses.map((cls) => (
                            <motion.div
                                key={cls.id}
                                layout
                                className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row gap-6 items-start"
                            >
                                <div className="flex-shrink-0 w-16 h-16 bg-emerald-50 rounded-xl flex items-center justify-center flex-col text-emerald-700">
                                    <span className="text-xs font-bold uppercase">{new Date(cls.startTime).toLocaleString('default', { month: 'short' })}</span>
                                    <span className="text-2xl font-bold">{new Date(cls.startTime).getDate()}</span>
                                </div>

                                <div className="flex-grow">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-900">{cls.title}</h3>
                                            <p className="text-emerald-600 font-medium text-sm mb-2">{cls.course?.title || 'Unknown Course'}</p>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${cls.status === 'live' ? 'bg-red-100 text-red-600 animate-pulse' :
                                            cls.status === 'completed' ? 'bg-gray-100 text-gray-500' :
                                                'bg-blue-50 text-blue-600'
                                            }`}>
                                            {cls.status}
                                        </span>
                                    </div>

                                    <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-500">
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-4 h-4" />
                                            {new Date(cls.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -
                                            {new Date(cls.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>

                                        {cls.isOnline ? (
                                            <div className="flex items-center gap-2">
                                                <Video className="w-4 h-4 text-purple-500" />
                                                Online Class
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                <MapPin className="w-4 h-4 text-orange-500" />
                                                {cls.location || 'TBD'}
                                            </div>
                                        )}
                                    </div>

                                    {cls.meetingLink && (
                                        <div className="mt-4 pt-4 border-t border-gray-100 flex gap-3">
                                            <a href={cls.meetingLink} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-blue-600 hover:underline flex items-center gap-1">
                                                Join Meeting <Video className="w-3 h-3" />
                                            </a>
                                        </div>
                                    )}

                                    <div className="mt-4 pt-4 border-t border-gray-100 flex gap-3">
                                        <button
                                            onClick={() => navigate(`/teacher/classes/${cls.id}/attendance`)}
                                            className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition-colors flex items-center gap-2 text-sm font-medium"
                                        >
                                            <CheckSquare className="w-4 h-4" /> Take Attendance
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
                            <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900">No classes found</h3>
                            <p className="text-gray-500">You don't have any classes scheduled for this filter.</p>
                        </div>
                    )}
                </div>
            )}
        </motion.div>
    );
};

export default TeacherClasses;
