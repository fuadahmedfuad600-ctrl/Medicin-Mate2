const fs = require('fs');
let code = fs.readFileSync('src/components/Reminders.tsx', 'utf8');

// Remove the Plus icon from import
code = code.replace(
  "import { Bell, Plus, Trash2, Clock, CalendarDays, X } from 'lucide-react';",
  "import { Bell, Trash2, Clock, CalendarDays, X } from 'lucide-react';"
);

// We need to match lines 145-151 and 153-230
code = code.replace(/<button\s+onClick=\{\(\) => setIsAdding\(true\)\}[\s\S]*?\{t\.new\}\s+<\/button>/, "");

const isAddingStartIndex = code.indexOf("{isAdding && (");
const isAddingEndIndex = code.indexOf(")}", code.indexOf("</button>", code.indexOf("{t.save}"))) + 2;

if (isAddingStartIndex !== -1 && isAddingEndIndex !== -1) {
  code = code.substring(0, isAddingStartIndex) + code.substring(isAddingEndIndex);
}

fs.writeFileSync('src/components/Reminders.tsx', code);
