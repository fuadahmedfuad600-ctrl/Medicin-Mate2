const fs = require('fs');

let app = fs.readFileSync('src/App.tsx', 'utf8');
app = app.replace('<Route path="/" element={<History />} />', '<Route path="/" element={<Dashboard />} />');
app = app.replace('<Route path="/history" element={<Dashboard />} />', '<Route path="/history" element={<History />} />');
fs.writeFileSync('src/App.tsx', app);

let dash = fs.readFileSync('src/components/Dashboard.tsx', 'utf8');
dash = dash.replace(
  "language === 'en' ? 'History' : language === 'hi' ? 'इतिहास' : language === 'ur' ? 'تاریخ' : 'হিস্ট্রি'",
  "language === 'en' ? 'Dashboard' : language === 'hi' ? 'डैशबोर्ड' : language === 'ur' ? 'ڈیش بورڈ' : 'ড্যাশবোর্ড'"
);
fs.writeFileSync('src/components/Dashboard.tsx', dash);

let hist = fs.readFileSync('src/components/History.tsx', 'utf8');
hist = hist.replace(
  "title: language === 'en' ? 'Dashboard' : language === 'hi' ? 'डैशबोर्ड' : language === 'ur' ? 'ڈیش بورڈ' : 'ড্যাশবোর্ড',",
  "title: language === 'en' ? 'Prescription History' : language === 'hi' ? 'पर्चे का इतिहास' : language === 'ur' ? 'نسخے کی تاریخ' : 'প্রেসক্রিপশন হিস্ট্রি',"
);
fs.writeFileSync('src/components/History.tsx', hist);
