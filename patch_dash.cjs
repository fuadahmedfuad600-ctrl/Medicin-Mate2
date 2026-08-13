const fs = require('fs');

let dash = fs.readFileSync('src/components/Dashboard.tsx', 'utf8');

dash = dash.replace(
  "morning: language === 'bn' ? 'সকাল' : 'Morning',",
  "morning: language === 'en' ? 'Morning' : language === 'hi' ? 'सुबह' : language === 'ur' ? 'صبح' : 'সকাল',"
);
dash = dash.replace(
  "noon: language === 'bn' ? 'দুপুর' : 'Noon',",
  "noon: language === 'en' ? 'Noon' : language === 'hi' ? 'दोपहर' : language === 'ur' ? 'دوپہر' : 'দুপুর',"
);
dash = dash.replace(
  "night: language === 'bn' ? 'রাত' : 'Night',",
  "night: language === 'en' ? 'Night' : language === 'hi' ? 'रात' : language === 'ur' ? 'رات' : 'রাত',"
);

dash = dash.replace(
  "language === 'bn' ? 'আজ কোনো ওষুধ নেই!' : 'No medicines today!'",
  "language === 'en' ? 'No medicines today!' : language === 'hi' ? 'आज कोई दवा नहीं!' : language === 'ur' ? 'آج کوئی دوا نہیں!' : 'আজ কোনো ওষুধ নেই!'"
);

dash = dash.replace(
  "language === 'bn' \n             ? 'আপনার কোনো সক্রিয় প্রেসক্রিপশন নেই। শুরু করতে একটি প্রেসক্রিপশন স্ক্যান করুন।'\n             : \"You don't have any active prescriptions. Scan a prescription to get started.\"",
  "language === 'en' ? \"You don't have any active prescriptions. Scan a prescription to get started.\" : language === 'hi' ? 'आपके पास कोई सक्रिय पर्चा नहीं है। शुरू करने के लिए एक पर्चा स्कैन करें।' : language === 'ur' ? 'آپ کے پاس کوئی فعال نسخہ نہیں ہے۔ شروع کرنے کے لیے ایک نسخہ اسکین کریں۔' : 'আপনার কোনো সক্রিয় প্রেসক্রিপশন নেই। শুরু করতে একটি প্রেসক্রিপশন স্ক্যান করুন।'"
);

dash = dash.replace(
  "language === 'bn' ? 'আজকের রুটিন' : \"Today's Schedule\"",
  "language === 'en' ? \"Today's Schedule\" : language === 'hi' ? 'आज का रूटीन' : language === 'ur' ? 'آج کا شیڈول' : 'আজকের রুটিন'"
);

dash = dash.replace(
  "import { bn, enUS } from 'date-fns/locale';",
  "import { bn, enUS, hi } from 'date-fns/locale';"
);
dash = dash.replace(
  "locale: language === 'bn' ? bn : enUS",
  "locale: language === 'bn' ? bn : language === 'hi' ? hi : enUS // ur fallback to enUS since date-fns might not have it loaded easily without further imports"
);

fs.writeFileSync('src/components/Dashboard.tsx', dash);
