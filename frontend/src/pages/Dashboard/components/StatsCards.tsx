import React from 'react';
import { FaMapMarkedAlt, FaExclamationTriangle, FaClipboardCheck, FaStar } from 'react-icons/fa';

interface StatCard {
  title: string;
  value: string | number;
  change: string;
  changeType: 'increase' | 'decrease' | 'neutral';
  icon: React.ReactNode;
}

const StatsCards: React.FC = () => {
  const stats: StatCard[] = [
    {
      title: 'Total Villages',
      value: 1247,
      change: '+12 this month',
      changeType: 'increase',
      icon: React.createElement(FaMapMarkedAlt as React.ComponentType<any>, { className: "text-white text-xl" }),
    },
    {
      title: 'Pending Reports',
      value: 89,
      change: '-5 from yesterday',
      changeType: 'decrease',
      icon: React.createElement(FaExclamationTriangle as React.ComponentType<any>, { className: "text-white text-xl" }),
    },
    {
      title: 'Assessments Completed',
      value: 342,
      change: '+23 this week',
      changeType: 'increase',
      icon: React.createElement(FaClipboardCheck as React.ComponentType<any>, { className: "text-white text-xl" }),
    },
    {
      title: 'Adarsh Grams',
      value: 23,
      change: '+2 this quarter',
      changeType: 'increase',
      icon: React.createElement(FaStar as React.ComponentType<any>, { className: "text-white text-xl" }),
    },
  ];

  const getChangeColor = (type: StatCard['changeType']) => {
    switch (type) {
      case 'increase':
        return 'text-gray-600';
      case 'decrease':
        return 'text-gray-600';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 p-6 group cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                {stat.title}
              </p>
              <p className="text-3xl font-bold text-gray-900 mt-2 group-hover:text-gray-800 transition-colors">
                {stat.value.toLocaleString()}
              </p>
              <p className={`text-sm mt-2 font-medium ${getChangeColor(stat.changeType)}`}>
                {stat.change}
              </p>
            </div>
            <div className="shrink-0">
              <div className="w-14 h-14 bg-black rounded-xl flex items-center justify-center group-hover:bg-gray-800 transition-colors">
                {stat.icon}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;