import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const Profile: React.FC = () => {
  const { user, assignRole } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingRole, setIsEditingRole] = useState(false);
  const [selectedRole, setSelectedRole] = useState(user?.role || '');
  const [profileImage, setProfileImage] = useState<string | null>(
    localStorage.getItem(`profileImage_${user?.email}`) || null
  );
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    phone: '',
    designation: '',
    department: '',
  });

  // List of authorized admin emails
  const ADMIN_EMAILS = [
    'admin@adharshgram.in',
    'admin123@adharshgram.in',
    'yakkalasunayana1605@gmail.com',
  ];

  const isAdminEmail = ADMIN_EMAILS.includes(user?.email || '');

  // Get initials from username
  const getInitials = (name: string) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
    }
    return name.charAt(0).toUpperCase();
  };

  // Generate consistent color based on username
  const getAvatarColor = (name: string) => {
    const colors = [
      'from-blue-600 to-blue-800',
      'from-green-600 to-green-800',
      'from-purple-600 to-purple-800',
      'from-red-600 to-red-800',
      'from-yellow-600 to-yellow-800',
      'from-pink-600 to-pink-800',
      'from-indigo-600 to-indigo-800',
      'from-gray-700 to-gray-900',
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageData = reader.result as string;
        setProfileImage(imageData);
        localStorage.setItem(`profileImage_${user?.email}`, imageData);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setProfileImage(null);
    localStorage.removeItem(`profileImage_${user?.email}`);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = () => {
    // In a real app, this would save to backend/localStorage
    setIsEditing(false);
    // Show success message
    alert('Profile updated successfully!');
  };

  const handleRoleChange = () => {
    if (selectedRole === 'admin' && !isAdminEmail) {
      alert('You are not authorized to assign yourself the admin role.');
      return;
    }
    assignRole(selectedRole);
    setIsEditingRole(false);
    alert('Role updated successfully!');
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role?.toLowerCase()) {
      case 'admin':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'coordinator':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'assessor':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'viewer':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRoleDescription = (role: string) => {
    switch (role?.toLowerCase()) {
      case 'admin':
        return 'Full system access with administrative privileges';
      case 'coordinator':
        return 'Can manage projects and coordinate village activities';
      case 'assessor':
        return 'Can conduct assessments and submit reports';
      case 'viewer':
        return 'Read-only access to view data and reports';
      default:
        return 'User role';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-gray-200 pb-6">
        <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
        <p className="text-gray-600 mt-2 text-lg">
          Manage your account information and preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Summary Card */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
            <div className="text-center">
              {/* Avatar */}
              <div className="relative inline-block">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="w-24 h-24 rounded-full object-cover mx-auto mb-4 shadow-lg border-4 border-white"
                  />
                ) : (
                  <div className={`w-24 h-24 bg-gradient-to-br ${getAvatarColor(user?.username || 'User')} rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                    <span className="text-white font-bold text-3xl">
                      {getInitials(user?.username || 'User')}
                    </span>
                  </div>
                )}
                
                {/* Edit Photo Button */}
                <div className="absolute bottom-3 right-0 left-0 flex justify-center space-x-2">
                  <label
                    htmlFor="profile-upload"
                    className="bg-white border-2 border-gray-300 rounded-full p-1.5 cursor-pointer hover:bg-gray-50 transition-colors shadow-lg"
                    title="Upload Photo"
                  >
                    <svg className="h-4 w-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <input
                      id="profile-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                  
                  {profileImage && (
                    <button
                      onClick={handleRemoveImage}
                      className="bg-white border-2 border-red-300 rounded-full p-1.5 hover:bg-red-50 transition-colors shadow-lg"
                      title="Remove Photo"
                    >
                      <svg className="h-4 w-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>

              {/* User Info */}
              <h2 className="text-xl font-bold text-gray-900 mb-1">
                {user?.username || 'User'}
              </h2>
              <p className="text-sm text-gray-500 mb-4">{user?.email || 'user@example.com'}</p>

              {/* Role Badge */}
              <div className="inline-flex items-center space-x-2">
                <span
                  className={`px-4 py-2 rounded-lg text-sm font-semibold border ${getRoleBadgeColor(
                    user?.role || ''
                  )}`}
                >
                  <span className="capitalize">{user?.role || 'User'}</span>
                </span>
              </div>

              <p className="text-xs text-gray-500 mt-3 px-4">
                {getRoleDescription(user?.role || '')}
              </p>
            </div>

            <div className="border-t border-gray-200 mt-6 pt-6">
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Account Status</span>
                  <span className="flex items-center text-green-600 font-medium">
                    <span className="w-2 h-2 bg-green-600 rounded-full mr-2"></span>
                    Active
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Member Since</span>
                  <span className="text-gray-900 font-medium">Nov 2024</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Last Login</span>
                  <span className="text-gray-900 font-medium">Today</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  <span>Edit</span>
                </button>
              ) : (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Username
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                  />
                ) : (
                  <p className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900">
                    {user?.username || 'Not set'}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                  />
                ) : (
                  <p className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900">
                    {user?.email || 'Not set'}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+91 98765 43210"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                  />
                ) : (
                  <p className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900">
                    {formData.phone || 'Not set'}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Designation
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="designation"
                    value={formData.designation}
                    onChange={handleInputChange}
                    placeholder="e.g., Project Manager"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                  />
                ) : (
                  <p className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900">
                    {formData.designation || 'Not set'}
                  </p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Department
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    placeholder="e.g., Rural Development"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                  />
                ) : (
                  <p className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900">
                    {formData.department || 'Not set'}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Role Management */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Role Management</h3>
                <p className="text-sm text-gray-500 mt-1">Select your role or provide additional details</p>
              </div>
              {!isEditingRole ? (
                <button
                  onClick={() => setIsEditingRole(true)}
                  className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  <span>Change Role</span>
                </button>
              ) : (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      setIsEditingRole(false);
                      setSelectedRole(user?.role || '');
                    }}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleRoleChange}
                    className="px-4 py-2 text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    Update Role
                  </button>
                </div>
              )}
            </div>

            {isEditingRole ? (
              <div className="space-y-4">
                <p className="text-sm text-gray-600 mb-4">
                  Select a role that best describes your position in the system. Note: Admin role is restricted to authorized personnel only.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Viewer Role */}
                  <button
                    onClick={() => setSelectedRole('viewer')}
                    className={`p-4 border-2 rounded-lg text-left transition-all ${
                      selectedRole === 'viewer'
                        ? 'border-gray-900 bg-gray-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 ${
                        selectedRole === 'viewer' ? 'border-gray-900' : 'border-gray-300'
                      }`}>
                        {selectedRole === 'viewer' && (
                          <div className="w-3 h-3 bg-gray-900 rounded-full"></div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">Viewer</h4>
                        <p className="text-xs text-gray-600 mt-1">
                          Read-only access to view villages, reports, and assessments
                        </p>
                      </div>
                    </div>
                  </button>

                  {/* Assessor Role */}
                  <button
                    onClick={() => setSelectedRole('assessor')}
                    className={`p-4 border-2 rounded-lg text-left transition-all ${
                      selectedRole === 'assessor'
                        ? 'border-gray-900 bg-gray-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 ${
                        selectedRole === 'assessor' ? 'border-gray-900' : 'border-gray-300'
                      }`}>
                        {selectedRole === 'assessor' && (
                          <div className="w-3 h-3 bg-gray-900 rounded-full"></div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">Assessor</h4>
                        <p className="text-xs text-gray-600 mt-1">
                          Can conduct assessments, submit reports, and update village data
                        </p>
                      </div>
                    </div>
                  </button>

                  {/* Coordinator Role */}
                  <button
                    onClick={() => setSelectedRole('coordinator')}
                    className={`p-4 border-2 rounded-lg text-left transition-all ${
                      selectedRole === 'coordinator'
                        ? 'border-gray-900 bg-gray-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 ${
                        selectedRole === 'coordinator' ? 'border-gray-900' : 'border-gray-300'
                      }`}>
                        {selectedRole === 'coordinator' && (
                          <div className="w-3 h-3 bg-gray-900 rounded-full"></div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">Coordinator</h4>
                        <p className="text-xs text-gray-600 mt-1">
                          Manage projects, coordinate activities, and oversee village development
                        </p>
                      </div>
                    </div>
                  </button>

                  {/* Admin Role - Restricted */}
                  <button
                    onClick={() => {
                      if (isAdminEmail) {
                        setSelectedRole('admin');
                      } else {
                        alert('Admin role is restricted to authorized personnel only. Please contact your system administrator.');
                      }
                    }}
                    disabled={!isAdminEmail}
                    className={`p-4 border-2 rounded-lg text-left transition-all relative ${
                      selectedRole === 'admin'
                        ? 'border-purple-600 bg-purple-50'
                        : !isAdminEmail
                        ? 'border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 ${
                        selectedRole === 'admin' ? 'border-purple-600' : 'border-gray-300'
                      }`}>
                        {selectedRole === 'admin' && (
                          <div className="w-3 h-3 bg-purple-600 rounded-full"></div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-semibold text-gray-900">Admin</h4>
                          {!isAdminEmail && (
                            <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                          )}
                        </div>
                        <p className="text-xs text-gray-600 mt-1">
                          Full system access with administrative privileges
                        </p>
                        {!isAdminEmail && (
                          <p className="text-xs text-red-600 mt-1 font-medium">
                            Restricted - Authorization required
                          </p>
                        )}
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Current Role</p>
                      <p className="text-lg font-bold text-gray-900 capitalize mt-1">{user?.role || 'Not assigned'}</p>
                      <p className="text-xs text-gray-600 mt-1">{getRoleDescription(user?.role || '')}</p>
                    </div>
                    <span
                      className={`px-4 py-2 rounded-lg text-sm font-semibold border ${getRoleBadgeColor(
                        user?.role || ''
                      )}`}
                    >
                      <span className="capitalize">{user?.role || 'User'}</span>
                    </span>
                  </div>
                </div>
                
                {!isAdminEmail && (
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start space-x-2">
                    <svg className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-xs text-yellow-800">
                      <strong>Note:</strong> Admin role is restricted to authorized email addresses only. If you need admin access, please contact your system administrator.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Security Settings */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Security Settings</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center space-x-3">
                  <svg className="h-5 w-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Password</p>
                    <p className="text-xs text-gray-500">Last changed 30 days ago</p>
                  </div>
                </div>
                <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 border border-gray-300 rounded-lg transition-colors">
                  Change Password
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center space-x-3">
                  <svg className="h-5 w-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Two-Factor Authentication</p>
                    <p className="text-xs text-gray-500">Add an extra layer of security</p>
                  </div>
                </div>
                <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 border border-gray-300 rounded-lg transition-colors">
                  Enable
                </button>
              </div>
            </div>
          </div>

          {/* Activity & Permissions */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Role Permissions</h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <svg className="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm text-gray-700">View Villages & Reports</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <svg className="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm text-gray-700">Submit Assessments</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <svg className="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm text-gray-700">Manage Projects</span>
                </div>
              </div>

              {user?.role?.toLowerCase() === 'admin' && (
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <svg className="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm text-gray-700">System Administration</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
