import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    FileText,
    Clock,
    CheckCircle,
    AlertCircle,
    Calendar,
    Search,
    Filter,
    ChevronRight,
    Download
} from 'lucide-react';
import { assignmentAPI } from '../services/api';


const Assignments = () => {
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filter, setFilter] = useState('all'); // all, pending, submitted, graded

    useEffect(() => {
        fetchAssignments();
    }, []);

    const fetchAssignments = async () => {
        try {
            setLoading(true);
            const response = await assignmentAPI.getAssignments();
            setAssignments(response.data.data.assignments || []);
        } catch (err) {
            console.error('Error fetching assignments:', err);
            setError('Failed to load assignments');
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'published': return 'blue';
            case 'submitted': return 'green';
            case 'graded': return 'purple';
            case 'overdue': return 'red';
            default: return 'gray';
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <div className="min-h-screen bg-gray-50">


            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                >
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                                <FileText className="w-8 h-8 text-indigo-600" />
                                Assignments
                            </h1>
                            <p className="text-gray-500 mt-1">Manage and submit your coursework</p>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search assignments..."
                                    className="pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 w-full md:w-64"
                                />
                            </div>
                            <button className="p-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 text-gray-600">
                                <Filter className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        {[
                            { label: 'Pending', value: assignments.filter(a => a.status === 'published').length, color: 'blue', icon: Clock },
                            { label: 'Submitted', value: assignments.filter(a => a.status === 'submitted').length, color: 'green', icon: CheckCircle },
                            { label: 'Missing', value: assignments.filter(a => a.status === 'overdue').length, color: 'red', icon: AlertCircle },
                            { label: 'Total', value: assignments.length, color: 'purple', icon: FileText },
                        ].map((stat, idx) => (
                            <motion.div
                                key={idx}
                                variants={itemVariants}
                                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between"
                            >
                                <div>
                                    <p className="text-gray-500 text-sm font-medium">{stat.label}</p>
                                    <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                                </div>
                                <div className={`w-12 h-12 rounded-xl bg-${stat.color}-50 flex items-center justify-center text-${stat.color}-600`}>
                                    <stat.icon className="w-6 h-6" />
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Assignments List */}
                    <motion.div variants={itemVariants} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                        {loading ? (
                            <div className="p-12 flex justify-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                            </div>
                        ) : assignments.length > 0 ? (
                            <div className="divide-y divide-gray-100">
                                {assignments.map((assignment) => (
                                    <div key={assignment.id} className="p-6 hover:bg-gray-50 transition-colors group">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex gap-4">
                                                <div className={`w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center flex-shrink-0 text-indigo-600 group-hover:scale-110 transition-transform`}>
                                                    <FileText className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <h3 className="font-bold text-gray-900 text-lg group-hover:text-indigo-600 transition-colors">
                                                            {assignment.title}
                                                        </h3>
                                                        <span className={`px-2 py-0.5 rounded text-xs font-semibold bg-${getStatusColor(assignment.status)}-50 text-${getStatusColor(assignment.status)}-700 uppercase tracking-wide`}>
                                                            {assignment.status}
                                                        </span>
                                                    </div>
                                                    <p className="text-gray-500 line-clamp-2 mb-3">{assignment.description || 'No description provided.'}</p>

                                                    <div className="flex items-center gap-4 text-sm text-gray-500">
                                                        <span className="flex items-center gap-1.5">
                                                            <Calendar className="w-4 h-4" />
                                                            Due {new Date(assignment.dueDate).toLocaleDateString()}
                                                        </span>
                                                        <span className="flex items-center gap-1.5">
                                                            <Clock className="w-4 h-4" />
                                                            {new Date(assignment.dueDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </span>
                                                        {assignment.course && (
                                                            <span className="flex items-center gap-1.5 px-2 py-0.5 bg-gray-100 rounded text-gray-600">
                                                                {assignment.course.title}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <button className="hidden sm:flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl font-medium hover:bg-indigo-100 transition-colors whitespace-nowrap">
                                                View Details
                                                <ChevronRight className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-12 text-center text-gray-500">
                                <FileText className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                                <h3 className="text-lg font-medium text-gray-900">No assignments found</h3>
                                <p>You're all caught up! Check back later for new tasks.</p>
                            </div>
                        )}
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
};

export default Assignments;
