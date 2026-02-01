import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Save, CheckCircle, XCircle, Clock, ArrowLeft } from 'lucide-react';
import { LoadingSpinner } from '../ui/AnimatedComponents';
import api from '../../services/api';

const ClassAttendance = () => {
    const { classId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [classData, setClassData] = useState(null);
    const [roster, setRoster] = useState([]);
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [successMsg, setSuccessMsg] = useState('');

    useEffect(() => {
        fetchRoster();
    }, [classId, date]);

    const fetchRoster = async () => {
        try {
            setLoading(true);
            const response = await api.get(`/attendance/class/${classId}/roster?date=${date}`);
            if (response.data.success) {
                setClassData(response.data.data.class);
                // Initialize roster state with existing attendance or default 'present'
                const rosterList = response.data.data.roster || [];
                const rosterData = rosterList.map(item => ({
                    studentId: item.student.id,
                    student: item.student,
                    status: item.attendance ? item.attendance.status : '', // Empty initially if not taken
                    notes: item.attendance ? item.attendance.notes : ''
                }));
                setRoster(rosterData);
            }
        } catch (error) {
            console.error('Failed to fetch roster:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = (studentId, status) => {
        setRoster(prev => prev.map(student =>
            student.studentId === studentId ? { ...student, status } : student
        ));
    };

    const handleNotesChange = (studentId, notes) => {
        setRoster(prev => prev.map(student =>
            student.studentId === studentId ? { ...student, notes } : student
        ));
    };

    const markAll = (status) => {
        setRoster(prev => prev.map(student => ({ ...student, status })));
    };

    const saveAttendance = async () => {
        try {
            setSaving(true);
            // Filter out students with no status selected
            const attendanceData = roster
                .filter(r => r.status)
                .map(r => ({
                    studentId: r.studentId,
                    status: r.status,
                    notes: r.notes
                }));

            if (attendanceData.length === 0) {
                alert('Please mark attendance for at least one student.');
                setSaving(false);
                return;
            }

            const response = await api.post('/attendance/mark/bulk', {
                classId,
                attendanceData
            });

            if (response.data.success) {
                setSuccessMsg('Attendance saved successfully!');
                setTimeout(() => setSuccessMsg(''), 3000);
            }
        } catch (error) {
            console.error('Failed to save attendance:', error);
            alert('Failed to save attendance.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="p-6 max-w-5xl mx-auto">
            <button onClick={() => navigate('/teacher/classes')} className="flex items-center text-gray-600 hover:text-emerald-600 mb-6 transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Classes
            </button>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-100 bg-emerald-50/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-1">{classData?.title}</h1>
                        <div className="flex items-center text-gray-500 text-sm">
                            <Calendar className="w-4 h-4 mr-2" />
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="bg-transparent border-none p-0 focus:ring-0 text-gray-600 font-medium cursor-pointer"
                            />
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <button onClick={() => markAll('present')} className="px-3 py-1.5 text-xs font-medium bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition-colors">
                            Mark All Present
                        </button>
                        <button onClick={() => markAll('absent')} className="px-3 py-1.5 text-xs font-medium bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors">
                            Mark All Absent
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-4">Student</th>
                                <th className="px-6 py-4 text-center">Status</th>
                                <th className="px-6 py-4">Notes</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {roster.map((student) => (
                                <tr key={student.studentId} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            <div className="h-10 w-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold mr-3">
                                                {student.student.avatar ? (
                                                    <img src={student.student.avatar} alt="" className="h-10 w-10 rounded-full object-cover" />
                                                ) : (
                                                    `${student.student.firstName[0]}${student.student.lastName[0]}`
                                                )}
                                            </div>
                                            <div>
                                                <div className="font-medium text-gray-900">{student.student.firstName} {student.student.lastName}</div>
                                                <div className="text-xs text-gray-500">{student.student.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex justify-center gap-2">
                                            <StatusButton
                                                status="present"
                                                current={student.status}
                                                onClick={() => handleStatusChange(student.studentId, 'present')}
                                                icon={CheckCircle}
                                                color="emerald"
                                            />
                                            <StatusButton
                                                status="late"
                                                current={student.status}
                                                onClick={() => handleStatusChange(student.studentId, 'late')}
                                                icon={Clock}
                                                color="yellow"
                                            />
                                            <StatusButton
                                                status="absent"
                                                current={student.status}
                                                onClick={() => handleStatusChange(student.studentId, 'absent')}
                                                icon={XCircle}
                                                color="red"
                                            />
                                            <StatusButton
                                                status="excused"
                                                current={student.status}
                                                onClick={() => handleStatusChange(student.studentId, 'excused')}
                                                label="Excused"
                                                color="blue"
                                            />
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <input
                                            type="text"
                                            value={student.notes || ''}
                                            onChange={(e) => handleNotesChange(student.studentId, e.target.value)}
                                            placeholder="Add note..."
                                            className="w-full text-sm border-gray-200 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                                        />
                                    </td>
                                </tr>
                            ))}
                            {roster.length === 0 && (
                                <tr>
                                    <td colSpan="3" className="px-6 py-8 text-center text-gray-500">
                                        No students found enrolled in this class's course.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end items-center gap-4">
                    {successMsg && <span className="text-emerald-600 font-medium animate-fade-in">{successMsg}</span>}
                    <button
                        onClick={saveAttendance}
                        disabled={saving}
                        className="flex items-center px-6 py-2.5 bg-emerald-600 text-white rounded-xl shadow-lg shadow-emerald-200 hover:bg-emerald-700 hover:scale-105 active:scale-95 transition-all disabled:opacity-70 disabled:hover:scale-100"
                    >
                        {saving ? <LoadingSpinner size="sm" color="white" /> : <><Save className="w-4 h-4 mr-2" /> Save Attendance</>}
                    </button>
                </div>
            </div>
        </div>
    );
};

const StatusButton = ({ status, current, onClick, icon: Icon, color, label }) => {
    const isSelected = current === status;
    const colors = {
        emerald: 'text-emerald-600 bg-emerald-50 border-emerald-200 hover:bg-emerald-100',
        activeEmerald: 'bg-emerald-600 text-white border-emerald-600',
        red: 'text-red-600 bg-red-50 border-red-200 hover:bg-red-100',
        activeRed: 'bg-red-600 text-white border-red-600',
        yellow: 'text-yellow-600 bg-yellow-50 border-yellow-200 hover:bg-yellow-100',
        activeYellow: 'bg-yellow-500 text-white border-yellow-500',
        blue: 'text-blue-600 bg-blue-50 border-blue-200 hover:bg-blue-100',
        activeBlue: 'bg-blue-600 text-white border-blue-600',
    };

    const baseClass = `flex items-center justify-center p-2 rounded-lg border transition-all ${isSelected ? colors[`active${color.charAt(0).toUpperCase() + color.slice(1)}`] : colors[color]}`;

    return (
        <button onClick={onClick} className={baseClass} title={status.charAt(0).toUpperCase() + status.slice(1)}>
            {Icon ? <Icon className="w-5 h-5" /> : <span className="text-xs font-bold px-1">{label || status}</span>}
        </button>
    );
};

export default ClassAttendance;
