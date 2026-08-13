const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  'const { reminders, activeProfileId, prescriptions, language } = useAppContext();',
  'const { reminders, activeProfileId, profiles, prescriptions, language } = useAppContext();'
);

code = code.replace(
  '  useEffect(() => {',
  `
  // Helper to add/sub minutes
  const getOffsetTime = (timeStr, offsetMins) => {
    if (!timeStr) return '';
    const [h, m] = timeStr.split(':').map(Number);
    const date = new Date();
    date.setHours(h, m, 0, 0);
    date.setMinutes(date.getMinutes() + offsetMins);
    return format(date, 'HH:mm');
  };

  useEffect(() => {`
);

code = code.replace(
  'const currentDay = now.getDay(); // 0-6',
  `const currentDay = now.getDay(); // 0-6
      
      const activeProfile = profiles.find(p => p.id === activeProfileId);
      const meals = activeProfile?.mealTimes || { breakfast: '08:00', lunch: '13:00', dinner: '20:00' };
`
);

code = code.replace(
  '      });\n\n      dueReminders.forEach(reminder => {',
  `      });

      // Smart Alerts logic
      activeMedicines.forEach(med => {
        const pFreq = med.frequency; // like "1-0-1"
        const mParts = pFreq.match(/(\\d+)[-+](\\d+)[-+](\\d+)/);
        
        let m = 0, n = 0, ni = 0;
        if (mParts) {
          m = parseInt(mParts[1]);
          n = parseInt(mParts[2]);
          ni = parseInt(mParts[3]);
        } else {
          // simple fallback
          const lowF = pFreq.toLowerCase();
          if (lowF.includes('morning') || lowF.includes('daily') || lowF.includes('সকালে')) m = 1;
          if (lowF.includes('noon') || lowF.includes('দুপুরে')) n = 1;
          if (lowF.includes('night') || lowF.includes('রাতে')) ni = 1;
        }

        const instr = med.instructions.toLowerCase();
        let offset = 0;
        if (instr.includes('before') || instr.includes('আগে')) offset = -30;
        else if (instr.includes('after') || instr.includes('পরে')) offset = 30;

        const checkTime = (mealTimeStr, count, mealName) => {
          if (count > 0) {
            const targetTime = getOffsetTime(mealTimeStr, offset);
            if (targetTime === currentTime) {
              if ('Notification' in window && Notification.permission === 'granted') {
                const bTitle = language === 'bn' ? 'ওষুধ খাওয়ার সময়!' : 'Time for your medicine!';
                const timingStr = offset < 0 ? (language === 'bn' ? 'আগে' : 'before') : offset > 0 ? (language === 'bn' ? 'পরে' : 'after') : (language === 'bn' ? 'সাথে' : 'with');
                const bBody = language === 'bn' 
                  ? \`আপনার \${med.name} (\${med.dosage}) খাওয়ার সময় হয়েছে (\${mealName}র \${timingStr})\।\` 
                  : \`It's time to take \${med.name} (\${med.dosage}) \${timingStr} \${mealName}.\`;
                new Notification(bTitle, { body: bBody, icon: '/favicon.ico' });
              }
            }
          }
        };

        checkTime(meals.breakfast, m, language === 'bn' ? 'সকালের খাবার' : 'breakfast');
        checkTime(meals.lunch, n, language === 'bn' ? 'দুপুরের খাবার' : 'lunch');
        checkTime(meals.dinner, ni, language === 'bn' ? 'রাতের খাবার' : 'dinner');
      });

      dueReminders.forEach(reminder => {`
);

code = code.replace(
  '  }, [reminders, activeProfileId, prescriptions, language]);',
  '  }, [reminders, activeProfileId, profiles, prescriptions, language]);'
);

fs.writeFileSync('src/App.tsx', code);
