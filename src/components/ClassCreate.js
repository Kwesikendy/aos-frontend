import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, MapPin, Video, BookOpen, Save, ArrowLeft } from 'lucide-react';
import { courseAPI, classAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { LoadingSpinner } from './ui/AnimatedComponents';

const ClassCreate = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [courses, setCourses] = useState([]);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        title: '',
        courseId: '',
        date: new Date().toISOString().split('T')[0],
        startTime: '09:00',
        durationMinutes: 60,
        isOnline: false,
        location: '',
        meetingLink: ''
    });

    useEffect(() => {
        fetchCourses();
    }, [user]);

    const fetchCourses = async () => {
        try {
            // If admin, fetching all. If teacher, fetch "mine".
            // Assuming getCourses accepts filters or we use getMyCourses if available.
            // Checking api.js: getMyCourses() exists for teachers.
            let response;
            if (user.role === 'admin') {
                response = await courseAPI.getCourses({ limit: 100 });
                setCourses(response.data.data.courses || []);
            } else {
                response = await courseAPI.getMyCourses();
                setCourses(response.data.data.courses || []);
            }
        } catch (err) {
            console.error('Failed to fetch courses:', err);
            setError('Failed to load your courses. Please try again.');
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Calculate start and end times
            const startDateTime = new Date(`${formData.date}T${formData.startTime}`);
            const endDateTime = new Date(startDateTime.getTime() + formData.durationMinutes * 60000);

            const payload = {
                title: formData.title,
                description: '', // Optional
                course: formData.courseId,
                instructor: user.id, // Assuming creating for self or admin assigning self? 
                // If admin, we ideally allow selecting instructor, but for MVP assuming current user or course owner.
                // Backend checks "isAssigned". If Admin, it works.
                startTime: startDateTime.toISOString(),
                endTime: endDateTime.toISOString(),
                isOnline: formData.isOnline,
                location: formData.location,
                meetingLink: formData.meetingLink
            };

            const response = await classAPI.createClass(payload);
            if (response.data.success) {
                navigate('/classes');
            }
        } catch (err) {
            console.error('Create class error:', err);
            setError(err.response?.data?.message || 'Failed to schedule class');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <button onClick={() => navigate('/classes')} className="flex items-center text-gray-600 hover:text-emerald-600 mb-6 transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Classes
            </button>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-100 bg-emerald-50/50">
                    <h1 className="text-2xl font-bold text-gray-900">Schedule New Class</h1>
                    <p className="text-gray-500 text-sm mt-1">Create a new session for your course</p>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {error && (
                        <div className="p-4 bg-red-50 text-red-700 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Course *</label>
                            <div className="relative">
                                <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <select
                                    name="courseId"
                                    value={formData.courseId}
                                    onChange={handleChange}
                                    required
                                    className="w-full pl-10 h-10 rounded-lg border-gray-200 focus:ring-emerald-500 focus:border-emerald-500"
                                >
                                    <option value="">Select a Course</option>
                                    {courses.map(course => (
                                        <option key={course.id} value={course.id}>
                                            {course.code} - {course.title}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Class Title *</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="e.g., Week 3: Introduction to React"
                                required
                                className="w-full h-10 rounded-lg border-gray-200 focus:ring-emerald-500 focus:border-emerald-500 px-3"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="date"
                                        name="date"
                                        value={formData.date}
                                        onChange={handleChange}
                                        required
                                        className="w-full pl-10 h-10 rounded-lg border-gray-200 focus:ring-emerald-500 focus:border-emerald-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Start Time *</label>
                                <div className="relative">
                                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="time"
                                        name="startTime"
                                        value={formData.startTime}
                                        onChange={handleChange}
                                        required
                                        className="w-full pl-10 h-10 rounded-lg border-gray-200 focus:ring-emerald-500 focus:border-emerald-500"
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Duration (Minutes)</label>
                            <input
                                type="number"
                                name="durationMinutes"
                                value={formData.durationMinutes}
                                onChange={handleChange}
                                min="15"
                                step="15"
                                className="w-full h-10 rounded-lg border-gray-200 focus:ring-emerald-500 focus:border-emerald-500 px-3"
                            />
                        </div>

                        <div className="flex items-center gap-2 mb-2">
                            <input
                                type="checkbox"
                                id="isOnline"
                                name="isOnline"
                                checked={formData.isOnline}
                                onChange={handleChange}
                                className="rounded text-emerald-600 focus:ring-emerald-500"
                            />
                            <label htmlFor="isOnline" className="text-sm font-medium text-gray-700">Online Class</label>
                        </div>

                        {formData.isOnline ? (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Meeting Link</label>
                                <div className="relative">
                                    <Video className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="url"
                                        name="meetingLink"
                                        value={formData.meetingLink}
                                        onChange={handleChange}
                                        placeholder="https://zoom.us/..."
                                        className="w-full pl-10 h-10 rounded-lg border-gray-200 focus:ring-emerald-500 focus:border-emerald-500"
                                    />
                                </div>
                            </div>
                        ) : (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleChange}
                                        placeholder="Room 304, Main Building"
                                        className="w-full pl-10 h-10 rounded-lg border-gray-200 focus:ring-emerald-500 focus:border-emerald-500"
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="pt-4 border-t border-gray-100 flex justify-end">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center px-6 py-2.5 bg-emerald-600 text-white rounded-xl shadow-lg shadow-emerald-200 hover:bg-emerald-700 hover:scale-105 active:scale-95 transition-all disabled:opacity-70 disabled:hover:scale-100"
                        >
                            {loading ? <LoadingSpinner size="sm" color="white" /> : <><Save className="w-4 h-4 mr-2" /> Schedule Class</>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ClassCreate;
