const dict = {
  'morning': { bn: 'সকালে', hi: 'सुबह', ur: 'صبح' },
  'noon': { bn: 'দুপুরে', hi: 'दोपहर', ur: 'دوپہر' },
  'afternoon': { bn: 'বিকালে', hi: 'शाम', ur: 'سہ پہر' },
  'evening': { bn: 'সন্ধ্যায়', hi: 'शाम', ur: 'شام' },
  'night': { bn: 'রাতে', hi: 'रात', ur: 'رات' },
  'daily': { bn: 'প্রতিদিন', hi: 'रोजाना', ur: 'روزانہ' },
  'before meal': { bn: 'খাবারের আগে', hi: 'भोजन से पहले', ur: 'کھانے سے پہلے' },
  'after meal': { bn: 'খাবারের পরে', hi: 'भोजन के बाद', ur: 'کھانے کے بعد' }
};

function translateText(text, language) {
  if (!text) return '';
  
  let normalized = text;
  const hasBengali = /[\u0980-\u09FF]/.test(normalized);
  const hasEnglish = /[a-zA-Z]/.test(normalized);
  
  // Clean up mixed texts like "Before meal (খাবারের আগে)"
  if (hasBengali && hasEnglish) {
    normalized = normalized.replace(/[\u0980-\u09FF]/g, '').replace(/[()]/g, '').trim().replace(/\s{2,}/g, ' ');
  }

  // Reverse translation (from bn/hi/ur back to en, or to another language)
  // First, convert any known foreign words to English
  Object.keys(dict).forEach(engKey => {
    const langs = dict[engKey];
    Object.values(langs).forEach(foreignWord => {
      if (normalized.includes(foreignWord)) {
         normalized = normalized.replace(new RegExp(foreignWord, 'g'), engKey);
      }
    });
  });

  // Now normalized should be mostly English. If the target language is English, we can just return it.
  if (language === 'en') return normalized;

  // Otherwise, translate English to target language
  let translated = normalized;
  const sortedKeys = Object.keys(dict).sort((a, b) => b.length - a.length);

  for (const eng of sortedKeys) {
    const translation = dict[eng][language];
    const regex = new RegExp(`\\b${eng}\\b`, 'gi');
    translated = translated.replace(regex, translation);
  }

  return translated;
}

console.log("en -> bn:", translateText("After meal (খাবারের পরে)", "bn"));
console.log("en -> en:", translateText("After meal (খাবারের পরে)", "en"));
console.log("bn -> en:", translateText("খাবারের আগে", "en"));
console.log("bn -> hi:", translateText("খাবারের আগে", "hi"));

