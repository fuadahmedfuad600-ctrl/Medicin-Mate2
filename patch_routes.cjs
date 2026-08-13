const fs = require('fs');

let app = fs.readFileSync('src/App.tsx', 'utf8');

// Swap the components for the routes
app = app.replace('<Route path="/" element={<Dashboard />} />', '<Route path="/" element={<History />} />');
app = app.replace('<Route path="/history" element={<History />} />', '<Route path="/history" element={<Dashboard />} />');

fs.writeFileSync('src/App.tsx', app);

let layout = fs.readFileSync('src/components/Layout.tsx', 'utf8');
layout = layout.replace(
  "language === 'en' ? 'Today' : language === 'hi' ? 'आज' : language === 'ur' ? 'آج' : 'আজ'",
  "language === 'en' ? 'Dashboard' : language === 'hi' ? 'डैशबोर्ड' : language === 'ur' ? 'ڈیش بورڈ' : 'ড্যাশবোর্ড'"
);
layout = layout.replace("import { Home,", "import { LayoutDashboard,");
layout = layout.replace("<Home className=\"w-6 h-6\" />", "<LayoutDashboard className=\"w-6 h-6\" />");

fs.writeFileSync('src/components/Layout.tsx', layout);

let dash = fs.readFileSync('src/components/Dashboard.tsx', 'utf8');
dash = dash.replace(
  "language === 'en' ? \"Today's Schedule\" : language === 'hi' ? 'आज का रूटीन' : language === 'ur' ? 'آج کا شیڈول' : 'আজকের রুটিন'",
  "language === 'en' ? 'History' : language === 'hi' ? 'इतिहास' : language === 'ur' ? 'تاریخ' : 'হিস্ট্রি'"
);
fs.writeFileSync('src/components/Dashboard.tsx', dash);

let hist = fs.readFileSync('src/components/History.tsx', 'utf8');
hist = hist.replace(
  "title: language === 'en' ? 'Prescription History' : language === 'hi' ? 'पर्चे का इतिहास' : language === 'ur' ? 'نسخے کی تاریخ' : 'প্রেসক্রিপশন হিস্ট্রি',",
  "title: language === 'en' ? 'Dashboard' : language === 'hi' ? 'डैशबोर्ड' : language === 'ur' ? 'ڈیش بورڈ' : 'ড্যাশবোর্ড',"
);
fs.writeFileSync('src/components/History.tsx', hist);

