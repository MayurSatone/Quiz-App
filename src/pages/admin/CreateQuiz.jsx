import React, { useState, useEffect } from 'react';
import { FiPlus, FiTrash2, FiSave, FiImage, FiChevronDown, FiLoader, FiAward, FiCheck, FiX } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { generateQuizQuestions } from "../../api/quizGenerator";

const CreateQuiz = () => {
  const [quizTopic, setQuizTopic] = useState('');
  const [quizCoverPhoto, setQuizCoverPhoto] = useState('');
  const [quizCategory, setQuizCategory] = useState('Others');
  const [questions, setQuestions] = useState([
    {
      id: 1,
      question: '',
      options: ['', '', '', ''],
      answer: ''
    }
  ]);
  const [aiLoading, setAiLoading] = useState(false);
  const [questionLimit, setQuestionLimit] = useState(5);
  const [showAiPanel, setShowAiPanel] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [imageError, setImageError] = useState(false);

  const categories = ['Programming', 'Computer Science', 'Security', 'Others'];
  const questionLimits = [3, 5, 10];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  const generateQuizWithAI = async () => {
    if (!quizTopic.trim()) {
      setApiError('Please enter a quiz topic first');
      return;
    }

    setApiError(null);
    setAiLoading(true);
    
    try {
      const generatedQuestions = await generateQuizQuestions(
        quizTopic,
        quizCategory,
        questionLimit
      );
      
      const validatedQuestions = generatedQuestions.map((q, index) => ({
        id: index + 1,
        question: q.question || '',
        options: Array.isArray(q.options) && q.options.length === 4 ? 
          q.options.map(opt => opt || '') : 
          ['', '', '', ''],
        answer: q.answer || ''
      }));
      
      setQuestions(validatedQuestions);
      setShowAiPanel(false);
    } catch (error) {
      console.error('Error generating quiz with AI:', error);
      setApiError(error.message || 'Failed to generate quiz. Please try again.');
    } finally {
      setAiLoading(false);
    }
  };

  const handleAddQuestion = () => {
    const newId = questions.length > 0 ? Math.max(...questions.map(q => q.id)) + 1 : 1;
    setQuestions([
      ...questions,
      {
        id: newId,
        question: '',
        options: ['', '', '', ''],
        answer: ''
      }
    ]);
  };

  const handleRemoveQuestion = (id) => {
    if (questions.length > 1) {
      setQuestions(questions.filter(question => question.id !== id));
    }
  };

  const handleQuestionChange = (id, value) => {
    setQuestions(questions.map(question => 
      question.id === id ? { ...question, question: value } : question
    ));
  };

  const handleOptionChange = (questionId, optionIndex, value) => {
    setQuestions(questions.map(question => {
      if (question.id === questionId) {
        const newOptions = [...question.options];
        newOptions[optionIndex] = value;
        return { ...question, options: newOptions };
      }
      return question;
    }));
  };

  const handleAnswerChange = (questionId, answer) => {
    setQuestions(questions.map(question => 
      question.id === questionId ? { ...question, answer } : question
    ));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    if (!quizTopic.trim()) {
      setApiError('Please enter a quiz topic');
      return;
    }

    for (const question of questions) {
      if (!question.question.trim()) {
        setApiError('Please enter all questions');
        return;
      }
      
      for (const option of question.options) {
        if (!option.trim()) {
          setApiError('Please fill in all options');
          return;
        }
      }
      
      if (!question.answer.trim()) {
        setApiError('Please select an answer for each question');
        return;
      }
    }

    // Save to localStorage
    const existingQuizzes = JSON.parse(localStorage.getItem('quizzes')) || {};
    const newQuiz = {
      [quizTopic]: {
        coverPhoto: quizCoverPhoto,
        category: quizCategory,
        questions: questions.map(q => ({
          id: q.id,
          question: q.question,
          options: q.options,
          answer: q.answer
        }))
      }
    };

    const updatedQuizzes = { ...existingQuizzes, ...newQuiz };
    localStorage.setItem('quizzes', JSON.stringify(updatedQuizzes));
    
    setIsSaved(true);
    setApiError(null);
    
    // Reset success message after 3 seconds
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto"
      >
        <div className="text-center mb-10">
          <motion.h1 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl"
          >
            Create Your Quiz
          </motion.h1>
          <motion.p
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-5 max-w-xl mx-auto text-xl text-gray-500"
          >
            Build engaging quizzes manually or with our AI assistant
          </motion.p>
        </div>

        <div className="mb-8 flex justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAiPanel(!showAiPanel)}
            className="flex items-center justify-center px-8 py-4 border border-transparent text-lg font-semibold rounded-xl shadow-lg text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-purple-300 focus:ring-offset-2 transition-all duration-300"
          >
            <FiAward className="mr-3 h-6 w-6" />
            {showAiPanel ? 'Hide AI Assistant' : 'Generate Quiz with AI'}
          </motion.button>
        </div>

        <AnimatePresence>
          {showAiPanel && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200 mb-10 overflow-hidden"
            >
              <div className="flex items-center mb-6">
                <div className="p-3 rounded-full bg-purple-100 mr-4">
                  <FiAward className="h-6 w-6 text-purple-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">AI Quiz Generator</h2>
              </div>
              
              <p className="text-gray-600 mb-8 text-lg">Enter your quiz topic and select the number of questions to generate a quiz automatically.</p>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-6">
                <div>
                  <label htmlFor="aiQuizTopic" className="block text-lg font-semibold text-gray-700 mb-3">
                    Quiz Topic <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="aiQuizTopic"
                      value={quizTopic}
                      onChange={(e) => setQuizTopic(e.target.value)}
                      className="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all duration-200"
                      placeholder="e.g., React Hooks, Python Basics, etc."
                      required
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-lg font-semibold text-gray-700 mb-3">
                    Number of Questions <span className="text-red-500">*</span>
                  </label>
                  <div className="flex space-x-4">
                    {questionLimits.map((limit) => (
                      <motion.button
                        key={limit}
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        type="button"
                        onClick={() => setQuestionLimit(limit)}
                        className={`px-6 py-3 text-lg rounded-xl shadow-md transition-all duration-200 ${
                          questionLimit === limit 
                            ? 'bg-purple-600 text-white shadow-purple-300' 
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 shadow-gray-200'
                        }`}
                      >
                        {limit}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={generateQuizWithAI}
                  disabled={aiLoading || !quizTopic.trim()}
                  className={`flex-1 flex items-center justify-center px-8 py-4 border border-transparent text-lg font-semibold rounded-xl shadow-lg text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-purple-300 focus:ring-offset-2 transition-all duration-300 ${
                    aiLoading || !quizTopic.trim() ? 'opacity-80 cursor-not-allowed' : ''
                  }`}
                >
                  {aiLoading ? (
                    <>
                      <FiLoader className="mr-3 h-6 w-6 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <FiAward className="mr-3 h-6 w-6" />
                      Generate {questionLimit} Questions
                    </>
                  )}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  type="button"
                  onClick={() => setShowAiPanel(false)}
                  className="flex-1 px-8 py-4 border-2 border-gray-300 text-lg font-semibold rounded-xl shadow-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-gray-200 focus:ring-offset-2 transition-all duration-300"
                >
                  Cancel
                </motion.button>
              </div>
              
              {aiLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200"
                >
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg className="h-8 w-8 text-blue-400 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-lg font-medium text-blue-800">Generating your quiz</h3>
                      <div className="mt-2 text-blue-700">
                        <p>Creating {questionLimit} questions about "{quizTopic}"...</p>
                        <p className="mt-1">This may take a few moments.</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {apiError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 p-4 bg-red-50 rounded-xl border border-red-200"
                >
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <FiX className="h-8 w-8 text-red-400" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-lg font-medium text-red-800">Error generating quiz</h3>
                      <div className="mt-2 text-red-700">
                        <p>{apiError}</p>
                        <p className="mt-1">Please check your input and try again.</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.form 
          onSubmit={handleSubmit}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200"
        >
          <motion.div variants={itemVariants} className="mb-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Quiz Details</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <label htmlFor="quizTopic" className="block text-lg font-semibold text-gray-700 mb-3">
                  Quiz Title <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="quizTopic"
                    value={quizTopic}
                    onChange={(e) => setQuizTopic(e.target.value)}
                    className="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-200"
                    placeholder="Give your quiz a title"
                    required
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="quizCategory" className="block text-lg font-semibold text-gray-700 mb-3">
                  Category <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    id="quizCategory"
                    value={quizCategory}
                    onChange={(e) => setQuizCategory(e.target.value)}
                    className="appearance-none w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-200 pr-12"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <FiChevronDown className="h-6 w-6 text-gray-400" />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <label htmlFor="quizCoverPhoto" className="block text-lg font-semibold text-gray-700 mb-3">
                Cover Image URL
              </label>
              <div className="flex rounded-xl shadow-sm overflow-hidden">
                <span className="inline-flex items-center px-4 py-3 border border-r-0 border-gray-300 bg-gray-100 text-gray-500 text-lg">
                  <FiImage className="h-6 w-6" />
                </span>
                <input
                  type="url"
                  id="quizCoverPhoto"
                  value={quizCoverPhoto}
                  onChange={(e) => {
                    setQuizCoverPhoto(e.target.value);
                    setImageError(false);
                  }}
                  className="flex-1 block w-full px-6 py-4 text-lg border-2 border-gray-200 focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-200"
                  placeholder="Paste an image URL for your quiz cover"
                />
              </div>
            </div>

            {quizCoverPhoto && !imageError && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-6"
              >
                <p className="text-lg font-semibold text-gray-700 mb-3">Cover Preview:</p>
                <div className="relative rounded-xl overflow-hidden border-2 border-gray-200">
                  <img 
                    src={quizCoverPhoto} 
                    alt="Quiz cover preview" 
                    className="w-full h-64 object-cover"
                    onError={handleImageError}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setQuizCoverPhoto('');
                      setImageError(false);
                    }}
                    className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors"
                  >
                    <FiX className="h-5 w-5 text-gray-600" />
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>

          <motion.div variants={itemVariants} className="mb-10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Questions</h2>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={handleAddQuestion}
                className="flex items-center justify-center px-6 py-3 border border-transparent text-lg font-semibold rounded-xl shadow-md text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-200 focus:ring-offset-2 transition-all duration-200"
              >
                <FiPlus className="mr-2 h-5 w-5" />
                Add Question
              </motion.button>
            </div>

            <div className="space-y-8">
              {questions.map((question, qIndex) => (
                <motion.div
                  key={question.id}
                  variants={itemVariants}
                  className="border-2 border-gray-100 rounded-2xl p-6 relative bg-gray-50 shadow-sm"
                >
                  {questions.length > 1 && (
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      type="button"
                      onClick={() => handleRemoveQuestion(question.id)}
                      className="absolute top-4 right-4 text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition-colors"
                      aria-label="Remove question"
                    >
                      <FiTrash2 className="h-6 w-6" />
                    </motion.button>
                  )}

                  <div className="mb-6">
                    <label htmlFor={`question-${question.id}`} className="block text-lg font-semibold text-gray-700 mb-3">
                      Question {qIndex + 1} <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id={`question-${question.id}`}
                        value={question.question}
                        onChange={(e) => handleQuestionChange(question.id, e.target.value)}
                        className="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-200"
                        placeholder="Enter your question here"
                        required
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-5">
                    <label className="block text-lg font-semibold text-gray-700 mb-3">
                      Options <span className="text-red-500">*</span>
                    </label>
                    {question.options.map((option, oIndex) => (
                      <div key={oIndex} className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <input
                            type="radio"
                            name={`answer-${question.id}`}
                            checked={option === question.answer}
                            onChange={() => handleAnswerChange(question.id, option)}
                            className="h-6 w-6 text-blue-600 focus:ring-blue-500 border-gray-300"
                            required
                          />
                        </div>
                        <div className="flex-1">
                          <input
                            type="text"
                            value={option}
                            onChange={(e) => handleOptionChange(question.id, oIndex, e.target.value)}
                            className="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-200"
                            placeholder={`Option ${oIndex + 1}`}
                            required
                          />
                        </div>
                        {option === question.answer && (
                          <div className="flex-shrink-0 p-2 rounded-full bg-green-100">
                            <FiCheck className="h-5 w-5 text-green-600" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row justify-between gap-6 pt-6 border-t border-gray-200"
          >
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              type="reset"
              className="px-8 py-4 border-2 border-gray-300 text-lg font-semibold rounded-xl shadow-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-gray-200 focus:ring-offset-2 transition-all duration-200"
            >
              Reset Form
            </motion.button>

            <div className="flex flex-col sm:flex-row gap-6">
              {apiError && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center px-4 py-3 bg-red-50 rounded-lg border border-red-200 text-red-700"
                >
                  <FiX className="mr-2 h-5 w-5" />
                  {apiError}
                </motion.div>
              )}

              {isSaved && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex items-center px-4 py-3 bg-green-50 rounded-lg border border-green-200 text-green-700"
                >
                  <FiCheck className="mr-2 h-5 w-5" />
                  Quiz saved successfully!
                </motion.div>
              )}

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                type="submit"
                className="flex items-center justify-center px-8 py-4 border border-transparent text-lg font-semibold rounded-xl shadow-lg text-white bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 focus:outline-none focus:ring-4 focus:ring-green-200 focus:ring-offset-2 transition-all duration-200"
              >
                <FiSave className="mr-3 h-6 w-6" />
                Save Quiz
              </motion.button>
            </div>
          </motion.div>
        </motion.form>
      </motion.div>
    </div>
  );
};

export default CreateQuiz;