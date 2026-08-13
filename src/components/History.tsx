import React from 'react';
import { useAppContext } from '../context/AppContext';
import { format } from 'date-fns';
import { bn, enUS } from 'date-fns/locale';
import { Pill, CalendarDays, History as HistoryIcon, Trash2 } from 'lucide-react';
import { translateText, parseFrequency } from '../lib/translator';

export default function History() {
  const { prescriptions, activeProfileId, language, deletePrescription } = useAppContext();

  const userPrescriptions = (prescriptions || [])
    .filter(p => p.profileId === activeProfileId)
    .sort((a, b) => new Date(b.dateAdded || 0).getTime() - new Date(a.dateAdded || 0).getTime());

  const t = {
    noHistoryTitle: language === 'en' ? 'No history yet' : language === 'hi' ? 'कोई इतिहास नहीं' : language === 'ur' ? 'کوئی تاریخ نہیں' : 'কোনো হিস্ট্রি নেই',
    noHistoryDesc: language === 'en' ? 'Your scanned prescriptions will appear here.' : language === 'hi' ? 'आपके स्कैन किए गए नुस्खे यहाँ दिखाई देंगे।' : language === 'ur' ? 'آپ کے اسکین شدہ نسخے یہاں ظاہر ہوں گے۔' : 'আপনার স্ক্যান করা প্রেসক্রিপশনগুলো এখানে দেখা যাবে।',
    title: language === 'en' ? 'Prescription History' : language === 'hi' ? 'पर्चे का इतिहास' : language === 'ur' ? 'نسخے کی تاریخ' : 'প্রেসক্রিপশন হিস্ট্রি',
    meds: language === 'en' ? 'Meds' : language === 'hi' ? 'दवाएं' : language === 'ur' ? 'ادویات' : 'টি ওষুধ'
  };

  if (userPrescriptions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 mt-12 text-center">
        <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 text-slate-400 dark:text-slate-500">
          <HistoryIcon className="w-10 h-10" />
        </div>
        <h2 className="text-xl font-semibold mb-2 text-slate-900 dark:text-white">{t.noHistoryTitle}</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          {t.noHistoryDesc}
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 pt-6">
      <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-6">{t.title}</h2>
      
      <div className="space-y-4">
        {userPrescriptions.map(p => (
          <div key={p.id} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm transition-colors">
            <div className="bg-slate-50 dark:bg-slate-700/50 p-4 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                <CalendarDays className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {format(new Date(p.dateAdded), 'MMM d, yyyy - h:mm a', { locale: language === 'bn' ? bn : enUS })}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 px-2.5 py-1 rounded-full">
                  {p.medicines.length} {t.meds}
                </span>
                <button 
                  onClick={() => deletePrescription(p.id)}
                  className="text-slate-400 hover:text-red-500 dark:text-slate-500 dark:hover:text-red-400 transition-colors p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="p-4 divide-y divide-slate-100 dark:divide-slate-700">
              { (p.medicines || []).map(m => (
                <div key={m.id} className="py-3 first:pt-0 last:pb-0 flex items-start gap-3">
                  <div className="mt-0.5 bg-slate-100 dark:bg-slate-700 p-2 rounded-lg text-slate-500 dark:text-slate-400">
                    <Pill className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">{translateText(m.name, language)} <span className="text-slate-500 dark:text-slate-400 font-normal text-sm">{translateText(m.dosage, language)}</span></p>
                    <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400 mt-0.5">{parseFrequency(m.frequency, language) || translateText(m.simplifiedFrequency, language)}</p>
                    {(() => {
                        const freq = parseFrequency(m.frequency, language) || translateText(m.simplifiedFrequency, language);
                        const inst = translateText(m.instructions, language);
                        return (inst && inst.toLowerCase() !== freq.toLowerCase()) ? (
                          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{inst}</p>
                        ) : null;
                    })()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
