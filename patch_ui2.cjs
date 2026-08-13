const fs = require('fs');

function patchHistory() {
  let code = fs.readFileSync('src/components/History.tsx', 'utf-8');
  code = code.replace(
    `<p className="text-sm font-medium text-indigo-600 dark:text-indigo-400 mt-0.5">{parseFrequency(m.frequency, language)}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{translateText(m.simplifiedFrequency, language)}</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{translateText(m.instructions, language)}</p>`,
    `<p className="text-sm font-medium text-indigo-600 dark:text-indigo-400 mt-0.5">{parseFrequency(m.frequency, language) || translateText(m.simplifiedFrequency, language)}</p>
                    {(() => {
                        const freq = parseFrequency(m.frequency, language) || translateText(m.simplifiedFrequency, language);
                        const inst = translateText(m.instructions, language);
                        return (inst && inst.toLowerCase() !== freq.toLowerCase()) ? (
                          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{inst}</p>
                        ) : null;
                    })()}`
  );
  fs.writeFileSync('src/components/History.tsx', code);
}

function patchDashboard() {
  let code = fs.readFileSync('src/components/Dashboard.tsx', 'utf-8');
  code = code.replace(
    `<p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                      {translateText(med.instructions, language)}
                    </p>`,
    `{(() => {
                        const freq = parseFrequency(med.frequency, language) || translateText(med.simplifiedFrequency, language);
                        const inst = translateText(med.instructions, language);
                        return (inst && inst.toLowerCase() !== freq.toLowerCase()) ? (
                          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{inst}</p>
                        ) : null;
                      })()}`
  );
  fs.writeFileSync('src/components/Dashboard.tsx', code);
}

function patchScanner() {
  let code = fs.readFileSync('src/components/Scanner.tsx', 'utf-8');
  code = code.replace(
    `{med.instructions && (
                    <span className="text-slate-500 dark:text-slate-400 ml-1">({med.instructions})</span>
                  )}`,
    `{(med.instructions && med.instructions.toLowerCase() !== med.simplifiedFrequency.toLowerCase()) && (
                    <span className="text-slate-500 dark:text-slate-400 ml-1">({med.instructions})</span>
                  )}`
  );
  
  code = code.replace(
    `<div className="flex justify-between">
                  <span className="text-slate-400 dark:text-slate-500">{t.instructions}</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">{med.instructions}</span>
                </div>`,
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
