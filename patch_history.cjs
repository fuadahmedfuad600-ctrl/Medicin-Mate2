const fs = require('fs');

let historyCode = fs.readFileSync('src/components/History.tsx', 'utf8');

historyCode = historyCode.replace(
  "noHistoryTitle: language === 'bn' ? 'কোনো হিস্ট্রি নেই' : 'No history yet',",
  "noHistoryTitle: language === 'en' ? 'No history yet' : language === 'hi' ? 'कोई इतिहास नहीं' : language === 'ur' ? 'کوئی تاریخ نہیں' : 'কোনো হিস্ট্রি নেই',"
);

historyCode = historyCode.replace(
  "noHistoryDesc: language === 'bn' ? 'আপনার স্ক্যান করা প্রেসক্রিপশনগুলো এখানে দেখা যাবে।' : 'Your scanned prescriptions will appear here.',",
  "noHistoryDesc: language === 'en' ? 'Your scanned prescriptions will appear here.' : language === 'hi' ? 'आपके स्कैन किए गए नुस्खे यहाँ दिखाई देंगे।' : language === 'ur' ? 'آپ کے اسکین شدہ نسخے یہاں ظاہر ہوں گے۔' : 'আপনার স্ক্যান করা প্রেসক্রিপশনগুলো এখানে দেখা যাবে।',"
);

historyCode = historyCode.replace(
  "title: language === 'bn' ? 'প্রেসক্রিপশন হিস্ট্রি' : 'Prescription History',",
  "title: language === 'en' ? 'Prescription History' : language === 'hi' ? 'पर्चे का इतिहास' : language === 'ur' ? 'نسخے کی تاریخ' : 'প্রেসক্রিপশন হিস্ট্রি',"
);

historyCode = historyCode.replace(
  "meds: language === 'bn' ? 'টি ওষুধ' : 'Meds'",
  "meds: language === 'en' ? 'Meds' : language === 'hi' ? 'दवाएं' : language === 'ur' ? 'ادویات' : 'টি ওষুধ'"
);

fs.writeFileSync('src/components/History.tsx', historyCode);

