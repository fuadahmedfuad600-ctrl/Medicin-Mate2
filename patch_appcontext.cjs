const fs = require('fs');
const content = fs.readFileSync('src/context/AppContext.tsx', 'utf-8');
const newContent = content.replace(
  'return { ...defaultState, ...parsed };',
  `
        if (!parsed.profiles || parsed.profiles.length === 0) {
          const defaultProfile = {
            id: generateId(),
            name: 'Me',
            relation: 'Self',
            avatarColor: 'bg-blue-500',
            mealTimes: { breakfast: '08:00', lunch: '13:00', dinner: '20:00' }
          };
          parsed.profiles = [defaultProfile];
          parsed.activeProfileId = defaultProfile.id;
        }
        return { ...defaultState, ...parsed };
  `
);
fs.writeFileSync('src/context/AppContext.tsx', newContent);
