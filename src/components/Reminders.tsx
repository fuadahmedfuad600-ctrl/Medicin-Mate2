import React, { useState, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { Bell, Trash2, Clock, CalendarDays, X } from 'lucide-react';

export default function Reminders() {
  const { reminders, activeProfileId, profiles, prescriptions, addReminder, deleteReminder, toggleReminder, language, updateProfile } = useAppContext();
  const [isAdding, setIsAdding] = useState(false);
  const [selectedMedicineId, setSelectedMedicineId] = useState('');
  const [time, setTime] = useState('08:00');
  const [frequency, setFrequency] = useState<'daily' | 'weekly'>('daily');
  const [daysOfWeek, setDaysOfWeek] = useState<number[]>([1, 2, 3, 4, 5]);

  const activeProfile = (profiles || []).find(p => p.id === activeProfileId);
  const [isEditingMeals, setIsEditingMeals] = useState(false);
  const [mealTimes, setMealTimes] = useState({
    breakfast: activeProfile?.mealTimes?.breakfast || '08:00',
    lunch: activeProfile?.mealTimes?.lunch || '13:00',
    dinner: activeProfile?.mealTimes?.dinner || '20:00'
  });

  const handleSaveMeals = () => {
    if (activeProfileId) {
      updateProfile(activeProfileId, { mealTimes });
      setIsEditingMeals(false);
    }
  };

  const activeMedicines = useMemo(() => {
    if (!activeProfileId) return [];
    return (prescriptions || [])
      .filter((p) => p.profileId === activeProfileId)
      .flatMap((p) => p.medicines || []);
  }, [prescriptions, activeProfileId]);

  const profileReminders = (reminders || []).filter((r) => r.profileId === activeProfileId);

  const handleSave = () => {
    if (!selectedMedicineId || !activeProfileId) return;

    addReminder({
      medicineId: selectedMedicineId,
      profileId: activeProfileId,
      time,
      frequency,
      daysOfWeek: frequency === 'weekly' ? daysOfWeek : undefined,
      enabled: true,
    });

    setIsAdding(false);
    setSelectedMedicineId('');
    setTime('08:00');
    setFrequency('daily');
    setDaysOfWeek([1, 2, 3, 4, 5]);

    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  };

  const toggleDay = (day: number) => {
    setDaysOfWeek(prev => 
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day].sort()
    );
  };

  const formatDays = (days?: number[]) => {
    if (!days || days.length === 0) return language === 'bn' ? 'কোনো দিন নির্বাচিত হয়নি' : 'No days selected';
    if (days.length === 7) return language === 'bn' ? 'প্রতিদিন' : 'Every day';
    const dayNames = language === 'bn' ? ['রবি', 'সোম', 'মঙ্গল', 'বুধ', 'বৃহঃ', 'শুক্র', 'শনি'] : language === 'hi' ? ['रवि', 'सोम', 'मंगल', 'बुध', 'गुरु', 'शुक्र', 'शनि'] : language === 'ur' ? ['اتوار', 'پیر', 'منگل', 'بدھ', 'جمعرات', 'جمعہ', 'ہفتہ'] : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days.map(d => dayNames[d]).join(', ');
  };

  const t = {
    title: language === 'bn' ? 'রিমাইন্ডার' : 'Reminders',
    new: language === 'bn' ? 'নতুন' : 'New',
    newRem: language === 'bn' ? 'নতুন রিমাইন্ডার' : 'New Reminder',
    medicine: language === 'bn' ? 'ওষুধ' : 'Medicine',
    selMed: language === 'bn' ? 'ওষুধ নির্বাচন করুন' : 'Select medicine',
    time: language === 'bn' ? 'সময়' : 'Time',
    freq: language === 'bn' ? 'বারবার' : 'Frequency',
    daily: language === 'bn' ? 'প্রতিদিন' : 'Daily',
    weekly: language === 'bn' ? 'সাপ্তাহিক' : 'Weekly',
    days: language === 'bn' ? 'দিনগুলো' : 'Days',
    save: language === 'bn' ? 'রিমাইন্ডার সেভ করুন' : 'Save Reminder',
    noRem: language === 'bn' ? 'কোনো রিমাইন্ডার নেই' : 'No Reminders',
    noRemDesc: language === 'bn' ? 'আপনার ওষুধের জন্য দৈনিক বা সাপ্তাহিক অ্যালার্ট সেট করুন।' : 'Set up daily or weekly alerts for your medications.',
    mealTimes: language === 'bn' ? 'খাবারের সময়' : 'Meal Times',
    breakfast: language === 'bn' ? 'সকাল' : 'Breakfast',
    lunch: language === 'bn' ? 'দুপুর' : 'Lunch',
    dinner: language === 'bn' ? 'রাত' : 'Dinner',
    saveMeals: language === 'bn' ? 'সংরক্ষণ করুন' : 'Save',
    editMeals: language === 'bn' ? 'পরিবর্তন করুন' : 'Edit',
    smartAlertsInfo: language === 'bn' ? 'খাবারের সময়ের উপর ভিত্তি করে স্মার্ট অ্যালার্টগুলি স্বয়ংক্রিয়ভাবে পরিচালিত হয়।' : 'Smart alerts will automatically trigger based on meal times and prescription instructions.'
  };
  
  const weekDays = language === 'bn' ? ['র', 'সো', 'ম', 'বু', 'বৃ', 'শু', 'শ'] : ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  return (
    <div className="p-4 pt-6 pb-24">
      <div className="mb-6 bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-slate-200 dark:border-slate-700">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{t.mealTimes}</h3>
          {!isEditingMeals ? (
            <button onClick={() => setIsEditingMeals(true)} className="text-indigo-600 dark:text-indigo-400 text-sm font-semibold hover:underline">
              {t.editMeals}
            </button>
          ) : (
            <button onClick={handleSaveMeals} className="bg-indigo-600 text-white px-4 py-1.5 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors">
              {t.saveMeals}
            </button>
          )}
        </div>
        
        {isEditingMeals ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">{t.breakfast}</label>
              <input type="time" value={mealTimes.breakfast} onChange={(e) => setMealTimes({...mealTimes, breakfast: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-3 text-base text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">{t.lunch}</label>
              <input type="time" value={mealTimes.lunch} onChange={(e) => setMealTimes({...mealTimes, lunch: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-3 text-base text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">{t.dinner}</label>
              <input type="time" value={mealTimes.dinner} onChange={(e) => setMealTimes({...mealTimes, dinner: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-3 text-base text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500" />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg border border-slate-100 dark:border-slate-700/50">
              <span className="block text-xs font-medium text-slate-500 mb-1">{t.breakfast}</span>
              <span className="text-lg font-semibold text-slate-900 dark:text-white">{activeProfile?.mealTimes?.breakfast || '08:00'}</span>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg border border-slate-100 dark:border-slate-700/50">
              <span className="block text-xs font-medium text-slate-500 mb-1">{t.lunch}</span>
              <span className="text-lg font-semibold text-slate-900 dark:text-white">{activeProfile?.mealTimes?.lunch || '13:00'}</span>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg border border-slate-100 dark:border-slate-700/50">
              <span className="block text-xs font-medium text-slate-500 mb-1">{t.dinner}</span>
              <span className="text-lg font-semibold text-slate-900 dark:text-white">{activeProfile?.mealTimes?.dinner || '20:00'}</span>
            </div>
          </div>
        )}
        <p className="text-sm text-slate-500 mt-5 pt-4 border-t border-slate-100 dark:border-slate-700 flex items-start gap-2">
          <Bell className="w-4 h-4 mt-0.5 flex-shrink-0 text-indigo-500" />
          <span>{t.smartAlertsInfo}</span>
        </p>
      </div>

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">{t.title}</h2>
        
      </div>

      

      {profileReminders.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 mt-6 text-center">
          <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 text-slate-400 dark:text-slate-500">
            <Bell className="w-10 h-10" />
          </div>
          <h2 className="text-xl font-semibold mb-2 text-slate-900 dark:text-white">{t.noRem}</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            {t.noRemDesc}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {profileReminders.map(reminder => {
            const med = activeMedicines.find(m => m.id === reminder.medicineId);
            if (!med) return null;

            return (
              <div key={reminder.id} className={`bg-white dark:bg-slate-800 border rounded-xl p-4 flex items-center justify-between shadow-sm transition-opacity ${!reminder.enabled ? 'opacity-50 border-slate-200 dark:border-slate-700' : 'border-indigo-100 dark:border-indigo-900/50'}`}>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white">{med.name} <span className="text-slate-500 dark:text-slate-400 font-normal text-sm">{med.dosage}</span></h3>
                  <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
                    <span className="flex items-center gap-1 text-slate-700 dark:text-slate-300">
                      <Clock className="w-3.5 h-3.5" />
                      {reminder.time}
                    </span>
                    <span className="flex items-center gap-1">
                      <CalendarDays className="w-3.5 h-3.5" />
                      {reminder.frequency === 'daily' ? t.daily : formatDays(reminder.daysOfWeek)}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => toggleReminder(reminder.id)}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${reminder.enabled ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-600'}`}
                  >
                    <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${reminder.enabled ? 'translate-x-4.5' : 'translate-x-1'}`} />
                  </button>
                  <button onClick={() => deleteReminder(reminder.id)} className="text-slate-300 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 transition-colors p-1">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
