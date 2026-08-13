const fs = require('fs');

let code = fs.readFileSync('server.ts', 'utf-8');

// Replace the single apiKey initialization with a rotation logic
code = code.replace(
  `const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });`,
  `const apiKeys = [
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
      console.log(\`Rate limit hit. Switched to API key index \${currentKeyIndex}\`);
      return true;
    }
    return false;
  }
  
  let ai = getAiClient();`
);

// Now patch the extract API:
code = code.replace(
  `const response = await ai.models.generateContent({`,
  `let response;
      let attempts = 0;
      const maxAttempts = apiKeys.length || 1;
      
      while(attempts < maxAttempts) {
        try {
          ai = getAiClient();
          response = await ai.models.generateContent({`
);

code = code.replace(
  `if (!response.text) {
        throw new Error('No response from Gemini');
      }

      const extractedData = JSON.parse(response.text);
      res.json(extractedData);
    } catch (error) {
      console.error('Error extracting prescription:', error);
      res.status(500).json({ error: 'Failed to extract data from prescription' });
    }`,
  `if (!response.text) {
            throw new Error('No response from Gemini');
          }
          const extractedData = JSON.parse(response.text);
          return res.json(extractedData);
        } catch (err) {
          if (err.status === 429 || (err.message && (err.message.includes('429') || err.message.includes('quota')))) {
            if (rotateApiKey()) {
              attempts++;
              continue;
            }
          }
          console.error('Error extracting prescription:', err);
          return res.status(500).json({ error: 'Failed to extract data from prescription' });
        }
      }`
);

// Now patch the WebSocket connection
code = code.replace(
  `session = await ai.live.connect({
            model: "gemini-2.0-flash-exp",`,
  `let attempts = 0;
          const maxAttempts = apiKeys.length || 1;
          while (attempts < maxAttempts) {
            try {
              ai = getAiClient();
              session = await ai.live.connect({
                model: "gemini-2.0-flash-exp",`
);

// The end of ws.onopen block for init:
code = code.replace(
  `clientWs.send(JSON.stringify({ type: 'ready' }));
        } else if (msg.type === 'audio' && session) {`,
  `clientWs.send(JSON.stringify({ type: 'ready' }));
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
        } else if (msg.type === 'audio' && session) {`
);

fs.writeFileSync('server.ts', code);
