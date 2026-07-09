import OpenAI from 'openai';
import dotenv from 'dotenv';
import path from 'path';

// Load .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

console.log('Testing with baseURL:', process.env.OPENAI_BASE_URL);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_BASE_URL,
});

async function main() {
  try {
    console.log('Memanggil API...');
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: "Halo! Tolong balas pesan ini dengan 'Tes koneksi berhasil!'" }
      ],
    });

    console.log('\n--- SUCCESS ---');
    console.log(completion.choices[0].message.content);
  } catch (error) {
    console.log('\n--- ERROR ---');
    if (error.response) {
      console.error(error.status, error.response.data);
    } else {
      console.error(error.message);
    }
  }
}

main();
