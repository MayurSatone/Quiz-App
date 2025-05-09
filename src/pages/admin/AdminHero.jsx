import React, { useState, useEffect } from 'react';
import { 
  FiUsers, FiBook, FiClock, FiAward, FiMail, 
  FiUser, FiChevronLeft, FiChevronRight, FiBarChart2, 
  FiActivity, FiTrendingUp, FiDatabase, FiX, FiCheck, FiXCircle 
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { useAutoAnimate } from '@formkit/auto-animate/react';

const AdminHero = () => {
  const [users, setUsers] = useState([]);
  const [quizHistory, setQuizHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [currentUserIndex, setCurrentUserIndex] = useState(0);
  const [totalQuizzes, setTotalQuizzes] = useState(7);
  const [selectedAttempt, setSelectedAttempt] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [parent] = useAutoAnimate();

  // Modern color palette
  const colors = {
    primary: '#6366F1', // Indigo
    secondary: '#8B5CF6', // Violet
    accent: '#EC4899', // Pink
    success: '#10B981', // Emerald
    warning: '#F59E0B', // Amber
    danger: '#EF4444', // Red
    dark: '#1F2937', // Gray-800
    light: '#F9FAFB', // Gray-50
    info: '#3B82F6' // Blue
  };

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      // Load data from localStorage
      const storedUsers = JSON.parse(localStorage.getItem('users')) || [];
      const storedHistory = JSON.parse(localStorage.getItem('quizHistory')) || [];
      const quizzesCollection = JSON.parse(localStorage.getItem('quizzes')) || {};
      
      // Count the quizzes in quizzes collection
      const quizzesCount = Object.keys(quizzesCollection).length;
      // Update total quizzes (default 7 + quizzes in collection)
      setTotalQuizzes(7 + quizzesCount);
      
      // Sort quiz history by date in descending order (newest first)
      const sortedHistory = [...storedHistory].sort((a, b) => 
        new Date(b.date) - new Date(a.date)
      );
      
      setUsers(storedUsers);
      setQuizHistory(sortedHistory);
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  // Format date to dd/mm/yyyy
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Format time to hh:mm:ss AM/PM
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  // Calculate statistics
  const totalUsers = users.length;
  const totalAttempts = quizHistory.length;
  const averageScore = quizHistory.length > 0 
    ? (quizHistory.reduce((sum, attempt) => sum + attempt.percentage, 0) / quizHistory.length).toFixed(2)
    : 0;

  // Get current 3 quiz attempts to display
  const visibleQuizzes = quizHistory.slice(currentQuizIndex, currentQuizIndex + 3);
  
  // Get current 3 users to display
  const visibleUsers = users.slice(currentUserIndex, currentUserIndex + 3);

  // Navigation handlers for quizzes
  const nextQuizzes = () => {
    if (currentQuizIndex + 3 < quizHistory.length) {
      setCurrentQuizIndex(currentQuizIndex + 1);
    }
  };

  const prevQuizzes = () => {
    if (currentQuizIndex > 0) {
      setCurrentQuizIndex(currentQuizIndex - 1);
    }
  };

  // Navigation handlers for users
  const nextUsers = () => {
    if (currentUserIndex + 3 < users.length) {
      setCurrentUserIndex(currentUserIndex + 1);
    }
  };

  const prevUsers = () => {
    if (currentUserIndex > 0) {
      setCurrentUserIndex(currentUserIndex - 1);
    }
  };

  // Calculate user statistics
  const getUserStats = (user) => {
    const userAttempts = quizHistory.filter(attempt => attempt.username === user.username);
    const quizzesTaken = userAttempts.length;
    const averageScore = quizzesTaken > 0 
      ? (userAttempts.reduce((sum, attempt) => sum + attempt.percentage, 0) / quizzesTaken).toFixed(2)
      : 0;
    return { quizzesTaken, averageScore };
  };

  // Show quiz attempt details
  const showAttemptDetails = (attempt) => {
    setSelectedAttempt(attempt);
    setShowModal(true);
  };

  // Close modal
  const closeModal = () => {
    setShowModal(false);
    setSelectedAttempt(null);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 }
  };

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-between items-center mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-500">Welcome back! Here's what's happening with your platform.</p>
          </div>
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="px-4 py-2 rounded-lg bg-white shadow-sm border border-gray-200"
          >
            <p className="text-sm font-medium text-gray-700">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </motion.div>
        </motion.div>
        
        {/* Statistics Cards */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          ref={parent}
        >
          <StatCard 
            icon={<FiUsers className="text-2xl" />}
            title="Total Users"
            value={totalUsers}
            change="+12% from last month"
            color={colors.primary}
            loading={loading}
          />
          <StatCard 
            icon={<FiBook className="text-2xl" />}
            title="Total Quizzes"
            value={totalQuizzes}
            change="+3 new quizzes"
            color={colors.secondary}
            loading={loading}
          />
          <StatCard 
            icon={<FiActivity className="text-2xl" />}
            title="Total Attempts"
            value={totalAttempts}
            change="+24% from last week"
            color={colors.accent}
            loading={loading}
          />
          <StatCard 
            icon={<FiTrendingUp className="text-2xl" />}
            title="Average Score"
            value={`${averageScore}%`}
            change="+2.5% improvement"
            color={colors.success}
            loading={loading}
          />
        </motion.div>

        {/* Users Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <SectionTitle 
            title="User Management" 
            subtitle="Overview of registered users and their activity"
            icon={<FiUser className="text-lg" />}
            color={colors.primary}
          />
          
          {loading ? (
            <LoadingSpinner color={colors.primary} />
          ) : (
            <motion.div 
              className="bg-white rounded-xl shadow-sm overflow-hidden mb-8 border border-gray-200"
              whileHover={{ y: -2 }}
              transition={{ duration: 0.3 }}
            >
              <div className="relative">
                {/* Navigation Arrows */}
                {users.length > 3 && (
                  <>
                    <motion.button 
                      onClick={prevUsers}
                      disabled={currentUserIndex === 0}
                      className={`absolute left-2 top-1/2 transform -translate-y-1/2 z-10 p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-all ${currentUserIndex === 0 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-50'}`}
                      style={{ color: colors.primary }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <FiChevronLeft className="text-xl" />
                    </motion.button>
                    <motion.button 
                      onClick={nextUsers}
                      disabled={currentUserIndex + 3 >= users.length}
                      className={`absolute right-2 top-1/2 transform -translate-y-1/2 z-10 p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-all ${currentUserIndex + 3 >= users.length ? 'text-gray-300 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-50'}`}
                      style={{ color: colors.primary }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <FiChevronRight className="text-xl" />
                    </motion.button>
                  </>
                )}

                {/* Users Table */}
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <TableHeader color={colors.primary}>Username</TableHeader>
                        <TableHeader color={colors.primary}>Email</TableHeader>
                        <TableHeader color={colors.primary}>Quizzes Taken</TableHeader>
                        <TableHeader color={colors.primary}>Avg. Score</TableHeader>
                        <TableHeader color={colors.primary}>Status</TableHeader>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {visibleUsers.map((user, index) => {
                        const { quizzesTaken, averageScore } = getUserStats(user);
                        return (
                          <motion.tr 
                            key={user.email} 
                            className="hover:bg-gray-50 transition-colors"
                            variants={itemVariants}
                            initial="hidden"
                            animate="show"
                            transition={{ delay: index * 0.1 }}
                          >
                            <TableCell>
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                                  <FiUser className="text-indigo-600" />
                                </div>
                                <div className="ml-4">
                                  <div className="font-medium text-gray-900">{user.username}</div>
                                  <div className="text-gray-500">Joined {formatDate(user.joinDate || new Date())}</div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text-gray-900">{user.email}</div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <div className="w-16 bg-gray-200 rounded-full h-2.5 mr-2">
                                  <div 
                                    className="h-2.5 rounded-full" 
                                    style={{ 
                                      width: `${Math.min(quizzesTaken / 10 * 100, 100)}%`,
                                      backgroundColor: colors.primary
                                    }}
                                  ></div>
                                </div>
                                <span className="text-gray-900">{quizzesTaken}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <span 
                                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    quizzesTaken > 0 ? 
                                      (parseFloat(averageScore) >= 70 ? 'bg-green-100 text-green-800' : 
                                       parseFloat(averageScore) >= 50 ? 'bg-yellow-100 text-yellow-800' : 
                                       'bg-red-100 text-red-800') : 
                                      'bg-gray-100 text-gray-800'
                                  }`}
                                >
                                  {quizzesTaken > 0 ? `${averageScore}%` : 'N/A'}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <span className="px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                                Active
                              </span>
                            </TableCell>
                          </motion.tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Pagination Indicator */}
              {users.length > 3 && (
                <div className="flex justify-between items-center px-6 py-3 bg-gray-50 border-t border-gray-200">
                  <span className="text-sm text-gray-500">
                    Showing {currentUserIndex + 1}-{Math.min(currentUserIndex + 3, users.length)} of {users.length} users
                  </span>
                  <div className="flex space-x-2">
                    <motion.button 
                      onClick={prevUsers}
                      disabled={currentUserIndex === 0}
                      className={`px-3 py-1 rounded-md text-sm ${currentUserIndex === 0 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
                      whileTap={{ scale: 0.95 }}
                    >
                      Previous
                    </motion.button>
                    <motion.button 
                      onClick={nextUsers}
                      disabled={currentUserIndex + 3 >= users.length}
                      className={`px-3 py-1 rounded-md text-sm ${currentUserIndex + 3 >= users.length ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
                      whileTap={{ scale: 0.95 }}
                    >
                      Next
                    </motion.button>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </motion.div>

        {/* Quiz History Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <SectionTitle 
            title="Recent Quiz Activity" 
            subtitle="Detailed view of recent quiz attempts"
            icon={<FiDatabase className="text-lg" />}
            color={colors.secondary}
          />
          
          {loading ? (
            <LoadingSpinner color={colors.secondary} />
          ) : (
            <motion.div 
              className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200"
              whileHover={{ y: -2 }}
              transition={{ duration: 0.3 }}
            >
              <div className="relative">
                {/* Navigation Arrows */}
                {quizHistory.length > 3 && (
                  <>
                    <motion.button 
                      onClick={prevQuizzes}
                      disabled={currentQuizIndex === 0}
                      className={`absolute left-2 top-1/2 transform -translate-y-1/2 z-10 p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-all ${currentQuizIndex === 0 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-50'}`}
                      style={{ color: colors.secondary }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <FiChevronLeft className="text-xl" />
                    </motion.button>
                    <motion.button 
                      onClick={nextQuizzes}
                      disabled={currentQuizIndex + 3 >= quizHistory.length}
                      className={`absolute right-2 top-1/2 transform -translate-y-1/2 z-10 p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-all ${currentQuizIndex + 3 >= quizHistory.length ? 'text-gray-300 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-50'}`}
                      style={{ color: colors.secondary }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <FiChevronRight className="text-xl" />
                    </motion.button>
                  </>
                )}

                {/* Quiz Attempts Table */}
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <TableHeader color={colors.secondary}>User</TableHeader>
                        <TableHeader color={colors.secondary}>Topic</TableHeader>
                        <TableHeader color={colors.secondary}>Score</TableHeader>
                        <TableHeader color={colors.secondary}>Performance</TableHeader>
                        <TableHeader color={colors.secondary}>Date & Time</TableHeader>
                        <TableHeader color={colors.secondary}>Details</TableHeader>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {visibleQuizzes.map((attempt, index) => (
                        <motion.tr 
                          key={`${attempt.username}-${attempt.date}-${index}`} 
                          className="hover:bg-gray-50 transition-colors"
                          variants={itemVariants}
                          initial="hidden"
                          animate="show"
                          transition={{ delay: index * 0.1 }}
                        >
                          <TableCell>
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                                <FiUser className="text-purple-600 text-sm" />
                              </div>
                              <div className="ml-3">
                                <div className="font-medium text-gray-900">{attempt.username}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-gray-900 font-medium">{attempt.topic}</div>
                          </TableCell>
                          <TableCell>
                            <div className="text-gray-900">{attempt.score}/{attempt.totalQuestions}</div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <div className="w-24 bg-gray-200 rounded-full h-2 mr-3">
                                <div 
                                  className="h-2 rounded-full" 
                                  style={{ 
                                    width: `${attempt.percentage}%`,
                                    backgroundColor: 
                                      attempt.percentage >= 70 ? colors.success : 
                                      attempt.percentage >= 50 ? colors.warning : colors.danger
                                  }}
                                ></div>
                              </div>
                              <span 
                                className={`font-medium ${
                                  attempt.percentage >= 70 ? 'text-green-600' : 
                                  attempt.percentage >= 50 ? 'text-yellow-600' : 'text-red-600'
                                }`}
                              >
                                {attempt.percentage}%
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-gray-900">{formatDate(attempt.date)}</div>
                            <div className="text-gray-500 text-sm">{formatTime(attempt.date)}</div>
                          </TableCell>
                          <TableCell>
                            <motion.button 
                              className="px-3 py-1 rounded-md text-sm bg-violet-100 text-violet-700 hover:bg-violet-200"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => showAttemptDetails(attempt)}
                            >
                              View
                            </motion.button>
                          </TableCell>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Pagination Indicator */}
              {quizHistory.length > 3 && (
                <div className="flex justify-between items-center px-6 py-3 bg-gray-50 border-t border-gray-200">
                  <span className="text-sm text-gray-500">
                    Showing {currentQuizIndex + 1}-{Math.min(currentQuizIndex + 3, quizHistory.length)} of {quizHistory.length} attempts
                  </span>
                  <div className="flex space-x-2">
                    <motion.button 
                      onClick={prevQuizzes}
                      disabled={currentQuizIndex === 0}
                      className={`px-3 py-1 rounded-md text-sm ${currentQuizIndex === 0 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
                      whileTap={{ scale: 0.95 }}
                    >
                      Previous
                    </motion.button>
                    <motion.button 
                      onClick={nextQuizzes}
                      disabled={currentQuizIndex + 3 >= quizHistory.length}
                      className={`px-3 py-1 rounded-md text-sm ${currentQuizIndex + 3 >= quizHistory.length ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
                      whileTap={{ scale: 0.95 }}
                    >
                      Next
                    </motion.button>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Quiz Attempt Details Modal */}
      <AnimatePresence>
        {showModal && selectedAttempt && (
          <motion.div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Quiz Attempt Details</h2>
                    <p className="text-gray-500">Detailed information about this quiz attempt</p>
                  </div>
                  <motion.button 
                    onClick={closeModal}
                    className="p-2 rounded-full hover:bg-gray-100"
                    whileHover={{ rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <FiX className="text-gray-500 text-xl" />
                  </motion.button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium text-gray-700 mb-2">User Information</h3>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                          <FiUser className="text-indigo-600" />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">{selectedAttempt.username}</p>
                          <p className="text-sm text-gray-500">User ID: {selectedAttempt.userId || 'N/A'}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium text-gray-700 mb-2">Quiz Information</h3>
                    <div className="space-y-2">
                      <p className="text-sm"><span className="font-medium">Topic:</span> {selectedAttempt.topic}</p>
                      <p className="text-sm"><span className="font-medium">Difficulty:</span> {selectedAttempt.difficulty || 'Medium'}</p>
                      <p className="text-sm"><span className="font-medium">Category:</span> {selectedAttempt.category || 'General'}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm font-medium text-blue-700 mb-1">Score</p>
                    <p className="text-2xl font-bold text-blue-900">
                      {selectedAttempt.score}/{selectedAttempt.totalQuestions}
                    </p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <p className="text-sm font-medium text-purple-700 mb-1">Percentage</p>
                    <p className="text-2xl font-bold text-purple-900">
                      {selectedAttempt.percentage}%
                    </p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-sm font-medium text-green-700 mb-1">Time Taken</p>
                    <p className="text-2xl font-bold text-green-900">
                      {selectedAttempt.timeTaken.toFixed(2)} seconds
                    </p>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="font-medium text-gray-700 mb-3">Performance Breakdown</h3>
                  <div className="h-4 bg-gray-200 rounded-full w-full mb-2">
                    <div 
                      className="h-4 rounded-full" 
                      style={{ 
                        width: `${selectedAttempt.percentage}%`,
                        backgroundColor: 
                          selectedAttempt.percentage >= 70 ? colors.success : 
                          selectedAttempt.percentage >= 50 ? colors.warning : colors.danger
                      }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>0%</span>
                    <span>50%</span>
                    <span>100%</span>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="font-medium text-gray-700 mb-3">Attempt Details</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Date</p>
                        <p className="font-medium">{formatDate(selectedAttempt.date)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Time</p>
                        <p className="font-medium">{formatTime(selectedAttempt.date)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Correct Answers</p>
                        <p className="font-medium text-green-600">{selectedAttempt.score}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Incorrect Answers</p>
                        <p className="font-medium text-red-600">{selectedAttempt.totalQuestions - selectedAttempt.score}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-gray-700 mb-3">Question Analysis</h3>
                  <div className="space-y-4">
                    {selectedAttempt.questions?.map((question, qIndex) => (
                      <div key={qIndex} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <p className="font-medium">Question {qIndex + 1}</p>
                          {question.correct ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <FiCheck className="mr-1" /> Correct
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              <FiXCircle className="mr-1" /> Incorrect
                            </span>
                          )}
                        </div>
                        <p className="text-gray-700 mb-2">{question.text}</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          <div>
                            <p className="text-sm text-gray-500">User Answer</p>
                            <p className={`font-medium ${
                              question.correct ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {question.userAnswer}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Correct Answer</p>
                            <p className="font-medium text-green-600">{question.correctAnswer}</p>
                          </div>
                        </div>
                        {question.explanation && (
                          <div className="mt-2">
                            <p className="text-sm text-gray-500">Explanation</p>
                            <p className="text-sm text-gray-700">{question.explanation}</p>
                          </div>
                        )}
                      </div>
                    )) || (
                      <div className="text-center py-8 text-gray-500">
                        Detailed question data not available for this attempt
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Reusable components (same as before)
const StatCard = ({ icon, title, value, change, color, loading }) => (
  <motion.div 
    className="p-6 rounded-xl shadow-sm hover:shadow-md transition-all cursor-default bg-white"
    style={{ 
      borderTop: `4px solid ${color}`,
      boxShadow: `0 4px 6px -1px ${color}20, 0 2px 4px -1px ${color}10`
    }}
    whileHover={{ y: -5 }}
    transition={{ duration: 0.3 }}
  >
    <div className="flex items-start">
      <div 
        className="p-3 rounded-lg mr-4"
        style={{ backgroundColor: `${color}20`, color: color }}
      >
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        {loading ? (
          <div className="h-8 w-16 bg-gray-200 rounded mt-2 animate-pulse"></div>
        ) : (
          <motion.p 
            className="text-2xl font-semibold mt-1"
            style={{ color }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {value}
          </motion.p>
        )}
        <p className="text-xs text-gray-400 mt-2">{change}</p>
      </div>
    </div>
  </motion.div>
);

const SectionTitle = ({ title, subtitle, icon, color }) => (
  <div className="mb-4">
    <div className="flex items-center">
      <div 
        className="p-2 rounded-lg mr-3 flex items-center justify-center"
        style={{ backgroundColor: `${color}20`, color: color }}
      >
        {icon}
      </div>
      <div>
        <h2 
          className="text-xl font-semibold"
          style={{ color }}
        >
          {title}
        </h2>
        <p className="text-sm text-gray-500">{subtitle}</p>
      </div>
    </div>
  </div>
);

const TableHeader = ({ children, color }) => (
  <th 
    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
    style={{ 
      color: color,
      backgroundColor: `${color}08`
    }}
  >
    {children}
  </th>
);

const TableCell = ({ children }) => (
  <td className="px-6 py-4 whitespace-nowrap">
    {children}
  </td>
);

const LoadingSpinner = ({ color }) => (
  <motion.div 
    className="flex justify-center items-center py-16"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
  >
    <motion.div 
      className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2"
      style={{ borderColor: color }}
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
    ></motion.div>
  </motion.div>
);

export default AdminHero;