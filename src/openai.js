const OpenAI = require('openai');

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Send a message to OpenAI and get a response
 * @param {string} message - The user's message
 * @returns {Promise<string>} - The AI response
 */
async function getOpenAIResponse(message) {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant in a Slack channel. Keep responses concise and friendly."
        },
        {
          role: "user",
          content: message
        }
      ],
      max_tokens: 150,
      temperature: 0.7,
    });

    return completion.choices[0].message.content.trim();
  } catch (error) {
    console.error('OpenAI API error:', error);
    return "Sorry, I'm having trouble thinking right now. Please try again later.";
  }
}

/**
 * Get a simple greeting response
 * @returns {Promise<string>}
 */
async function getGreeting() {
  return await getOpenAIResponse("Say hi in a friendly way");
}

module.exports = {
  getOpenAIResponse,
  getGreeting
};