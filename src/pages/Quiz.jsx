import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import data from '../data/data.json';

const Quiz = () => {
  const { id: topicName } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [answeredQuestions, setAnsweredQuestions] = useState(new Set());
  const [startTime, setStartTime] = useState(null);
  const [timeTaken, setTimeTaken] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [timerActive, setTimerActive] = useState(true);
  const [questions, setQuestions] = useState([]);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    // Check if this is a custom quiz from localStorage
    const isCustom = location.state?.isCustom || false;
    
    let quizQuestions = [];
    if (isCustom) {
      const storedQuizzes = JSON.parse(localStorage.getItem('quizzes')) || {};
      quizQuestions = storedQuizzes[topicName]?.questions || [];
    } else {
      quizQuestions = data.quizzes[topicName] || [];
    }

    setQuestions(quizQuestions);
    setTotalQuestions(quizQuestions.length);

    // Set start time when component mounts
    setStartTime(new Date());
    
    // Load any saved progress from localStorage
    const savedProgress = JSON.parse(localStorage.getItem(`quizProgress_${topicName}`));
    if (savedProgress) {
      setCurrentQuestionIndex(savedProgress.currentQuestionIndex);
      setSelectedOptions(savedProgress.selectedOptions);
      setScore(savedProgress.score);
      setAnsweredQuestions(new Set(savedProgress.answeredQuestions));
    }
    
    // Start the timer for the first question
    startQuestionTimer();
    
    return () => {
      // Clean up timer when component unmounts
      clearTimer();
    };
  }, [topicName, location.state]);

  useEffect(() => {
    // Reset timer when question changes
    if (timerActive && questions.length > 0) {
      setTimeLeft(30);
      startQuestionTimer();
    }
  }, [currentQuestionIndex, questions]);

  const clearTimer = () => {
    if (window.questionTimer) {
      clearInterval(window.questionTimer);
    }
  };

  const startQuestionTimer = () => {
    clearTimer(); // Clear any existing timer
    
    window.questionTimer = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 1) {
          clearTimer();
          handleTimeUp();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
  };

  const handleTimeUp = () => {
    if (questions.length === 0) return;
    
    // Mark the question as unanswered if not already answered
    const currentQuestionId = questions[currentQuestionIndex].id;
    if (!answeredQuestions.has(currentQuestionId)) {
      setAnsweredQuestions(prev => new Set(prev).add(currentQuestionId));
      saveProgress();
    }
    
    // Move to next question or submit if last question
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      handleSubmit();
    }
  };

  const saveProgress = () => {
    localStorage.setItem(`quizProgress_${topicName}`, JSON.stringify({
      currentQuestionIndex,
      selectedOptions,
      score,
      answeredQuestions: Array.from(answeredQuestions)
    }));
  };

  const handleOptionSelect = (questionId, option) => {
    const currentQuestion = questions.find(q => q.id === questionId);
    if (!currentQuestion) return;
    
    const wasPreviouslyAnswered = answeredQuestions.has(questionId);
    const previousSelection = selectedOptions[questionId];
    
    // Update selected option
    const newSelectedOptions = {
      ...selectedOptions,
      [questionId]: option
    };
    setSelectedOptions(newSelectedOptions);
    
    // If this question was previously answered
    if (wasPreviouslyAnswered) {
      // If the previous selection was correct and the new one isn't, decrease score
      if (previousSelection === currentQuestion.answer && option !== currentQuestion.answer) {
        setScore(prev => prev - 1);
      } 
      // If the previous selection was incorrect and the new one is correct, increase score
      else if (previousSelection !== currentQuestion.answer && option === currentQuestion.answer) {
        setScore(prev => prev + 1);
      }
    } 
    // If this question wasn't previously answered and the new selection is correct
    else if (option === currentQuestion.answer) {
      setScore(prev => prev + 1);
    }
    
    // Mark question as answered (or update if already answered)
    setAnsweredQuestions(prev => new Set(prev).add(questionId));
    saveProgress();
  };

  const handleNextQuestion = () => {
    clearTimer();
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      saveProgress();
    }
  };

  const handlePrevQuestion = () => {
    clearTimer();
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      saveProgress();
    }
  };

  const handleSubmit = () => {
    clearTimer();
    const endTime = new Date();
    const timeDiff = (endTime - startTime) / 1000; // in seconds
    setTimeTaken(timeDiff);
    setShowResult(true);
    setQuizCompleted(true);
    setTimerActive(false);
    
    // Save quiz results to history
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
      const quizHistory = JSON.parse(localStorage.getItem('quizHistory')) || [];
      const newQuizResult = {
        username: currentUser.username,
        topic: topicName,
        score: score,
        totalQuestions: totalQuestions,
        percentage: Math.round((score / totalQuestions) * 100),
        timeTaken: timeDiff,
        date: new Date().toISOString()
      };
      
      localStorage.setItem('quizHistory', JSON.stringify([...quizHistory, newQuizResult]));
    }
    
    // Clear saved progress
    localStorage.removeItem(`quizProgress_${topicName}`);
  };

  const handleQuestionNavigation = (index) => {
    clearTimer();
    setCurrentQuestionIndex(index);
    saveProgress();
    setSidebarOpen(false);
  };

  if (questions.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-md max-w-md w-full">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">No Questions Found</h1>
          <p className="text-gray-600 mb-6">There are no questions available for the topic "{topicName}".</p>
          <button
            onClick={() => navigate('/dashboard/quizes')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Quizzes
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;
  const percentage = (score / totalQuestions) * 100;
  const passed = percentage >= 70;
  const isAnswered = answeredQuestions.has(currentQuestion.id);
  const selectedOption = selectedOptions[currentQuestion.id];

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex flex-col lg:flex-row">
        {/* Sidebar for question navigation - Mobile */}
        <div className={`lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40 ${sidebarOpen ? 'block' : 'hidden'}`}
             onClick={() => setSidebarOpen(false)}>
          <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-xl transform transition-transform duration-300 ease-in-out"
               onClick={e => e.stopPropagation()}>
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">Quiz Progress</h3>
              <button 
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                onClick={() => setSidebarOpen(false)}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-4 overflow-y-auto h-[calc(100%-60px)]">
              <div className="grid grid-cols-3 gap-3">
                {questions.map((question, index) => {
                  const isAnswered = answeredQuestions.has(question.id);
                  const isCurrent = currentQuestionIndex === index;
                  return (
                    <button
                      key={index}
                      onClick={() => handleQuestionNavigation(index)}
                      className={`w-full h-12 rounded-lg flex items-center justify-center font-medium transition-all ${
                        isCurrent 
                          ? 'bg-blue-600 text-white border-2 border-blue-700 shadow-md'
                          : isAnswered
                            ? 'bg-green-100 text-green-800 border-2 border-green-200'
                            : 'bg-gray-100 text-gray-700 border-2 border-gray-200'
                      }`}
                    >
                      {index + 1}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar for question navigation - Desktop */}
        <div className="hidden lg:block w-80 bg-white border-r border-gray-200 h-screen sticky top-0 overflow-y-auto">
          <div className="p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Quiz Progress</h3>
            <div className="grid grid-cols-3 gap-4">
              {questions.map((question, index) => {
                const isAnswered = answeredQuestions.has(question.id);
                const isCurrent = currentQuestionIndex === index;
                return (
                  <button
                    key={index}
                    onClick={() => handleQuestionNavigation(index)}
                    className={`w-full h-14 rounded-xl flex items-center justify-center font-medium transition-all ${
                      isCurrent 
                        ? 'bg-blue-600 text-white border-2 border-blue-700 shadow-lg transform scale-105'
                        : isAnswered
                          ? 'bg-green-100 text-green-800 border-2 border-green-200 hover:bg-green-200'
                          : 'bg-gray-100 text-gray-700 border-2 border-gray-200 hover:bg-gray-200'
                    }`}
                  >
                    {index + 1}
                  </button>
                );
              })}
            </div>

            <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-100">
              <h4 className="font-semibold text-blue-800 mb-2">Quiz Summary</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Questions:</span>
                  <span className="font-medium">{totalQuestions}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Answered:</span>
                  <span className="font-medium text-green-600">{answeredQuestions.size}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Remaining:</span>
                  <span className="font-medium text-orange-600">{totalQuestions - answeredQuestions.size}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Current Score:</span>
                  <span className="font-medium text-blue-600">{score}/{totalQuestions}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Quiz Content */}
        <div className="flex-1 min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
            {/* Header with topic and mobile menu button */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold">{topicName} Quiz</h1>
                <p className="text-blue-100">Test your knowledge on {topicName}</p>
              </div>
              <button 
                className="lg:hidden p-2 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30"
                onClick={() => setSidebarOpen(true)}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>

            {/* Progress bar */}
            <div className="px-6 pt-4">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">
                  Question {currentQuestionIndex + 1} of {totalQuestions}
                </span>
                <div className="flex items-center">
                  <span className="text-sm font-medium text-gray-600 mr-3">
                    Time left: <span className={`font-bold ${timeLeft <= 10 ? 'text-red-500' : 'text-gray-600'}`}>{timeLeft}s</span>
                  </span>
                  {showResult && (
                    <span className="text-sm font-medium text-gray-600">
                      Score: {score} / {totalQuestions}
                    </span>
                  )}
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
                  style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Question area */}
            <div className="px-6 pb-6">
              <h2 className="text-xl font-semibold mb-6 text-gray-800">{currentQuestion.question}</h2>
              <div className="space-y-3 mb-8">
                {currentQuestion.options.map((option, index) => {
                  const isSelected = selectedOption === option;
                  let optionClasses = "p-4 border rounded-lg cursor-pointer transition-all duration-200";
                  
                  optionClasses += isSelected 
                    ? " border-blue-500 bg-blue-50 shadow-inner" 
                    : " border-gray-300 hover:bg-gray-50 hover:shadow-sm";

                  return (
                    <div 
                      key={index}
                      className={optionClasses}
                      onClick={() => handleOptionSelect(currentQuestion.id, option)}
                    >
                      <div className="flex items-center">
                        <span className="mr-3 font-medium text-gray-700">{String.fromCharCode(65 + index)}.</span>
                        <span>{option}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Navigation buttons */}
              <div className="flex justify-between">
                <button
                  onClick={handlePrevQuestion}
                  disabled={currentQuestionIndex === 0}
                  className={`px-5 py-2.5 rounded-lg font-medium ${
                    currentQuestionIndex === 0
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  ← Previous
                </button>
                {isLastQuestion ? (
                  <button
                    onClick={handleSubmit}
                    disabled={answeredQuestions.size < totalQuestions}
                    className={`px-5 py-2.5 rounded-lg font-medium text-white ${
                      answeredQuestions.size < totalQuestions
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-green-600 hover:bg-green-700'
                    }`}
                  >
                    Submit Quiz
                  </button>
                ) : (
                  <button
                    onClick={handleNextQuestion}
                    disabled={!isAnswered}
                    className={`px-5 py-2.5 rounded-lg font-medium text-white ${
                      !isAnswered
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                  >
                    Next Question →
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Result Modal */}
      {showResult && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-8 max-w-md w-full shadow-xl">
            <div className="text-center">
              <div className={`mx-auto flex items-center justify-center h-16 w-16 rounded-full ${passed ? 'bg-green-100' : 'bg-red-100'} mb-4`}>
                {passed ? (
                  <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {passed ? 'Congratulations! 🎉' : 'Try Again! 😔'}
              </h2>
              <p className="text-lg text-gray-600 mb-1">
                You scored <span className="font-bold">{score}</span> out of <span className="font-bold">{totalQuestions}</span>
              </p>
              <p className="text-lg text-gray-600 mb-1">
                Time taken: <span className="font-bold">{formatTime(timeTaken)}</span>
              </p>
              <p className={`text-xl font-bold mb-6 ${passed ? 'text-green-600' : 'text-red-600'}`}>
                {Math.round(percentage)}% {passed ? 'Passed' : 'Failed'}
              </p>
              
              <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
                <div 
                  className={`h-2.5 rounded-full ${passed ? 'bg-green-600' : 'bg-red-600'}`} 
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
              
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => {
                    setCurrentQuestionIndex(0);
                    setSelectedOptions({});
                    setScore(0);
                    setShowResult(false);
                    setQuizCompleted(false);
                    setAnsweredQuestions(new Set());
                    setStartTime(new Date());
                    setTimeLeft(30);
                    setTimerActive(true);
                    startQuestionTimer();
                  }}
                  className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                >
                  Retry Quiz
                </button>
                <button
                  onClick={() => navigate('/dashboard/quizes')}
                  className="px-5 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium"
                >
                  Back to Quizzes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Quiz;