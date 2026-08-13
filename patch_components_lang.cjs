const fs = require('fs');

const replaceLang = (file, from, en, bn, hi, ur) => {
  let content = fs.readFileSync(file, 'utf8');
  // Simple regex to replace the ternary operator pattern
  // E.g., language === 'en' ? 'Today' : 'আজ'
  const regex = new RegExp(`language === 'en' \\? '${en}' : '${bn}'`, 'g');
  const replacement = `language === 'en' ? '${en}' : language === 'hi' ? '${hi}' : language === 'ur' ? '${ur}' : '${bn}'`;
  content = content.replace(regex, replacement);
  fs.writeFileSync(file, content);
};

const replaceLangDouble = (file, from, en, bn, hi, ur) => {
  let content = fs.readFileSync(file, 'utf8');
  const regex = new RegExp(`language === 'en' \\? "${en}" : "${bn}"`, 'g');
  const replacement = `language === 'en' ? "${en}" : language === 'hi' ? "${hi}" : language === 'ur' ? "${ur}" : "${bn}"`;
  content = content.replace(regex, replacement);
  fs.writeFileSync(file, content);
};

const replaceLangBackticks = (file, from, en, bn, hi, ur) => {
  let content = fs.readFileSync(file, 'utf8');
  const regex = new RegExp(`language === 'en' \\? \\\`${en}\\\` : \\\`${bn}\\\``, 'g');
  const replacement = `language === 'en' ? \`${en}\` : language === 'hi' ? \`${hi}\` : language === 'ur' ? \`${ur}\` : \`${bn}\``;
  content = content.replace(regex, replacement);
  fs.writeFileSync(file, content);
};

// Layout.tsx
replaceLang('src/components/Layout.tsx', '', 'Today', 'আজ', 'आज', 'آج');
replaceLang('src/components/Layout.tsx', '', 'Alerts', 'অ্যালার্ট', 'अलर्ट', 'الرٹس');
replaceLang('src/components/Layout.tsx', '', 'Scan', 'স্ক্যান', 'स्कैन', 'اسکین');
replaceLang('src/components/Layout.tsx', '', 'History', 'হিস্ট্রি', 'इतिहास', 'تاریخ');
replaceLang('src/components/Layout.tsx', '', 'Settings', 'সেটিংস', 'सेटिंग्स', 'ترتیبات');

// Reminders.tsx
replaceLang('src/components/Reminders.tsx', '', 'Reminders', 'রিমাইন্ডার', 'रिमाइंडर', 'یاد دہانی');
replaceLang('src/components/Reminders.tsx', '', 'New Reminder', 'নতুন রিমাইন্ডার', 'नया रिमाइंडर', 'نئی یاد دہانی');
replaceLang('src/components/Reminders.tsx', '', 'New', 'নতুন', 'नया', 'نئی');
replaceLang('src/components/Reminders.tsx', '', 'Medicine', 'ওষুধ', 'दवा', 'دوا');
replaceLang('src/components/Reminders.tsx', '', 'Select medicine', 'ওষুধ নির্বাচন করুন', 'दवा चुनें', 'دوا منتخب کریں');
replaceLang('src/components/Reminders.tsx', '', 'Time', 'সময়', 'समय', 'وقت');
replaceLang('src/components/Reminders.tsx', '', 'Frequency', 'বারবার', 'आवृत्ति', 'تعدد');
replaceLang('src/components/Reminders.tsx', '', 'Daily', 'প্রতিদিন', 'रोजाना', 'روزانہ');
replaceLang('src/components/Reminders.tsx', '', 'Weekly', 'সাপ্তাহিক', 'साप्ताहिक', 'ہفتہ وار');
replaceLang('src/components/Reminders.tsx', '', 'Days', 'দিনগুলো', 'दिन', 'دن');
replaceLang('src/components/Reminders.tsx', '', 'Save Reminder', 'রিমাইন্ডার সেভ করুন', 'रिमाइंडर सेव करें', 'محفوظ کریں');
replaceLang('src/components/Reminders.tsx', '', 'No Reminders', 'কোনো রিমাইন্ডার নেই', 'कोई रिमाइंडर नहीं', 'کوئی یاد دہانی نہیں');
replaceLang('src/components/Reminders.tsx', '', 'Set up daily or weekly alerts for your medications.', 'আপনার ওষুধের জন্য দৈনিক বা সাপ্তাহিক অ্যালার্ট সেট করুন।', 'अपनी दवाओं के लिए दैनिक या साप्ताहिक अलर्ट सेट करें।', 'اپنی ادویات کے لیے روزانہ یا ہفتہ وار الرٹ سیٹ کریں۔');
replaceLang('src/components/Reminders.tsx', '', 'Meal Times', 'খাবারের সময়', 'भोजन का समय', 'کھانے کے اوقات');
replaceLang('src/components/Reminders.tsx', '', 'Breakfast', 'সকাল', 'सुबह का नाश्ता', 'ناشتہ');
replaceLang('src/components/Reminders.tsx', '', 'Lunch', 'দুপুর', 'दोपहर का भोजन', 'دوپہر کا کھانا');
replaceLang('src/components/Reminders.tsx', '', 'Dinner', 'রাত', 'रात का भोजन', 'رات کا کھانا');
replaceLang('src/components/Reminders.tsx', '', 'Save', 'সংরক্ষণ করুন', 'सेव करें', 'محفوظ کریں');
replaceLang('src/components/Reminders.tsx', '', 'Edit', 'পরিবর্তন করুন', 'संपादित करें', 'ترمیم');
replaceLang('src/components/Reminders.tsx', '', 'Smart alerts will automatically trigger based on meal times and prescription instructions.', 'খাবারের সময়ের উপর ভিত্তি করে স্মার্ট অ্যালার্টগুলি স্বয়ংক্রিয়ভাবে পরিচালিত হয়।', 'भोजन के समय और नुस्खे के निर्देशों के आधार पर स्मार्ट अलर्ट स्वचालित रूप से ट्रिगर होंगे।', 'کھانے کے اوقات اور نسخے کی ہدایات کی بنیاد پر اسمارٹ الرٹس خود بخود متحرک ہوجائیں گے۔');
replaceLang('src/components/Reminders.tsx', '', 'No days selected', 'কোনো দিন নির্বাচিত হয়নি', 'कोई दिन नहीं चुना गया', 'کوئی دن منتخب نہیں کیا گیا');
replaceLang('src/components/Reminders.tsx', '', 'Every day', 'প্রতিদিন', 'हर दिन', 'ہر روز');

let rem = fs.readFileSync('src/components/Reminders.tsx', 'utf8');
rem = rem.replace(
  "language === 'bn' \n      ? ['রবি', 'সোম', 'মঙ্গল', 'বুধ', 'বৃহঃ', 'শুক্র', 'শনি']\n      : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']",
  "language === 'bn' ? ['রবি', 'সোম', 'মঙ্গল', 'বুধ', 'বৃহঃ', 'শুক্র', 'শনি'] : language === 'hi' ? ['रवि', 'सोम', 'मंगल', 'बुध', 'गुरु', 'शुक्र', 'शनि'] : language === 'ur' ? ['اتوار', 'پیر', 'منگل', 'بدھ', 'جمعرات', 'جمعہ', 'ہفتہ'] : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']"
);
fs.writeFileSync('src/components/Reminders.tsx', rem);

// VoiceAssistant.tsx
replaceLang('src/components/VoiceAssistant.tsx', '', 'Listening...', 'শুনছি...', 'सुन रहा हूँ...', 'سن رہا ہوں...');
replaceLang('src/components/VoiceAssistant.tsx', '', 'Voice', 'ভয়েস', 'आवाज़', 'آواز');

