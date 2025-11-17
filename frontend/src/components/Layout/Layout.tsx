import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import WelcomeTour from '../Tour/WelcomeTour';
import RoleSelection from '../Auth/RoleSelection';
import { useAuth } from '../../context/AuthContext';

const Layout: React.FC = () => {
  const { isAuthenticated, isFirstTimeUser, markTourComplete, needsRoleAssignment, loading } = useAuth();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated && !needsRoleAssignment) {
    return <Navigate to="/login" replace />;
  }

  // Show role selection if user hasn't assigned a role yet
  if (needsRoleAssignment) {
    return <RoleSelection />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {isFirstTimeUser && <WelcomeTour onComplete={markTourComplete} />}
      <Header />
      <div className="flex pt-16"> {/* Add top padding for fixed header */}
        <Sidebar />
        <main className="flex-1 p-6 ml-64">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;