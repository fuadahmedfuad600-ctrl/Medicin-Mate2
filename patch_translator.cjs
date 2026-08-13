const fs = require('fs');

let translator = fs.readFileSync('src/lib/translator.ts', 'utf8');

// Add "1" (English) and "টি" to dictionary
const newDictEntries = `
    'morning': { bn: 'সকালে', hi: 'सुबह', ur: 'صبح' },
    'noon': { bn: 'দুপুরে', hi: 'दोपहर', ur: 'دوپہر' },
    'afternoon': { bn: 'বিকালে', hi: 'शाम', ur: 'سہ پہر' },
    'evening': { bn: 'সন্ধ্যায়', hi: 'शाम', ur: 'شام' },
    'night': { bn: 'রাতে', hi: 'रात', ur: 'رات' },
    'daily': { bn: 'প্রতিদিন', hi: 'रोजाना', ur: 'روزانہ' },
    'pieces': { bn: 'টি', hi: 'पीस', ur: 'ٹکڑے' },
    'piece': { bn: 'টা', hi: 'पीस', ur: 'ٹکڑا' },
    'before meal': { bn: 'খাবারের আগে', hi: 'भोजन से पहले', ur: 'کھانے سے پہلے' },
`;

translator = translator.replace(
  "'morning': { bn: 'সকালে', hi: 'सुबह', ur: 'صبح' },\n    'noon': { bn: 'দুপুরে', hi: 'दोपहर', ur: 'دوپہر' },\n    'afternoon': { bn: 'বিকালে', hi: 'शाम', ur: 'سہ پہر' },\n    'evening': { bn: 'সন্ধ্যায়', hi: 'शाम', ur: 'شام' },\n    'night': { bn: 'রাতে', hi: 'रात', ur: 'رات' },\n    'daily': { bn: 'প্রতিদিন', hi: 'रोजाना', ur: 'روزانہ' },\n    'before meal': { bn: 'খাবারের আগে', hi: 'भोजन से पहले', ur: 'کھانے سے پہلے' },",
  newDictEntries
);

fs.writeFileSync('src/lib/translator.ts', translator);
