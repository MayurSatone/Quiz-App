import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const DashboardLayout = () => {
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-20 bg-white shadow-sm border-b border-gray-200">
        <div className="px-4 sm:px-6">
          <div className="flex justify-between h-16 items-center">
            {/* Left side - logo and mobile menu button */}
            <div className="flex items-center">
              <button
                onClick={() => setMobileSidebarOpen(true)}
                className="mr-3 text-gray-500 hover:text-gray-700 md:hidden"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <img 
                src="/quiz-logo.png" 
                alt="Quiz Logo" 
                className="h-8 w-auto" 
              />
            </div>

            {/* Right side - user info and logout */}
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500 hidden sm:inline">Welcome, {currentUser.username}</span>
              <button
                onClick={handleLogout}
                className="whitespace-nowrap inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 pt-16">
        {/* Mobile Sidebar Overlay */}
        {mobileSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden"
            onClick={() => setMobileSidebarOpen(false)}
          />
        )}

        {/* Sidebar - fixed on desktop, overlay on mobile */}
        <Sidebar 
          isMobileOpen={mobileSidebarOpen} 
          onClose={() => setMobileSidebarOpen(false)} 
        />

        {/* Content Area */}
        <main className="flex-1 md:ml-64 overflow-auto">
          <div className="p-4">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;