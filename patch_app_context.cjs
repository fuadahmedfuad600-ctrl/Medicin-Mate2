const fs = require('fs');

let ctx = fs.readFileSync('src/context/AppContext.tsx', 'utf8');

// Update AppState
ctx = ctx.replace(
  "language: 'en' | 'bn' | 'hi' | 'ur';",
  "language: 'en' | 'bn' | 'hi' | 'ur';\n  reminderSound: 'default' | 'chime' | 'digital' | 'gentle';"
);

// Update AppContextType
ctx = ctx.replace(
  "setLanguage: (language: 'en' | 'bn' | 'hi' | 'ur') => void;",
  "setLanguage: (language: 'en' | 'bn' | 'hi' | 'ur') => void;\n  setReminderSound: (sound: 'default' | 'chime' | 'digital' | 'gentle') => void;"
);

// Update defaultState
ctx = ctx.replace(
  "language: 'en',",
  "language: 'en',\n  reminderSound: 'default',"
);

// Update initialization
ctx = ctx.replace(
  "language: 'en',",
  "language: 'en',\n      reminderSound: savedData.reminderSound || 'default'," // ensure we handle both cases, I'll do this carefully
);

fs.writeFileSync('src/context/AppContext.tsx', ctx);
