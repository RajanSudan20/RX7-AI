import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

app.post('/api/analyze', async (req, res) => {
  const startTime = Date.now();
  try {
    const { code, errorLog, language, options } = req.body || {};
    const apiKey = process.env.GEMINI_API_KEY;

    if (!code || typeof code !== 'string') {
      return res.status(400).json({ error: 'Code content is required.' });
    }

    if (!apiKey) {
      return res.status(400).json({
        error: 'GEMINI_API_KEY environment variable is missing. Please configure it in the Secrets panel.'
      });
    }

    const ai = new GoogleGenAI({ apiKey });
    
    // Strict prompt engineered to enforce RX7 AI persona & output structure
    const systemPrompt = `You are "RX7 AI," the high-performance AI developer assistant. Your sole purpose is to diagnose programming errors, explain the root cause in plain English, and provide optimal, production-ready fixes.

Context & Tone:
- Speak like a senior software engineer conducting a constructive code review: objective, concise, and helpful.
- Avoid conversational filler, pleasantries, or closing remarks (e.g., do not say "Hope this helps!", "Sure, I can look at that", or "Let me know if you need anything else").

Objectives:
1. Identify the exact line or logic causing the error based on the user's code and error log.
2. Explain *why* the error happens, defining any underlying runtime, memory, or syntax concepts simply.
3. Provide a corrected version of the code that is fully functional and optimized.

Strict Constraints:
- If the user provides code without an error message, analyze it for implicit bugs, edge cases, or resource leaks (e.g., unclosed connections, memory issues).
- Never write placeholder code inside the solution block (e.g., \`// your code here\`). Provide the complete, working block or function so the user can easily copy/paste it.
- Keep explanations brief. Focus on why it failed and how the fix addresses it.
${options?.inlineComments ? '- Include concise inline safety comments in the fixed code explaining critical guard clauses or resource management.' : ''}

Output Structure:
You must strictly format your response using the following Markdown sections. Do not deviate from this layout:

### 🔍 Error Diagnosis
[A 2-3 sentence explanation of the root cause. Pinpoint the specific line or logic block where the failure occurs.]

### 🛠️ The Fix
\`\`\`${language || ''}
[Provide the complete, corrected code block here. Ensure it follows best practices and handles edge cases.]
\`\`\`
`;

    const userContent = `USER CODE:
\`\`\`${language || ''}
${code}
\`\`\`

ERROR LOG / STACK TRACE:
${errorLog ? errorLog : '(No explicit error log provided. Analyze for implicit bugs, edge cases, unhandled nulls, memory leaks, or logical flaws.)'}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: [
        { role: 'user', parts: [{ text: systemPrompt + '\n\n' + userContent }] }
      ],
    });

    const resultText = response.text || '';
    const latency = Date.now() - startTime;
    const tokenEstimate = Math.round((systemPrompt.length + userContent.length + resultText.length) / 4);

    return res.json({
      result: resultText,
      latencyMs: latency,
      tokensUsed: tokenEstimate,
      modelUsed: 'gemini-2.0-flash'
    });
  } catch (error: any) {
    console.error('API Error in CodeFix Engine:', error);
    return res.status(500).json({
      error: error.message || 'An error occurred while processing the analysis.'
    });
  }
});

// Interactive Mistake Explanation & Q&A Endpoint
app.post('/api/explain', async (req, res) => {
  try {
    const { code, diagnosis, userQuestion, language, mode } = req.body || {};
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(400).json({
        error: 'GEMINI_API_KEY environment variable is missing.'
      });
    }

    const ai = new GoogleGenAI({ apiKey });

    let systemPrompt = '';
    let userPrompt = '';

    if (mode === 'eli5') {
      systemPrompt = `You are RX7 AI. Explain the coding mistake in super simple terms like explaining to a beginner or a 5-year-old using a relatable real-world analogy (like ordering food, driving a car, or using a library). Be clear, encouraging, and brief.`;
      userPrompt = `CODE:
\`\`\`${language || ''}
${code}
\`\`\`

DIAGNOSIS:
${diagnosis}`;
    } else {
      systemPrompt = `You are RX7 AI, an expert software developer teacher. Answer the user's question about their code mistake or fix clearly, accurately, and concisely. Use code snippets if relevant.`;
      userPrompt = `USER CODE:
\`\`\`${language || ''}
${code}
\`\`\`

PREVIOUS DIAGNOSIS:
${diagnosis}

USER QUESTION ABOUT THEIR MISTAKE:
${userQuestion}`;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: [{ role: 'user', parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }] }],
    });

    return res.json({
      explanation: response.text || 'Unable to generate explanation.'
    });
  } catch (error: any) {
    console.error('Error in /api/explain:', error);
    return res.status(500).json({
      error: error.message || 'Failed to generate mistake explanation.'
    });
  }
});

// Production static file serving vs Development Vite middleware
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'dist')));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
} else {
  const { createServer } = await import('vite');
  const vite = await createServer({
    server: {
      middlewareMode: true,
      hmr: process.env.DISABLE_HMR !== 'true',
    },
    appType: 'spa',
  });
  app.use(vite.middlewares);
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`CodeFix Engine server running on http://0.0.0.0:${PORT}`);
});
