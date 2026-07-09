const { OpenAI } = require('openai');

// Initialize client with SumoPod AI (Menggunakan API Key Anda dari .env.local)
const openai = new OpenAI({
  apiKey: 'sk-G2ohiSkZz9C9FEJCuojPNg',
  baseURL: 'https://ai.sumopod.com/v1'
});

async function main() {
  try {
    // Make a chat completion request
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'user', content: 'Say hello in a creative way' }
      ],
      max_tokens: 150,
      temperature: 0.7
    });

    console.log(response.choices[0].message.content);
  } catch (error) {
    console.error('Error:', error);
  }
}

main();
