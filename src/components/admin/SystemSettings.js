import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Settings,
    Save,
    Globe,
    Shield,
    Bell,
    Palette,
    CheckCircle,
    AlertCircle
} from 'lucide-react';
import { settingsAPI } from '../../services/api';

const SystemSettings = () => {
    const [settings, setSettings] = useState({
        general: {},
        registration: {},
        appearance: {},
        notifications: {}
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [activeTab, setActiveTab] = useState('general');

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            setLoading(true);
            const response = await settingsAPI.getSettings();
            setSettings(response.data.data || {});
        } catch (err) {
            console.error('Error fetching settings:', err);
            setError('Failed to load settings');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (section, field, value) => {
        setSettings(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value
            }
        }));
        // Clear messages on edit
        if (success) setSuccess('');
        if (error) setError('');
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            setError('');
            setSuccess('');

            await settingsAPI.updateSettings(settings);
            setSuccess('Settings saved successfully');

            // Auto dismiss success message
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            console.error('Error saving settings:', err);
            setError('Failed to save settings');
        } finally {
            setSaving(false);
        }
    };

    const tabs = [
        { id: 'general', label: 'General', icon: Globe },
        { id: 'registration', label: 'Registration & Security', icon: Shield },
        { id: 'appearance', label: 'Appearance', icon: Palette },
        { id: 'notifications', label: 'Notifications', icon: Bell },
    ];

    return (
        <div className="p-6 md:p-8 max-w-5xl mx-auto w-full">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <Settings className="w-8 h-8 text-primary-600" />
                        System Settings
                    </h1>
                    <p className="text-gray-500 mt-1">Configure global application preferences</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving || loading}
                    className="flex items-center gap-2 px-6 py-2 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {saving ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                        <Save className="w-5 h-5" />
                    )}
                    Save Changes
                </button>
            </div>

            {/* Messages */}
            <AnimatePresence>
                {success && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="mb-6 p-4 bg-green-50 text-green-700 rounded-xl flex items-center gap-2 border border-green-100"
                    >
                        <CheckCircle className="w-5 h-5" />
                        {success}
                    </motion.div>
                )}
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl flex items-center gap-2 border border-red-100"
                    >
                        <AlertCircle className="w-5 h-5" />
                        {error}
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="flex flex-col md:flex-row gap-8">
                {/* Sidebar Navigation */}
                <div className="w-full md:w-64 flex-shrink-0">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors font-medium border-l-4 ${activeTab === tab.id
                                    ? 'bg-indigo-50 text-indigo-700 border-indigo-600'
                                    : 'text-gray-600 hover:bg-gray-50 border-transparent'
                                    }`}
                            >
                                <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? 'text-indigo-600' : 'text-gray-400'}`} />
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8">
                    {loading ? (
                        <div className="flex justify-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                        </div>
                    ) : (
                        <div className="space-y-6">

                            {/* General Settings */}
                            {activeTab === 'general' && (
                                <div className="space-y-6">
                                    <h2 className="text-xl font-bold text-gray-900 border-b pb-2">General Information</h2>

                                    <div className="grid gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">School Name</label>
                                            <input
                                                type="text"
                                                value={settings.general?.schoolName || ''}
                                                onChange={(e) => handleChange('general', 'schoolName', e.target.value)}
                                                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                                            />
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Website URL</label>
                                                <input
                                                    type="url"
                                                    value={settings.general?.website || ''}
                                                    onChange={(e) => handleChange('general', 'website', e.target.value)}
                                                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Phone</label>
                                                <input
                                                    type="tel"
                                                    value={settings.general?.phone || ''}
                                                    onChange={(e) => handleChange('general', 'phone', e.target.value)}
                                                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email</label>
                                            <input
                                                type="email"
                                                value={settings.general?.contactEmail || ''}
                                                onChange={(e) => handleChange('general', 'contactEmail', e.target.value)}
                                                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                                            <textarea
                                                rows="3"
                                                value={settings.general?.address || ''}
                                                onChange={(e) => handleChange('general', 'address', e.target.value)}
                                                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 resize-none"
                                            ></textarea>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Registration Settings */}
                            {activeTab === 'registration' && (
                                <div className="space-y-6">
                                    <h2 className="text-xl font-bold text-gray-900 border-b pb-2">Registration & Policies</h2>

                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                                            <div>
                                                <h4 className="font-semibold text-gray-900">Allow Student Registration</h4>
                                                <p className="text-sm text-gray-500">Enable public registration page for new students</p>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    className="sr-only peer"
                                                    checked={settings.registration?.allowStudentRegistration || false}
                                                    onChange={(e) => handleChange('registration', 'allowStudentRegistration', e.target.checked)}
                                                />
                                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                                            </label>
                                        </div>

                                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                                            <div>
                                                <h4 className="font-semibold text-gray-900">Allow Teacher Registration</h4>
                                                <p className="text-sm text-gray-500">Careful: New accounts will have teacher privileges</p>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    className="sr-only peer"
                                                    checked={settings.registration?.allowTeacherRegistration || false}
                                                    onChange={(e) => handleChange('registration', 'allowTeacherRegistration', e.target.checked)}
                                                />
                                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                                            </label>
                                        </div>

                                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                                            <div>
                                                <h4 className="font-semibold text-gray-900">Require Email Verification</h4>
                                                <p className="text-sm text-gray-500">Users must verify email before accessing dashboard</p>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    className="sr-only peer"
                                                    checked={settings.registration?.requireEmailVerification || false}
                                                    onChange={(e) => handleChange('registration', 'requireEmailVerification', e.target.checked)}
                                                />
                                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Notification Settings */}
                            {activeTab === 'notifications' && (
                                <div className="space-y-6">
                                    <h2 className="text-xl font-bold text-gray-900 border-b pb-2">Notification Preferences</h2>

                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                                            <div>
                                                <h4 className="font-semibold text-gray-900">Email Notifications</h4>
                                                <p className="text-sm text-gray-500">Send automated emails for assignments, grades, etc.</p>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    className="sr-only peer"
                                                    checked={settings.notifications?.emailEnabled || false}
                                                    onChange={(e) => handleChange('notifications', 'emailEnabled', e.target.checked)}
                                                />
                                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                                            </label>
                                        </div>

                                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 opacity-60 cursor-not-allowed">
                                            <div>
                                                <h4 className="font-semibold text-gray-900">SMS Notifications (Coming Soon)</h4>
                                                <p className="text-sm text-gray-500">Send text message alerts to users</p>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer pointer-events-none">
                                                <input type="checkbox" className="sr-only peer" disabled />
                                                <div className="w-11 h-6 bg-gray-200 rounded-full peer after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5"></div>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Appearance Settings */}
                            {activeTab === 'appearance' && (
                                <div className="space-y-6">
                                    <h2 className="text-xl font-bold text-gray-900 border-b pb-2">Visual Customization</h2>

                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Primary Color</label>
                                            <div className="flex items-center gap-4">
                                                <input
                                                    type="color"
                                                    value={settings.appearance?.primaryColor || '#4F46E5'}
                                                    onChange={(e) => handleChange('appearance', 'primaryColor', e.target.value)}
                                                    className="w-12 h-12 rounded-lg border border-gray-200 cursor-pointer"
                                                />
                                                <div className="flex-1">
                                                    <input
                                                        type="text"
                                                        value={settings.appearance?.primaryColor || '#4F46E5'}
                                                        onChange={(e) => handleChange('appearance', 'primaryColor', e.target.value)}
                                                        className="uppercase w-32 px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                                                    />
                                                    <p className="text-sm text-gray-500 mt-1">Main brand color used for buttons and key elements</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid md:grid-cols-3 gap-4">
                                            {['light', 'dark', 'system'].map((theme) => (
                                                <label
                                                    key={theme}
                                                    className={`cursor-pointer relative p-4 rounded-xl border-2 transition-all ${(settings.appearance?.theme || 'light') === theme
                                                        ? 'border-primary-600 bg-primary-50'
                                                        : 'border-gray-100 hover:border-gray-200 bg-gray-50'
                                                        }`}
                                                >
                                                    <input
                                                        type="radio"
                                                        name="theme"
                                                        value={theme}
                                                        checked={(settings.appearance?.theme || 'light') === theme}
                                                        onChange={(e) => handleChange('appearance', 'theme', e.target.value)}
                                                        className="sr-only"
                                                    />
                                                    <div className="text-center">
                                                        <div className={`w-full h-24 mb-3 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : theme === 'light' ? 'bg-white border border-gray-200' : 'bg-gradient-to-br from-white to-gray-800 border border-gray-200'
                                                            }`}></div>
                                                        <span className="font-medium capitalize text-gray-900">{theme} Mode</span>
                                                    </div>
                                                </label>
                                            ))}
                                        </div>

                                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                                            <div>
                                                <h4 className="font-semibold text-gray-900">Show Branding</h4>
                                                <p className="text-sm text-gray-500">Display "Powered by AcademyOS" in footer</p>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    className="sr-only peer"
                                                    checked={settings.appearance?.showBranding !== false} // Default true
                                                    onChange={(e) => handleChange('appearance', 'showBranding', e.target.checked)}
                                                />
                                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                                            </label>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Logo URL (Optional)</label>
                                            <input
                                                type="url"
                                                placeholder="https://example.com/logo.png"
                                                value={settings.appearance?.logoUrl || ''}
                                                onChange={(e) => handleChange('appearance', 'logoUrl', e.target.value)}
                                                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                                            />
                                            <p className="text-sm text-gray-500 mt-1">Enter a direct link to your school's logo image</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SystemSettings;
