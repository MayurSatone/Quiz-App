import { useState } from 'react';

const QuizSelection = ({ topics, difficulties, onStartQuiz }) => {
  const [selectedTopic, setSelectedTopic] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedTopic && selectedDifficulty) {
      onStartQuiz(selectedTopic, selectedDifficulty);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Select Quiz Options</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-1">
              Select Topic:
            </label>
            <select
              id="topic"
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">-- Select a topic --</option>
              {topics.map((topic) => (
                <option key={topic} value={topic}>
                  {topic}
                </option>
              ))}
            </select>
          </div>
          
          <div className="mb-6">
            <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-1">
              Select Difficulty:
            </label>
            <select
              id="difficulty"
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">-- Select difficulty --</option>
              {difficulties.map((difficulty) => (
                <option key={difficulty} value={difficulty}>
                  {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                </option>
              ))}
            </select>
          </div>
          
          <button
            type="submit"
            disabled={!selectedTopic || !selectedDifficulty}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
          >
            Start Quiz
          </button>
        </form>
      </div>
    </div>
  );
};

export default QuizSelection;