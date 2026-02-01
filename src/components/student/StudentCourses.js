import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, PlayCircle, Clock, Award } from 'lucide-react';
import { enrollmentsAPI } from '../../services/api';


const StudentCourses = () => {
    const [enrollments, setEnrollments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchMyCourses();
    }, []);

    const fetchMyCourses = async () => {
        try {
            const response = await enrollmentsAPI.getMyEnrollments();
            if (response.data.success) {
                setEnrollments(response.data.data);
            }
        } catch (err) {
            console.error('Error fetching courses:', err);
            setError('Failed to load your courses.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 pb-20">

                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-20">

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">My Courses</h1>
                        <p className="text-gray-500 mt-1">Continue where you left off</p>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-700 p-4 rounded-xl mb-6">
                        {error}
                        <button onClick={fetchMyCourses} className="ml-2 underline font-medium">Retry</button>
                    </div>
                )}

                {!loading && enrollments.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
                        <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h2 className="text-xl font-bold text-gray-900 mb-2">No courses yet</h2>
                        <p className="text-gray-500 mb-6">Browse our catalog to start learning.</p>
                        <Link
                            to="/courses"
                            className="inline-flex items-center px-6 py-3 bg-primary-600 text-white font-medium rounded-xl hover:bg-primary-700 transition-colors"
                        >
                            Browse Courses
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {enrollments.map((enrollment) => (
                            <div key={enrollment.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow flex flex-col h-full">
                                {/* Thumbnail */}
                                <div className="h-48 bg-gray-200 relative">
                                    {enrollment.course.thumbnail ? (
                                        <img
                                            src={enrollment.course.thumbnail}
                                            alt={enrollment.course.title}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-primary-100 text-primary-300">
                                            <BookOpen className="w-12 h-12" />
                                        </div>
                                    )}
                                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur text-xs font-bold px-2 py-1 rounded-lg shadow-sm text-gray-700">
                                        {enrollment.status === 'completed' ? 'Completed' : 'In Progress'}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-6 flex-1 flex flex-col">
                                    <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                                        {enrollment.course.title}
                                    </h3>

                                    {/* Progress Bar */}
                                    <div className="mt-auto pt-4">
                                        <div className="flex justify-between text-xs font-medium text-gray-500 mb-1">
                                            <span>Progress</span>
                                            <span>{enrollment.progress || 0}%</span>
                                        </div>
                                        <div className="w-full bg-gray-100 rounded-full h-2 mb-4">
                                            <div
                                                className="bg-primary-600 h-2 rounded-full transition-all duration-500"
                                                style={{ width: `${enrollment.progress || 0}%` }}
                                            ></div>
                                        </div>

                                        <Link
                                            to={`/course/${enrollment.courseId}/learn`} // Placeholder for course player
                                            className="w-full flex items-center justify-center gap-2 py-2.5 bg-primary-50 text-primary-700 font-medium rounded-xl hover:bg-primary-100 transition-colors"
                                        >
                                            {enrollment.progress > 0 ? 'Continue Learning' : 'Start Course'}
                                            <PlayCircle className="w-4 h-4" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentCourses;
