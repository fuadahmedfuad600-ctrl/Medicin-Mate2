const fs = require('fs');

let code = fs.readFileSync('server.ts', 'utf-8');

// The original file had `try {` at line 171.
// Let's replace the whole app.post('/api/extract' block with a clean one.
code = code.replace(
  /app\.post\('\/api\/extract'[\s\S]*?\/\/ Vite middleware for development/m,
  `app.post('/api/extract', async (req, res) => {
    try {
      const { imageBase64, mimeType, language } = req.body;
      if (!imageBase64 || !mimeType) {
        return res.status(400).json({ error: 'Image data and mimeType are required' });
      }
      const base64Data = imageBase64.replace(/^data:image\\/\\w+;base64,/, '');
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

  // Vite middleware for development`
);

fs.writeFileSync('server.ts', code);
