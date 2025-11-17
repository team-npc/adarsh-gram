import React, { useState } from 'react';
import { HiOutlinePencil, HiOutlineTrash, HiOutlineEye } from 'react-icons/hi';
import { MdWaterDrop, MdSchool, MdLocalHospital } from 'react-icons/md';
import { GiRoad } from 'react-icons/gi';
import { IoChevronForward } from 'react-icons/io5';

interface PendingReport {
  id: string;
  title: string;
  village: string;
  district: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  reportedDate: string;
  reporterName: string;
}

const PendingReports: React.FC = () => {
  const [reports, setReports] = useState<PendingReport[]>([
    {
      id: '1',
      title: 'Water supply disruption in main area',
      village: 'Rampur',
      district: 'Sitapur',
      category: 'Drinking Water',
      priority: 'high',
      reportedDate: '2 hours ago',
      reporterName: 'Rajesh Kumar',
    },
    {
      id: '2',
      title: 'Primary school building needs repair',
      village: 'Krishnanagar',
      district: 'Sitapur',
      category: 'Education',
      priority: 'medium',
      reportedDate: '1 day ago',
      reporterName: 'Priya Sharma',
    },
    {
      id: '3',
      title: 'Road connectivity issues during monsoon',
      village: 'Shanti Nagar',
      district: 'Sitapur',
      category: 'Connectivity',
      priority: 'medium',
      reportedDate: '2 days ago',
      reporterName: 'Amit Singh',
    },
    {
      id: '4',
      title: 'Healthcare center lacks basic equipment',
      village: 'Rampur',
      district: 'Sitapur',
      category: 'Healthcare',
      priority: 'critical',
      reportedDate: '3 days ago',
      reporterName: 'Dr. Sunita Devi',
    },
  ]);

  const [editingReport, setEditingReport] = useState<PendingReport | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEdit = (report: PendingReport) => {
    setEditingReport(report);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this report?')) {
      setReports(reports.filter(r => r.id !== id));
    }
  };

  const handleSave = (reportData: PendingReport) => {
    setReports(reports.map(r => r.id === reportData.id ? reportData : r));
    setIsModalOpen(false);
    setEditingReport(null);
  };

  const getPriorityColor = (priority: PendingReport['priority']) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-600';
      case 'high':
        return 'bg-orange-600';
      case 'medium':
        return 'bg-yellow-600';
      case 'low':
        return 'bg-green-600';
      default:
        return 'bg-gray-400';
    }
  };

  const getCategoryIcon = (category: string) => {
    const iconClass = "text-gray-500";
    switch (category.toLowerCase()) {
      case 'drinking water':
        return <MdWaterDrop className={iconClass} size={18} />;
      case 'education':
        return <MdSchool className={iconClass} size={18} />;
      case 'healthcare':
        return <MdLocalHospital className={iconClass} size={18} />;
      case 'connectivity':
        return <GiRoad className={iconClass} size={18} />;
      default:
        return <GiRoad className={iconClass} size={18} />;
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Pending Problem Reports</h3>
          <p className="text-gray-600 mt-1">Recent issues reported by village representatives</p>
        </div>
        <button className="text-sm text-gray-600 hover:text-gray-900 font-medium flex items-center gap-1 transition-all">
          View All 
          <IoChevronForward className="text-gray-400" size={16} />
        </button>
      </div>

      <div className="space-y-3">
        {reports.map((report) => (
          <div
            key={report.id}
            className="p-4 border border-gray-200 rounded-lg hover:shadow-md hover:border-gray-300 transition-all duration-200 group"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-50 group-hover:bg-gray-100 transition-colors">
                    {getCategoryIcon(report.category)}
                  </div>
                  <span className="text-sm font-medium text-gray-900">{report.category}</span>
                  <span className={`text-xs font-bold ${getPriorityColor(report.priority).replace('bg-', 'text-')}`}>
                    {report.priority.toUpperCase()}
                  </span>
                </div>
                
                <h4 className="font-semibold text-gray-900 mb-1.5 line-clamp-1">{report.title}</h4>
                
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="truncate">{report.village}, {report.district}</span>
                  <span className="text-gray-400">•</span>
                  <span className="truncate">by {report.reporterName}</span>
                  <span className="text-gray-400">•</span>
                  <span className="whitespace-nowrap">{report.reportedDate}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleEdit(report)}
                  className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 transform hover:scale-110"
                  title="Edit report"
                >
                  <HiOutlinePencil size={18} />
                </button>
                <button
                  onClick={() => handleDelete(report.id)}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 transform hover:scale-110"
                  title="Delete report"
                >
                  <HiOutlineTrash size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <button className="w-full btn-secondary">
          View All Pending Reports
        </button>
      </div>

      {/* Edit Modal */}
      {isModalOpen && editingReport && (
        <EditReportModal
          report={editingReport}
          onSave={handleSave}
          onClose={() => {
            setIsModalOpen(false);
            setEditingReport(null);
          }}
        />
      )}
    </div>
  );
};

// Edit Modal Component
interface EditReportModalProps {
  report: PendingReport;
  onSave: (report: PendingReport) => void;
  onClose: () => void;
}

const EditReportModal: React.FC<EditReportModalProps> = ({ report, onSave, onClose }) => {
  const [formData, setFormData] = useState(report);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Edit Problem Report</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <HiOutlineEye className="rotate-45" size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Problem Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="input-field"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Village *
              </label>
              <input
                type="text"
                required
                value={formData.village}
                onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                District *
              </label>
              <input
                type="text"
                required
                value={formData.district}
                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                className="input-field"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="input-field"
              >
                <option value="Drinking Water">Drinking Water</option>
                <option value="Education">Education</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Connectivity">Connectivity</option>
                <option value="Sanitation">Sanitation</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority *
              </label>
              <select
                required
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as PendingReport['priority'] })}
                className="input-field"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reporter Name *
            </label>
            <input
              type="text"
              required
              value={formData.reporterName}
              onChange={(e) => setFormData({ ...formData, reporterName: e.target.value })}
              className="input-field"
            />
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PendingReports;