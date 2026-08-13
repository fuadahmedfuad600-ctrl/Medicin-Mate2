import React, { useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { format, differenceInCalendarDays } from 'date-fns';
import { bn, enUS, hi } from 'date-fns/locale';
import { CheckCircle2, Circle, Trash2, CalendarDays } from 'lucide-react';
import { Medicine } from '../types';
import { translateText, parseFrequency } from '../lib/translator';

export default function Dashboard() {
  const { activeProfileId, prescriptions, doseLogs, toggleDose, language, deleteMedicine } = useAppContext();

  const today = format(new Date(), 'yyyy-MM-dd');
  const todayFormatted = format(new Date(), 'EEEE, d MMMM', { locale: language === 'bn' ? bn : language === 'hi' ? hi : enUS });

  const activeMedicines = useMemo(() => {
    if (!activeProfileId) return [];
    const meds: Medicine[] = [];
    (prescriptions || [])
      .filter((p) => p.profileId === activeProfileId)
      .forEach((p) => {
        (p.medicines || []).forEach((m) => {
          meds.push(m);
        });
      });
    return meds;
  }, [prescriptions, activeProfileId]);

  const hasTime = (frequency: string | undefined, time: 'morning' | 'noon' | 'night') => {
    if (!frequency) return true;
    const lower = frequency.toLowerCase();
    
    const parts = frequency.match(/(\d+)[-+](\d+)[-+](\d+)/);
    if (parts) {
      if (time === 'morning') return parseInt(parts[1]) > 0;
      if (time === 'noon') return parseInt(parts[2]) > 0;
      if (time === 'night') return parseInt(parts[3]) > 0;
    }
    
    if (lower.includes('od')) return time === 'morning';
    if (lower.includes('bd') || lower.includes('bid')) return time === 'morning' || time === 'night';
    if (lower.includes('tds') || lower.includes('tid')) return true; 

    return true; 
  };

  const labels = {
    morning: language === 'en' ? 'Morning' : language === 'hi' ? 'सुबह' : language === 'ur' ? 'صبح' : 'সকাল',
    noon: language === 'en' ? 'Noon' : language === 'hi' ? 'दोपहर' : language === 'ur' ? 'دوپہر' : 'দুপুর',
    night: language === 'en' ? 'Night' : language === 'hi' ? 'रात' : language === 'ur' ? 'رات' : 'রাত',
  };

  const durationText = {
    continuous: language === 'en' ? 'Continuous' : language === 'hi' ? 'निरंतर' : language === 'ur' ? 'مسلسل' : 'চলবে',
    days: language === 'en' ? 'days' : language === 'hi' ? 'दिन' : language === 'ur' ? 'دن' : 'দিন',
    left: language === 'en' ? 'left' : language === 'hi' ? 'बचे' : language === 'ur' ? 'باقی' : 'বাকি',
    finished: language === 'en' ? 'Course finished' : language === 'hi' ? 'कोर्स समाप्त' : language === 'ur' ? 'کورس مکمل' : 'কোর্স শেষ',
    lastDay: language === 'en' ? 'Last day' : language === 'hi' ? 'आखिरी दिन' : language === 'ur' ? 'آخری دن' : 'শেষ দিন',
  };

  // Returns a short, friendly label about how long the medicine needs to be taken,
  // e.g. "৭ দিনের কোর্স · ৩ দিন বাকি" using durationDays + startDate from the prescription.
  const getDurationLabel = (med: Medicine): string | null => {
    if (med.durationDays === undefined || med.durationDays === null) return null;

    if (med.durationDays === -1) {
      return durationText.continuous;
    }

    if (!med.startDate) {
      return `${med.durationDays} ${durationText.days}`;
    }

    const elapsed = differenceInCalendarDays(new Date(today), new Date(med.startDate));
    const remaining = med.durationDays - elapsed - 1; // days left including today counted once

    if (remaining < 0) {
      return `${med.durationDays} ${durationText.days} · ${durationText.finished}`;
    }
    if (remaining === 0) {
      return `${med.durationDays} ${durationText.days} · ${durationText.lastDay}`;
    }
    return `${med.durationDays} ${durationText.days} · ${remaining} ${durationText.days} ${durationText.left}`;
  };

  const renderTimeSection = (time: 'morning' | 'noon' | 'night', label: string) => {
    const medsForTime = activeMedicines.filter((m) => hasTime(m.frequency, time));
    
    if (medsForTime.length === 0) return null;

    return (
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3 px-1">{label}</h3>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden transition-colors">
          {medsForTime.map((med, index) => {
            const isTaken = (doseLogs || []).some(
              (log) => log.medicineId === med.id && log.date === today && log.timeOfDay === time && log.taken
            );

            return (
              <div 
                key={med.id} 
                className={`p-4 flex items-center justify-between transition-colors ${index !== medsForTime.length - 1 ? 'border-b border-slate-100 dark:border-slate-700' : ''} ${isTaken ? 'bg-slate-50/50 dark:bg-slate-700/50' : 'hover:bg-slate-50 dark:hover:bg-slate-700/30'}`}
              >
                <div 
                  className="flex items-start gap-4 flex-1 cursor-pointer"
                  onClick={() => toggleDose(med.id, today, time)}
                >
                  <button className="mt-0.5 text-slate-400 dark:text-slate-500 focus:outline-none">
                    {isTaken ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-500 fill-emerald-50 dark:fill-emerald-900/30" />
                    ) : (
                      <Circle className="w-6 h-6 text-slate-300 dark:text-slate-600" />
                    )}
                  </button>
                  <div>
                    <p className={`font-medium ${isTaken ? 'text-slate-500 dark:text-slate-400 line-through' : 'text-slate-900 dark:text-slate-100'}`}>
                      {translateText(med.name, language)} <span className="text-sm font-normal text-slate-500 dark:text-slate-400">{translateText(med.dosage, language)}</span>
                    </p>
                    <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400 mt-0.5">
                      {parseFrequency(med.frequency, language) || translateText(med.simplifiedFrequency, language)}
                    </p>
                    {(() => {
                        const freq = parseFrequency(med.frequency, language) || translateText(med.simplifiedFrequency, language);
                        const inst = translateText(med.instructions, language);
                        return (inst && inst.toLowerCase() !== freq.toLowerCase()) ? (
                          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{inst}</p>
                        ) : null;
                      })()}
                    {(() => {
                        const durationLabel = getDurationLabel(med);
                        return durationLabel ? (
                          <p className="inline-flex items-center gap-1 text-xs font-medium text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 rounded-full px-2 py-0.5 mt-1.5">
                            <CalendarDays className="w-3 h-3" />
                            {durationLabel}
                          </p>
                        ) : null;
                      })()}
                  </div>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); deleteMedicine(med.id); }}
                  className="p-2 -mr-2 text-slate-300 hover:text-red-500 dark:text-slate-600 dark:hover:text-red-400 transition-colors focus:outline-none"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  if (activeMedicines.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 mt-12 text-center">
        <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mb-4 text-indigo-600 dark:text-indigo-400">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h2 className="text-xl font-semibold mb-2 text-slate-900 dark:text-white">
          {language === 'en' ? 'No medicines today!' : language === 'hi' ? 'आज कोई दवा नहीं!' : language === 'ur' ? 'آج کوئی دوا نہیں!' : 'আজ কোনো ওষুধ নেই!'}
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
          {language === 'bn' 
            ? 'আপনার কোনো সক্রিয় প্রেসক্রিপশন নেই। শুরু করতে একটি প্রেসক্রিপশন স্ক্যান করুন।' 
            : "You don't have any active prescriptions. Scan a prescription to get started."}
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 pt-6">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
          {language === 'en' ? 'Dashboard' : language === 'hi' ? 'डैशबोर्ड' : language === 'ur' ? 'ڈیش بورڈ' : 'ড্যাশবোর্ড'}
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{todayFormatted}</p>
      </div>

      {renderTimeSection('morning', labels.morning)}
      {renderTimeSection('noon', labels.noon)}
      {renderTimeSection('night', labels.night)}
    </div>
  );
}
