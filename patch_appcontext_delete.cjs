const fs = require('fs');

let ctx = fs.readFileSync('src/context/AppContext.tsx', 'utf8');

// 1. Add to AppContextType
ctx = ctx.replace(
  "deleteMedicine: (id: string) => void;",
  "deleteMedicine: (id: string) => void;\n  deleteProfile: (id: string) => void;"
);

// 2. Add implementation
const impl = `
  const deleteProfile = (id: string) => {
    setState((prev) => {
      // Don't delete the last profile or the "Me" profile if we can avoid it, but specifically don't delete if it's the only one
      if (prev.profiles.length <= 1) return prev;
      
      const newProfiles = prev.profiles.filter(p => p.id !== id);
      const newActiveId = prev.activeProfileId === id ? newProfiles[0].id : prev.activeProfileId;
      
      return {
        ...prev,
        profiles: newProfiles,
        activeProfileId: newActiveId,
        // Also cleanup their data
        prescriptions: prev.prescriptions.filter(p => p.profileId !== id),
        doseLogs: prev.doseLogs.filter(l => l.profileId !== id),
        reminders: prev.reminders.filter(r => r.profileId !== id)
      };
    });
  };
`;

ctx = ctx.replace(
  "const deleteMedicine = (id: string) => {",
  impl + "\n  const deleteMedicine = (id: string) => {"
);

// 3. Add to provider
ctx = ctx.replace(
  "deleteMedicine,",
  "deleteMedicine,\n        deleteProfile,"
);

fs.writeFileSync('src/context/AppContext.tsx', ctx);
