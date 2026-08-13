const fs = require('fs');

let ctx = fs.readFileSync('src/context/AppContext.tsx', 'utf8');

// Ensure setReminderSound is added
if (!ctx.includes('setReminderSound')) {
  // Add to AppState
  ctx = ctx.replace(
    /language: 'en' \| 'bn' \| 'hi' \| 'ur';/g,
    "language: 'en' | 'bn' | 'hi' | 'ur';\n  reminderSound: 'default' | 'chime' | 'digital' | 'gentle';"
  );
  
  // Add to AppContextType
  ctx = ctx.replace(
    /setLanguage: \(language: 'en' \| 'bn' \| 'hi' \| 'ur'\) => void;/g,
    "setLanguage: (language: 'en' | 'bn' | 'hi' | 'ur') => void;\n  setReminderSound: (sound: 'default' | 'chime' | 'digital' | 'gentle') => void;"
  );

  // Add to defaultState and initial state
  ctx = ctx.replace(
    /language: 'en',/g,
    "language: 'en',\n  reminderSound: 'default',"
  );

  // We also need to get it from savedData in the init block
  ctx = ctx.replace(
    /const savedData = JSON.parse\(saved\);/g,
    "const savedData = JSON.parse(saved);\n      if (!savedData.reminderSound) savedData.reminderSound = 'default';"
  );

  // Provide the function in AppProvider
  ctx = ctx.replace(
    /const setLanguage = \(language: 'en' \| 'bn' \| 'hi' \| 'ur'\) => \{/g,
    "const setReminderSound = (sound: 'default' | 'chime' | 'digital' | 'gentle') => {\n    setState((prev) => ({ ...prev, reminderSound: sound }));\n  };\n\n  const setLanguage = (language: 'en' | 'bn' | 'hi' | 'ur') => {"
  );

  // Export the function in Context.Provider
  ctx = ctx.replace(
    /setLanguage,/g,
    "setLanguage,\n        setReminderSound,"
  );
}

fs.writeFileSync('src/context/AppContext.tsx', ctx);
