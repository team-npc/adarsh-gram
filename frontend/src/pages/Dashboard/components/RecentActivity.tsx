import React, { useState, useEffect } from 'react';
import { MdReportProblem, MdAssignment, MdWork, MdLocationCity } from 'react-icons/md';
import { IoChevronForward } from 'react-icons/io5';
import { BiCheckCircle, BiTime } from 'react-icons/bi';
import { IoMdClose } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';

interface Activity {
  id: string;
  type: 'report' | 'assessment' | 'project' | 'village';
  title: string;
  description: string;
  timestamp: string;
  user: string;
  status?: 'completed' | 'in_progress' | 'pending';
  details?: string;
  location?: string;
  createdAt?: string;
}

const RecentActivity: React.FC = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);

  // Load activities from localStorage
  const [activities, setActivities] = useState<Activity[]>(() => {
    const stored = localStorage.getItem('activityLog');
    if (stored) {
      const allActivities = JSON.parse(stored);
      // Return only the 5 most recent activities
      return allActivities.slice(0, 5);
    }
    // Default activities if none in localStorage
    return [
      {
        id: '1',
        type: 'assessment',
        title: 'Healthcare Assessment Completed',
        description: 'Assessment for Rampur village healthcare facilities',
        timestamp: '2 hours ago',
        user: 'Dr. Rajesh Kumar',
        status: 'completed',
        details: 'Comprehensive healthcare facility assessment completed. All metrics recorded and documented.',
        location: 'Rampur, Sitapur',
        createdAt: '2024-11-17 10:30 AM',
      },
      {
        id: '2',
        type: 'report',
        title: 'New Problem Report',
        description: 'Water supply issue reported in Krishnanagar',
        timestamp: '4 hours ago',
        user: 'Priya Sharma',
        status: 'pending',
        details: 'Water supply disruption affecting over 200 households. Immediate attention required.',
        location: 'Krishnanagar, Sitapur',
        createdAt: '2024-11-17 08:15 AM',
      },
      {
        id: '3',
        type: 'project',
        title: 'School Construction Update',
        description: 'Primary school building project milestone reached',
        timestamp: '1 day ago',
        user: 'Amit Singh',
        status: 'in_progress',
        details: 'Foundation work completed. Moving to next phase of construction.',
        location: 'Shanti Nagar, Sitapur',
        createdAt: '2024-11-16 02:45 PM',
      },
      {
        id: '4',
        type: 'village',
        title: 'Village Registration',
        description: 'New village Shanti Nagar added to system',
        timestamp: '2 days ago',
        user: 'System Admin',
        status: 'completed',
        details: 'Village successfully registered with complete demographic information.',
        location: 'Shanti Nagar, Sitapur',
        createdAt: '2024-11-15 11:20 AM',
      },
      {
        id: '5',
        type: 'assessment',
        title: 'Education Assessment Started',
        description: 'Education infrastructure assessment for Rampur',
        timestamp: '3 days ago',
        user: 'Sunita Devi',
        status: 'in_progress',
        details: 'Assessment of educational facilities and infrastructure in progress.',
        location: 'Rampur, Sitapur',
        createdAt: '2024-11-14 09:00 AM',
      },
    ];
  });

  // Update localStorage whenever default activities are loaded for the first time
  useEffect(() => {
    const stored = localStorage.getItem('activityLog');
    if (!stored && activities.length > 0) {
      localStorage.setItem('activityLog', JSON.stringify(activities));
    }
  }, [activities]);

  // Listen for localStorage changes to update recent activities
  useEffect(() => {
    const handleStorageChange = () => {
      const stored = localStorage.getItem('activityLog');
      if (stored) {
        const allActivities = JSON.parse(stored);
        setActivities(allActivities.slice(0, 5));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleViewActivity = (activity: Activity) => {
    setSelectedActivity(activity);
    setShowModal(true);
  };

  const handleViewAll = () => {
    // Navigate to a full activity log page or open expanded view
    navigate('/dashboard/activity-log');
  };

  const handleNavigateToRelated = (activity: Activity) => {
    switch (activity.type) {
      case 'report':
        navigate('/dashboard/reports');
        break;
      case 'assessment':
        navigate('/dashboard/assessments');
        break;
      case 'project':
        navigate('/dashboard/projects');
        break;
      case 'village':
        navigate('/dashboard/villages');
        break;
    }
  };

  const getActivityIcon = (type: Activity['type']) => {
    const iconSize = 20;
    switch (type) {
      case 'report':
        return (
          <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center">
            <MdReportProblem className="text-white" size={iconSize} />
          </div>
        );
      case 'assessment':
        return (
          <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center">
            <MdAssignment className="text-white" size={iconSize} />
          </div>
        );
      case 'project':
        return (
          <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center">
            <MdWork className="text-white" size={iconSize} />
          </div>
        );
      case 'village':
        return (
          <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center">
            <MdLocationCity className="text-white" size={iconSize} />
          </div>
        );
      default:
        return (
          <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full"></div>
          </div>
        );
    }
  };

  const getStatusBadge = (status?: Activity['status']) => {
    if (!status) return null;

    const statusConfig = {
      completed: { 
        bg: 'bg-green-50', 
        text: 'text-green-700',
        icon: <BiCheckCircle size={14} />
      },
      in_progress: { 
        bg: 'bg-blue-50', 
        text: 'text-blue-700',
        icon: <BiTime size={14} />
      },
      pending: { 
        bg: 'bg-gray-100', 
        text: 'text-gray-700',
        icon: <BiTime size={14} />
      },
    };

    const config = statusConfig[status];

    return (
      <span className={`px-2 py-1 text-xs rounded-lg ${config.bg} ${config.text} font-medium flex items-center gap-1 whitespace-nowrap`}>
        {config.icon}
        {status === 'in_progress' ? 'In Progress' : status.replace('_', ' ')}
      </span>
    );
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 h-fit sticky top-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Recent Activity</h3>
          <p className="text-gray-600 mt-1">Latest system updates</p>
        </div>
        <button 
          onClick={handleViewAll}
          className="text-sm text-gray-600 hover:text-gray-900 font-medium flex items-center gap-1 transition-all"
        >
          View All
          <IoChevronForward className="text-gray-400" size={16} />
        </button>
      </div>

      <div className="space-y-4 relative">
        {activities.map((activity, index) => (
          <div 
            key={activity.id} 
            className="flex items-start gap-3 relative cursor-pointer hover:bg-gray-50 -mx-2 px-2 py-2 rounded-lg transition-colors"
            onClick={() => handleViewActivity(activity)}
          >
            {/* Activity Icon */}
            <div className="shrink-0">
              {getActivityIcon(activity.type)}
            </div>

            {/* Activity Content */}
            <div className="flex-1 min-w-0 pt-0.5">
              <div className="flex items-start justify-between mb-1 gap-2">
                <p className="text-sm font-semibold text-gray-900 leading-tight">
                  {activity.title}
                </p>
                {getStatusBadge(activity.status)}
              </div>
              
              <p className="text-sm text-gray-600 mb-2 leading-snug">
                {activity.description}
              </p>
              
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span className="font-medium">{activity.user}</span>
                <span className="text-gray-400">•</span>
                <span>{activity.timestamp}</span>
              </div>
            </div>

            {/* Timeline Line */}
            {index < activities.length - 1 && (
              <div className="absolute left-5 top-12 w-px h-6 bg-gray-200"></div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <button 
          onClick={handleViewAll}
          className="w-full btn-secondary"
        >
          View Activity Log
        </button>
      </div>

      {/* Activity Detail Modal */}
      {showModal && selectedActivity && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Activity Details</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                {React.createElement(IoMdClose as React.ComponentType<any>, { size: 24 })}
              </button>
            </div>

            <div className="space-y-6">
              {/* Activity Icon and Type */}
              <div className="flex items-center gap-4">
                {getActivityIcon(selectedActivity.type)}
                <div>
                  <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                    {selectedActivity.type}
                  </p>
                  <h3 className="text-xl font-bold text-gray-900 mt-1">
                    {selectedActivity.title}
                  </h3>
                </div>
              </div>

              {/* Status Badge */}
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">Status:</span>
                {getStatusBadge(selectedActivity.status)}
              </div>

              {/* Description */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Description</h4>
                <p className="text-gray-900">{selectedActivity.description}</p>
              </div>

              {/* Details */}
              {selectedActivity.details && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Additional Details</h4>
                  <p className="text-gray-900">{selectedActivity.details}</p>
                </div>
              )}

              {/* Information Grid */}
              <div className="grid grid-cols-2 gap-4 py-4 border-t border-b border-gray-200">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Reported By</p>
                  <p className="text-sm font-medium text-gray-900">{selectedActivity.user}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Time</p>
                  <p className="text-sm font-medium text-gray-900">{selectedActivity.timestamp}</p>
                </div>
                {selectedActivity.location && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Location</p>
                    <p className="text-sm font-medium text-gray-900">{selectedActivity.location}</p>
                  </div>
                )}
                {selectedActivity.createdAt && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Created At</p>
                    <p className="text-sm font-medium text-gray-900">{selectedActivity.createdAt}</p>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="btn-secondary"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setShowModal(false);
                    handleNavigateToRelated(selectedActivity);
                  }}
                  className="btn-primary"
                >
                  View Related {selectedActivity.type === 'report' ? 'Reports' : 
                              selectedActivity.type === 'assessment' ? 'Assessments' : 
                              selectedActivity.type === 'project' ? 'Projects' : 'Villages'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecentActivity;