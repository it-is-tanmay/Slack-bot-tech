require('dotenv').config();
const { App } = require('@slack/bolt');
const { getOpenAIResponse, getGreeting } = require('./src/openai');

// Initialize your app with your bot token and signing secret
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET
});

// Respond with AI-generated message when someone mentions the bot
app.event('app_mention', async ({ event, say }) => {
  try {
    // Remove the bot mention from the message
    const message = event.text.replace(/<@[^>]+>/g, '').trim();
    
    let response;
    if (message === '' || message.toLowerCase().includes('hi') || message.toLowerCase().includes('hello')) {
      // If just mentioned or saying hi, use greeting
      response = await getGreeting();
    } else {
      // Otherwise, send the message to OpenAI
      response = await getOpenAIResponse(message);
    }
    
    await say(response);
  } catch (error) {
    console.error('Error handling mention:', error);
    await say('Sorry, something went wrong!');
  }
});

// Optionally respond to "hello" messages in the channel
app.message('hello', async ({ message, say }) => {
  const response = await getGreeting();
  await say(response);
});

// Start your app
(async () => {
  await app.start(process.env.PORT || 3000);
  console.log('⚡️ Hi Bot with OpenAI is running!');
})();