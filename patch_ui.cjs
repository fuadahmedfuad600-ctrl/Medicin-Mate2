const fs = require('fs');

function patchDashboard() {
  let code = fs.readFileSync('src/components/Dashboard.tsx', 'utf-8');
  code = code.replace(
    /\{translateText\(med\.instructions, language\)\}/g,
    `{(() => {
                        const freq = parseFrequency(med.frequency, language) || translateText(med.simplifiedFrequency, language);
                        const inst = translateText(med.instructions, language);
                        return (inst && inst.toLowerCase() !== freq.toLowerCase()) ? inst : null;
                      })()}`
  );
  fs.writeFileSync('src/components/Dashboard.tsx', code);
}

function patchHistory() {
  let code = fs.readFileSync('src/components/History.tsx', 'utf-8');
  code = code.replace(
    /\{translateText\(m\.instructions, language\)\}/g,
    `{(() => {
                        const freq = parseFrequency(m.frequency, language) || translateText(m.simplifiedFrequency, language);
                        const inst = translateText(m.instructions, language);
                        return (inst && inst.toLowerCase() !== freq.toLowerCase()) ? inst : null;
                      })()}`
  );
  
  // also fix the simplifiedFrequency showing up together with parseFrequency incorrectly sometimes
  code = code.replace(
    /<p className="text-sm font-medium text-indigo-600 dark:text-indigo-400 mt-0.5">\{parseFrequency\(m\.frequency, language\)\}<\/p>\\s*<p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">\{translateText\(m\.simplifiedFrequency, language\)\}<\/p>/g,
    `<p className="text-sm font-medium text-indigo-600 dark:text-indigo-400 mt-0.5">{parseFrequency(m.frequency, language) || translateText(m.simplifiedFrequency, language)}</p>`
  );

  fs.writeFileSync('src/components/History.tsx', code);
}

function patchScanner() {
  let code = fs.readFileSync('src/components/Scanner.tsx', 'utf-8');
  code = code.replace(
    /\{med\.instructions && \(\\s*<span className="text-slate-500 dark:text-slate-400 ml-1">\\(\{med\.instructions\}\)<\/span>\\s*\)\}/g,
    `{(med.instructions && med.instructions.toLowerCase() !== med.simplifiedFrequency.toLowerCase()) && (
                    <span className="text-slate-500 dark:text-slate-400 ml-1">({med.instructions})</span>
                  )}`
  );
  
  code = code.replace(
    /<div className="flex justify-between">\\s*<span className="text-slate-400 dark:text-slate-500">\{t\.instructions\}<\/span>\\s*<span className="font-medium text-slate-800 dark:text-slate-200">\{med\.instructions\}<\/span>\\s*<\/div>/g,
    `{(med.instructions && med.instructions.toLowerCase() !== med.simplifiedFrequency.toLowerCase()) && (
                <div className="flex justify-between">
                  <span className="text-slate-400 dark:text-slate-500">{t.instructions}</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">{med.instructions}</span>
                </div>
                )}`
  );
  fs.writeFileSync('src/components/Scanner.tsx', code);
}

patchDashboard();
patchHistory();
patchScanner();
