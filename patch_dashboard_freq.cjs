const fs = require('fs');
let code = fs.readFileSync('src/components/Dashboard.tsx', 'utf8');
code = code.replace(
  "{parseFrequency(med.frequency, language)}",
  "{parseFrequency(med.frequency, language) || translateText(med.simplifiedFrequency, language)}"
);
fs.writeFileSync('src/components/Dashboard.tsx', code);
