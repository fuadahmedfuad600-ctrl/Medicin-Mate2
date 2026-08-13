const fs = require('fs');
let layout = fs.readFileSync('src/components/Layout.tsx', 'utf8');

// 1. Add imports
layout = layout.replace(
  "import { LayoutDashboard, Camera, History, Users, Bell, Settings } from 'lucide-react';",
  "import { LayoutDashboard, Camera, History, Users, Bell, Settings, ChevronDown, Trash2, UserPlus, Check } from 'lucide-react';"
);

// 2. Add state and deleteProfile from Context
layout = layout.replace(
  "const { profiles, activeProfileId, setActiveProfile, addProfile, language } = useAppContext();",
  "const { profiles, activeProfileId, setActiveProfile, addProfile, deleteProfile, language } = useAppContext();\n  const [isDropdownOpen, setIsDropdownOpen] = useState(false);"
);

// 3. Update translations
layout = layout.replace(
  "const t = {",
  "const t = {\n    manageProfiles: language === 'en' ? 'Manage Profiles' : language === 'hi' ? 'प्रोफाइल प्रबंधित करें' : language === 'ur' ? 'پروفائلز کا نظم کریں' : 'প্রোফাইল পরিচালনা করুন',\n    deleteWarning: language === 'en' ? 'Delete this member?' : language === 'hi' ? 'इस सदस्य को हटाएं?' : language === 'ur' ? 'اس ممبر کو حذف کریں؟' : 'এই মেম্বারকে মুছবেন?',"
);

// 4. Replace handleProfileChange with nothing (we won't use <select>)
layout = layout.replace(
  /const handleProfileChange = \([\s\S]*?setActiveProfile\(e\.target\.value\);\n    }\n  };/,
  ""
);

// 5. Replace the header profile section
const oldProfileDivRegex = /<div className="flex items-center gap-2">\s*<select[\s\S]*?<\/select>\s*<div className=\{`w-8 h-8 rounded-full \$\{activeProfile\?\.avatarColor \|\| 'bg-slate-300'\} flex items-center justify-center text-white text-sm font-medium`\}>\s*\{activeProfile\?\.name\.charAt\(0\)\}\s*<\/div>\s*<\/div>/;

const newProfileDiv = `
          {/* Custom Profile Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 bg-slate-100 dark:bg-slate-700/50 hover:bg-slate-200 dark:hover:bg-slate-700 px-3 py-1.5 rounded-full transition-colors"
            >
              <div className={\`w-6 h-6 rounded-full \${activeProfile?.avatarColor || 'bg-slate-300'} flex items-center justify-center text-white text-xs font-bold shadow-sm\`}>
                {activeProfile?.name.charAt(0)}
              </div>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200 max-w-[80px] truncate">{activeProfile?.name}</span>
              <ChevronDown className={\`w-4 h-4 text-slate-400 transition-transform duration-200 \${isDropdownOpen ? 'rotate-180' : ''}\`} />
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
                    {profiles.map(p => (
                      <div 
                        key={p.id}
                        className={\`flex items-center justify-between p-2 rounded-xl transition-colors \${p.id === activeProfileId ? 'bg-indigo-50 dark:bg-indigo-900/20' : 'hover:bg-slate-50 dark:hover:bg-slate-700/50'}\`}
                      >
                        <button 
                          className="flex items-center gap-3 flex-1 text-left"
                          onClick={() => {
                            setActiveProfile(p.id);
                            setIsDropdownOpen(false);
                          }}
                        >
                          <div className={\`w-8 h-8 rounded-full \${p.avatarColor} flex items-center justify-center text-white text-sm font-bold shadow-sm\`}>
                            {p.name.charAt(0)}
                          </div>
                          <span className={\`font-medium text-sm \${p.id === activeProfileId ? 'text-indigo-700 dark:text-indigo-300' : 'text-slate-700 dark:text-slate-200'}\`}>
                            {p.name}
                          </span>
                          {p.id === activeProfileId && <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400 ml-auto" />}
                        </button>
                        
                        {/* Only show delete for non-Me profiles if there's more than one */}
                        {(p.name.toLowerCase() !== 'me' && profiles.length > 1) && (
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
`;

layout = layout.replace(oldProfileDivRegex, newProfileDiv);

fs.writeFileSync('src/components/Layout.tsx', layout);
