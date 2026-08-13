const fs = require('fs');
let code = fs.readFileSync('src/lib/translator.ts', 'utf8');

const newParseFreq = `export function parseFrequency(freq: string, lang: 'en' | 'bn' | 'hi' | 'ur'): string {
  if (!freq) return '';
  
  let normalized = freq;
  
  // Clean mixed languages for raw frequency too
  const hasEnglish = /[a-zA-Z0-9]/.test(normalized);
  const hasBengali = /[\\u0980-\\u09FF]/.test(normalized);
  if (hasEnglish && hasBengali) {
    normalized = normalized.replace(/[\\u0980-\\u09FF]/g, '').replace(/[()]/g, '').trim().replace(/\\s{2,}/g, ' ');
  }

  const parts = normalized.match(/(\\d+)[-+](\\d+)[-+](\\d+)/);
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
  
  const parts2 = normalized.match(/(\\d+)[-+](\\d+)/);
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
      if (m > 0) res.push(\`সকালে \${toLocalDigits(m, lang)}টি\`);
      if (n > 0) res.push(\`রাতে \${toLocalDigits(n, lang)}টি\`);
    } else if (lang === 'hi') {
      if (m > 0) res.push(\`सुबह \${toLocalDigits(m, lang)}\`);
      if (n > 0) res.push(\`रात \${toLocalDigits(n, lang)}\`);
    } else if (lang === 'ur') {
      if (m > 0) res.push(\`صبح \${toLocalDigits(m, lang)}\`);
      if (n > 0) res.push(\`رات \${toLocalDigits(n, lang)}\`);
    } else {
      if (m > 0) res.push(\`Morning: \${m}\`);
      if (n > 0) res.push(\`Night: \${n}\`);
    }
    return res.join(', ');
  }

  return translateText(normalized, lang);
}`;

code = code.replace(/export function parseFrequency[\s\S]*$/, newParseFreq);
fs.writeFileSync('src/lib/translator.ts', code);
