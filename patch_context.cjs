const fs = require('fs');
let code = fs.readFileSync('src/context/AppContext.tsx', 'utf-8');
code = code.replace(
  'localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));',
  `try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
    } catch (err) {
      console.error('Failed to save state to localStorage', err);
    }`
);
fs.writeFileSync('src/context/AppContext.tsx', code);
