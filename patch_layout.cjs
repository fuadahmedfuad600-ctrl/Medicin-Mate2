const fs = require('fs');

let layout = fs.readFileSync('src/components/Layout.tsx', 'utf8');

// Update imports
layout = layout.replace(
  "import React from 'react';",
  "import React, { useState } from 'react';"
);

// Get addProfile
layout = layout.replace(
  "const { profiles, activeProfileId, setActiveProfile, language } = useAppContext();",
  "const { profiles, activeProfileId, setActiveProfile, addProfile, language } = useAppContext();\n  const [isAddModalOpen, setIsAddModalOpen] = useState(false);\n  const [newMemberName, setNewMemberName] = useState('');"
);

// Translation variables
const translationCode = `
  const t = {
    addMember: language === 'en' ? '+ Add Member' : language === 'hi' ? '+ सदस्य जोड़ें' : language === 'ur' ? '+ ممبر شامل کریں' : '+ মেম্বার যোগ করুন',
    newMemberName: language === 'en' ? 'New Member Name' : language === 'hi' ? 'नए सदस्य का नाम' : language === 'ur' ? 'نئے ممبر کا نام' : 'নতুন মেম্বারের নাম',
    cancel: language === 'en' ? 'Cancel' : language === 'hi' ? 'रद्द करें' : language === 'ur' ? 'منسوخ کریں' : 'বাতিল',
    save: language === 'en' ? 'Save' : language === 'hi' ? 'सहेजें' : language === 'ur' ? 'محفوظ کریں' : 'সেভ করুন',
  };

  const handleProfileChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value === 'add_new') {
      setIsAddModalOpen(true);
      // Reset select value back to current active profile so 'add_new' doesn't stay selected
      e.target.value = activeProfileId || '';
    } else {
      setActiveProfile(e.target.value);
    }
  };

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName.trim()) return;
    
    const colors = ['bg-blue-500', 'bg-emerald-500', 'bg-purple-500', 'bg-rose-500', 'bg-amber-500', 'bg-indigo-500'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    addProfile({
      name: newMemberName.trim(),
      relation: 'Family',
      avatarColor: randomColor,
    });
    
    setNewMemberName('');
    setIsAddModalOpen(false);
  };
`;

layout = layout.replace(
  "const activeProfile = profiles.find(p => p.id === activeProfileId) || profiles[0];",
  "const activeProfile = profiles.find(p => p.id === activeProfileId) || profiles[0];\n" + translationCode
);

// Replace select handler and options
const oldSelect = `<select
              value={activeProfileId || ''}
              onChange={(e) => setActiveProfile(e.target.value)}
              className="bg-slate-100 dark:bg-slate-700 dark:text-white border-none text-sm rounded-lg focus:ring-indigo-500 py-1.5 pl-3 pr-8 transition-colors"
            >
              {profiles.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>`;

const newSelect = `<select
              value={activeProfileId || ''}
              onChange={handleProfileChange}
              className="bg-slate-100 dark:bg-slate-700 dark:text-white border-none text-sm rounded-lg focus:ring-indigo-500 py-1.5 pl-3 pr-8 transition-colors appearance-none"
            >
              {profiles.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
              <option value="disabled" disabled>───────</option>
              <option value="add_new" className="font-bold text-indigo-600 dark:text-indigo-400">{t.addMember}</option>
            </select>`;

layout = layout.replace(oldSelect, newSelect);

// Add the modal HTML before the closing </header> or at the end of the <div>
const modalHtml = `
      {/* Add Member Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 w-full max-w-sm shadow-xl">
            <h2 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">{t.addMember.replace('+', '').trim()}</h2>
            <form onSubmit={handleAddMember}>
              <input
                type="text"
                autoFocus
                placeholder={t.newMemberName}
                value={newMemberName}
                onChange={(e) => setNewMemberName(e.target.value)}
                className="w-full bg-slate-100 dark:bg-slate-700 dark:text-white border-none rounded-lg px-4 py-3 mb-6 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-slate-600 dark:text-slate-400 font-medium hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  disabled={!newMemberName.trim()}
                  className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
                >
                  {t.save}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
`;

layout = layout.replace(
  "</header>",
  "</header>\n" + modalHtml
);

fs.writeFileSync('src/components/Layout.tsx', layout);

