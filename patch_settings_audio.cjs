const fs = require('fs');
let settings = fs.readFileSync('src/components/Settings.tsx', 'utf8');

settings = settings.replace(
  "import { Moon, Sun, Globe, BellRing } from 'lucide-react';",
  "import { Moon, Sun, Globe, BellRing } from 'lucide-react';\nimport { playReminderSound } from '../lib/audio';"
);

// We want to replace the whole `playSoundPreview` function with a call to playReminderSound
const oldPreviewStart = "const playSoundPreview = (soundName: string) => {";
const oldPreviewEnd = "const handleSoundChange = (e: React.ChangeEvent<HTMLSelectElement>) => {";

// Let's use regex to replace it
settings = settings.replace(
  /const playSoundPreview = \([\s\S]*?const handleSoundChange = \(e: React\.ChangeEvent<HTMLSelectElement>\) => \{/m,
  "const handleSoundChange = (e: React.ChangeEvent<HTMLSelectElement>) => {"
);

// replace playSoundPreview inside handleSoundChange
settings = settings.replace(
  "playSoundPreview(sound);",
  "playReminderSound(sound, 5);"
);

fs.writeFileSync('src/components/Settings.tsx', settings);
