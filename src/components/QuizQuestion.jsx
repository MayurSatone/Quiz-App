const QuizQuestion = ({
    question,
    options,
    selectedAnswer,
    onAnswerSelect,
    onNextQuestion,
    onPreviousQuestion,
    currentIndex,
    totalQuestions,
    timeLeft,
    score,
    isLastQuestion
  }) => {
    return (
      <div className="min-h-screen bg-gray-100 p-4 md:p-8">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
          <div className="bg-blue-600 p-4 text-white">
            <div className="flex justify-between items-center mt-2">
              <p className="font-medium">
                Question {currentIndex + 1} of {totalQuestions}
              </p>
              <div className="flex items-center gap-2">
                <span className="font-medium">Time:</span>
                <span
                  className={`px-3 py-1 rounded-full font-bold ${
                    timeLeft < 10 ? 'bg-red-500' : 'bg-blue-500'
                  }`}
                >
                  {timeLeft}s
                </span>
              </div>
            </div>
          </div>
  
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-6">{question}</h2>
            
            <div className="space-y-3 mb-8">
              {options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => onAnswerSelect(option)}
                  disabled={selectedAnswer !== null}
                  className={`w-full text-left p-4 rounded-lg border-2 transition ${
                    selectedAnswer === option
                      ? option === question.answer
                        ? 'border-green-500 bg-green-50'
                        : 'border-red-500 bg-red-50'
                      : selectedAnswer !== null && option === question.answer
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-blue-400'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
  
            <div className="flex justify-between">
              <button
                onClick={onPreviousQuestion}
                disabled={currentIndex === 0}
                className="px-6 py-2 bg-gray-500 text-white rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-gray-600 transition"
              >
                Previous
              </button>
              
              {selectedAnswer !== null || timeLeft === 0 ? (
                <button
                  onClick={onNextQuestion}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  {isLastQuestion ? 'Finish' : 'Next'}
                </button>
              ) : (
                <div className="text-gray-500 italic">
                  Select an answer to continue
                </div>
              )}
            </div>
          </div>
  
          <div className="bg-gray-50 p-4 border-t">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full"
                style={{
                  width: `${((currentIndex + 1) / totalQuestions) * 100}%`,
                }}
              ></div>
            </div>
            <p className="text-right mt-1 text-sm font-medium">
              Score: {score} / {currentIndex}
            </p>
          </div>
        </div>
      </div>
    );
  };
  
  export default QuizQuestion;