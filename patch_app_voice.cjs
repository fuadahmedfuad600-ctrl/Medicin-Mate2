const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  "import VoiceAssistant from './components/VoiceAssistant';\n",
  ""
);

code = code.replace(
  "      <VoiceAssistant />\n      <Routes>",
  "      <Routes>"
);

fs.writeFileSync('src/App.tsx', code);
