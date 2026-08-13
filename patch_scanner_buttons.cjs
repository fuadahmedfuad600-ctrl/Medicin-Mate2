const fs = require('fs');
let code = fs.readFileSync('src/components/Scanner.tsx', 'utf8');

// Imports
code = code.replace(
  "import { Camera, AlertCircle, CheckCircle2, ChevronRight, Loader2 } from 'lucide-react';",
  "import { Camera, AlertCircle, CheckCircle2, ChevronRight, Loader2, Image as ImageIcon } from 'lucide-react';"
);

// Refs
code = code.replace(
  "const fileInputRef = useRef<HTMLInputElement>(null);",
  "const cameraInputRef = useRef<HTMLInputElement>(null);\n  const galleryInputRef = useRef<HTMLInputElement>(null);"
);

// Translations
code = code.replace(
  "openCam: language === 'en' ? 'Open Camera' : language === 'hi' ? 'कैमरा खोलें' : language === 'ur' ? 'کیمرہ کھولیں' : 'ক্যামেরা খুলুন',",
  "openCam: language === 'en' ? 'Open Camera' : language === 'hi' ? 'कैमरा खोलें' : language === 'ur' ? 'کیمرہ کھولیں' : 'ক্যামেরা খুলুন',\n    openGallery: language === 'en' ? 'Open Gallery' : language === 'hi' ? 'गैलरी खोलें' : language === 'ur' ? 'گیلری کھولیں' : 'গ্যালারি খুলুন',"
);

// Buttons section
const oldButtonsRegex = /<input\s+type="file"\s+accept="image\/\*"\s+capture="environment"\s+className="hidden"\s+ref=\{fileInputRef\}\s+onChange=\{handleImageCapture\}\s+\/>\s+<button\s+disabled=\{loading\}\s+onClick=\{.*\}\s+className=".*"\s+>\s+\{loading \? \(\s+<>\s+<Loader2 className="w-5 h-5 animate-spin" \/>\s+\{t\.analyzing\}\s+<\/>\s+\) : \(\s+<>\s+<Camera className="w-5 h-5" \/>\s+\{t\.openCam\}\s+<\/>\s+\)\}\s+<\/button>/g;

const newButtons = `<input
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        ref={cameraInputRef}
        onChange={handleImageCapture}
      />
      <input
        type="file"
        accept="image/*"
        className="hidden"
        ref={galleryInputRef}
        onChange={handleImageCapture}
      />
      <div className="w-full max-w-xs space-y-3">
        <button
          disabled={loading}
          onClick={() => cameraInputRef.current?.click()}
          className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white font-medium py-4 rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-70"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              {t.analyzing}
            </>
          ) : (
            <>
              <Camera className="w-5 h-5" />
              {t.openCam}
            </>
          )}
        </button>
        <button
          disabled={loading}
          onClick={() => galleryInputRef.current?.click()}
          className="w-full flex items-center justify-center gap-2 bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 border-2 border-indigo-100 dark:border-slate-700 font-medium py-4 rounded-xl hover:bg-indigo-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-70"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              {t.analyzing}
            </>
          ) : (
            <>
              <ImageIcon className="w-5 h-5" />
              {t.openGallery}
            </>
          )}
        </button>
      </div>`;

code = code.replace(oldButtonsRegex, newButtons);

fs.writeFileSync('src/components/Scanner.tsx', code);
