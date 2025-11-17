import React, { useState, useMemo } from 'react';
import { FaMapMarkerAlt, FaClipboardList, FaDollarSign, FaChartBar, FaDownload } from 'react-icons/fa';

// Mock data sources - In a real app, these would come from API/Context
const villagesData = [
  {
    id: '1',
    name: 'Rampur',
    district: 'Sitapur',
    state: 'Uttar Pradesh',
    population: 3500,
    status: 'under_assessment',
    registeredDate: '2024-10-15',
    assignedOfficer: 'Rajesh Kumar',
    score: 75,
  },
  {
    id: '2',
    name: 'Krishnanagar',
    district: 'Sitapur',
    state: 'Uttar Pradesh',
    population: 2800,
    status: 'in_development',
    registeredDate: '2024-09-20',
    assignedOfficer: 'Priya Sharma',
    score: 68,
  },
  {
    id: '3',
    name: 'Shanti Nagar',
    district: 'Sitapur',
    state: 'Uttar Pradesh',
    population: 4200,
    status: 'adarsh_gram',
    registeredDate: '2024-08-10',
    assignedOfficer: 'Amit Singh',
    score: 85,
  },
];

const projectsData = [
  { id: '1', name: 'Road Construction', village: 'Rampur', category: 'Infrastructure', budget: 500000, status: 'completed', completedDate: '2024-10-20' },
  { id: '2', name: 'Primary Health Center', village: 'Krishnanagar', category: 'Healthcare', budget: 300000, status: 'in_progress', completedDate: null },
  { id: '3', name: 'School Building', village: 'Shanti Nagar', category: 'Education', budget: 400000, status: 'completed', completedDate: '2024-09-15' },
  { id: '4', name: 'Water Pipeline', village: 'Rampur', category: 'Water & Sanitation', budget: 250000, status: 'in_progress', completedDate: null },
  { id: '5', name: 'Community Hall', village: 'Krishnanagar', category: 'Infrastructure', budget: 300000, status: 'completed', completedDate: '2024-11-01' },
  { id: '6', name: 'Drainage System', village: 'Shanti Nagar', category: 'Water & Sanitation', budget: 350000, status: 'completed', completedDate: '2024-10-10' },
  { id: '7', name: 'Street Lights', village: 'Rampur', category: 'Infrastructure', budget: 150000, status: 'in_progress', completedDate: null },
  { id: '8', name: 'Dispensary', village: 'Krishnanagar', category: 'Healthcare', budget: 200000, status: 'in_progress', completedDate: null },
  { id: '9', name: 'Library', village: 'Shanti Nagar', category: 'Education', budget: 100000, status: 'completed', completedDate: '2024-08-25' },
  { id: '10', name: 'Public Toilet', village: 'Rampur', category: 'Water & Sanitation', budget: 100000, status: 'completed', completedDate: '2024-09-30' },
  { id: '11', name: 'Computer Lab', village: 'Krishnanagar', category: 'Education', budget: 200000, status: 'in_progress', completedDate: null },
  { id: '12', name: 'Health Camp', village: 'Shanti Nagar', category: 'Healthcare', budget: 100000, status: 'completed', completedDate: '2024-10-05' },
  { id: '13', name: 'Solar Panels', village: 'Rampur', category: 'Infrastructure', budget: 250000, status: 'in_progress', completedDate: null },
  { id: '14', name: 'Playground', village: 'Krishnanagar', category: 'Education', budget: 150000, status: 'completed', completedDate: '2024-10-28' },
  { id: '15', name: 'Sewage Treatment', village: 'Shanti Nagar', category: 'Water & Sanitation', budget: 400000, status: 'in_progress', completedDate: null },
];

const problemReportsData = [
  { id: '1', title: 'Water Shortage', village: 'Rampur', category: 'Water Supply', status: 'resolved', priority: 'high', createdAt: '2024-10-01' },
  { id: '2', title: 'Road Damage', village: 'Krishnanagar', category: 'Infrastructure', status: 'in_progress', priority: 'medium', createdAt: '2024-10-15' },
  { id: '3', title: 'No Street Lights', village: 'Shanti Nagar', category: 'Infrastructure', status: 'resolved', priority: 'low', createdAt: '2024-09-20' },
  { id: '4', title: 'Health Center Closed', village: 'Rampur', category: 'Healthcare', status: 'pending', priority: 'critical', createdAt: '2024-11-01' },
  { id: '5', title: 'School Roof Leak', village: 'Krishnanagar', category: 'Education', status: 'resolved', priority: 'medium', createdAt: '2024-09-10' },
  // Add more problem reports
  ...Array.from({ length: 32 }, (_, i) => ({
    id: `${i + 6}`,
    title: `Problem ${i + 6}`,
    village: villagesData[i % 3].name,
    category: ['Infrastructure', 'Healthcare', 'Water Supply', 'Education'][i % 4],
    status: i % 3 === 0 ? 'resolved' : i % 3 === 1 ? 'in_progress' : 'pending',
    priority: ['low', 'medium', 'high', 'critical'][i % 4],
    createdAt: `2024-${String(Math.floor(Math.random() * 3) + 9).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
  })),
];

const Analytics: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('year');
  const [selectedVillage, setSelectedVillage] = useState('all');

  // Helper function to get date range based on selected period
  const getDateRange = useMemo(() => {
    const now = new Date();
    let startDate: Date;
    
    switch (selectedPeriod) {
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case 'quarter':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case 'year':
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
    }
    
    return { startDate, endDate: now };
  }, [selectedPeriod]);

  // Dynamic calculations with date filtering
  const filteredProjects = useMemo(() => {
    let filtered = projectsData;
    
    // Filter by village
    if (selectedVillage !== 'all') {
      const villageName = villagesData.find(v => v.name.toLowerCase() === selectedVillage)?.name;
      filtered = filtered.filter(p => p.village === villageName);
    }
    
    // Filter by date period (using completedDate for completed projects, or include all in-progress)
    filtered = filtered.filter(p => {
      if (p.status === 'in_progress') return true; // Always include ongoing projects
      if (p.completedDate) {
        const completedDate = new Date(p.completedDate);
        return completedDate >= getDateRange.startDate && completedDate <= getDateRange.endDate;
      }
      return false;
    });
    
    return filtered;
  }, [selectedVillage, getDateRange]);

  const filteredReports = useMemo(() => {
    let filtered = problemReportsData;
    
    // Filter by village
    if (selectedVillage !== 'all') {
      const villageName = villagesData.find(v => v.name.toLowerCase() === selectedVillage)?.name;
      filtered = filtered.filter(r => r.village === villageName);
    }
    
    // Filter by date period
    filtered = filtered.filter(r => {
      const createdDate = new Date(r.createdAt);
      return createdDate >= getDateRange.startDate && createdDate <= getDateRange.endDate;
    });
    
    return filtered;
  }, [selectedVillage, getDateRange]);

  const filteredVillages = useMemo(() => {
    let filtered = villagesData;
    
    // Filter by village
    if (selectedVillage !== 'all') {
      filtered = filtered.filter(v => v.name.toLowerCase() === selectedVillage);
    }
    
    // Filter by date period (villages registered in the period)
    filtered = filtered.filter(v => {
      const registeredDate = new Date(v.registeredDate);
      return registeredDate >= getDateRange.startDate && registeredDate <= getDateRange.endDate;
    });
    
    return filtered;
  }, [selectedVillage, getDateRange]);

  const stats = useMemo(() => {
    const totalVillages = filteredVillages.length;
    const totalProjects = filteredProjects.length;
    const completedProjects = filteredProjects.filter(p => p.status === 'completed').length;
    const totalBudget = filteredProjects.reduce((sum, p) => sum + p.budget, 0);
    const resolvedReports = filteredReports.filter(r => r.status === 'resolved').length;
    const activeReports = filteredReports.filter(r => r.status === 'pending' || r.status === 'in_progress').length;
    const averageScore = filteredVillages.length > 0 
      ? Math.round(filteredVillages.reduce((sum, v) => sum + v.score, 0) / filteredVillages.length)
      : 0;

    return {
      totalVillages,
      totalProjects,
      totalBudget,
      completedProjects,
      activeReports,
      resolvedReports,
      averageScore,
    };
  }, [filteredVillages, filteredProjects, filteredReports]);

  const categoryData = useMemo(() => {
    const categories = ['Infrastructure', 'Healthcare', 'Education', 'Water & Sanitation'];
    return categories.map(category => {
      const categoryProjects = filteredProjects.filter(p => p.category === category);
      const completed = categoryProjects.filter(p => p.status === 'completed').length;
      const budget = categoryProjects.reduce((sum, p) => sum + p.budget, 0);
      return {
        name: category,
        projects: categoryProjects.length,
        budget,
        completed,
      };
    }).filter(c => c.projects > 0); // Only show categories with projects
  }, [filteredProjects]);

  const topPerformingVillages = useMemo(() => {
    return [...villagesData]
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
  }, []);

  const priorityAreas = useMemo(() => {
    const categories = ['Infrastructure', 'Healthcare', 'Water & Sanitation', 'Education'];
    const problemCounts = categories.map(category => ({
      name: category,
      count: filteredReports.filter(r => 
        r.category === category && (r.status === 'pending' || r.status === 'in_progress')
      ).length,
    }));
    return problemCounts
      .sort((a, b) => b.count - a.count)
      .slice(0, 3)
      .filter(p => p.count > 0);
  }, [filteredReports]);

  const recentAssessments = useMemo(() => {
    return filteredVillages
      .map(v => ({
        village: v.name,
        score: v.score,
        date: v.registeredDate,
      }))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 3);
  }, [filteredVillages]);

  const exportReport = () => {
    const reportData = {
      period: selectedPeriod,
      village: selectedVillage,
      stats,
      categories: categoryData,
      generated: new Date().toISOString(),
    };
    
    const dataStr = JSON.stringify(reportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `analytics-report-${selectedVillage}-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-gray-200 pb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
            <p className="text-gray-600 mt-2 text-lg">
              Comprehensive insights and performance metrics
            </p>
          </div>
          <button
            onClick={exportReport}
            className="btn-primary flex items-center"
          >
            <div className="w-5 h-5 bg-black rounded flex items-center justify-center mr-2">
              {React.createElement(FaDownload as React.ComponentType<any>, { className: "text-white", style: { fontSize: '12px' } })}
            </div>
            Export Report
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Time Period</label>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="w-full pl-4 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
            >
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
              <option value="quarter">Last Quarter</option>
              <option value="year">Last Year</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Village</label>
            <select
              value={selectedVillage}
              onChange={(e) => setSelectedVillage(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
            >
              <option value="all">All Villages</option>
              {villagesData.map((village) => (
                <option key={village.id} value={village.name.toLowerCase()}>
                  {village.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 uppercase">Total Villages</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalVillages}</p>
              <p className="text-sm text-green-600 mt-1">↑ 15% from last month</p>
            </div>
            <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center">
              {React.createElement(FaMapMarkerAlt as React.ComponentType<any>, { className: "text-white text-xl" })}
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 uppercase">Total Projects</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalProjects}</p>
              <p className="text-sm text-green-600 mt-1">↑ 8% from last month</p>
            </div>
            <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center">
              {React.createElement(FaClipboardList as React.ComponentType<any>, { className: "text-white text-xl" })}
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 uppercase">Total Budget</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">₹{(stats.totalBudget / 100000).toFixed(1)}L</p>
              <p className="text-sm text-green-600 mt-1">↑ 22% from last month</p>
            </div>
            <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center">
              {React.createElement(FaDollarSign as React.ComponentType<any>, { className: "text-white text-xl" })}
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 uppercase">Avg Score</p>
              <p className="text-3xl font-bold text-yellow-600 mt-2">{stats.averageScore}%</p>
              <p className="text-sm text-green-600 mt-1">↑ 5% from last month</p>
            </div>
            <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center">
              {React.createElement(FaChartBar as React.ComponentType<any>, { className: "text-white text-xl" })}
            </div>
          </div>
        </div>
      </div>

      {/* Projects & Reports Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Status</h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Completed</span>
                <span className="text-sm font-bold text-gray-900">{stats.completedProjects} / {stats.totalProjects}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-green-600 h-3 rounded-full"
                  style={{ width: `${(stats.completedProjects / stats.totalProjects) * 100}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">In Progress</span>
                <span className="text-sm font-bold text-gray-900">{stats.totalProjects - stats.completedProjects} / {stats.totalProjects}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-blue-600 h-3 rounded-full"
                  style={{ width: `${((stats.totalProjects - stats.completedProjects) / stats.totalProjects) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Problem Reports</h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Resolved</span>
                <span className="text-sm font-bold text-gray-900">{stats.resolvedReports} / {stats.resolvedReports + stats.activeReports}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-green-600 h-3 rounded-full"
                  style={{ width: `${(stats.resolvedReports / (stats.resolvedReports + stats.activeReports)) * 100}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Active</span>
                <span className="text-sm font-bold text-gray-900">{stats.activeReports} / {stats.resolvedReports + stats.activeReports}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-orange-600 h-3 rounded-full"
                  style={{ width: `${(stats.activeReports / (stats.resolvedReports + stats.activeReports)) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Projects by Category</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Projects</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Completed</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Budget</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {categoryData.map((category) => (
                <tr key={category.name} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{category.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{category.projects}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{category.completed}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">₹{(category.budget / 100000).toFixed(1)}L</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-32 bg-gray-200 rounded-full h-2 mr-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${(category.completed / category.projects) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {Math.round((category.completed / category.projects) * 100)}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Villages</h3>
          <div className="space-y-3">
            {topPerformingVillages.map((village) => (
              <div key={village.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">{village.name}</span>
                <span className="text-sm font-bold text-green-600">{village.score}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Priority Areas</h3>
          <div className="space-y-3">
            {priorityAreas.length > 0 ? (
              priorityAreas.map((area) => (
                <div key={area.name} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">{area.name}</span>
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-600 text-white">
                    {area.count} Active Issues
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">No priority areas at the moment</p>
            )}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Assessments</h3>
          <div className="space-y-3">
            {recentAssessments.map((assessment, idx) => (
              <div key={idx} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">{assessment.village}</span>
                  <span className="text-sm font-bold text-gray-900">{assessment.score}%</span>
                </div>
                <span className="text-xs text-gray-500">{new Date(assessment.date).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
