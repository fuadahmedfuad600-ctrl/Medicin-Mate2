/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Scanner from './components/Scanner';
import History from './components/History';
import Reminders from './components/Reminders';
import Settings from './components/Settings';
import { useAppContext } from './context/AppContext';
import { format } from 'date-fns';

function NotificationManager() {
  const { reminders, activeProfileId, profiles, prescriptions, language } = useAppContext();


  // Helper to add/sub minutes
  const getOffsetTime = (timeStr: string, offsetMins: number) => {
    if (!timeStr) return '';
    const [h, m] = timeStr.split(':').map(Number);
    const date = new Date();
    date.setHours(h || 0, m || 0, 0, 0);
    date.setMinutes(date.getMinutes() + offsetMins);
    return format(date, 'HH:mm');
  };

  useEffect(() => {
    // Check reminders every minute
    const interval = setInterval(() => {
      const now = new Date();
      const currentTime = format(now, 'HH:mm');
      const currentDay = now.getDay(); // 0-6
      
      const activeProfile = (profiles || []).find(p => p.id === activeProfileId);
      const meals = activeProfile?.mealTimes || { breakfast: '08:00', lunch: '13:00', dinner: '20:00' };


      const activeMedicines = (prescriptions || [])
        .filter((p) => p.profileId === activeProfileId)
        .flatMap((p) => p.medicines || []);

      const dueReminders = (reminders || []).filter(r => {
        if (!r.enabled || r.profileId !== activeProfileId) return false;
        if (r.time !== currentTime) return false;
        
        if (r.frequency === 'weekly' && r.daysOfWeek && !r.daysOfWeek.includes(currentDay)) {
          return false;
        }
        
        return true;
      });

      // Smart Alerts logic
      activeMedicines.forEach(med => {
        const pFreq = med.frequency || ''; // like "1-0-1"
        const mParts = pFreq.match(/(\d+)[-+](\d+)[-+](\d+)/);
        
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

        const instr = (med.instructions || '').toLowerCase();
        let offset = 0;
        if (instr.includes('before') || instr.includes('আগে')) offset = -30;
        else if (instr.includes('after') || instr.includes('পরে')) offset = 30;

        const checkTime = (mealTimeStr: string, count: number, mealName: string) => {
          if (count > 0) {
            const targetTime = getOffsetTime(mealTimeStr, offset);
            if (targetTime === currentTime) {
              if ('Notification' in window && Notification.permission === 'granted') {
                const bTitle = language === 'en' ? 'Time for your medicine!' : language === 'hi' ? 'दवा का समय!' : language === 'ur' ? 'دوا کا وقت!' : 'ওষুধ খাওয়ার সময়!';
                const timingStr = offset < 0 ? (language === 'en' ? 'before' : language === 'hi' ? 'से पहले' : language === 'ur' ? 'سے پہلے' : 'আগে') : offset > 0 ? (language === 'en' ? 'after' : language === 'hi' ? 'के बाद' : language === 'ur' ? 'کے بعد' : 'পরে') : (language === 'en' ? 'with' : language === 'hi' ? 'के साथ' : language === 'ur' ? 'کے ساتھ' : 'সাথে');
                const bBody = language === 'en' ? `It's time to take ${med.name} (${med.dosage}) ${timingStr} ${mealName}.` : language === 'hi' ? `आपकी ${med.name} (${med.dosage}) खाने का समय हो गया है (${mealName} ${timingStr})।` : language === 'ur' ? `آپ کی ${med.name} (${med.dosage}) کھانے کا وقت ہو گیا ہے (${mealName} ${timingStr})۔` : `আপনার ${med.name} (${med.dosage}) খাওয়ার সময় হয়েছে (${mealName}র ${timingStr})।`;
                new Notification(bTitle, { body: bBody, icon: '/favicon.ico' });
              }
            }
          }
        };

        checkTime(meals.breakfast, m, language === 'en' ? 'breakfast' : language === 'hi' ? 'नाश्ते' : language === 'ur' ? 'ناشتے' : 'সকালের খাবার');
        checkTime(meals.lunch, n, language === 'en' ? 'lunch' : language === 'hi' ? 'दोपहर के भोजन' : language === 'ur' ? 'دوپہر کے کھانے' : 'দুপুরের খাবার');
        checkTime(meals.dinner, ni, language === 'en' ? 'dinner' : language === 'hi' ? 'रात के भोजन' : language === 'ur' ? 'رات کے کھانے' : 'রাতের খাবার');
      });

      dueReminders.forEach(reminder => {
        const med = activeMedicines.find(m => m.id === reminder.medicineId);
        if (med && 'Notification' in window && Notification.permission === 'granted') {
          const title = language === 'en' ? 'Time for your medicine!' : language === 'hi' ? 'दवा का समय!' : language === 'ur' ? 'دوا کا وقت!' : 'ওষুধ খাওয়ার সময়!';
          const body = language === 'en' ? `It's time to take ${med.name} (${med.dosage}).` : language === 'hi' ? `आपकी ${med.name} (${med.dosage}) खाने का समय हो गया है।` : language === 'ur' ? `آپ کی ${med.name} (${med.dosage}) کھانے کا وقت ہو گیا ہے۔` : `আপনার ${med.name} (${med.dosage}) খাওয়ার সময় হয়েছে।`;
          new Notification(title, {
            body: body,
            icon: '/favicon.ico'
          });
        }
      });

    }, 60000); // every minute

    return () => clearInterval(interval);
  }, [reminders, activeProfileId, profiles, prescriptions, language]);

  return null;
}

export default function App() {
  return (
    <Layout>
      <NotificationManager />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/scan" element={<Scanner />} />
        <Route path="/history" element={<History />} />
        <Route path="/reminders" element={<Reminders />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Layout>
  );
}
