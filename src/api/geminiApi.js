const GEMINI_API_KEY = 'AIzaSyATQYkbehVhfAikgg3WKR9clxivj_60BkA'; // Remove this in production!
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent" ;

export const generateContentWithGemini = async (prompt) => {
  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }],
        safetySettings: [
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_ONLY_HIGH"
          }
        ],
        generationConfig: {
          temperature: 0.9,
          topP: 1,
          topK: 32,
          maxOutputTokens: 2048
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('API Error Details:', errorData);
      throw new Error(`API request failed with status ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Full Gemini API Error:', error);
    throw error;
  }
};