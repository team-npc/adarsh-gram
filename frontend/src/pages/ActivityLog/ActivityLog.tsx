import React, { useState, useEffect } from 'react';
import { MdReportProblem, MdAssignment, MdWork, MdLocationCity } from 'react-icons/md';
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

const ActivityLog: React.FC = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Load activities from localStorage or use default data
  const [activities, setActivities] = useState<Activity[]>(() => {
    const stored = localStorage.getItem('activityLog');
    if (stored) {
      return JSON.parse(stored);
    }
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

  // Save to localStorage whenever activities change
  useEffect(() => {
    localStorage.setItem('activityLog', JSON.stringify(activities));
  }, [activities]);

  const handleViewActivity = (activity: Activity) => {
    setSelectedActivity(activity);
    setShowModal(true);
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
          <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center">
            {React.createElement(MdReportProblem as React.ComponentType<any>, { className: 'text-white', size: iconSize })}
          </div>
        );
      case 'assessment':
        return (
          <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center">
            {React.createElement(MdAssignment as React.ComponentType<any>, { className: 'text-white', size: iconSize })}
          </div>
        );
      case 'project':
        return (
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
            {React.createElement(MdWork as React.ComponentType<any>, { className: 'text-white', size: iconSize })}
          </div>
        );
      case 'village':
        return (
          <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center">
            {React.createElement(MdLocationCity as React.ComponentType<any>, { className: 'text-white', size: iconSize })}
          </div>
        );
      default:
        return (
          <div className="w-10 h-10 bg-gray-600 rounded-xl flex items-center justify-center">
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
        icon: React.createElement(BiCheckCircle as React.ComponentType<any>, { size: 14 })
      },
      in_progress: { 
        bg: 'bg-blue-50', 
        text: 'text-blue-700',
        icon: React.createElement(BiTime as React.ComponentType<any>, { size: 14 })
      },
      pending: { 
        bg: 'bg-gray-100', 
        text: 'text-gray-700',
        icon: React.createElement(BiTime as React.ComponentType<any>, { size: 14 })
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

  // Filter activities based on search and filters
  const filteredActivities = activities.filter(activity => {
    const matchesSearch = activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         activity.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         activity.user.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = filterType === 'all' || activity.type === filterType;
    const matchesStatus = filterStatus === 'all' || activity.status === filterStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Activity Log</h1>
              <p className="text-gray-600 mt-2">Complete history of all system activities and changes</p>
            </div>
            <button
              onClick={() => navigate('/dashboard')}
              className="btn-secondary"
            >
              Back to Dashboard
            </button>
          </div>

          {/* Stats Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-white p-4 rounded-xl border border-gray-200">
              <p className="text-sm text-gray-600">Total Activities</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{activities.length}</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-200">
              <p className="text-sm text-gray-600">Reports</p>
              <p className="text-2xl font-bold text-red-600 mt-1">
                {activities.filter(a => a.type === 'report').length}
              </p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-200">
              <p className="text-sm text-gray-600">Assessments</p>
              <p className="text-2xl font-bold text-green-600 mt-1">
                {activities.filter(a => a.type === 'assessment').length}
              </p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-200">
              <p className="text-sm text-gray-600">Projects</p>
              <p className="text-2xl font-bold text-blue-600 mt-1">
                {activities.filter(a => a.type === 'project').length}
              </p>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search activities..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>
            </div>

            {/* Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Type</label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="report">Reports</option>
                <option value="assessment">Assessments</option>
                <option value="project">Projects</option>
                <option value="village">Villages</option>
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              >
                <option value="all">All Statuses</option>
                <option value="completed">Completed</option>
                <option value="in_progress">In Progress</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>
        </div>

        {/* Activity List */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              {filteredActivities.length} {filteredActivities.length === 1 ? 'Activity' : 'Activities'}
            </h2>
          </div>

          {filteredActivities.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No activities found matching your filters</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredActivities.map((activity, index) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-4 p-4 rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-sm cursor-pointer transition-all"
                  onClick={() => handleViewActivity(activity)}
                >
                  {/* Activity Icon */}
                  <div className="shrink-0">
                    {getActivityIcon(activity.type)}
                  </div>

                  {/* Activity Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2 gap-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {activity.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">
                          {activity.description}
                        </p>
                      </div>
                      {getStatusBadge(activity.status)}
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="font-medium">{activity.user}</span>
                      <span className="text-gray-400">•</span>
                      <span>{activity.timestamp}</span>
                      {activity.location && (
                        <>
                          <span className="text-gray-400">•</span>
                          <span>{activity.location}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
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

export default ActivityLog;
