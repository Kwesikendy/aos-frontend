import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Mail, BookOpen, Search, User } from 'lucide-react';
import { userAPI } from '../../services/api';
import { LoadingSpinner } from '../ui/AnimatedComponents';

const TeacherStudents = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            setLoading(true);
            const response = await userAPI.getMyStudents();
            if (response.data.success) {
                setStudents(response.data.data.students || []);
            }
        } catch (error) {
            console.error('Failed to fetch students:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredStudents = students.filter(student =>
        student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <motion.div
            className="p-6 max-w-7xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                        <Users className="w-8 h-8 text-emerald-600" />
                        My Students
                    </h1>
                    <p className="text-gray-500 mt-1">Directory of students enrolled in your courses</p>
                </div>

                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search students..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none w-64"
                    />
                </div>
            </div>

            {loading ? (
                <LoadingSpinner />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredStudents.length > 0 ? (
                        filteredStudents.map((student) => (
                            <motion.div
                                key={student.id}
                                whileHover={{ y: -4 }}
                                className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all"
                            >
                                <div className="flex items-center gap-4 mb-4">
                                    {student.avatar ? (
                                        <img src={student.avatar} alt={student.firstName} className="w-16 h-16 rounded-full object-cover border-2 border-emerald-100" />
                                    ) : (
                                        <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 border-2 border-emerald-50">
                                            <User className="w-8 h-8" />
                                        </div>
                                    )}
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900">{student.firstName} {student.lastName}</h3>
                                        <p className="text-sm text-gray-500 flex items-center gap-1">
                                            <Mail className="w-3 h-3" /> {student.email}
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Enrolled Courses</h4>
                                    {student.courses && student.courses.map(course => (
                                        <div key={course.id} className="bg-gray-50 p-3 rounded-lg flex justify-between items-center">
                                            <span className="text-sm font-medium text-gray-800">{course.title}</span>
                                            <span className="text-xs font-bold text-emerald-600">{course.progress}%</span>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-12 bg-gray-50 rounded-2xl">
                            <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900">No students found</h3>
                            <p className="text-gray-500">Try adjusting your search terms.</p>
                        </div>
                    )}
                </div>
            )}
        </motion.div>
    );
};

export default TeacherStudents;
