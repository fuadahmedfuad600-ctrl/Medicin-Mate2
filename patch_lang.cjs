const fs = require('fs');

// 1. Update server.ts prompt
let serverCode = fs.readFileSync('server.ts', 'utf8');
serverCode = serverCode.replace(
  'Ensure the simplifiedFrequency and instructions are strictly in ${targetLang}.',
  'Ensure the simplifiedFrequency and instructions are strictly in English.'
);
fs.writeFileSync('server.ts', serverCode);

// 2. Update types.ts
let typesCode = fs.readFileSync('src/types.ts', 'utf8');
fs.writeFileSync('src/types.ts', typesCode);

// 3. Update AppContext.tsx
let contextCode = fs.readFileSync('src/context/AppContext.tsx', 'utf8');
contextCode = contextCode.replace(
  /language: 'en' \| 'bn';/g,
  "language: 'en' | 'bn' | 'hi' | 'ur';"
);
contextCode = contextCode.replace(
  /setLanguage: \(language: 'en' \| 'bn'\) => void;/g,
  "setLanguage: (language: 'en' | 'bn' | 'hi' | 'ur') => void;"
);
fs.writeFileSync('src/context/AppContext.tsx', contextCode);

// 4. Update translator.ts
const translatorCode = `
export function translateText(text: string | undefined, language: 'en' | 'bn' | 'hi' | 'ur'): string {
  if (!text) return '';
  if (language === 'en') return text;

  const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  const hiDigits = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
  const urDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  
  let translated = text.replace(/[0-9]/g, (match) => {
    if (language === 'bn') return bnDigits[parseInt(match)];
    if (language === 'hi') return hiDigits[parseInt(match)];
    if (language === 'ur') return urDigits[parseInt(match)];
    return match;
  });

  const dict: Record<string, Record<'bn' | 'hi' | 'ur', string>> = {
    'morning': { bn: 'সকালে', hi: 'सुबह', ur: 'صبح' },
    'noon': { bn: 'দুপুরে', hi: 'दोपहर', ur: 'دوپہر' },
    'afternoon': { bn: 'বিকালে', hi: 'शाम', ur: 'سہ پہر' },
    'evening': { bn: 'সন্ধ্যায়', hi: 'शाम', ur: 'شام' },
    'night': { bn: 'রাতে', hi: 'रात', ur: 'رات' },
    'daily': { bn: 'প্রতিদিন', hi: 'रोजाना', ur: 'روزانہ' },
    'before meal': { bn: 'খাবারের আগে', hi: 'भोजन से पहले', ur: 'کھانے سے پہلے' },
    'before meals': { bn: 'খাবারের আগে', hi: 'भोजन से पहले', ur: 'کھانے سے پہلے' },
    'after meal': { bn: 'খাবারের পরে', hi: 'भोजन के बाद', ur: 'کھانے کے بعد' },
    'after meals': { bn: 'খাবারের পরে', hi: 'भोजन के बाद', ur: 'کھانے کے بعد' },
    'with meal': { bn: 'খাবারের সাথে', hi: 'भोजन के साथ', ur: 'کھانے کے ساتھ' },
    'tablet': { bn: 'ট্যাবলেট', hi: 'गोली', ur: 'گولی' },
    'tablets': { bn: 'ট্যাবলেট', hi: 'गोलियाँ', ur: 'گولیاں' },
    'pill': { bn: 'বড়ি', hi: 'गोली', ur: 'گولی' },
    'pills': { bn: 'বড়ি', hi: 'गोलियाँ', ur: 'گولیاں' },
    'capsule': { bn: 'ক্যাপসুল', hi: 'कैप्सूल', ur: 'کیپسول' },
    'capsules': { bn: 'ক্যাপসুল', hi: 'कैप्सूल', ur: 'کیپسول' },
    'mg': { bn: 'মি.গ্রা.', hi: 'मि.ग्रा.', ur: 'ملی گرام' },
    'ml': { bn: 'মিলি.', hi: 'मिली.', ur: 'ملی لیٹر' },
    'days': { bn: 'দিন', hi: 'दिन', ur: 'دن' },
    'day': { bn: 'দিন', hi: 'दिन', ur: 'دن' },
    'week': { bn: 'সপ্তাহ', hi: 'सप्ताह', ur: 'ہفتہ' },
    'month': { bn: 'মাস', hi: 'महीना', ur: 'مہینہ' },
    'continuous': { bn: 'চলবে', hi: 'निरंतर', ur: 'مسلسل' },
    'once': { bn: 'একবার', hi: 'एक बार', ur: 'ایک بار' },
    'twice': { bn: 'দুইবার', hi: 'दो बार', ur: 'دو بار' },
    'thrice': { bn: 'তিনবার', hi: 'तीन बार', ur: 'تین بار' }
  };

  const sortedKeys = Object.keys(dict).sort((a, b) => b.length - a.length);

  for (const eng of sortedKeys) {
    const translation = dict[eng][language];
    const regex = new RegExp(\`\\\\b\${eng}\\\\b\`, 'gi');
    translated = translated.replace(regex, translation);
  }

  return translated;
}

export function parseFrequency(freq: string, lang: 'en' | 'bn' | 'hi' | 'ur'): string {
  if (!freq) return '';
  const parts = freq.match(/(\\d+)[-+](\\d+)[-+](\\d+)/);
  if (parts) {
    const m = parseInt(parts[1]);
    const n = parseInt(parts[2]);
    const ni = parseInt(parts[3]);
    
    const toLocalDigits = (num: number, l: 'en'|'bn'|'hi'|'ur') => {
      if (l === 'en') return num.toString();
      const digits = {
        'bn': ['০','১','২','৩','৪','৫','৬','৭','৮','৯'],
        'hi': ['०','१','२','३','४','५','६','७','८','९'],
        'ur': ['۰','۱','۲','۳','۴','۵','۶','۷','۸','۹']
      }[l];
      return num.toString().replace(/[0-9]/g, w => digits[parseInt(w)]);
    };

    const res = [];
    if (lang === 'bn') {
      if (m > 0) res.push(\`সকালে \${toLocalDigits(m, lang)}টি\`);
      if (n > 0) res.push(\`দুপুরে \${toLocalDigits(n, lang)}টি\`);
      if (ni > 0) res.push(\`রাতে \${toLocalDigits(ni, lang)}টি\`);
    } else if (lang === 'hi') {
      if (m > 0) res.push(\`सुबह \${toLocalDigits(m, lang)}\`);
      if (n > 0) res.push(\`दोपहर \${toLocalDigits(n, lang)}\`);
      if (ni > 0) res.push(\`रात \${toLocalDigits(ni, lang)}\`);
    } else if (lang === 'ur') {
      if (m > 0) res.push(\`صبح \${toLocalDigits(m, lang)}\`);
      if (n > 0) res.push(\`دوپہر \${toLocalDigits(n, lang)}\`);
      if (ni > 0) res.push(\`رات \${toLocalDigits(ni, lang)}\`);
    } else {
      if (m > 0) res.push(\`Morning: \${m}\`);
      if (n > 0) res.push(\`Noon: \${n}\`);
      if (ni > 0) res.push(\`Night: \${ni}\`);
    }
    return res.join(', ');
  }
  return translateText(freq, lang);
}
`;
fs.writeFileSync('src/lib/translator.ts', translatorCode);

