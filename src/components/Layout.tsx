import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Camera, History, Users, Bell, Settings, ChevronDown, Trash2, UserPlus, Check } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import VoiceAssistant from './VoiceAssistant';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { profiles, activeProfileId, setActiveProfile, addProfile, deleteProfile, language } = useAppContext();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newMemberName, setNewMemberName] = useState('');
  
  const activeProfile = (profiles || []).find(p => p.id === activeProfileId) || (profiles || [])[0];

  const t = {
    manageProfiles: language === 'en' ? 'Manage Profiles' : language === 'hi' ? 'प्रोफाइल प्रबंधित करें' : language === 'ur' ? 'پروفائلز کا نظم کریں' : 'প্রোফাইল পরিচালনা করুন',
    deleteWarning: language === 'en' ? 'Delete this member?' : language === 'hi' ? 'इस सदस्य को हटाएं?' : language === 'ur' ? 'اس ممبر کو حذف کریں؟' : 'এই মেম্বারকে মুছবেন?',
    addMember: language === 'en' ? '+ Add Member' : language === 'hi' ? '+ सदस्य जोड़ें' : language === 'ur' ? '+ ممبر شامل کریں' : '+ মেম্বার যোগ করুন',
    newMemberName: language === 'en' ? 'New Member Name' : language === 'hi' ? 'नए सदस्य का नाम' : language === 'ur' ? 'نئے ممبر کا نام' : 'নতুন মেম্বারের নাম',
    cancel: language === 'en' ? 'Cancel' : language === 'hi' ? 'रद्द करें' : language === 'ur' ? 'منسوخ کریں' : 'বাতিল',
    save: language === 'en' ? 'Save' : language === 'hi' ? 'सहेजें' : language === 'ur' ? 'محفوظ کریں' : 'সেভ করুন',
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


  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-sans transition-colors">
      
      {/* Top Header */}
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-10 transition-colors">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">
              M
            </div>
            <h1 className="font-semibold text-lg tracking-tight">MedicineMate</h1>
          </div>

          {/* Profile Switcher (Simple) */}
          
          {/* Custom Profile Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 bg-slate-100 dark:bg-slate-700/50 hover:bg-slate-200 dark:hover:bg-slate-700 px-3 py-1.5 rounded-full transition-colors"
            >
              <div className={`w-6 h-6 rounded-full ${activeProfile?.avatarColor || 'bg-slate-300'} flex items-center justify-center text-white text-xs font-bold shadow-sm`}>
                {activeProfile?.name?.charAt(0) || "?"}
              </div>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200 max-w-[80px] truncate">{activeProfile?.name}</span>
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setIsDropdownOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                  <div className="p-3 border-b border-slate-100 dark:border-slate-700">
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t.manageProfiles}</p>
                  </div>
                  <div className="max-h-60 overflow-y-auto p-2 space-y-1">
                    { (profiles || []).map(p => (
                      <div 
                        key={p.id}
                        className={`flex items-center justify-between p-2 rounded-xl transition-colors ${p.id === activeProfileId ? 'bg-indigo-50 dark:bg-indigo-900/20' : 'hover:bg-slate-50 dark:hover:bg-slate-700/50'}`}
                      >
                        <button 
                          className="flex items-center gap-3 flex-1 text-left"
                          onClick={() => {
                            setActiveProfile(p.id);
                            setIsDropdownOpen(false);
                          }}
                        >
                          <div className={`w-8 h-8 rounded-full ${p.avatarColor} flex items-center justify-center text-white text-sm font-bold shadow-sm`}>
                            {p?.name?.charAt(0) || "?"}
                          </div>
                          <span className={`font-medium text-sm ${p.id === activeProfileId ? 'text-indigo-700 dark:text-indigo-300' : 'text-slate-700 dark:text-slate-200'}`}>
                            {p.name}
                          </span>
                          {p.id === activeProfileId && <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400 ml-auto" />}
                        </button>
                        
                        {/* Only show delete for non-Me profiles if there's more than one */}
                        {((p?.name || "").toLowerCase() !== 'me' && (profiles || []).length > 1) && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (window.confirm(t.deleteWarning)) {
                                deleteProfile(p.id);
                                if (p.id === activeProfileId) setIsDropdownOpen(false);
                              }
                            }}
                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="p-2 border-t border-slate-100 dark:border-slate-700">
                    <button
                      onClick={() => {
                        setIsDropdownOpen(false);
                        setIsAddModalOpen(true);
                      }}
                      className="w-full flex items-center justify-center gap-2 py-2.5 px-4 text-sm font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 rounded-xl transition-colors"
                    >
                      <UserPlus className="w-4 h-4" />
                      {t.addMember.replace('+', '').trim()}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

        </div>
      </header>

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


      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-md mx-auto pb-24 overflow-x-hidden">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 w-full bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 pb-2 z-20 transition-colors">
        <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-between">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 text-xs font-medium transition-colors ${
                isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`
            }
          >
            <LayoutDashboard className="w-6 h-6" />
            <span>{language === 'en' ? 'Dashboard' : language === 'hi' ? 'डैशबोर्ड' : language === 'ur' ? 'ڈیش بورڈ' : 'ড্যাশবোর্ড'}</span>
          </NavLink>
          <NavLink
            to="/reminders"
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 text-xs font-medium transition-colors ${
                isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`
            }
          >
            <Bell className="w-6 h-6" />
            <span>{language === 'en' ? 'Alerts' : language === 'hi' ? 'अलर्ट' : language === 'ur' ? 'الرٹس' : 'অ্যালার্ট'}</span>
          </NavLink>
          <VoiceAssistant />
          <NavLink
            to="/scan"
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 text-xs font-medium transition-colors ${
                isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`
            }
          >
            <Camera className="w-6 h-6" />
            <span>{language === 'en' ? 'Scan' : language === 'hi' ? 'स्कैन' : language === 'ur' ? 'اسکین' : 'স্ক্যান'}</span>
          </NavLink>
          <NavLink
            to="/history"
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 text-xs font-medium transition-colors ${
                isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`
            }
          >
            <History className="w-6 h-6" />
            <span>{language === 'en' ? 'History' : language === 'hi' ? 'इतिहास' : language === 'ur' ? 'تاریخ' : 'হিস্ট্রি'}</span>
          </NavLink>
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 text-xs font-medium transition-colors ${
                isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`
            }
          >
            <Settings className="w-6 h-6" />
            <span>{language === 'en' ? 'Settings' : language === 'hi' ? 'सेटिंग्स' : language === 'ur' ? 'ترتیبات' : 'সেটিংস'}</span>
          </NavLink>
        </div>
      </nav>
    </div>
  );
}
