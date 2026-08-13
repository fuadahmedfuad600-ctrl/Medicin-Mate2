const fs = require('fs');
let code = fs.readFileSync('src/components/VoiceAssistant.tsx', 'utf8');

code = code.replace(
  '  return (\n    <div className="fixed bottom-20 right-4 z-50">',
  '  return ('
);

code = code.replace(
  `      <button
        onClick={isActive ? stopAssistant : startAssistant}
        disabled={isConnecting}
        className={\`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all transform hover:scale-105 active:scale-95 \${
          isActive 
            ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse' 
            : 'bg-indigo-600 hover:bg-indigo-700 text-white'
        } \${isConnecting ? 'opacity-70 cursor-not-allowed' : ''}\`}
        aria-label={isActive ? "Stop Voice Assistant" : "Start Voice Assistant"}
      >`,
  `      <button
        onClick={isActive ? stopAssistant : startAssistant}
        disabled={isConnecting}
        className={\`flex flex-col items-center gap-1 text-xs font-medium transition-colors \${
          isActive 
            ? 'text-red-500 animate-pulse' 
            : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
        } \${isConnecting ? 'opacity-70 cursor-not-allowed' : ''}\`}
        aria-label={isActive ? "Stop Voice Assistant" : "Start Voice Assistant"}
      >`
);

code = code.replace(
  `        {isConnecting ? (
          <Loader2 className="w-6 h-6 animate-spin" />
        ) : isActive ? (
          <MicOff className="w-6 h-6" />
        ) : (
          <Mic className="w-6 h-6" />
        )}
      </button>
      
      {/* Tooltip or status indicator */}
      {isActive && (
        <div className="absolute right-16 top-1/2 -translate-y-1/2 bg-white dark:bg-slate-800 px-3 py-1.5 rounded-lg shadow-md whitespace-nowrap text-sm font-medium text-slate-700 dark:text-slate-200 border border-slate-100 dark:border-slate-700">
          {language === 'bn' ? 'শুনছি...' : 'Listening...'}
          <div className="absolute top-1/2 -right-1 -translate-y-1/2 border-y-4 border-y-transparent border-l-4 border-l-white dark:border-l-slate-800"></div>
        </div>
      )}
    </div>`,
  `        {isConnecting ? (
          <Loader2 className="w-6 h-6 animate-spin" />
        ) : isActive ? (
          <MicOff className="w-6 h-6" />
        ) : (
          <Mic className="w-6 h-6" />
        )}
        <span>{language === 'bn' ? 'ভয়েস' : 'Voice'}</span>
      </button>`
);

fs.writeFileSync('src/components/VoiceAssistant.tsx', code);
