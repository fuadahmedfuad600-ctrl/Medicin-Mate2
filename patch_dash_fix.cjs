const fs = require('fs');
let dash = fs.readFileSync('src/components/Dashboard.tsx', 'utf8');
dash = dash.replace(
  "locale: language === 'bn' ? bn : language === 'hi' ? hi : enUS // ur fallback to enUS since date-fns might not have it loaded easily without further imports });",
  "locale: language === 'bn' ? bn : language === 'hi' ? hi : enUS });"
);
fs.writeFileSync('src/components/Dashboard.tsx', dash);
