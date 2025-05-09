import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import data from '../data/data.json';

// Import topic images
import reactImage from '../assets/react.png';
import javascriptImage from '../assets/javascript.png';
import cppImage from '../assets/cpp.png';
import oopsImage from '../assets/oops.png';
import dbmsImage from '../assets/dbms.png';
import osImage from '../assets/os.png';
import cybersecurityImage from '../assets/cybersecurity.png';

const Quizes = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [customQuizzes, setCustomQuizzes] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const scrollContainerRef = useRef(null);

  // Theme colors with refined palette
  const themeColors = {
    primary: '#2563eb',
    secondary: '#7c3aed',
    accent1: '#ec4899',
    accent2: '#06b6d4',
    dark: '#1e293b',
    light: '#f8fafc',
    success: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444'
  };

  // Difficulty colors
  const difficultyColors = {
    'Easy': themeColors.success,
    'Medium': themeColors.warning,
    'Hard': themeColors.danger
  };

  // Mouse events for horizontal scrolling
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Scroll speed
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  // Touch events for mobile
  const handleTouchStart = (e) => {
    setIsDragging(true);
    setStartX(e.touches[0].pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const x = e.touches[0].pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  // Load custom quizzes
  useEffect(() => {
    const storedQuizzes = JSON.parse(localStorage.getItem('quizzes')) || {};
    const customQuizTopics = Object.keys(storedQuizzes).map(topicName => ({
      name: topicName,
      count: storedQuizzes[topicName].questions.length,
      image: storedQuizzes[topicName].coverPhoto || `https://source.unsplash.com/random/600x400/?quiz,${topicName.replace(/\s+/g, '-')}`,
      category: storedQuizzes[topicName].category || 'Others',
      isCustom: true,
      difficulty: storedQuizzes[topicName].difficulty || 'Medium',
      lastUpdated: storedQuizzes[topicName].lastUpdated || new Date().toISOString()
    }));
    setCustomQuizzes(customQuizTopics);
  }, []);

  // Topic images mapping
  const topicImages = {
    "React": reactImage,
    "JavaScript": javascriptImage,
    "C++": cppImage,
    "OOPs": oopsImage,
    "DBMS": dbmsImage,
    "OS": osImage,
    "Cyber Security": cybersecurityImage
  };

  // Categories
  const categories = ['All', 'Programming', 'Computer Science', 'Security', 'Others'];

  // Topic to category mapping
  const topicCategories = {
    "React": "Programming",
    "JavaScript": "Programming",
    "C++": "Programming",
    "OOPs": "Computer Science",
    "DBMS": "Computer Science",
    "OS": "Computer Science",
    "Cyber Security": "Security"
  };

  // Handle quiz start
  const handleStartQuiz = (topicName, isCustom = false) => {
    navigate(`/quiz/${topicName}`, { state: { isCustom } });
  };

  // Get category color
  const getCategoryColor = (category) => {
    switch(category) {
      case 'Programming': return themeColors.primary;
      case 'Computer Science': return themeColors.accent2;
      case 'Security': return themeColors.secondary;
      case 'Others': return themeColors.warning;
      default: return themeColors.dark;
    }
  };

  // Create predefined topics
  const predefinedTopics = Object.keys(data.quizzes).map((topicName) => ({
    name: topicName,
    count: data.quizzes[topicName].length,
    image: topicImages[topicName],
    category: topicCategories[topicName] || 'Others',
    isCustom: false,
    difficulty: 'Medium',
    lastUpdated: new Date().toISOString()
  }));

  // Combine and filter topics
  const allTopics = [...predefinedTopics, ...customQuizzes];
  const filteredTopics = allTopics.filter(topic => {
    const matchesSearch = topic.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || topic.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Sort by last updated (newest first)
  const sortedTopics = [...filteredTopics].sort((a, b) => 
    new Date(b.lastUpdated) - new Date(a.lastUpdated)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-extrabold mb-6">
            <span className="bg-clip-text text-transparent bg-gradient-to-r" 
                  style={{ backgroundImage: `linear-gradient(45deg, ${themeColors.primary}, ${themeColors.accent1})` }}>
              Quiz Explorer
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Browse, search, and discover interactive quizzes to test your knowledge
          </p>
        </div>
        
        {/* Search and Filter */}
        <div className="max-w-4xl mx-auto mb-12 space-y-6 sticky top-4 z-10">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search quizzes by topic, difficulty, or category..."
              className="block w-full pl-10 pr-3 py-4 rounded-xl bg-white border-0 shadow-lg focus:ring-4 focus:ring-opacity-30 transition-all duration-300 focus:shadow-xl backdrop-blur-sm bg-opacity-80"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ 
                focusRingColor: themeColors.primary,
              }}
            />
          </div>
          
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 transform hover:scale-105 ${
                  selectedCategory === category
                    ? 'text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-50 shadow-sm'
                }`}
                style={{
                  backgroundColor: selectedCategory === category ? getCategoryColor(category) : '',
                  borderColor: selectedCategory === category ? getCategoryColor(category) : ''
                }}
              >
                {category}
                <span className="ml-2 inline-flex items-center justify-center w-5 h-5 rounded-full bg-white bg-opacity-20">
                  {allTopics.filter(t => category === 'All' || t.category === category).length}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        {sortedTopics.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-xl max-w-2xl mx-auto border border-gray-200 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100 opacity-60"></div>
            <div className="relative z-10">
              <div className="mx-auto h-24 w-24 flex items-center justify-center rounded-full bg-gradient-to-br from-gray-100 to-gray-200 mb-6">
                <svg className="h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="mt-2 text-2xl font-bold text-gray-900">No matching quizzes found</h3>
              <p className="mt-3 text-lg text-gray-500 max-w-md mx-auto">
                Try adjusting your search or filter criteria
              </p>
              <div className="mt-8">
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('All');
                  }}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl shadow-sm text-white focus:outline-none focus:ring-4 focus:ring-opacity-50 transition-all duration-300 hover:shadow-xl transform hover:-translate-y-0.5"
                  style={{ 
                    background: `linear-gradient(45deg, ${themeColors.primary}, ${themeColors.accent2})`,
                  }}
                >
                  Reset filters
                  <svg className="ml-3 -mr-1 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Horizontal Scrolling Cards */}
            <div 
              ref={scrollContainerRef}
              className="relative mb-16 pb-8 -mx-4"
              onMouseDown={handleMouseDown}
              onMouseLeave={handleMouseLeave}
              onMouseUp={handleMouseUp}
              onMouseMove={handleMouseMove}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleMouseUp}
              style={{
                cursor: isDragging ? 'grabbing' : 'grab',
                overflowX: 'auto',
                overflowY: 'hidden',
                whiteSpace: 'nowrap',
                scrollbarWidth: 'none', // Firefox
                msOverflowStyle: 'none', // IE
                WebkitOverflowScrolling: 'touch',
              }}
            >
              {/* Hide scrollbar for Chrome/Safari */}
              <style dangerouslySetInnerHTML={{ __html: `
                ::-webkit-scrollbar { display: none; }
              `}} />
              
              {/* Cards Container */}
              <div className="inline-flex space-x-6 px-4">
                {sortedTopics.map((topic, index) => (
                  <div 
                    key={`${topic.name}-${index}`}
                    className="w-80 flex-shrink-0 bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-500 hover:shadow-2xl transform hover:-translate-y-2 flex flex-col h-full border border-gray-200 relative"
                    style={{
                      opacity: isDragging ? 0.9 : 1,
                      transform: isDragging ? 'scale(0.98)' : 'scale(1)'
                    }}
                  >
                    {/* Category Tag */}
                    <div 
                      className="absolute top-4 left-4 px-3 py-1 text-xs font-bold text-white shadow-md rounded-lg z-10"
                      style={{ backgroundColor: getCategoryColor(topic.category) }}
                    >
                      {topic.category}
                    </div>
                    
                    {/* Difficulty Badge */}
                    <div 
                      className="absolute top-4 right-4 text-xs font-bold px-3 py-1 rounded-full text-white shadow-md z-10"
                      style={{ backgroundColor: difficultyColors[topic.difficulty] }}
                    >
                      {topic.difficulty}
                    </div>
                    
                    {/* Quiz Image */}
                    <div className="h-48 w-full overflow-hidden relative">
                      <img 
                        src={topic.image} 
                        alt={topic.name} 
                        className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                        onError={(e) => {
                          e.target.onerror = null; 
                          e.target.src = `https://source.unsplash.com/random/600x400/?quiz,${topic.name.replace(/\s+/g, '-')}`;
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-40"></div>
                    </div>
                    
                    {/* Quiz Content */}
                    <div className="p-6 flex flex-col flex-grow">
                      <div className="flex-grow">
                        <h2 className="text-xl font-bold text-gray-900 mb-2">{topic.name}</h2>
                        <div className="flex items-center text-gray-600 text-sm mb-3">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          {topic.count} {topic.count === 1 ? 'question' : 'questions'}
                        </div>
                        
                        {/* Custom Quiz Indicator */}
                        {topic.isCustom && (
                          <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 mb-3">
                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                            </svg>
                            User Created
                          </div>
                        )}
                        
                        {/* Last Updated */}
                        <div className="text-xs text-gray-500 mt-2">
                          <svg className="w-3 h-3 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Updated {new Date(topic.lastUpdated).toLocaleDateString()}
                        </div>
                      </div>
                      
                      {/* Action Button */}
                      <button
                        onClick={() => handleStartQuiz(topic.name, topic.isCustom)}
                        className="w-full mt-4 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 text-center flex items-center justify-center hover:shadow-md transform hover:-translate-y-0.5 active:scale-95"
                        style={{ 
                          background: `linear-gradient(45deg, ${themeColors.primary}, ${themeColors.secondary})`,
                        }}
                      >
                        Start Quiz
                        <svg className="ml-2 -mr-1 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats Section */}
            <div className="mt-8 bg-white rounded-2xl shadow-xl p-8 max-w-6xl mx-auto border border-gray-200 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-100">
                  <div className="flex items-center">
                    <div className="p-3 rounded-lg bg-blue-100 bg-opacity-50 mr-4">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Topics</p>
                      <p className="text-2xl font-bold text-gray-900">{allTopics.length}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-100">
                  <div className="flex items-center">
                    <div className="p-3 rounded-lg bg-green-100 bg-opacity-50 mr-4">
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Predefined Questions</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {predefinedTopics.reduce((sum, topic) => sum + topic.count, 0)}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-100">
                  <div className="flex items-center">
                    <div className="p-3 rounded-lg bg-purple-100 bg-opacity-50 mr-4">
                      <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Custom Quizzes</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {customQuizzes.length}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-pink-50 to-pink-100 p-6 rounded-xl border border-pink-100">
                  <div className="flex items-center">
                    <div className="p-3 rounded-lg bg-pink-100 bg-opacity-50 mr-4">
                      <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Showing</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {sortedTopics.length} {sortedTopics.length === 1 ? 'quiz' : 'quizzes'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Quizes;