import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  User,
  Mail,
  Phone,
  Calendar,
  LogOut,
  Camera,
  Edit2,
  Clock
} from 'lucide-react';


const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = React.useRef(null);
  const [profileImage, setProfileImage] = React.useState(null);
  const [isHovering, setIsHovering] = React.useState(false);

  React.useEffect(() => {
    // Load saved profile image from localStorage
    if (user) {
      const savedImage = localStorage.getItem(`profile_img_${user._id || 'user'}`);
      if (savedImage) {
        setProfileImage(savedImage);
      }
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert("File size should be less than 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setProfileImage(base64String);
        // Save to localStorage to persist
        if (user) {
          localStorage.setItem(`profile_img_${user._id || 'user'}`, base64String);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8">
          <p className="text-lg text-gray-600 mb-4">Please log in to view your profile.</p>
          <button onClick={() => navigate('/login')} className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700">
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-xl overflow-hidden"
        >
          {/* Header Gradient */}
          <div className="h-48 bg-gradient-to-r from-emerald-600 to-teal-700 relative">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="absolute top-0 right-0 p-6">
              <button
                onClick={handleLogout}
                className="bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-xl font-medium hover:bg-white/30 transition-colors flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>

            {/* Decorative circles */}
            <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            <div className="absolute bottom-10 right-20 w-40 h-40 bg-teal-300/20 rounded-full blur-2xl"></div>
          </div>

          <div className="relative px-8 pb-12">
            {/* Profile Image - Overlapping Header */}
            <div className="relative -mt-20 mb-8 flex flex-col sm:flex-row items-end sm:items-end gap-6">
              <div
                className="relative group cursor-pointer"
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
                onClick={triggerFileInput}
              >
                <div className="w-40 h-40 rounded-full border-4 border-white shadow-2xl overflow-hidden bg-gray-100 relative z-10">
                  {profileImage ? (
                    <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-emerald-100 text-emerald-600">
                      <span className="text-4xl font-bold">{user.firstName?.[0]}{user.lastName?.[0]}</span>
                    </div>
                  )}

                  {/* Overlay */}
                  <div className={`absolute inset-0 bg-black/50 flex items-center justify-center transition-opacity duration-200 ${isHovering ? 'opacity-100' : 'opacity-0'}`}>
                    <Camera className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div className="absolute bottom-2 right-2 z-20 bg-white p-2 rounded-full shadow-lg text-gray-600 group-hover:text-emerald-600 transition-colors">
                  <Edit2 className="w-4 h-4" />
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                />
              </div>

              <div className="flex-1 pb-4 text-center sm:text-left">
                <h1 className="text-3xl font-bold text-gray-900">{user.firstName} {user.lastName}</h1>
                <p className="text-emerald-600 font-medium capitalize mt-1 flex items-center justify-center sm:justify-start gap-2">
                  <span className="px-3 py-1 bg-emerald-100 rounded-full text-sm">
                    {user.role}
                  </span>
                </p>
              </div>
            </div>

            {/* Profile Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <User className="w-5 h-5 text-emerald-600" />
                    Personal Information
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs text-gray-500 uppercase font-semibold">Email Address</label>
                      <p className="text-gray-900 font-medium flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        {user.email}
                      </p>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 uppercase font-semibold">Phone Number</label>
                      <p className="text-gray-900 font-medium flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        {user.phone || 'Not provided'}
                      </p>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 uppercase font-semibold">Date of Birth</label>
                      <p className="text-gray-900 font-medium flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        {user.dateOfBirth || 'Not provided'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-emerald-600" />
                    Account Activity
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs text-gray-500 uppercase font-semibold">Member Since</label>
                      <p className="text-gray-900 font-medium">January 2024</p>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 uppercase font-semibold">Last Login</label>
                      <p className="text-gray-900 font-medium">{new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}</p>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 uppercase font-semibold">Account Status</label>
                      <p className="text-emerald-600 font-bold flex items-center gap-1">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                        Active
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100">
                  <h3 className="font-semibold text-emerald-900 mb-2">Need Help?</h3>
                  <p className="text-emerald-700 text-sm mb-4">You can update your profile details by contacting the school administration.</p>
                  <button className="text-emerald-600 font-semibold text-sm hover:underline">Contact Support &rarr;</button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
