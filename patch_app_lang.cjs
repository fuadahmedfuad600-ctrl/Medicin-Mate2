const fs = require('fs');
let appCode = fs.readFileSync('src/App.tsx', 'utf8');

appCode = appCode.replace(
  "const bTitle = language === 'bn' ? 'ওষুধ খাওয়ার সময়!' : 'Time for your medicine!';",
  "const bTitle = language === 'en' ? 'Time for your medicine!' : language === 'hi' ? 'दवा का समय!' : language === 'ur' ? 'دوا کا وقت!' : 'ওষুধ খাওয়ার সময়!';"
);

appCode = appCode.replace(
  "const timingStr = offset < 0 ? (language === 'bn' ? 'আগে' : 'before') : offset > 0 ? (language === 'bn' ? 'পরে' : 'after') : (language === 'bn' ? 'সাথে' : 'with');",
  "const timingStr = offset < 0 ? (language === 'en' ? 'before' : language === 'hi' ? 'से पहले' : language === 'ur' ? 'سے پہلے' : 'আগে') : offset > 0 ? (language === 'en' ? 'after' : language === 'hi' ? 'के बाद' : language === 'ur' ? 'کے بعد' : 'পরে') : (language === 'en' ? 'with' : language === 'hi' ? 'के साथ' : language === 'ur' ? 'کے ساتھ' : 'সাথে');"
);

appCode = appCode.replace(
  "const bBody = language === 'bn' \n                  ? `আপনার ${med.name} (${med.dosage}) খাওয়ার সময় হয়েছে (${mealName}র ${timingStr})।` \n                  : `It's time to take ${med.name} (${med.dosage}) ${timingStr} ${mealName}.`;",
  "const bBody = language === 'en' ? `It's time to take ${med.name} (${med.dosage}) ${timingStr} ${mealName}.` : language === 'hi' ? `आपकी ${med.name} (${med.dosage}) खाने का समय हो गया है (${mealName} ${timingStr})।` : language === 'ur' ? `آپ کی ${med.name} (${med.dosage}) کھانے کا وقت ہو گیا ہے (${mealName} ${timingStr})۔` : `আপনার ${med.name} (${med.dosage}) খাওয়ার সময় হয়েছে (${mealName}র ${timingStr})।`;"
);

appCode = appCode.replace(
  "checkTime(meals.breakfast, m, language === 'bn' ? 'সকালের খাবার' : 'breakfast');",
  "checkTime(meals.breakfast, m, language === 'en' ? 'breakfast' : language === 'hi' ? 'नाश्ते' : language === 'ur' ? 'ناشتے' : 'সকালের খাবার');"
);
appCode = appCode.replace(
  "checkTime(meals.lunch, n, language === 'bn' ? 'দুপুরের খাবার' : 'lunch');",
  "checkTime(meals.lunch, n, language === 'en' ? 'lunch' : language === 'hi' ? 'दोपहर के भोजन' : language === 'ur' ? 'دوپہر کے کھانے' : 'দুপুরের খাবার');"
);
appCode = appCode.replace(
  "checkTime(meals.dinner, ni, language === 'bn' ? 'রাতের খাবার' : 'dinner');",
  "checkTime(meals.dinner, ni, language === 'en' ? 'dinner' : language === 'hi' ? 'रात के भोजन' : language === 'ur' ? 'رات کے کھانے' : 'রাতের খাবার');"
);

appCode = appCode.replace(
  "const title = language === 'bn' ? 'ওষুধ খাওয়ার সময়!' : 'Time for your medicine!';",
  "const title = language === 'en' ? 'Time for your medicine!' : language === 'hi' ? 'दवा का समय!' : language === 'ur' ? 'دوا کا وقت!' : 'ওষুধ খাওয়ার সময়!';"
);
appCode = appCode.replace(
  "const body = language === 'bn' ? `আপনার ${med.name} (${med.dosage}) খাওয়ার সময় হয়েছে।` : `It's time to take ${med.name} (${med.dosage}).`;",
  "const body = language === 'en' ? `It's time to take ${med.name} (${med.dosage}).` : language === 'hi' ? `आपकी ${med.name} (${med.dosage}) खाने का समय हो गया है।` : language === 'ur' ? `آپ کی ${med.name} (${med.dosage}) کھانے کا وقت ہو گیا ہے۔` : `আপনার ${med.name} (${med.dosage}) খাওয়ার সময় হয়েছে।`;"
);

fs.writeFileSync('src/App.tsx', appCode);

