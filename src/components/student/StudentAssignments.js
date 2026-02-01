import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Clock, CheckCircle, AlertCircle, Calendar, ChevronRight } from 'lucide-react';
import { assignmentAPI } from '../../services/api';

const StudentAssignments = () => {
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchAssignments();
    }, []);

    const fetchAssignments = async () => {
        try {
            const response = await assignmentAPI.getAssignments();
            if (response.data.success) {
                setAssignments(response.data.data.assignments || []);
            }
        } catch (err) {
            console.error('Error fetching assignments:', err);
            setError('Failed to load your assignments.');
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status, dueDate) => {
        if (status === 'submitted') return 'green';
        if (new Date(dueDate) < new Date() && status !== 'submitted') return 'red';
        return 'blue';
    };

    const getStatusLabel = (status, dueDate) => {
        if (status === 'submitted') return 'Submitted';
        if (new Date(dueDate) < new Date() && status !== 'submitted') return 'Overdue';
        return 'Pending';
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">My Assignments</h1>
                        <p className="text-gray-500 mt-1">Track your pending and completed work</p>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-700 p-4 rounded-xl mb-6">
                        {error}
                        <button onClick={fetchAssignments} className="ml-2 underline font-medium">Retry</button>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm font-medium">Pending</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">
                                {assignments.filter(a => new Date(a.dueDate) > new Date() && a.status !== 'submitted').length}
                            </p>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                            <Clock className="w-6 h-6" />
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm font-medium">Submitted</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">
                                {assignments.filter(a => a.status === 'submitted').length}
                            </p>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-green-600">
                            <CheckCircle className="w-6 h-6" />
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm font-medium">Overdue</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">
                                {assignments.filter(a => new Date(a.dueDate) < new Date() && a.status !== 'submitted').length}
                            </p>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center text-red-600">
                            <AlertCircle className="w-6 h-6" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                    {assignments.length > 0 ? (
                        <div className="divide-y divide-gray-100">
                            {assignments.map((assignment) => {
                                const statusColor = getStatusColor(assignment.status, assignment.dueDate);
                                const statusLabel = getStatusLabel(assignment.status, assignment.dueDate);

                                return (
                                    <div key={assignment.id} className="p-6 hover:bg-gray-50 transition-colors group">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex gap-4">
                                                <div className={`w-12 h-12 rounded-xl bg-${statusColor}-50 flex items-center justify-center flex-shrink-0 text-${statusColor}-600`}>
                                                    <FileText className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <h3 className="font-bold text-gray-900 text-lg">
                                                            {assignment.title}
                                                        </h3>
                                                        <span className={`px-2 py-0.5 rounded text-xs font-semibold bg-${statusColor}-50 text-${statusColor}-700 uppercase tracking-wide`}>
                                                            {statusLabel}
                                                        </span>
                                                    </div>
                                                    <p className="text-gray-500 line-clamp-1 mb-2">{assignment.description || 'No description provided.'}</p>
                                                    <div className="flex items-center gap-4 text-sm text-gray-500">
                                                        <span className="flex items-center gap-1.5">
                                                            <Calendar className="w-4 h-4" />
                                                            Due {new Date(assignment.dueDate).toLocaleDateString()}
                                                        </span>
                                                        {assignment.course && (
                                                            <span className="flex items-center gap-1.5 px-2 py-0.5 bg-gray-100 rounded text-gray-600">
                                                                {assignment.course.title}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <button className="hidden sm:flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl font-medium hover:bg-indigo-100 transition-colors">
                                                View
                                                <ChevronRight className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="p-12 text-center text-gray-500">
                            <FileText className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                            <h3 className="text-lg font-medium text-gray-900">No assignments found</h3>
                            <p>You have no pending assignments right now.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StudentAssignments;
