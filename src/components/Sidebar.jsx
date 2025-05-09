import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = ({ isMobileOpen, onClose }) => {
  // Get current user from localStorage
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  const role = currentUser?.role || 'user';

  return (
    <>
      {/* Desktop Sidebar (always visible on md+) */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="w-64 fixed h-[calc(100vh-4rem)] bg-white border-r border-gray-200 overflow-y-auto">
          <div className="p-3 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">Menu</h2>
          </div>
          <nav className="p-2">
            <ul className="space-y-1">
              {/* Common Routes for all users */}
              {role !== 'admin' && (
                <li>
                  <NavLink
                    to="/dashboard/home"
                    className={({ isActive }) =>
                      `flex items-center p-2 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-indigo-100 text-indigo-700'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`
                    }
                  >
                    <svg
                      className="w-5 h-5 mr-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                      />
                    </svg>
                    Home
                  </NavLink>
                </li>
              )}
              
              {/* Admin-only Routes */}
              {role === 'admin' ? (
                <>
                  <li className="border-t border-white mt-2 pt-2">
                    <p className="px-2 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Admin
                    </p>
                  </li>
                  <li>
                    <NavLink
                      to="/dashboard/admin"
                      className={({ isActive }) =>
                        `flex items-center p-2 rounded-lg transition-colors ${
                          isActive
                            ? 'bg-indigo-100 text-indigo-700'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`
                      }
                    >
                      <svg
                        className="w-5 h-5 mr-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      Admin Dashboard
                    </NavLink>
                  </li>
                  <li>
                  <NavLink
                    to="/dashboard/quizes"
                    className={({ isActive }) =>
                      `flex items-center p-2 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-indigo-100 text-indigo-700'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`
                    }
                  >
                    <svg
                      className="w-5 h-5 mr-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    Quizes
                  </NavLink>
                </li>
                  <li>
                    <NavLink
                      to="/dashboard/create-quiz"
                      className={({ isActive }) =>
                        `flex items-center p-2 rounded-lg transition-colors ${
                          isActive
                            ? 'bg-indigo-100 text-indigo-700'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`
                      }
                    >
                      <svg
                        className="w-5 h-5 mr-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                      Create Quiz
                    </NavLink>
                  </li>
                </>
              ) : (
                // Regular user quizes link
                <li>
                  <NavLink
                    to="/dashboard/quizes"
                    className={({ isActive }) =>
                      `flex items-center p-2 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-indigo-100 text-indigo-700'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`
                    }
                  >
                    <svg
                      className="w-5 h-5 mr-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    Quizes
                  </NavLink>
                </li>
              )}
            </ul>
          </nav>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-20 w-64 bg-white transform ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-200 ease-in-out md:hidden`}
      >
        <div className="p-3 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Menu</h2>
        </div>
        <nav className="p-2">
          <ul className="space-y-1">
            {/* Common Routes for all users */}
            {role !== 'admin' && (
              <li>
                <NavLink
                  to="/dashboard/home"
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center p-2 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-indigo-100 text-indigo-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`
                  }
                >
                  <svg
                    className="w-5 h-5 mr-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                  Home
                </NavLink>
              </li>
            )}
            
            {/* Admin-only Routes */}
            {role === 'admin' ? (
              <>
                <li className="border-t border-gray-200 mt-2 pt-2">
                  <p className="px-2 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Admin
                  </p>
                </li>
                <li>
                  <NavLink
                    to="/dashboard/admin"
                    onClick={onClose}
                    className={({ isActive }) =>
                      `flex items-center p-2 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-indigo-100 text-indigo-700'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`
                    }
                  >
                    <svg
                      className="w-5 h-5 mr-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    Admin Dashboard
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/dashboard/quizes"
                    onClick={onClose}
                    className={({ isActive }) =>
                      `flex items-center p-2 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-indigo-100 text-indigo-700'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`
                    }
                  >
                    <svg
                      className="w-5 h-5 mr-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    Quizes
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/dashboard/create-quiz"
                    onClick={onClose}
                    className={({ isActive }) =>
                      `flex items-center p-2 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-indigo-100 text-indigo-700'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`
                    }
                  >
                    <svg
                      className="w-5 h-5 mr-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                    Create Quiz
                  </NavLink>
                </li>
              </>
            ) : (
              // Regular user quizes link
              <li>
                <NavLink
                  to="/dashboard/quizes"
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center p-2 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-indigo-100 text-indigo-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`
                  }
                >
                  <svg
                    className="w-5 h-5 mr-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  Quizes
                </NavLink>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;