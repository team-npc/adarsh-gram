import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaAward, FaArrowRight, FaChevronDown, FaClipboardCheck, 
  FaBookOpen, FaHeartbeat, FaToilet, FaBolt, FaWifi, FaTint,
  FaBriefcase, FaDollarSign, FaUserPlus, FaClipboardList,
  FaChartBar, FaCheckCircle, FaMapMarkerAlt, FaExclamationTriangle,
  FaTasks, FaUsers, FaEye, FaUserCheck, FaUserTie, FaShieldAlt
} from 'react-icons/fa';
import type { IconType } from 'react-icons';

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Hero Section */}
      <div 
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('/hero-section.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          filter: 'grayscale(30%)'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/40 via-transparent to-gray-900/60"></div>
        
        {/* Main Content */}
        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto mt-16">
          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
            <span className="text-white">Transform SC-Majority Villages into </span>
            <span className="text-yellow-400">Adarsh Grams</span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-gray-200 mb-6 max-w-3xl mx-auto leading-relaxed">
            Supporting PM-AJAY's mission to holistically develop Scheduled Caste majority villages through data-driven gap identification and systematic infrastructure development.
          </p>
          
          {/* Problem Statement Badge */}
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/10 backdrop-blur-md rounded-full border-2 border-yellow-400/50 mb-8">
            <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
              {React.createElement(FaAward as React.ComponentType<any>, { className: "text-white text-sm" })}
            </div>
            <span className="text-sm font-semibold text-white">Pradhan Mantri Anusuchit Jaati Abhyudaya Yojana (PM-AJAY)</span>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <button
              onClick={() => navigate('/login')}
              className="group w-full sm:w-auto px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold rounded-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <div className="w-5 h-5 bg-black rounded-md flex items-center justify-center">
                {React.createElement(FaCheckCircle as React.ComponentType<any>, { className: "text-white text-xs" })}
              </div>
              <span>Start Your Journey</span>
              {React.createElement(FaArrowRight as React.ComponentType<any>, { className: "transform group-hover:translate-x-1 transition-transform" })}
            </button>
            
            {/* <button
              onClick={() => navigate('/auth/login')}
              className="group flex items-center gap-3 px-8 py-4 bg-white/10 backdrop-blur-md border-2 border-white/20 rounded-lg text-white hover:bg-white hover:text-gray-900 transition-all duration-300"
            >
              <div className="w-5 h-5 bg-black rounded-md flex items-center justify-center">
                {React.createElement(FaArrowRight as React.ComponentType<any>, { className: "text-white text-xs" })}
              </div>
              <span>Sign In</span>
            </button> */}
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
            {React.createElement(FaChevronDown as React.ComponentType<any>, { className: "text-white" })}
          </div>
        </div>
      </div>

      {/* About PM-AJAY Section */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-start space-x-4 mb-8">
            <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center flex-shrink-0">
              {React.createElement(FaClipboardCheck as React.ComponentType<any>, { className: "text-white text-2xl" })}
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                About the Initiative
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-4">
                The <strong>Pradhan Mantri Anusuchit Jaati Abhyudaya Yojana (PM-AJAY)</strong> aims to holistically develop Scheduled Caste (SC) majority villages into <strong>Adarsh Grams (Model Villages)</strong> by addressing critical gaps in infrastructure and services.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                Our platform supports this mission by providing a comprehensive digital solution to identify infrastructure gaps, track development projects, and monitor progress across key focus areas including education, healthcare, sanitation, connectivity, drinking water, electricity, skill development, and livelihood opportunities.
              </p>
            </div>
          </div>
          
          {/* Focus Areas Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <div className="bg-white border-2 border-gray-200 hover:border-black rounded-lg p-4 text-center transition-all">
              <div className="w-12 h-12 bg-black rounded-lg mx-auto mb-2 flex items-center justify-center">
                {React.createElement(FaBookOpen as React.ComponentType<any>, { className: "text-white text-xl" })}
              </div>
              <p className="text-sm font-semibold text-gray-900">Education</p>
            </div>
            <div className="bg-white border-2 border-gray-200 hover:border-black rounded-lg p-4 text-center transition-all">
              <div className="w-12 h-12 bg-black rounded-lg mx-auto mb-2 flex items-center justify-center">
                {React.createElement(FaHeartbeat as React.ComponentType<any>, { className: "text-white text-xl" })}
              </div>
              <p className="text-sm font-semibold text-gray-900">Healthcare</p>
            </div>
            <div className="bg-white border-2 border-gray-200 hover:border-black rounded-lg p-4 text-center transition-all">
              <div className="w-12 h-12 bg-black rounded-lg mx-auto mb-2 flex items-center justify-center">
                {React.createElement(FaToilet as React.ComponentType<any>, { className: "text-white text-xl" })}
              </div>
              <p className="text-sm font-semibold text-gray-900">Sanitation</p>
            </div>
            <div className="bg-white border-2 border-gray-200 hover:border-black rounded-lg p-4 text-center transition-all">
              <div className="w-12 h-12 bg-black rounded-lg mx-auto mb-2 flex items-center justify-center">
                {React.createElement(FaBolt as React.ComponentType<any>, { className: "text-white text-xl" })}
              </div>
              <p className="text-sm font-semibold text-gray-900">Electricity</p>
            </div>
            <div className="bg-white border-2 border-gray-200 hover:border-black rounded-lg p-4 text-center transition-all">
              <div className="w-12 h-12 bg-black rounded-lg mx-auto mb-2 flex items-center justify-center">
                {React.createElement(FaWifi as React.ComponentType<any>, { className: "text-white text-xl" })}
              </div>
              <p className="text-sm font-semibold text-gray-900">Connectivity</p>
            </div>
            <div className="bg-white border-2 border-gray-200 hover:border-black rounded-lg p-4 text-center transition-all">
              <div className="w-12 h-12 bg-black rounded-lg mx-auto mb-2 flex items-center justify-center">
                {React.createElement(FaTint as React.ComponentType<any>, { className: "text-white text-xl" })}
              </div>
              <p className="text-sm font-semibold text-gray-900">Water Supply</p>
            </div>
            <div className="bg-white border-2 border-gray-200 hover:border-black rounded-lg p-4 text-center transition-all">
              <div className="w-12 h-12 bg-black rounded-lg mx-auto mb-2 flex items-center justify-center">
                {React.createElement(FaBriefcase as React.ComponentType<any>, { className: "text-white text-xl" })}
              </div>
              <p className="text-sm font-semibold text-gray-900">Skill Dev.</p>
            </div>
            <div className="bg-white border-2 border-gray-200 hover:border-black rounded-lg p-4 text-center transition-all">
              <div className="w-12 h-12 bg-black rounded-lg mx-auto mb-2 flex items-center justify-center">
                {React.createElement(FaDollarSign as React.ComponentType<any>, { className: "text-white text-xl" })}
              </div>
              <p className="text-sm font-semibold text-gray-900">Livelihood</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A simple 4-step process to identify gaps and transform your village into an Adarsh Gram
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Step 1 */}
            <div className="relative h-full">
              <div className="bg-white rounded-2xl p-8 border-2 border-gray-200 hover:border-black hover:shadow-xl transition-all h-full flex flex-col">
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-black rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-xl">1</span>
                </div>
                <div className="w-16 h-16 bg-black rounded-xl flex items-center justify-center mb-4 mt-4">
                  {React.createElement(FaUserPlus as React.ComponentType<any>, { className: "text-white text-2xl" })}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Register Village</h3>
                <p className="text-gray-600 flex-grow">
                  Create an account and register your SC-majority village with basic demographic and geographic information.
                </p>
              </div>
            </div>
            
            {/* Step 2 */}
            <div className="relative h-full">
              <div className="bg-white rounded-2xl p-8 border-2 border-gray-200 hover:border-black hover:shadow-xl transition-all h-full flex flex-col">
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-black rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-xl">2</span>
                </div>
                <div className="w-16 h-16 bg-black rounded-xl flex items-center justify-center mb-4 mt-4">
                  {React.createElement(FaClipboardList as React.ComponentType<any>, { className: "text-white text-2xl" })}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Conduct Assessment</h3>
                <p className="text-gray-600 flex-grow">
                  Complete comprehensive gap assessments across 10+ categories covering all PM-AJAY focus areas.
                </p>
              </div>
            </div>
            
            {/* Step 3 */}
            <div className="relative h-full">
              <div className="bg-white rounded-2xl p-8 border-2 border-gray-200 hover:border-black hover:shadow-xl transition-all h-full flex flex-col">
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-black rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-xl">3</span>
                </div>
                <div className="w-16 h-16 bg-black rounded-xl flex items-center justify-center mb-4 mt-4">
                  {React.createElement(FaChartBar as React.ComponentType<any>, { className: "text-white text-2xl" })}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Analyze Data</h3>
                <p className="text-gray-600 flex-grow">
                  View real-time analytics, gap reports, and prioritized recommendations for infrastructure development.
                </p>
              </div>
            </div>
            
            {/* Step 4 */}
            <div className="relative h-full">
              <div className="bg-white rounded-2xl p-8 border-2 border-gray-200 hover:border-black hover:shadow-xl transition-all h-full flex flex-col">
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-black rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-xl">4</span>
                </div>
                <div className="w-16 h-16 bg-black rounded-xl flex items-center justify-center mb-4 mt-4">
                  {React.createElement(FaCheckCircle as React.ComponentType<any>, { className: "text-white text-2xl" })}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Track Progress</h3>
                <p className="text-gray-600 flex-grow">
                  Monitor project execution, report problems, and track village transformation towards Adarsh Gram status.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Comprehensive Platform Features
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to identify gaps, plan interventions, and achieve Adarsh Gram declaration
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group p-8 bg-gradient-to-br from-gray-50 to-white rounded-2xl border-2 border-gray-100 hover:border-gray-900 hover:shadow-2xl transition-all duration-300">
              <div className="w-16 h-16 bg-black rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {React.createElement(FaMapMarkerAlt as React.ComponentType<any>, { className: "text-white text-2xl" })}
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Village Tracking</h3>
              <p className="text-gray-600 leading-relaxed">
                Register and monitor villages with comprehensive data on infrastructure, demographics, and development status.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group p-8 bg-gradient-to-br from-gray-50 to-white rounded-2xl border-2 border-gray-100 hover:border-gray-900 hover:shadow-2xl transition-all duration-300">
              <div className="w-16 h-16 bg-black rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {React.createElement(FaClipboardCheck as React.ComponentType<any>, { className: "text-white text-2xl" })}
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Gap Assessment</h3>
              <p className="text-gray-600 leading-relaxed">
                Conduct detailed assessments across 10+ categories to identify development gaps and prioritize interventions.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group p-8 bg-gradient-to-br from-gray-50 to-white rounded-2xl border-2 border-gray-100 hover:border-gray-900 hover:shadow-2xl transition-all duration-300">
              <div className="w-16 h-16 bg-black rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {React.createElement(FaChartBar as React.ComponentType<any>, { className: "text-white text-2xl" })}
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Real-time Analytics & Reports</h3>
              <p className="text-gray-600 leading-relaxed">
                Track progress with dynamic dashboards, gap analysis reports, and data visualizations to monitor Adarsh Gram readiness.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="group p-8 bg-gradient-to-br from-gray-50 to-white rounded-2xl border-2 border-gray-100 hover:border-gray-900 hover:shadow-2xl transition-all duration-300">
              <div className="w-16 h-16 bg-black rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {React.createElement(FaExclamationTriangle as React.ComponentType<any>, { className: "text-white text-2xl" })}
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Problem Reporting</h3>
              <p className="text-gray-600 leading-relaxed">
                Enable villagers and coordinators to report issues instantly and track resolution in real-time.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="group p-8 bg-gradient-to-br from-gray-50 to-white rounded-2xl border-2 border-gray-100 hover:border-gray-900 hover:shadow-2xl transition-all duration-300">
              <div className="w-16 h-16 bg-black rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {React.createElement(FaTasks as React.ComponentType<any>, { className: "text-white text-2xl" })}
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Project Management</h3>
              <p className="text-gray-600 leading-relaxed">
                Plan, execute, and monitor development projects with milestones, budgets, and progress tracking.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="group p-8 bg-gradient-to-br from-gray-50 to-white rounded-2xl border-2 border-gray-100 hover:border-gray-900 hover:shadow-2xl transition-all duration-300">
              <div className="w-16 h-16 bg-black rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {React.createElement(FaUsers as React.ComponentType<any>, { className: "text-white text-2xl" })}
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Role-Based Access</h3>
              <p className="text-gray-600 leading-relaxed">
                Secure, role-based system for viewers, assessors, coordinators, and administrators with proper permissions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* User Roles Section */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Who Can Use This Platform?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Role-based access for different stakeholders in the village development ecosystem
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white border-2 border-gray-200 hover:border-black rounded-xl p-6 hover:shadow-xl transition-all">
              <div className="w-14 h-14 bg-black rounded-full flex items-center justify-center mb-4">
                {React.createElement(FaEye as React.ComponentType<any>, { className: "text-white text-xl" })}
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Viewer</h3>
              <p className="text-sm text-gray-600">
                View village data, reports, and progress. Ideal for monitoring and research purposes.
              </p>
            </div>
            
            <div className="bg-white border-2 border-gray-200 hover:border-black rounded-xl p-6 hover:shadow-xl transition-all">
              <div className="w-14 h-14 bg-black rounded-full flex items-center justify-center mb-4">
                {React.createElement(FaUserCheck as React.ComponentType<any>, { className: "text-white text-xl" })}
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Assessor</h3>
              <p className="text-sm text-gray-600">
                Conduct gap assessments, update village data, and generate evaluation reports.
              </p>
            </div>
            
            <div className="bg-white border-2 border-gray-200 hover:border-black rounded-xl p-6 hover:shadow-xl transition-all">
              <div className="w-14 h-14 bg-black rounded-full flex items-center justify-center mb-4">
                {React.createElement(FaUserTie as React.ComponentType<any>, { className: "text-white text-xl" })}
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Coordinator</h3>
              <p className="text-sm text-gray-600">
                Manage projects, report problems, coordinate development activities and track implementation.
              </p>
            </div>
            
            <div className="bg-white border-2 border-gray-200 hover:border-black rounded-xl p-6 hover:shadow-xl transition-all">
              <div className="w-14 h-14 bg-black rounded-full flex items-center justify-center mb-4">
                {React.createElement(FaShieldAlt as React.ComponentType<any>, { className: "text-white text-xl" })}
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Administrator</h3>
              <p className="text-sm text-gray-600">
                Full system access, user management, village approval, and comprehensive oversight.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Transform Your Village into an Adarsh Gram?
          </h2>
          <p className="text-xl text-gray-300 mb-10">
            Join the PM-AJAY initiative and be part of India's holistic rural development mission.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <button
              onClick={() => navigate('/register')}
              className="px-10 py-5 bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold text-lg rounded-xl shadow-2xl hover:shadow-yellow-500/50 transform hover:scale-105 transition-all duration-300"
            >
              Register Your Village
            </button>
            <button
              onClick={() => navigate('/login')}
              className="px-10 py-5 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white font-bold text-lg rounded-xl border-2 border-white/30 hover:border-white/50 shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              Sign In to Continue
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">About PM-AJAY</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Pradhan Mantri Anusuchit Jaati Abhyudaya Yojana aims to develop SC-majority villages into Adarsh Grams through holistic infrastructure development.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><button onClick={() => navigate('/register')} className="hover:text-gray-900 transition-colors">Register Village</button></li>
                <li><button onClick={() => navigate('/login')} className="hover:text-gray-900 transition-colors">Sign In</button></li>
                <li><a href="#features" className="hover:text-gray-900 transition-colors">Features</a></li>
                <li><a href="#how-it-works" className="hover:text-gray-900 transition-colors">How It Works</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Contact</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                For support and queries regarding the platform, please contact your district coordinator or administrator.
              </p>
            </div>
          </div>
          <div className="text-center pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              © 2025 PM-AJAY Adarsh Gram Platform. Building a better tomorrow, one village at a time.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
