const fs = require('fs');
let code = fs.readFileSync('src/components/Reminders.tsx', 'utf8');

code = code.replace(
  'const { reminders, activeProfileId, prescriptions, addReminder, deleteReminder, toggleReminder, language } = useAppContext();',
  'const { reminders, activeProfileId, profiles, prescriptions, addReminder, deleteReminder, toggleReminder, language, updateProfile } = useAppContext();'
);

code = code.replace(
  'const activeMedicines = useMemo(() => {',
  `const activeProfile = profiles.find(p => p.id === activeProfileId);
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

  const activeMedicines = useMemo(() => {`
);

code = code.replace(
  '    noRemDesc: language === \'bn\' ? \'আপনার ওষুধের জন্য দৈনিক বা সাপ্তাহিক অ্যালার্ট সেট করুন।\' : \'Set up daily or weekly alerts for your medications.\',\n  };',
  `    noRemDesc: language === 'bn' ? 'আপনার ওষুধের জন্য দৈনিক বা সাপ্তাহিক অ্যালার্ট সেট করুন।' : 'Set up daily or weekly alerts for your medications.',
    mealTimes: language === 'bn' ? 'খাবারের সময়' : 'Meal Times',
    breakfast: language === 'bn' ? 'সকাল' : 'Breakfast',
    lunch: language === 'bn' ? 'দুপুর' : 'Lunch',
    dinner: language === 'bn' ? 'রাত' : 'Dinner',
    saveMeals: language === 'bn' ? 'সংরক্ষণ করুন' : 'Save',
    editMeals: language === 'bn' ? 'পরিবর্তন করুন' : 'Edit',
    smartAlertsInfo: language === 'bn' ? 'খাবারের সময়ের উপর ভিত্তি করে স্মার্ট অ্যালার্টগুলি স্বয়ংক্রিয়ভাবে পরিচালিত হয়।' : 'Smart alerts will automatically trigger based on meal times and prescription instructions.'
  };`
);

code = code.replace(
  '<h2 className="text-2xl font-semibold text-slate-900 dark:text-white">{t.title}</h2>',
  `<h2 className="text-2xl font-semibold text-slate-900 dark:text-white">{t.title}</h2>`
);

code = code.replace(
  '<div className="flex items-center justify-between mb-6">',
  `<div className="mb-6 bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-200 dark:border-slate-700">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold text-slate-900 dark:text-white">{t.mealTimes}</h3>
          {!isEditingMeals ? (
            <button onClick={() => setIsEditingMeals(true)} className="text-indigo-600 dark:text-indigo-400 text-sm font-medium hover:underline">
              {t.editMeals}
            </button>
          ) : (
            <button onClick={handleSaveMeals} className="text-indigo-600 dark:text-indigo-400 text-sm font-medium hover:underline">
              {t.saveMeals}
            </button>
          )}
        </div>
        
        {isEditingMeals ? (
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">{t.breakfast}</label>
              <input type="time" value={mealTimes.breakfast} onChange={(e) => setMealTimes({...mealTimes, breakfast: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-sm text-slate-900 dark:text-white" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">{t.lunch}</label>
              <input type="time" value={mealTimes.lunch} onChange={(e) => setMealTimes({...mealTimes, lunch: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-sm text-slate-900 dark:text-white" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">{t.dinner}</label>
              <input type="time" value={mealTimes.dinner} onChange={(e) => setMealTimes({...mealTimes, dinner: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-sm text-slate-900 dark:text-white" />
            </div>
          </div>
        ) : (
          <div className="flex gap-4 text-sm text-slate-600 dark:text-slate-300">
            <div><span className="text-slate-400">{t.breakfast}:</span> {activeProfile?.mealTimes?.breakfast || '08:00'}</div>
            <div><span className="text-slate-400">{t.lunch}:</span> {activeProfile?.mealTimes?.lunch || '13:00'}</div>
            <div><span className="text-slate-400">{t.dinner}:</span> {activeProfile?.mealTimes?.dinner || '20:00'}</div>
          </div>
        )}
        <p className="text-xs text-slate-500 mt-3 pt-3 border-t border-slate-100 dark:border-slate-700">
          {t.smartAlertsInfo}
        </p>
      </div>

      <div className="flex items-center justify-between mb-6">`
);

fs.writeFileSync('src/components/Reminders.tsx', code);
