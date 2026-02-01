import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, ChevronLeft, ChevronRight, Clock, MapPin, Video, Users, Plus } from 'lucide-react';
import { classAPI, courseAPI, adminAPI } from '../../services/api';
import ClassCreate from '../ClassCreate'; // Reusing the create modal/component if adaptable, or building simplified modal

const AdminTimetable = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);

    useEffect(() => {
        fetchWeekSchedule();
    }, [currentDate]);

    const fetchWeekSchedule = async () => {
        setLoading(true);
        try {
            // Calculate start/end of week
            const start = getStartOfWeek(currentDate);
            const end = new Date(start);
            end.setDate(end.getDate() + 6);

            // In a real app, we'd filter by date range API. 
            // For now, fetching all (or assume API supports range) and filtering client side if needed
            // Currently classAPI.getClasses() gets all for admin probably.
            const response = await classAPI.getClasses();
            const allClasses = response.data.data.classes || [];

            // Filter for this week
            const weekClasses = allClasses.filter(c => {
                const cDate = new Date(c.startTime);
                return cDate >= start && cDate <= end;
            });

            setClasses(weekClasses);
        } catch (error) {
            console.error("Failed to fetch schedule", error);
        } finally {
            setLoading(false);
        }
    };

    const getStartOfWeek = (date) => {
        const d = new Date(date);
        const day = d.getDay();
        const diff = d.getDate() - day; // Adjust for Sunday start
        return new Date(d.setDate(diff));
    };

    const nextWeek = () => {
        const d = new Date(currentDate);
        d.setDate(d.getDate() + 7);
        setCurrentDate(d);
    };

    const prevWeek = () => {
        const d = new Date(currentDate);
        d.setDate(d.getDate() - 7);
        setCurrentDate(d);
    };

    const weekStart = getStartOfWeek(currentDate);
    const weekDays = [...Array(7)].map((_, i) => {
        const d = new Date(weekStart);
        d.setDate(d.getDate() + i);
        return d;
    });

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Class Timetable</h1>
                        <p className="text-gray-500">Manage schedules and notify teachers</p>
                    </div>
                    <div className="flex gap-4">
                        <div className="flex items-center bg-white rounded-lg shadow-sm border border-gray-200 p-1">
                            <button onClick={prevWeek} className="p-2 hover:bg-gray-50 rounded-md"><ChevronLeft className="w-5 h-5 text-gray-600" /></button>
                            <span className="px-4 font-medium text-gray-700">
                                {weekStart.toLocaleDateString()} - {new Date(weekDays[6]).toLocaleDateString()}
                            </span>
                            <button onClick={nextWeek} className="p-2 hover:bg-gray-50 rounded-md"><ChevronRight className="w-5 h-5 text-gray-600" /></button>
                        </div>
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-indigo-700 transition-colors"
                        >
                            <Plus className="w-5 h-5" />
                            Schedule Class
                        </button>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="grid grid-cols-7 border-b border-gray-200">
                        {weekDays.map((day, i) => (
                            <div key={i} className={`p-4 text-center border-r border-gray-100 last:border-0 ${day.toDateString() === new Date().toDateString() ? 'bg-indigo-50' : ''}`}>
                                <p className="text-xs font-semibold text-gray-500 uppercase">{day.toLocaleDateString('en-US', { weekday: 'short' })}</p>
                                <p className="text-lg font-bold text-gray-900">{day.getDate()}</p>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-7 min-h-[600px] divide-x divide-gray-100">
                        {weekDays.map((day, colIndex) => {
                            const dayClasses = classes.filter(c => new Date(c.startTime).toDateString() === day.toDateString());
                            dayClasses.sort((a, b) => new Date(a.startTime) - new Date(b.startTime));

                            return (
                                <div key={colIndex} className="p-2 space-y-2">
                                    {dayClasses.map(cls => (
                                        <div key={cls.id} className="bg-indigo-50 border border-indigo-100 p-3 rounded-lg text-sm hover:shadow-md transition-shadow cursor-pointer">
                                            <p className="font-bold text-indigo-900 truncate">{cls.title}</p>
                                            <p className="text-indigo-700 text-xs mb-2">{new Date(cls.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                            <div className="flex items-center gap-1 text-xs text-indigo-600 mb-1">
                                                <Users className="w-3 h-3" />
                                                <span>{cls.instructor?.firstName} {cls.instructor?.lastName}</span>
                                            </div>
                                            {cls.isOnline && (
                                                <div className="flex items-center gap-1 text-xs text-indigo-600">
                                                    <Video className="w-3 h-3" />
                                                    <span>Online</span>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                    {dayClasses.length === 0 && (
                                        <div className="h-full flex items-center justify-center p-4">
                                            {/* Empty slot placeholder */}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Modal for Creating Class - We can reuse ClassCreate by navigation or embedding */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative">
                        <button
                            onClick={() => { setShowCreateModal(false); fetchWeekSchedule(); }}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                        >
                            ✕
                        </button>
                        <div className="p-6">
                            <h2 className="text-xl font-bold mb-4">Schedule New Class</h2>
                            {/* We will route to the class create component or embed it slightly modified. 
                                For simplicity, we can link to the page, but embedding provides better UX.
                                Let's assume we render a simplified form or the standard ClassCreate here.
                            */}
                            <div className="text-center py-8">
                                <p className="mb-4 text-gray-600">Redirecting to schedule form...</p>
                                {/* Actual implementation: Reset window location or use Router to navigate while keeping state? 
                                    Better: Simple navigation for now.
                                */}
                                <a href="/classes/create" className="text-indigo-600 font-medium hover:underline">Go to Scheduling Form</a>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminTimetable;
