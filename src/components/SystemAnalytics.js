import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { analyticsAPI } from '../services/api';
import '../styles/system-analytics.css';

const SystemAnalytics = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [timeframe, setTimeframe] = useState('month'); // week, month, year
    const [analytics, setAnalytics] = useState({
        overview: {
            totalUsers: 0,
            totalCourses: 0,
            totalEnrollments: 0,
            activeUsers: 0,
            growthRate: 0
        },
        userActivity: {
            daily: [],
            weekly: [],
            monthly: []
        },
        courseStats: {
            published: 0,
            draft: 0,
            archived: 0,
            averageEnrollment: 0
        },
        enrollmentTrends: [],
        topCourses: [],
        recentActivity: []
    });

    useEffect(() => {
        fetchAnalytics();
    }, [timeframe]);

    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            setError('');

            const response = await analyticsAPI.getSystemAnalytics(timeframe);
            const data = response.data.data;

            setAnalytics({
                overview: data.overview,
                courseStats: data.courseStats,
                enrollmentTrends: data.enrollmentTrends,
                topCourses: data.topCourses,
                recentActivity: data.recentActivity
            });

            setLoading(false);
        } catch (err) {
            console.error('Error fetching analytics:', err);
            setError(err.response?.data?.message || 'Failed to load analytics data');
            setLoading(false);
        }
    };

    const formatNumber = (num) => {
        return num.toLocaleString();
    };

    const formatPercentage = (num) => {
        return `${num > 0 ? '+' : ''}${num.toFixed(1)}%`;
    };

    if (loading) {
        return (
            <div className="analytics-container">
                <div className="analytics-loading">
                    <div className="loading-spinner"></div>
                    <p>Loading analytics...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="analytics-container">
            {/* Header */}
            <div className="analytics-header">
                <div className="header-content">
                    <h1>📊 System Analytics</h1>
                    <p>Comprehensive insights into your learning management system</p>
                </div>
                <div className="header-actions">
                    <select
                        value={timeframe}
                        onChange={(e) => setTimeframe(e.target.value)}
                        className="timeframe-selector"
                    >
                        <option value="week">Last 7 Days</option>
                        <option value="month">Last 30 Days</option>
                        <option value="year">Last 12 Months</option>
                    </select>
                    <button className="btn btn-primary">
                        📥 Export Report
                    </button>
                </div>
            </div>

            {/* Overview Metrics */}
            <div className="metrics-grid">
                <div className="metric-card animate-slide-up" style={{ animationDelay: '0.1s' }}>
                    <div className="metric-icon users">👥</div>
                    <div className="metric-content">
                        <h3>{formatNumber(analytics.overview.totalUsers)}</h3>
                        <p>Total Users</p>
                        <span className="metric-change positive">
                            {formatPercentage(analytics.overview.growthRate)}
                        </span>
                    </div>
                </div>

                <div className="metric-card animate-slide-up" style={{ animationDelay: '0.2s' }}>
                    <div className="metric-icon courses">📚</div>
                    <div className="metric-content">
                        <h3>{formatNumber(analytics.overview.totalCourses)}</h3>
                        <p>Total Courses</p>
                        <span className="metric-change positive">+8.3%</span>
                    </div>
                </div>

                <div className="metric-card animate-slide-up" style={{ animationDelay: '0.3s' }}>
                    <div className="metric-icon enrollments">🎓</div>
                    <div className="metric-content">
                        <h3>{formatNumber(analytics.overview.totalEnrollments)}</h3>
                        <p>Total Enrollments</p>
                        <span className="metric-change positive">+15.7%</span>
                    </div>
                </div>

                <div className="metric-card animate-slide-up" style={{ animationDelay: '0.4s' }}>
                    <div className="metric-icon active">⚡</div>
                    <div className="metric-content">
                        <h3>{formatNumber(analytics.overview.activeUsers)}</h3>
                        <p>Active Users</p>
                        <span className="metric-change positive">+6.2%</span>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="charts-section">
                {/* Enrollment Trends */}
                <div className="chart-card animate-fade-in" style={{ animationDelay: '0.5s' }}>
                    <div className="chart-header">
                        <h3>📈 Enrollment Trends</h3>
                        <span className="chart-subtitle">Monthly growth overview</span>
                    </div>
                    <div className="chart-content">
                        <div className="bar-chart">
                            {analytics.enrollmentTrends.map((item, index) => {
                                const maxCount = Math.max(...analytics.enrollmentTrends.map(i => i.count));
                                const height = (item.count / maxCount) * 100;
                                return (
                                    <div key={index} className="bar-item">
                                        <div
                                            className="bar"
                                            style={{
                                                height: `${height}%`,
                                                animationDelay: `${0.6 + index * 0.1}s`
                                            }}
                                        >
                                            <span className="bar-value">{item.count}</span>
                                        </div>
                                        <span className="bar-label">{item.month}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Course Distribution */}
                <div className="chart-card animate-fade-in" style={{ animationDelay: '0.6s' }}>
                    <div className="chart-header">
                        <h3>📊 Course Distribution</h3>
                        <span className="chart-subtitle">By status</span>
                    </div>
                    <div className="chart-content">
                        <div className="donut-chart">
                            <div className="donut-segments">
                                <div className="donut-center">
                                    <h4>{analytics.courseStats.published + analytics.courseStats.draft + analytics.courseStats.archived}</h4>
                                    <p>Total</p>
                                </div>
                            </div>
                            <div className="donut-legend">
                                <div className="legend-item">
                                    <span className="legend-color published"></span>
                                    <span className="legend-label">Published</span>
                                    <span className="legend-value">{analytics.courseStats.published}</span>
                                </div>
                                <div className="legend-item">
                                    <span className="legend-color draft"></span>
                                    <span className="legend-label">Draft</span>
                                    <span className="legend-value">{analytics.courseStats.draft}</span>
                                </div>
                                <div className="legend-item">
                                    <span className="legend-color archived"></span>
                                    <span className="legend-label">Archived</span>
                                    <span className="legend-value">{analytics.courseStats.archived}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Top Courses */}
            <div className="top-courses-section animate-fade-in" style={{ animationDelay: '0.7s' }}>
                <div className="section-header">
                    <h3>🏆 Top Performing Courses</h3>
                    <Link to="/courses" className="view-all-link">View All →</Link>
                </div>
                <div className="courses-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Rank</th>
                                <th>Course Title</th>
                                <th>Enrollments</th>
                                <th>Rating</th>
                                <th>Performance</th>
                            </tr>
                        </thead>
                        <tbody>
                            {analytics.topCourses.map((course, index) => (
                                <tr key={index} className="table-row-animate" style={{ animationDelay: `${0.8 + index * 0.1}s` }}>
                                    <td>
                                        <div className="rank-badge">#{index + 1}</div>
                                    </td>
                                    <td className="course-title">{course.title}</td>
                                    <td>
                                        <span className="enrollment-count">{course.enrollments}</span>
                                    </td>
                                    <td>
                                        <div className="rating">
                                            <span className="star">⭐</span>
                                            <span>{course.rating}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="performance-bar">
                                            <div
                                                className="performance-fill"
                                                style={{ width: `${(course.rating / 5) * 100}%` }}
                                            ></div>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="recent-activity-section animate-fade-in" style={{ animationDelay: '0.9s' }}>
                <h3>🔔 Recent Activity</h3>
                <div className="activity-list">
                    {analytics.recentActivity.map((activity, index) => (
                        <div key={index} className="activity-item" style={{ animationDelay: `${1.0 + index * 0.1}s` }}>
                            <div className={`activity-icon ${activity.type}`}>
                                {activity.type === 'enrollment' && '🎓'}
                                {activity.type === 'course' && '📚'}
                                {activity.type === 'user' && '👤'}
                            </div>
                            <div className="activity-content">
                                <p>{activity.description}</p>
                                <span className="activity-time">{activity.time}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SystemAnalytics;
