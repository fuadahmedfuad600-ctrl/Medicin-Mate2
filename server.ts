import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type, Schema, LiveServerMessage, Modality } from '@google/genai';
import { WebSocketServer } from 'ws';
import http from 'http';
import dotenv from 'dotenv';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Create HTTP server to attach both Express and WebSocket
  const server = http.createServer(app);
  const wss = new WebSocketServer({ server, path: '/live' });

  // Increase payload limit for base64 images
  app.use(express.json({ limit: '50mb' }));

  const apiKeys = [
    process.env.GEMINI_API_KEY,
    process.env.GEMINI_API_KEY_2,
    process.env.GEMINI_API_KEY_3,
    process.env.GEMINI_API_KEY_4,
    process.env.GEMINI_API_KEY_5
  ].filter(Boolean);

  let currentKeyIndex = 0;

  function getAiClient() {
    if (apiKeys.length === 0) return new GoogleGenAI({});
    return new GoogleGenAI({ apiKey: apiKeys[currentKeyIndex] });
  }

  function rotateApiKey() {
    if (apiKeys.length > 1) {
      currentKeyIndex = (currentKeyIndex + 1) % apiKeys.length;
      console.log(`Rate limit hit. Switched to API key index ${currentKeyIndex}`);
      return true;
    }
    return false;
  }
  
  let ai = getAiClient();

  // ... [Websocket handling]
  wss.on('connection', (clientWs) => {
    let session: any = null;

    clientWs.on('message', async (data) => {
      try {
        const msg = JSON.parse(data.toString());
        
        if (msg.type === 'init') {
          // Initialize Gemini Live session with user context
          let attempts = 0;
          const maxAttempts = apiKeys.length || 1;
          while (attempts < maxAttempts) {
            try {
              ai = getAiClient();
              session = await ai.live.connect({
                model: "gemini-2.0-flash-exp",
            config: {
              responseModalities: [Modality.AUDIO],
              speechConfig: {
                voiceConfig: { prebuiltVoiceConfig: { voiceName: "Zephyr" } },
              },
              systemInstruction: `You are a helpful and caring medical assistant for the MedicineMate app. You must strictly talk ONLY about the user's active prescriptions and medicines provided in the context below. Provide natural language, conversational responses about their medication status.

IMPORTANT RULES:
1. ONLY answer based on the user's active prescriptions. Do not provide general medical advice or talk about medicines they do not have prescribed.
2. If they ask about something not in their prescriptions, politely inform them you can only assist with their active medicines.
3. If they ask about what they need to take, reference their context to provide a clear, natural language summary.

Here is the user's current profile, active medicine schedule, and logs:
${JSON.stringify(msg.context, null, 2)}

Provide a natural, concise, and helpful response. Speak in the language the user speaks to you (English, Bengali, Hindi, or Urdu).`,
            },
            callbacks: {
              onmessage: (message: LiveServerMessage) => {
                const audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
                if (audio && clientWs.readyState === 1) {
                  clientWs.send(JSON.stringify({ type: 'audio', audio }));
                }
                if (message.serverContent?.interrupted && clientWs.readyState === 1) {
                  clientWs.send(JSON.stringify({ type: 'interrupted', interrupted: true }));
                }
              },
            },
          });
          clientWs.send(JSON.stringify({ type: 'ready' }));
              break;
            } catch (err) {
              if (err.status === 429 || (err.message && (err.message.includes('429') || err.message.includes('quota')))) {
                if (rotateApiKey()) {
                  attempts++;
                  continue;
                }
              }
              throw err;
            }
          }
        } else if (msg.type === 'audio' && session) {
          session.sendRealtimeInput({
            audio: { data: msg.audio, mimeType: "audio/pcm;rate=16000" },
          });
        }
      } catch (err) {
        console.error('WebSocket message error:', err);
      }
    });

    clientWs.on('close', () => {
      if (session) {
        session.close();
      }
    });
  });


  // Define structured output schema for medicines
  const medicineSchema: Schema = {
    type: Type.OBJECT,
    properties: {
      medicines: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            name: {
              type: Type.STRING,
              description: 'The name of the medicine (e.g., Napa, Seclo).',
            },
            dosage: {
              type: Type.STRING,
              description: 'The dosage amount (e.g., 500mg, 20mg).',
            },
            frequency: {
              type: Type.STRING,
              description: 'The exact frequency written on the prescription (e.g., 1+0+1, 1-1-1, PO BD, TDS).',
            },
            simplifiedFrequency: {
              type: Type.STRING,
              description: 'A very simple, easy to understand translation of the frequency in English (e.g., 1 in the morning, 1 at night).',
            },
            instructions: {
              type: Type.STRING,
              description: 'Additional instructions like Before meal, After meal, etc.',
            },
            durationDays: {
              type: Type.INTEGER,
              description: 'How many days to take the medicine. Use -1 if it is continuous or unspecified.',
            },
            confidence: {
              type: Type.INTEGER,
              description: 'A confidence score from 0 to 100 on how accurately you were able to read this specific medicine from the image.',
            },
          },
          required: ['name', 'dosage', 'frequency', 'simplifiedFrequency', 'instructions', 'durationDays', 'confidence'],
        },
      },
    },
    required: ['medicines'],
  };

  // API routes
  app.post('/api/extract', async (req, res) => {
    try {
      const { imageBase64, mimeType, language } = req.body;
      if (!imageBase64 || !mimeType) {
        return res.status(400).json({ error: 'Image data and mimeType are required' });
      }
      const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');
      const targetLang = language === 'bn' ? 'Bengali' : 'English';

      let response;
      let attempts = 0;
      const maxAttempts = apiKeys.length || 1;
      
      while (attempts < maxAttempts) {
        try {
          const currentAi = getAiClient();
          response = await currentAi.models.generateContent({
            model: 'gemini-3.6-flash',
            contents: [
              {
                role: 'user',
                parts: [
                  { text: 'Carefully read this prescription image. Extract all the prescribed medicines. For each medicine, provide its name, dosage, frequency exactly as written, a simplified explanation of the frequency in English, any instructions (like before/after meals) in English, the duration in days (-1 if not specified), and your confidence score (0-100) in reading this item. DO NOT invent or infer medicines that are not explicitly written. Output simplifiedFrequency and instructions STRICTLY in English ONLY.' },
                  { inlineData: { data: base64Data, mimeType: mimeType } }
                ]
              }
            ],
            config: {
              responseMimeType: 'application/json',
              responseSchema: medicineSchema,
              temperature: 0.1
            }
          });
          break; // break while loop on success
        } catch (err) {
          if (err.status === 429 || (err.message && (err.message.includes('429') || err.message.includes('quota')))) {
            if (rotateApiKey()) {
              attempts++;
              continue;
            }
          }
          throw err; // throw to outer try-catch
        }
      }

      if (!response || !response.text) {
        throw new Error('No response from Gemini');
      }
      const extractedData = JSON.parse(response.text);
      res.json(extractedData);
    } catch (error) {
      console.error('Error extracting prescription:', error);
      res.status(500).json({ error: 'Failed to extract data from prescription' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
