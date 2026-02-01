import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { dashboardAPI } from '../../services/api';
import {
    BookOpen,
    Clock,
    Award,
    Calendar,
    ChevronRight,
    AlertCircle,
    ArrowLeft
} from 'lucide-react';
import { motion } from 'framer-motion';

const ChildDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchChildData();
    }, [id]);

    const fetchChildData = async () => {
        try {
            setLoading(true);
            const response = await dashboardAPI.getChildDetails(id);
            setData(response.data.data);
        } catch (err) {
            console.error('Error fetching child details:', err);
            setError('Failed to load child data. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="max-w-7xl mx-auto p-8">
                <button
                    onClick={() => navigate('/parent')}
                    className="flex items-center text-gray-600 hover:text-indigo-600 mb-6 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
                </button>
                <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-center gap-3">
                    <AlertCircle className="w-5 h-5" />
                    {error || 'Student not found'}
                </div>
            </div>
        );
    }

    const { student, stats, enrolledCourses, upcomingClasses, assignments } = data;

    return (
        <div className="p-6 md:p-8 max-w-7xl mx-auto w-full">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <button
                        onClick={() => navigate('/parent')}
                        className="flex items-center text-gray-500 hover:text-indigo-600 mb-2 transition-colors text-sm font-medium"
                    >
                        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Dashboard
                    </button>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                        {student.avatar ? (
                            <img src={student.avatar} alt="" className="w-10 h-10 rounded-full" />
                        ) : (
                            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                                {student.firstName[0]}
                            </div>
                        )}
                        {student.firstName}'s Progress
                    </h1>
                    <p className="text-gray-500 mt-1">Detailed academic overview for {student.firstName} {student.lastName}</p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                            <BookOpen className="w-5 h-5" />
                        </div>
                        <span className="text-sm font-medium text-gray-500">Enrolled</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{stats.totalCourses}</div>
                    <div className="text-xs text-green-600 mt-1">Active Courses</div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                            <Award className="w-5 h-5" />
                        </div>
                        <span className="text-sm font-medium text-gray-500">Avg Grade</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{stats.averageGrade}%</div>
                    <div className="text-xs text-gray-500 mt-1">Overall Performance</div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                            <Clock className="w-5 h-5" />
                        </div>
                        <span className="text-sm font-medium text-gray-500">Attendance</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{stats.attendanceRate}%</div>
                    <div className="text-xs text-green-600 mt-1">Present Rate</div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                            <Calendar className="w-5 h-5" />
                        </div>
                        <span className="text-sm font-medium text-gray-500">Assignments</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{stats.pendingAssignmentsCount}</div>
                    <div className="text-xs text-orange-600 mt-1">Pending Due</div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Main Content - Course List */}
                <div className="lg:col-span-2 space-y-6">
                    <h2 className="text-lg font-bold text-gray-900">Enrolled Courses</h2>
                    <div className="space-y-4">
                        {enrolledCourses.length > 0 ? (
                            enrolledCourses.map((enrollment) => (
                                <div key={enrollment.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="font-bold text-gray-900">{enrollment.course.title}</h3>
                                            <p className="text-sm text-gray-500 mt-1">Instructor: {enrollment.course.instructors.map(i => `${i.firstName} ${i.lastName}`).join(', ')}</p>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${enrollment.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                                            }`}>
                                            {enrollment.status}
                                        </span>
                                    </div>

                                    <div className="space-y-3">
                                        <div>
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="text-gray-600">Progress</span>
                                                <span className="font-medium text-gray-900">{enrollment.progress}%</span>
                                            </div>
                                            <div className="w-full bg-gray-100 rounded-full h-2">
                                                <div
                                                    className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                                                    style={{ width: `${enrollment.progress}%` }}
                                                ></div>
                                            </div>
                                        </div>

                                        <div className="flex justify-between items-center pt-2 border-t border-gray-50">
                                            <div className="text-sm">
                                                <span className="text-gray-500">Current Grade: </span>
                                                <span className="font-bold text-indigo-600">{enrollment.grade ? enrollment.grade : 'N/A'}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-10 bg-white rounded-2xl border border-gray-100 border-dashed">
                                <p className="text-gray-500">No courses enrolled yet.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar - Schedule & Assignments */}
                <div className="space-y-6">
                    {/* Upcoming Classes */}
                    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-indigo-600" />
                            Upcoming Classes
                        </h3>
                        <div className="space-y-4">
                            {upcomingClasses.length > 0 ? (
                                upcomingClasses.map((cls) => (
                                    <div key={cls.id} className="flex gap-4 items-start p-3 rounded-xl hover:bg-gray-50 transition-colors">
                                        <div className="text-center min-w-[3.5rem] bg-indigo-50 rounded-lg p-2">
                                            <div className="text-xs font-bold text-indigo-600 uppercase">
                                                {new Date(cls.startTime).toLocaleDateString('en-US', { weekday: 'short' })}
                                            </div>
                                            <div className="text-lg font-bold text-gray-900">
                                                {new Date(cls.startTime).getDate()}
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-gray-900 line-clamp-1">{cls.course.title}</h4>
                                            <p className="text-sm text-gray-500">
                                                {new Date(cls.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-gray-500 text-center py-4">No upcoming classes scheduled</p>
                            )}
                        </div>
                    </div>

                    {/* Due Assignments */}
                    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <AlertCircle className="w-5 h-5 text-orange-600" />
                            Due Soon
                        </h3>
                        <div className="space-y-3">
                            {assignments.length > 0 ? (
                                assignments.map((assignment) => (
                                    <div key={assignment.id} className="p-3 border border-gray-100 rounded-xl bg-gray-50/50">
                                        <h4 className="text-sm font-medium text-gray-900 line-clamp-1">{assignment.title}</h4>
                                        <div className="flex justify-between items-center mt-2 text-xs">
                                            <span className="text-gray-500">{assignment.course.title}</span>
                                            <span className="text-orange-600 font-medium">
                                                {new Date(assignment.dueDate).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-gray-500 text-center py-4">No pending assignments</p>
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ChildDetail;
