import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  FaTachometerAlt, FaMapMarkedAlt, FaExclamationTriangle, 
  FaClipboardList, FaBriefcase, FaChartBar, FaPlus, FaFileAlt, FaTimes
} from 'react-icons/fa';
import type { IconType } from 'react-icons';

interface NavItem {
  name: string;
  path: string;
  icon: React.ReactNode;
  badge?: number;
}

const Sidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showReportModal, setShowReportModal] = useState(false);
  const [showAssessmentModal, setShowAssessmentModal] = useState(false);

  const navItems: NavItem[] = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: React.createElement('div', { className: "w-5 h-5 bg-black rounded flex items-center justify-center" }, React.createElement(FaTachometerAlt as React.ComponentType<any>, { className: "text-white text-xs" })),
    },
    {
      name: 'Villages',
      path: '/dashboard/villages',
      icon: React.createElement('div', { className: "w-5 h-5 bg-black rounded flex items-center justify-center" }, React.createElement(FaMapMarkedAlt as React.ComponentType<any>, { className: "text-white text-xs" })),
    },
    {
      name: 'Problem Reports',
      path: '/dashboard/reports',
      icon: React.createElement('div', { className: "w-5 h-5 bg-black rounded flex items-center justify-center" }, React.createElement(FaExclamationTriangle as React.ComponentType<any>, { className: "text-white text-xs" })),
      badge: 5,
    },
    {
      name: 'Assessments',
      path: '/dashboard/assessments',
      icon: React.createElement('div', { className: "w-5 h-5 bg-black rounded flex items-center justify-center" }, React.createElement(FaClipboardList as React.ComponentType<any>, { className: "text-white text-xs" })),
    },
    {
      name: 'Projects',
      path: '/dashboard/projects',
      icon: React.createElement('div', { className: "w-5 h-5 bg-black rounded flex items-center justify-center" }, React.createElement(FaBriefcase as React.ComponentType<any>, { className: "text-white text-xs" })),
    },
    {
      name: 'Reports & Analytics',
      path: '/dashboard/analytics',
      icon: React.createElement('div', { className: "w-5 h-5 bg-black rounded flex items-center justify-center" }, React.createElement(FaChartBar as React.ComponentType<any>, { className: "text-white text-xs" })),
    },
  ];

  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(path);
  };

  const handleReportProblem = () => {
    setShowReportModal(true);
  };

  const handleNewAssessment = () => {
    setShowAssessmentModal(true);
  };

  const handleGenerateReport = () => {
    navigate('/dashboard/analytics');
  };

  const submitProblemReport = (e: React.FormEvent) => {
    e.preventDefault();
    setShowReportModal(false);
    // Here you would typically send the data to your backend
    alert('Problem report submitted successfully!');
  };

  const submitAssessment = (e: React.FormEvent) => {
    e.preventDefault();
    setShowAssessmentModal(false);
    // Navigate to assessments page or show success
    navigate('/dashboard/assessments');
  };

  return (
    <>
    <aside className="fixed left-0 top-16 h-screen w-64 bg-white border-r border-gray-200 z-40 overflow-y-auto">
      <div className="p-6">
        <nav className="space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-link ${
                isActive(item.path) ? 'nav-link-active' : 'nav-link-inactive'
              }`}
            >
              <div className="flex items-center space-x-3">
                {item.icon}
                <span>{item.name}</span>
              </div>
              {item.badge && (
                <span className={`px-2 py-1 text-xs rounded-full ${
                  isActive(item.path)
                    ? 'bg-white text-gray-900'
                    : 'bg-gray-200 text-gray-700'
                }`}>
                  {item.badge}
                </span>
              )}
            </Link>
          ))}
        </nav>

        {/* Quick Actions */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Quick Actions
          </h3>
          <div className="space-y-2">
            <button 
              onClick={handleReportProblem}
              className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors flex items-center space-x-2"
            >
              <div className="w-4 h-4 bg-black rounded flex items-center justify-center">
                {React.createElement(FaPlus as React.ComponentType<any>, { className: "text-white", style: { fontSize: '8px' } })}
              </div>
              <span>Report Problem</span>
            </button>
            <button 
              onClick={handleNewAssessment}
              className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors flex items-center space-x-2"
            >
              <div className="w-4 h-4 bg-black rounded flex items-center justify-center">
                {React.createElement(FaClipboardList as React.ComponentType<any>, { className: "text-white", style: { fontSize: '8px' } })}
              </div>
              <span>New Assessment</span>
            </button>
            <button 
              onClick={handleGenerateReport}
              className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors flex items-center space-x-2"
            >
              <div className="w-4 h-4 bg-black rounded flex items-center justify-center">
                {React.createElement(FaFileAlt as React.ComponentType<any>, { className: "text-white", style: { fontSize: '8px' } })}
              </div>
              <span>Generate Report</span>
            </button>
          </div>
        </div>
      </div>
    </aside>

    {/* Report Problem Modal */}
    {showReportModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Report a Problem</h2>
              <button 
                onClick={() => setShowReportModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <div className="w-6 h-6 bg-black rounded flex items-center justify-center">
                  {React.createElement(FaTimes as React.ComponentType<any>, { className: "text-white" })}
                </div>
              </button>
            </div>
            <form onSubmit={submitProblemReport} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Village Name</label>
                <select className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent" required>
                  <option value="">Select Village</option>
                  <option value="rampur">Rampur</option>
                  <option value="krishnanagar">Krishnanagar</option>
                  <option value="shanti-nagar">Shanti Nagar</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Problem Category</label>
                <select className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent" required>
                  <option value="">Select Category</option>
                  <option value="infrastructure">Infrastructure</option>
                  <option value="sanitation">Sanitation</option>
                  <option value="water">Water Supply</option>
                  <option value="electricity">Electricity</option>
                  <option value="healthcare">Healthcare</option>
                  <option value="education">Education</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Priority Level</label>
                <select className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent" required>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea 
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  placeholder="Describe the problem in detail..."
                  required
                ></textarea>
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowReportModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
                >
                  Submit Report
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    )}

    {/* New Assessment Modal */}
    {showAssessmentModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Start New Assessment</h2>
              <button 
                onClick={() => setShowAssessmentModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <div className="w-6 h-6 bg-black rounded flex items-center justify-center">
                  {React.createElement(FaTimes as React.ComponentType<any>, { className: "text-white" })}
                </div>
              </button>
            </div>
            <form onSubmit={submitAssessment} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Village Name</label>
                <select className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent" required>
                  <option value="">Select Village</option>
                  <option value="rampur">Rampur</option>
                  <option value="krishnanagar">Krishnanagar</option>
                  <option value="shanti-nagar">Shanti Nagar</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Assessment Type</label>
                <select className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent" required>
                  <option value="">Select Type</option>
                  <option value="initial">Initial Assessment</option>
                  <option value="follow-up">Follow-up Assessment</option>
                  <option value="annual">Annual Review</option>
                  <option value="special">Special Audit</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Assessment Date</label>
                <input 
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Assessor Name</label>
                <input 
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  placeholder="Enter your name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes (Optional)</label>
                <textarea 
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  placeholder="Any preliminary notes..."
                ></textarea>
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAssessmentModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
                >
                  Start Assessment
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    )}
    </>
  );
};

export default Sidebar;