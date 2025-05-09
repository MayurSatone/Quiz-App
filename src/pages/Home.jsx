// src/pages/Home.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [quizHistory, setQuizHistory] = useState([]);
  const [stats, setStats] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate loading delay for better UX
    const timer = setTimeout(() => {
      // Load current user from localStorage
      const user = JSON.parse(localStorage.getItem('currentUser'));
      setCurrentUser(user);

      // Load quiz history from localStorage
      const history = JSON.parse(localStorage.getItem('quizHistory')) || [];
      
      // Filter history for current user if logged in
      const userHistory = user ? history.filter(item => item.username === user.username) : [];
      // Sort history by date in descending order (newest first)
      const sortedHistory = [...userHistory].sort((a, b) => new Date(b.date) - new Date(a.date));
      setQuizHistory(sortedHistory);

      // Calculate stats
      if (userHistory.length > 0) {
        const totalTests = userHistory.length;
        const totalCorrect = userHistory.reduce((sum, item) => sum + item.score, 0);
        const totalQuestions = userHistory.reduce((sum, item) => sum + item.totalQuestions, 0);
        const totalTime = userHistory.reduce((sum, item) => sum + item.timeTaken, 0);
        
        setStats({
          totalTests,
          accuracy: Math.round((totalCorrect / totalQuestions) * 100),
          averageScore: Math.round((totalCorrect / totalQuestions) * 100),
          averageTime: Math.round(totalTime / totalTests),
          bestScore: Math.max(...userHistory.map(item => item.score)),
          bestTime: Math.min(...userHistory.map(item => item.timeTaken))
        });
      }
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}m ${secs}s`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Quiz Dashboard</h1>
        <p className="text-gray-600 mb-8">Track your progress and performance</p>
        
        {currentUser ? (
          <>
            {/* Welcome Banner */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-lg shadow-lg p-6 mb-8 text-white">
              <h2 className="text-2xl font-bold mb-2">Welcome back, {currentUser.username}!</h2>
              <p className="opacity-90">Keep up the good work and improve your knowledge</p>
            </div>

            {/* Stats Cards */}
            {stats && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-blue-500">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Total Tests</h3>
                      <p className="text-2xl font-bold text-gray-900">{stats.totalTests}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-green-500">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Accuracy</h3>
                      <p className="text-2xl font-bold text-gray-900">{stats.accuracy}%</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-yellow-500">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Avg. Time</h3>
                      <p className="text-2xl font-bold text-gray-900">{formatTime(stats.averageTime)}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-red-500">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-red-100 text-red-600 mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Best Score</h3>
                      <p className="text-2xl font-bold text-gray-900">{stats.bestScore}/{stats.bestScore + Math.round((100 - stats.accuracy)/10)}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="mb-8 flex flex-wrap gap-4">
              <button 
                onClick={() => navigate('/dashboard/quizes')}
                className="flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md transition-all"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                Take a New Quiz
              </button>
            </div>

            {/* Quiz History */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-800">Recent Quiz Attempts</h2>
                {quizHistory.length > 0 && (
                  <span className="text-sm text-gray-500">Showing {quizHistory.length} attempt{quizHistory.length !== 1 ? 's' : ''}</span>
                )}
              </div>
              {quizHistory.length > 0 ? (
                <div className="divide-y divide-gray-200 max-h-[450px] overflow-y-auto">
                  {quizHistory.slice(0, 5).map((quiz, index) => (
                    <div 
                      key={index} 
                      className="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => navigate(`/dashboard/results/${quiz.id}`)}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div className="mb-2 sm:mb-0">
                          <h3 className="text-md font-medium text-gray-900 flex items-center">
                            {quiz.topic}
                            {quiz.percentage >= 90 && (
                              <span className="ml-2 px-2 py-0.5 text-xs font-semibold bg-yellow-100 text-yellow-800 rounded-full">
                                Top Score
                              </span>
                            )}
                          </h3>
                          <p className="text-xs text-gray-500 mt-1">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {formatDate(quiz.date)}
                          </p>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-center">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                              quiz.percentage >= 70 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                            }`}>
                              <span className="font-bold">{quiz.percentage}%</span>
                            </div>
                          </div>
                          <div className="text-center hidden sm:block">
                            <p className="text-xs text-gray-500">Time Taken</p>
                            <p className="text-sm font-medium text-gray-900">{formatTime(quiz.timeTaken)}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-gray-500">Result</p>
                            <p className={`text-sm font-bold ${
                              quiz.percentage >= 70 ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {quiz.percentage >= 70 ? 'Passed' : 'Failed'}
                            </p>
                          </div>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No quiz attempts yet</h3>
                  <p className="text-gray-600 mb-6">Take your first quiz and see your results appear here!</p>
                  <button
                    onClick={() => navigate('/dashboard/quizes')}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-md transition-all"
                  >
                    Start a Quiz
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md mx-auto">
            <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome to Quiz App</h2>
            <p className="text-gray-600 mb-6">Login to access your personalized dashboard, track your progress, and discover new quizzes.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => navigate('/login')}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md transition-all"
              >
                Login
              </button>
              <button
                onClick={() => navigate('/register')}
                className="px-6 py-2 border border-blue-600 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
              >
                Register
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;