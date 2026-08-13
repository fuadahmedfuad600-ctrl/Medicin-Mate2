const fs = require('fs');

let settings = fs.readFileSync('src/components/Settings.tsx', 'utf8');

settings = settings.replace(
  "import { Moon, Sun, Globe } from 'lucide-react';",
  "import { Moon, Sun, Globe, BellRing } from 'lucide-react';"
);

settings = settings.replace(
  "const { theme, language, setTheme, setLanguage } = useAppContext();",
  "const { theme, language, reminderSound, setTheme, setLanguage, setReminderSound } = useAppContext();"
);

const soundHandler = `
  const playSoundPreview = (soundName: string) => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      if (soundName === 'default') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 0.05);
        gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.2);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.2);
      } else if (soundName === 'chime') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
        osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.15); // E5
        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.5);
      } else if (soundName === 'digital') {
        osc.type = 'square';
        osc.frequency.setValueAtTime(800, ctx.currentTime);
        osc.frequency.setValueAtTime(1200, ctx.currentTime + 0.1);
        osc.frequency.setValueAtTime(800, ctx.currentTime + 0.2);
        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.setValueAtTime(0.1, ctx.currentTime + 0.01);
        gain.gain.setValueAtTime(0, ctx.currentTime + 0.3);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.3);
      } else if (soundName === 'gentle') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(349.23, ctx.currentTime); // F4
        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.4, ctx.currentTime + 0.2);
        gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.6);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.6);
      }
    } catch (e) {
      console.error('Audio preview failed', e);
    }
  };

  const handleSoundChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const sound = e.target.value as 'default' | 'chime' | 'digital' | 'gentle';
    setReminderSound(sound);
    playSoundPreview(sound);
  };
`;

settings = settings.replace(
  "return (",
  soundHandler + "\n  return ("
);

const soundBlock = `
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
`;

settings = settings.replace(
  "</div>\n    </div>\n  );\n}",
  soundBlock + "      </div>\n    </div>\n  );\n}"
);

fs.writeFileSync('src/components/Settings.tsx', settings);
