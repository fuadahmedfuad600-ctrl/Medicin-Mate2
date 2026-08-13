
export function translateText(text: string | undefined, language: 'en' | 'bn' | 'hi' | 'ur'): string {
  if (!text) return '';
  
  let normalized = text;
  const hasBengali = /[\u0980-\u09FF]/.test(normalized);
  const hasHindi = /[\u0900-\u097F]/.test(normalized);
  const hasUrdu = /[\u0600-\u06FF]/.test(normalized);
  const hasEnglish = /[a-zA-Z]/.test(normalized);
  
  // Clean up mixed texts like "Before meal (খাবারের আগে)" or "TDS (দিনে ৩ বার)"
  // We extract only the English portion if English exists alongside another script
  if (hasEnglish && (hasBengali || hasHindi || hasUrdu)) {
    normalized = normalized.replace(/[\u0980-\u09FF\u0900-\u097F\u0600-\u06FF]/g, '').replace(/[()]/g, '').trim().replace(/\s{2,}/g, ' ');
  }

  const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  const hiDigits = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
  const urDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  
  // Convert local digits back to English first
  if (hasBengali) {
    normalized = normalized.replace(/[০-৯]/g, d => bnDigits.indexOf(d).toString());
  }
  if (hasHindi) {
    normalized = normalized.replace(/[०-९]/g, d => hiDigits.indexOf(d).toString());
  }
  if (hasUrdu) {
    normalized = normalized.replace(/[۰-۹]/g, d => urDigits.indexOf(d).toString());
  }

  const dict: Record<string, Record<'bn' | 'hi' | 'ur', string>> = {
    
    'in the morning': { bn: 'সকালে', hi: 'सुबह में', ur: 'صبح میں' },
    'in the afternoon': { bn: 'বিকালে', hi: 'दोपहर में', ur: 'دوپہر میں' },
    'in the evening': { bn: 'সন্ধ্যায়', hi: 'शाम में', ur: 'شام میں' },
    'at night': { bn: 'রাতে', hi: 'रात को', ur: 'رات کو' },
    'at bed time': { bn: 'ঘুমানোর সময়', hi: 'सोते समय', ur: 'سوتے وقت' },
    'at bedtime': { bn: 'ঘুমানোর সময়', hi: 'सोते समय', ur: 'سوتے وقت' },
    'bed time': { bn: 'ঘুমানোর সময়', hi: 'सोते समय', ur: 'سوتے وقت' },
    'bedtime': { bn: 'ঘুমানোর সময়', hi: 'सोते समय', ur: 'سوتے وقت' },
    ' & ': { bn: ' এবং ', hi: ' और ', ur: ' اور ' },
    '&': { bn: 'এবং', hi: 'और', ur: 'اور' },
    ', and ': { bn: ' এবং ', hi: ' और ', ur: ' اور ' },
    ' and ': { bn: ' এবং ', hi: ' और ', ur: ' اور ' },
    'after breakfast': { bn: 'সকালের নাস্তার পর', hi: 'नाश्ते के बाद', ur: 'ناشتے کے بعد' },
    'before breakfast': { bn: 'সকালের নাস্তার আগে', hi: 'नाश्ते से पहले', ur: 'ناشتے سے پہلے' },
    'after lunch': { bn: 'দুপুরের খাবারের পর', hi: 'दोपहर के भोजन के बाद', ur: 'دوپہر کے کھانے کے بعد' },
    'before lunch': { bn: 'দুপুরের খাবারের আগে', hi: 'दोपहर के भोजन से पहले', ur: 'دوپہر کے کھانے سے پہلے' },
    'after dinner': { bn: 'রাতের খাবারের পর', hi: 'रात के खाने के बाद', ur: 'رات کے کھانے کے بعد' },
    'before dinner': { bn: 'রাতের খাবারের আগে', hi: 'रात के खाने से पहले', ur: 'رات کے کھانے سے پہلے' },
    'if pain': { bn: 'ব্যথা হলে', hi: 'दर्द होने पर', ur: 'درد ہونے پر' },
    'when necessary': { bn: 'প্রয়োজন হলে', hi: 'आवश्यकता होने पर', ur: 'ضرورت پڑنے پر' },
    'as needed': { bn: 'প্রয়োজন মতো', hi: 'ज़रूरत के अनुसार', ur: 'حسب ضرورت' },
    'if fever': { bn: 'জ্বর হলে', hi: 'बुखार होने पर', ur: 'بخار ہونے پر' },
    'morning': { bn: 'সকালে', hi: 'सुबह', ur: 'صبح' },
    'noon': { bn: 'দুপুরে', hi: 'दोपहर', ur: 'دوپہر' },
    'afternoon': { bn: 'বিকালে', hi: 'शाम', ur: 'سہ پہر' },
    'evening': { bn: 'সন্ধ্যায়', hi: 'शाम', ur: 'شام' },
    'night': { bn: 'রাতে', hi: 'रात', ur: 'رات' },
    'daily': { bn: 'প্রতিদিন', hi: 'रोजाना', ur: 'روزانہ' },
    'pieces': { bn: 'টি', hi: 'पीस', ur: 'ٹکڑے' },
    'piece': { bn: 'টা', hi: 'पीस', ur: 'ٹکڑا' },
    'before meal': { bn: 'খাবারের আগে', hi: 'भोजन से पहले', ur: 'کھانے سے پہلے' },
    'before meals': { bn: 'খাবারের আগে', hi: 'भोजन से पहले', ur: 'کھانے سے پہلے' },
    'before food': { bn: 'খাবারের আগে', hi: 'भोजन से पहले', ur: 'کھانے سے پہلے' },
    'after meal': { bn: 'খাবারের পরে', hi: 'भोजन के बाद', ur: 'کھانے کے بعد' },
    'after meals': { bn: 'খাবারের পরে', hi: 'भोजन के बाद', ur: 'کھانے کے بعد' },
    'after food': { bn: 'খাবারের পরে', hi: 'भोजन के बाद', ur: 'کھانے کے بعد' },
    'with meal': { bn: 'খাবারের সাথে', hi: 'भोजन के साथ', ur: 'کھانے کے ساتھ' },
    'with meals': { bn: 'খাবারের সাথে', hi: 'भोजन के साथ', ur: 'کھانے کے ساتھ' },
    'with food': { bn: 'খাবারের সাথে', hi: 'भोजन के साथ', ur: 'کھانے کے ساتھ' },
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
    'thrice': { bn: 'তিনবার', hi: 'तीन बार', ur: 'تین بار' },
    'empty stomach': { bn: 'খালি পেটে', hi: 'खाली पेट', ur: 'خالی پیٹ' },
    'full stomach': { bn: 'ভরা পেটে', hi: 'भरे पेट', ur: 'بھرے پیٹ' }
  };

  const sortedKeys = Object.keys(dict).sort((a, b) => b.length - a.length);

  // Reverse translation: convert any known foreign words to English
  for (const engKey of sortedKeys) {
    const langs = dict[engKey];
    for (const [langKey, foreignWord] of Object.entries(langs)) {
      if (normalized.includes(foreignWord)) {
         normalized = normalized.replace(new RegExp(foreignWord, 'g'), engKey);
      }
    }
  }

  // Convert digits to target language
  let translated = normalized.replace(/[0-9]/g, (match) => {
    if (language === 'bn') return bnDigits[parseInt(match)];
    if (language === 'hi') return hiDigits[parseInt(match)];
    if (language === 'ur') return urDigits[parseInt(match)];
    return match;
  });

  if (language === 'en') return translated;

  for (const eng of sortedKeys) {
    const translation = dict[eng][language];
    // If the english phrase starts/ends with non-word chars like spaces or commas, 
    // \b might cause issues. We'll use a more robust replacement strategy.
    // Escape special characters in the key
    const escapedEng = eng.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    
    // We only use \b if the string starts/ends with a word character
    const prefix = /^\w/.test(eng) ? '\\b' : '';
    const suffix = /\w$/.test(eng) ? '\\b' : '';
    
    const regex = new RegExp(`${prefix}${escapedEng}${suffix}`, 'gi');
    translated = translated.replace(regex, translation);
  }

  return translated;
}

export function parseFrequency(freq: string, lang: 'en' | 'bn' | 'hi' | 'ur'): string {
  if (!freq) return '';
  
  let normalized = freq;
  
  // Clean mixed languages for raw frequency too
  const hasEnglish = /[a-zA-Z0-9]/.test(normalized);
  const hasBengali = /[\u0980-\u09FF]/.test(normalized);
  if (hasEnglish && hasBengali) {
    normalized = normalized.replace(/[\u0980-\u09FF]/g, '').replace(/[()]/g, '').trim().replace(/\s{2,}/g, ' ');
  }

  const parts = normalized.match(/(\d+)[-+](\d+)[-+](\d+)/);
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
      if (m > 0) res.push(`সকালে ${toLocalDigits(m, lang)}টি`);
      if (n > 0) res.push(`দুপুরে ${toLocalDigits(n, lang)}টি`);
      if (ni > 0) res.push(`রাতে ${toLocalDigits(ni, lang)}টি`);
    } else if (lang === 'hi') {
      if (m > 0) res.push(`सुबह ${toLocalDigits(m, lang)}`);
      if (n > 0) res.push(`दोपहर ${toLocalDigits(n, lang)}`);
      if (ni > 0) res.push(`रात ${toLocalDigits(ni, lang)}`);
    } else if (lang === 'ur') {
      if (m > 0) res.push(`صبح ${toLocalDigits(m, lang)}`);
      if (n > 0) res.push(`دوپہر ${toLocalDigits(n, lang)}`);
      if (ni > 0) res.push(`رات ${toLocalDigits(ni, lang)}`);
    } else {
      if (m > 0) res.push(`Morning: ${m}`);
      if (n > 0) res.push(`Noon: ${n}`);
      if (ni > 0) res.push(`Night: ${ni}`);
    }
    return res.join(', ');
  }
  
  const parts2 = normalized.match(/(\d+)[-+](\d+)/);
  if (parts2) {
    const m = parseInt(parts2[1]);
    const n = parseInt(parts2[2]);
    
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
      if (m > 0) res.push(`সকালে ${toLocalDigits(m, lang)}টি`);
      if (n > 0) res.push(`রাতে ${toLocalDigits(n, lang)}টি`);
    } else if (lang === 'hi') {
      if (m > 0) res.push(`सुबह ${toLocalDigits(m, lang)}`);
      if (n > 0) res.push(`रात ${toLocalDigits(n, lang)}`);
    } else if (lang === 'ur') {
      if (m > 0) res.push(`صبح ${toLocalDigits(m, lang)}`);
      if (n > 0) res.push(`رات ${toLocalDigits(n, lang)}`);
    } else {
      if (m > 0) res.push(`Morning: ${m}`);
      if (n > 0) res.push(`Night: ${n}`);
    }
    return res.join(', ');
  }

  return translateText(normalized, lang);
}