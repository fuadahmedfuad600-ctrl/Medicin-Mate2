const fs = require('fs');

let scannerCode = fs.readFileSync('src/components/Scanner.tsx', 'utf8');

scannerCode = scannerCode.replace(
  "verify: language === 'bn' ? 'এই তথ্যগুলো যাচাই করুন' : 'Verify these details',",
  "verify: language === 'en' ? 'Verify these details' : language === 'hi' ? 'इन विवरणों को सत्यापित करें' : language === 'ur' ? 'ان تفصیلات کی تصدیق کریں' : 'এই তথ্যগুলো যাচাই করুন',"
);
scannerCode = scannerCode.replace(
  "verifyDesc: language === 'bn' ? 'এআই ভুল করতে পারে। সেভ করার আগে আপনার মূল প্রেসক্রিপশনের সাথে ওষুধগুলো মিলিয়ে নিন।' : 'AI can make mistakes. Please check the extracted medicines against your physical prescription before saving.',",
  "verifyDesc: language === 'en' ? 'AI can make mistakes. Please check the extracted medicines against your physical prescription before saving.' : language === 'hi' ? 'एआई गलतियाँ कर सकता है। कृपया सहेजने से पहले अपने भौतिक पर्चे के खिलाफ निकाली गई दवाओं की जांच करें।' : language === 'ur' ? 'اے آئی غلطیاں کر سکتا ہے۔ براہ کرم محفوظ کرنے سے پہلے اپنے جسمانی نسخے کے خلاف نکالی گئی ادویات کی جانچ کریں۔' : 'এআই ভুল করতে পারে। সেভ করার আগে আপনার মূল প্রেসক্রিপশনের সাথে ওষুধগুলো মিলিয়ে নিন।',"
);
scannerCode = scannerCode.replace(
  "extractedMeds: language === 'bn' ? 'উদ্ধারকৃত ওষুধসমূহ' : 'Extracted Medicines',",
  "extractedMeds: language === 'en' ? 'Extracted Medicines' : language === 'hi' ? 'निकाली गई दवाएं' : language === 'ur' ? 'نکالی گئی ادویات' : 'উদ্ধারকৃত ওষুধসমূহ',"
);
scannerCode = scannerCode.replace(
  "lowConf: language === 'bn' ? 'কম আত্মবিশ্বাস' : 'Low Confidence',",
  "lowConf: language === 'en' ? 'Low Confidence' : language === 'hi' ? 'कम आत्मविश्वास' : language === 'ur' ? 'کم اعتماد' : 'কম আত্মবিশ্বাস',"
);
scannerCode = scannerCode.replace(
  "freqRaw: language === 'bn' ? 'খাওয়ার নিয়ম (মূল):' : 'Frequency (Raw):',",
  "freqRaw: language === 'en' ? 'Frequency (Raw):' : language === 'hi' ? 'आवृत्ति (मूल):' : language === 'ur' ? 'تعدد (خام):' : 'খাওয়ার নিয়ম (মূল):',"
);
scannerCode = scannerCode.replace(
  "simply: language === 'bn' ? 'সহজভাবে:' : 'Simply:',",
  "simply: language === 'en' ? 'Simply:' : language === 'hi' ? 'सरलता से:' : language === 'ur' ? 'آسانی سے:' : 'সহজভাবে:',"
);
scannerCode = scannerCode.replace(
  "instructions: language === 'bn' ? 'নির্দেশনা:' : 'Instructions:',",
  "instructions: language === 'en' ? 'Instructions:' : language === 'hi' ? 'निर्देश:' : language === 'ur' ? 'ہدایات:' : 'নির্দেশনা:',"
);
scannerCode = scannerCode.replace(
  "duration: language === 'bn' ? 'মেয়াদ:' : 'Duration:',",
  "duration: language === 'en' ? 'Duration:' : language === 'hi' ? 'अवधि:' : language === 'ur' ? 'مدت:' : 'মেয়াদ:',"
);
scannerCode = scannerCode.replace(
  "continuous: language === 'bn' ? 'চলবে' : 'Continuous',",
  "continuous: language === 'en' ? 'Continuous' : language === 'hi' ? 'निरंतर' : language === 'ur' ? 'مسلسل' : 'চলবে',"
);
scannerCode = scannerCode.replace(
  "days: language === 'bn' ? 'দিন' : 'days',",
  "days: language === 'en' ? 'days' : language === 'hi' ? 'दिन' : language === 'ur' ? 'دن' : 'দিন',"
);
scannerCode = scannerCode.replace(
  "save: language === 'bn' ? 'ট্র্যাকারে সেভ করুন' : 'Save to Tracker',",
  "save: language === 'en' ? 'Save to Tracker' : language === 'hi' ? 'ट्रैकर में सेव करें' : language === 'ur' ? 'ٹریکر میں محفوظ کریں' : 'ট্র্যাকারে সেভ করুন',"
);
scannerCode = scannerCode.replace(
  "scanTitle: language === 'bn' ? 'প্রেসক্রিপশন স্ক্যান করুন' : 'Scan Prescription',",
  "scanTitle: language === 'en' ? 'Scan Prescription' : language === 'hi' ? 'पर्चा स्कैन करें' : language === 'ur' ? 'نسخہ اسکین کریں' : 'প্রেসক্রিপশন স্ক্যান করুন',"
);
scannerCode = scannerCode.replace(
  "scanDesc: language === 'bn' ? 'আপনার প্রেসক্রিপশনের একটি ছবি তুলুন, আর আমরা ওষুধগুলো বের করে আপনার রুটিনে যোগ করে দেব।' : \"Take a photo of your prescription, and we'll extract the medicines and schedule them for you.\",",
  "scanDesc: language === 'en' ? \"Take a photo of your prescription, and we'll extract the medicines and schedule them for you.\" : language === 'hi' ? 'अपने पर्चे की एक तस्वीर लें, और हम दवाएं निकाल लेंगे और उन्हें आपके रूटीन में शामिल कर देंगे।' : language === 'ur' ? 'اپنے نسخے کی تصویر لیں، اور ہم دوائیں نکال کر انہیں آپ کے شیڈول میں شامل کر دیں گے۔' : 'আপনার প্রেসক্রিপশনের একটি ছবি তুলুন, আর আমরা ওষুধগুলো বের করে আপনার রুটিনে যোগ করে দেব।',"
);
scannerCode = scannerCode.replace(
  "analyzing: language === 'bn' ? 'ছবি বিশ্লেষণ করা হচ্ছে...' : 'Analyzing Image...',",
  "analyzing: language === 'en' ? 'Analyzing Image...' : language === 'hi' ? 'छवि का विश्लेषण हो रहा है...' : language === 'ur' ? 'تصویر کا تجزیہ ہو رہا ہے...' : 'ছবি বিশ্লেষণ করা হচ্ছে...',"
);
scannerCode = scannerCode.replace(
  "openCam: language === 'bn' ? 'ক্যামেরা খুলুন' : 'Open Camera',",
  "openCam: language === 'en' ? 'Open Camera' : language === 'hi' ? 'कैमरा खोलें' : language === 'ur' ? 'کیمرہ کھولیں' : 'ক্যামেরা খুলুন',"
);
scannerCode = scannerCode.replace(
  "ensureLit: language === 'bn' ? 'ভালো ফলাফলের জন্য নিশ্চিত করুন ছবিতে পর্যাপ্ত আলো আছে এবং লেখা স্পষ্ট।' : 'Ensure the image is well-lit and the text is clearly visible for best results.',",
  "ensureLit: language === 'en' ? 'Ensure the image is well-lit and the text is clearly visible for best results.' : language === 'hi' ? 'सर्वोत्तम परिणामों के लिए सुनिश्चित करें कि छवि में पर्याप्त प्रकाश है और पाठ स्पष्ट रूप से दिखाई दे रहा है।' : language === 'ur' ? 'بہترین نتائج کے لیے یقینی بنائیں کہ تصویر اچھی طرح سے روشن ہے اور متن واضح طور پر نظر آ رہا ہے۔' : 'ভালো ফলাফলের জন্য নিশ্চিত করুন ছবিতে পর্যাপ্ত আলো আছে এবং লেখা স্পষ্ট।',"
);

fs.writeFileSync('src/components/Scanner.tsx', scannerCode);

