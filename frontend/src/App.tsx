import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout/Layout';
import Home from './pages/Home/Home';
import Dashboard from './pages/Dashboard/Dashboard';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import VillageManagement from './pages/Villages/VillageManagement';
import ProblemReports from './pages/Reports/ProblemReports';
import Assessments from './pages/Assessments/Assessments';
import Projects from './pages/Projects/Projects';
import Analytics from './pages/Analytics/Analytics';
import Profile from './pages/Profile/Profile';
import ActivityLog from './pages/ActivityLog/ActivityLog';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="villages" element={<VillageManagement />} />
              <Route path="reports" element={<ProblemReports />} />
              <Route path="assessments" element={<Assessments />} />
              <Route path="projects" element={<Projects />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="profile" element={<Profile />} />
              <Route path="activity-log" element={<ActivityLog />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
