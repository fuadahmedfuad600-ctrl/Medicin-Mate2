import React from 'react';
import { useAppContext } from '../context/AppContext';
import { Moon, Sun, Globe, BellRing } from 'lucide-react';
import { playReminderSound } from '../lib/audio';

export default function Settings() {
  const { theme, language, reminderSound, setTheme, setLanguage, setReminderSound } = useAppContext();

  
  const handleSoundChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const sound = e.target.value as 'default' | 'chime' | 'digital' | 'gentle';
    setReminderSound(sound);
    playReminderSound(sound, 5);
  };

  return (
    <div className="p-4 pt-6 pb-24 min-h-screen dark:bg-slate-900 transition-colors">
      <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-6">
        {language === 'en' ? 'Settings' : language === 'hi' ? 'सेटिंग्स' : language === 'ur' ? 'ترتیبات' : 'সেটিংস'}
      </h2>
      
      <div className="space-y-4">
        {/* Theme Toggle */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-50 dark:bg-slate-700 rounded-lg flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              {theme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </div>
            <div>
              <p className="font-semibold text-slate-900 dark:text-white">
                {language === 'en' ? 'Appearance' : language === 'hi' ? 'दिखावट' : language === 'ur' ? 'ظاہری شکل' : 'থিম'}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {language === 'en' ? 'Switch between light and dark mode' : language === 'hi' ? 'लाइट और डार्क मोड के बीच स्विच करें' : language === 'ur' ? 'لائٹ اور ڈارک موڈ کے درمیان سوئچ کریں' : 'লাইট এবং ডার্ক মোডের মধ্যে পরিবর্তন করুন'}
              </p>
            </div>
          </div>
          <select 
            value={theme}
            onChange={(e) => setTheme(e.target.value as 'light' | 'dark')}
            className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg py-2 px-3 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          >
            <option value="light">{language === 'en' ? 'Light' : language === 'hi' ? 'लाइट' : language === 'ur' ? 'لائٹ' : 'লাইট'}</option>
            <option value="dark">{language === 'en' ? 'Dark' : language === 'hi' ? 'डार्क' : language === 'ur' ? 'ڈارک' : 'ডার্ক'}</option>
          </select>
        </div>

        {/* Language Toggle */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-50 dark:bg-slate-700 rounded-lg flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold text-slate-900 dark:text-white">
                {language === 'en' ? 'Language' : language === 'hi' ? 'भाषा' : language === 'ur' ? 'زبان' : 'ভাষা'}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {language === 'en' ? 'Choose your preferred language' : language === 'hi' ? 'अपनी पसंदीदा भाषा चुनें' : language === 'ur' ? 'اپنی پسندیدہ زبان منتخب کریں' : 'আপনার পছন্দের ভাষা বেছে নিন'}
              </p>
            </div>
          </div>
          <select 
            value={language}
            onChange={(e) => setLanguage(e.target.value as 'en' | 'bn' | 'hi' | 'ur')}
            className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg py-2 px-3 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          >
            <option value="en">English</option>
            <option value="bn">বাংলা</option>
            <option value="hi">हिन्दी</option>
            <option value="ur">اردو</option>
          </select>
        </div>
      
        {/* Reminder Sound */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-50 dark:bg-slate-700 rounded-lg flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <BellRing className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold text-slate-900 dark:text-white">
                {language === 'en' ? 'Reminder Sound' : language === 'hi' ? 'अनुस्मारक ध्वनि' : language === 'ur' ? 'یاد دہانی کی آواز' : 'রিমাইন্ডার সাউন্ড'}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {language === 'en' ? 'Choose alert tone' : language === 'hi' ? 'अलर्ट टोन चुनें' : language === 'ur' ? 'الرٹ ٹون منتخب کریں' : 'অ্যালার্ট টোন বেছে নিন'}
              </p>
            </div>
          </div>
          <select 
            value={reminderSound || 'default'}
            onChange={handleSoundChange}
            className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg py-2 px-3 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          >
            <option value="default">{language === 'en' ? 'Default' : language === 'hi' ? 'डिफ़ॉल्ट' : language === 'ur' ? 'پہلے سے طے شدہ' : 'ডিফল্ট'}</option>
            <option value="chime">{language === 'en' ? 'Chime' : language === 'hi' ? 'झंकार' : language === 'ur' ? 'چائم' : 'চাইম (Chime)'}</option>
            <option value="digital">{language === 'en' ? 'Digital' : language === 'hi' ? 'डिजिटल' : language === 'ur' ? 'ڈیجیٹل' : 'ডিজিটাল'}</option>
            <option value="gentle">{language === 'en' ? 'Gentle' : language === 'hi' ? 'सौम्य' : language === 'ur' ? 'نرم' : 'মৃদু (Gentle)'}</option>
          </select>
        </div>
      </div>
    </div>
  );
}
