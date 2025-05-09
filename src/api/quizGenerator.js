import { generateContentWithGemini } from './geminiApi';

const parseGeminiResponse = (textResponse) => {
  try {
    // Try to find JSON in the response
    const jsonStart = textResponse.indexOf('[');
    const jsonEnd = textResponse.lastIndexOf(']') + 1;
    
    if (jsonStart === -1 || jsonEnd === -1) {
      throw new Error('No JSON array found in response');
    }
    
    const jsonString = textResponse.substring(jsonStart, jsonEnd);
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('Failed to parse Gemini response:', {
      error: error.message,
      response: textResponse.substring(0, 200) + '...'
    });
    throw new Error('Invalid response format from Gemini API');
  }
};

export const generateQuizQuestions = async (topic, category, questionCount) => {
  const prompt = `
    Generate exactly ${questionCount} multiple choice quiz questions about "${topic}" 
    in the "${category}" category. Follow these rules STRICTLY:
    
    1. Format MUST be a valid JSON array of question objects
    2. Each question object must have:
       - "question": "The question text?"
       - "options": ["Option 1", "Option 2", "Option 3", "Option 4"]
       - "answer": "The exact correct option text"
    3. Questions should cover different aspects of the topic
    4. Options should be plausible but only one correct
    5. Return ONLY the JSON array, no additional text
    
    Example of required format:
    [
      {
        "question": "What is React?",
        "options": [
          "A JavaScript framework",
          "A programming language",
          "A database system",
          "A design pattern"
        ],
        "answer": "A JavaScript framework"
      }
    ]
  `;

  try {
    const response = await generateContentWithGemini(prompt);
    
    if (!response.candidates?.[0]?.content?.parts?.[0]?.text) {
      throw new Error('Invalid response structure from Gemini API');
    }
    
    const textResponse = response.candidates[0].content.parts[0].text;
    const generatedQuestions = parseGeminiResponse(textResponse);

    if (!Array.isArray(generatedQuestions)) {
      throw new Error('Generated questions is not an array');
    }

    return generatedQuestions.map((q, index) => ({
      id: index + 1,
      question: q.question || '',
      options: Array.isArray(q.options) ? q.options : ['', '', '', ''],
      answer: q.answer || ''
    }));

  } catch (error) {
    console.error('Quiz Generation Error:', {
      topic,
      category,
      questionCount,
      error: error.message
    });
    throw new Error(`Failed to generate quiz: ${error.message}`);
  }
};