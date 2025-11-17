import React, { useState } from 'react';

interface Assessment {
  id: string;
  village: string;
  district: string;
  assessmentDate: string;
  assessmentType: 'baseline' | 'progress' | 'final';
  assessor: string;
  status: 'draft' | 'completed' | 'verified';
  overallScore: number;
  categories: {
    infrastructure: number;
    healthcare: number;
    education: number;
    sanitation: number;
    connectivity: number;
    economy: number;
  };
  notes: string;
}

const Assessments: React.FC = () => {
  const [assessments, setAssessments] = useState<Assessment[]>([
    {
      id: '1',
      village: 'Rampur',
      district: 'Sitapur',
      assessmentDate: '2024-11-01',
      assessmentType: 'baseline',
      assessor: 'Dr. Rajesh Kumar',
      status: 'completed',
      overallScore: 72,
      categories: {
        infrastructure: 70,
        healthcare: 65,
        education: 75,
        sanitation: 68,
        connectivity: 80,
        economy: 74,
      },
      notes: 'Village shows good potential for development. Priority areas: Healthcare and Sanitation.',
    },
    {
      id: '2',
      village: 'Krishnanagar',
      district: 'Sitapur',
      assessmentDate: '2024-10-28',
      assessmentType: 'progress',
      assessor: 'Priya Sharma',
      status: 'verified',
      overallScore: 68,
      categories: {
        infrastructure: 72,
        healthcare: 60,
        education: 70,
        sanitation: 65,
        connectivity: 75,
        economy: 66,
      },
      notes: 'Significant improvement in infrastructure noted. Healthcare facilities need urgent attention.',
    },
    {
      id: '3',
      village: 'Nandgaon',
      district: 'Barabanki',
      assessmentDate: '2024-11-05',
      assessmentType: 'baseline',
      assessor: 'Amit Verma',
      status: 'draft',
      overallScore: 58,
      categories: {
        infrastructure: 55,
        healthcare: 50,
        education: 60,
        sanitation: 52,
        connectivity: 65,
        economy: 66,
      },
      notes: 'Preliminary assessment in progress. All sectors require improvement.',
    },
  ]);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingAssessment, setEditingAssessment] = useState<Assessment | null>(null);
  const [viewingAssessment, setViewingAssessment] = useState<Assessment | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    if (score >= 40) return 'bg-orange-100';
    return 'bg-red-100';
  };

  const getStatusColor = (status: Assessment['status']) => {
    switch (status) {
      case 'draft': return 'bg-gray-400 text-white';
      case 'completed': return 'bg-blue-600 text-white';
      case 'verified': return 'bg-green-600 text-white';
      default: return 'bg-gray-400 text-white';
    }
  };

  const getTypeColor = (type: Assessment['assessmentType']) => {
    switch (type) {
      case 'baseline': return 'bg-purple-600 text-white';
      case 'progress': return 'bg-blue-600 text-white';
      case 'final': return 'bg-green-600 text-white';
      default: return 'bg-gray-400 text-white';
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this assessment?')) {
      setAssessments(assessments.filter(a => a.id !== id));
    }
  };

  const handleEdit = (assessment: Assessment) => {
    setEditingAssessment(assessment);
    setIsAddModalOpen(true);
  };

  const handleSave = (assessmentData: Partial<Assessment>) => {
    if (editingAssessment) {
      setAssessments(assessments.map(a => 
        a.id === editingAssessment.id ? { ...a, ...assessmentData } : a
      ));
    } else {
      const newAssessment: Assessment = {
        ...assessmentData as Assessment,
        id: Date.now().toString(),
        assessmentDate: new Date().toISOString().split('T')[0],
        status: 'draft',
      };
      setAssessments([...assessments, newAssessment]);
    }
    setIsAddModalOpen(false);
    setEditingAssessment(null);
  };

  const filteredAssessments = assessments.filter(assessment => {
    const matchesSearch = assessment.village.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         assessment.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         assessment.assessor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || assessment.assessmentType === filterType;
    const matchesStatus = filterStatus === 'all' || assessment.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const averageScore = assessments.length > 0
    ? Math.round(assessments.reduce((acc, a) => acc + a.overallScore, 0) / assessments.length)
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-gray-200 pb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Village Assessments</h1>
            <p className="text-gray-600 mt-2 text-lg">
              Comprehensive village development assessments
            </p>
          </div>
          <button
            onClick={() => {
              setEditingAssessment(null);
              setIsAddModalOpen(true);
            }}
            className="btn-primary flex items-center"
          >
            <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            New Assessment
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by village, district, or assessor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
          <div className="md:w-48">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
            >
              <option value="all">All Types</option>
              <option value="baseline">Baseline</option>
              <option value="progress">Progress</option>
              <option value="final">Final</option>
            </select>
          </div>
          <div className="md:w-48">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full pl-4 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="completed">Completed</option>
              <option value="verified">Verified</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 uppercase">Total Assessments</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{assessments.length}</p>
            </div>
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
              <svg className="h-6 w-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 uppercase">Average Score</p>
              <p className={`text-3xl font-bold mt-2 ${getScoreColor(averageScore)}`}>{averageScore}%</p>
            </div>
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getScoreBgColor(averageScore)}`}>
              <svg className={`h-6 w-6 ${getScoreColor(averageScore)}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 uppercase">Completed</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {assessments.filter(a => a.status === 'completed').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 uppercase">Verified</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {assessments.filter(a => a.status === 'verified').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Assessments Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredAssessments.map((assessment) => (
          <div
            key={assessment.id}
            className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(assessment.assessmentType)}`}>
                    {assessment.assessmentType.toUpperCase()}
                  </span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(assessment.status)}`}>
                    {assessment.status.toUpperCase()}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{assessment.village}, {assessment.district}</h3>
                <p className="text-sm text-gray-600">Assessed by {assessment.assessor}</p>
              </div>
              <div className={`text-center px-4 py-2 rounded-lg ${getScoreBgColor(assessment.overallScore)}`}>
                <p className="text-xs text-gray-600 uppercase">Score</p>
                <p className={`text-2xl font-bold ${getScoreColor(assessment.overallScore)}`}>{assessment.overallScore}%</p>
              </div>
            </div>

            {/* Category Scores */}
            <div className="space-y-2 mb-4">
              {Object.entries(assessment.categories).map(([category, score]) => (
                <div key={category} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 capitalize">{category}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${score >= 80 ? 'bg-green-600' : score >= 60 ? 'bg-yellow-600' : score >= 40 ? 'bg-orange-600' : 'bg-red-600'}`}
                        style={{ width: `${score}%` }}
                      />
                    </div>
                    <span className={`text-sm font-medium ${getScoreColor(score)}`}>{score}%</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-sm text-gray-600 mb-4 border-t border-gray-200 pt-4">
              <p className="line-clamp-2">{assessment.notes}</p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <span className="text-sm text-gray-500">
                {new Date(assessment.assessmentDate).toLocaleDateString()}
              </span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewingAssessment(assessment)}
                  className="text-sm text-gray-600 hover:text-gray-900 font-medium px-3 py-1 hover:bg-gray-100 rounded-md transition-colors"
                >
                  View Details
                </button>
                <button
                  onClick={() => handleEdit(assessment)}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                  title="Edit"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  onClick={() => handleDelete(assessment.id)}
                  className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
                  title="Delete"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredAssessments.length === 0 && (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-12 text-center">
          <svg className="h-12 w-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No assessments found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria</p>
        </div>
      )}

      {/* Add/Edit Modal */}
      {isAddModalOpen && (
        <AssessmentModal
          assessment={editingAssessment}
          onSave={handleSave}
          onClose={() => {
            setIsAddModalOpen(false);
            setEditingAssessment(null);
          }}
        />
      )}

      {/* View Details Modal */}
      {viewingAssessment && (
        <ViewAssessmentModal
          assessment={viewingAssessment}
          onClose={() => setViewingAssessment(null)}
        />
      )}
    </div>
  );
};

// Assessment Modal Component
interface AssessmentModalProps {
  assessment: Assessment | null;
  onSave: (assessment: Partial<Assessment>) => void;
  onClose: () => void;
}

const AssessmentModal: React.FC<AssessmentModalProps> = ({ assessment, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    village: assessment?.village || '',
    district: assessment?.district || '',
    assessmentType: assessment?.assessmentType || 'baseline',
    assessor: assessment?.assessor || '',
    status: assessment?.status || 'draft',
    notes: assessment?.notes || '',
    categories: assessment?.categories || {
      infrastructure: 0,
      healthcare: 0,
      education: 0,
      sanitation: 0,
      connectivity: 0,
      economy: 0,
    },
  });

  const overallScore = Math.round(
    Object.values(formData.categories).reduce((acc, val) => acc + val, 0) / 6
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...formData, overallScore });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full p-8 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {assessment ? 'Edit Assessment' : 'New Assessment'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                placeholder="Village name"
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
                placeholder="District name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Assessment Type *
              </label>
              <select
                required
                value={formData.assessmentType}
                onChange={(e) => setFormData({ ...formData, assessmentType: e.target.value as Assessment['assessmentType'] })}
                className="input-field"
              >
                <option value="baseline">Baseline</option>
                <option value="progress">Progress</option>
                <option value="final">Final</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Assessor *
              </label>
              <input
                type="text"
                required
                value={formData.assessor}
                onChange={(e) => setFormData({ ...formData, assessor: e.target.value })}
                className="input-field"
                placeholder="Assessor name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status *
              </label>
              <select
                required
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as Assessment['status'] })}
                className="input-field"
              >
                <option value="draft">Draft</option>
                <option value="completed">Completed</option>
                <option value="verified">Verified</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Overall Score
              </label>
              <div className="input-field bg-gray-50">
                <span className="text-2xl font-bold text-gray-900">{overallScore}%</span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Category Scores (0-100) *
            </label>
            <div className="space-y-4">
              {Object.entries(formData.categories).map(([category, score]) => (
                <div key={category}>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm text-gray-700 capitalize">{category}</label>
                    <span className="text-sm font-medium text-gray-900">{score}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={score}
                    onChange={(e) => setFormData({
                      ...formData,
                      categories: {
                        ...formData.categories,
                        [category]: parseInt(e.target.value)
                      }
                    })}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes
            </label>
            <textarea
              rows={4}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="input-field"
              placeholder="Assessment notes and observations..."
            />
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
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
              {assessment ? 'Update Assessment' : 'Create Assessment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// View Assessment Modal
interface ViewAssessmentModalProps {
  assessment: Assessment;
  onClose: () => void;
}

const ViewAssessmentModal: React.FC<ViewAssessmentModalProps> = ({ assessment, onClose }) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    if (score >= 40) return 'bg-orange-100';
    return 'bg-red-100';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full p-8 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Assessment Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-gray-200">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-1">{assessment.village}, {assessment.district}</h3>
              <p className="text-sm text-gray-600">Assessed by {assessment.assessor}</p>
            </div>
            <div className={`text-center px-6 py-3 rounded-xl ${getScoreBgColor(assessment.overallScore)}`}>
              <p className="text-xs text-gray-600 uppercase mb-1">Overall Score</p>
              <p className={`text-3xl font-bold ${getScoreColor(assessment.overallScore)}`}>{assessment.overallScore}%</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Assessment Date</p>
              <p className="text-sm font-medium text-gray-900">{new Date(assessment.assessmentDate).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Type</p>
              <p className="text-sm font-medium text-gray-900 capitalize">{assessment.assessmentType}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Status</p>
              <p className="text-sm font-medium text-gray-900 capitalize">{assessment.status}</p>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Category Scores</h4>
            <div className="space-y-3">
              {Object.entries(assessment.categories).map(([category, score]) => (
                <div key={category} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 capitalize w-32">{category}</span>
                  <div className="flex-1 mx-4">
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full ${score >= 80 ? 'bg-green-600' : score >= 60 ? 'bg-yellow-600' : score >= 40 ? 'bg-orange-600' : 'bg-red-600'}`}
                        style={{ width: `${score}%` }}
                      />
                    </div>
                  </div>
                  <span className={`text-lg font-bold ${getScoreColor(score)} w-16 text-right`}>{score}%</span>
                </div>
              ))}
            </div>
          </div>

          {assessment.notes && (
            <div className="pt-4 border-t border-gray-200">
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Notes</h4>
              <p className="text-gray-700">{assessment.notes}</p>
            </div>
          )}

          <div className="flex justify-end pt-6 border-t border-gray-200">
            <button
              onClick={onClose}
              className="btn-primary"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Assessments;
