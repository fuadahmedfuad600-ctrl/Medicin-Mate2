const fs = require('fs');

const code = `import React, { createContext, useContext, useEffect, useState } from 'react';
import { Profile, Prescription, DoseLog, Medicine, Reminder } from '../types';

interface AppState {
  profiles: Profile[];
  activeProfileId: string | null;
  prescriptions: Prescription[];
  doseLogs: DoseLog[];
  reminders: Reminder[];
  theme: 'light' | 'dark';
  language: 'en' | 'bn' | 'hi' | 'ur';
  reminderSound: 'default' | 'chime' | 'digital' | 'gentle';
}

interface AppContextType extends AppState {
  addProfile: (profile: Omit<Profile, 'id'>) => void;
  updateProfile: (id: string, profileData: Partial<Profile>) => void;
  setActiveProfile: (id: string) => void;
  addPrescription: (prescription: Omit<Prescription, 'id' | 'dateAdded'>) => void;
  toggleDose: (medicineId: string, date: string, timeOfDay: 'morning' | 'noon' | 'night') => void;
  addReminder: (reminder: Omit<Reminder, 'id'>) => void;
  updateReminder: (id: string, reminder: Partial<Reminder>) => void;
  deleteReminder: (id: string) => void;
  toggleReminder: (id: string) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  setLanguage: (language: 'en' | 'bn' | 'hi' | 'ur') => void;
  setReminderSound: (sound: 'default' | 'chime' | 'digital' | 'gentle') => void;
  deletePrescription: (id: string) => void;
  deleteMedicine: (id: string) => void;
}

const defaultState: AppState = {
  profiles: [],
  activeProfileId: null,
  prescriptions: [],
  doseLogs: [],
  reminders: [],
  theme: 'light',
  language: 'en',
  reminderSound: 'default',
};

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'medicinemate_data';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (!parsed.reminderSound) parsed.reminderSound = 'default';
        return { ...defaultState, ...parsed };
      } catch (e) {
        console.error('Failed to parse local storage data');
      }
    }
    
    // Initialize a default "Me" profile if nothing exists
    const defaultProfile: Profile = {
      id: crypto.randomUUID(),
      name: 'Me',
      relation: 'Self',
      avatarColor: 'bg-blue-500',
      mealTimes: {
        breakfast: '08:00',
        lunch: '13:00',
        dinner: '20:00'
      }
    };
    
    return {
      profiles: [defaultProfile],
      activeProfileId: defaultProfile.id,
      prescriptions: [],
      doseLogs: [],
      reminders: [],
      theme: 'light',
      language: 'en',
      reminderSound: 'default',
    };
  });

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
    
    // Apply theme
    if (state.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [state]);

  const setTheme = (theme: 'light' | 'dark') => {
    setState((prev) => ({ ...prev, theme }));
  };
  
  const setLanguage = (language: 'en' | 'bn' | 'hi' | 'ur') => {
    setState((prev) => ({ ...prev, language }));
  };

  const setReminderSound = (sound: 'default' | 'chime' | 'digital' | 'gentle') => {
    setState((prev) => ({ ...prev, reminderSound: sound }));
  };

  const addProfile = (profileData: Omit<Profile, 'id'>) => {
    setState((prev) => {
      const newProfile: Profile = { 
        ...profileData, 
        id: crypto.randomUUID(),
        mealTimes: {
          breakfast: '08:00',
          lunch: '13:00',
          dinner: '20:00'
        }
      };
      return {
        ...prev,
        profiles: [...prev.profiles, newProfile],
        activeProfileId: prev.activeProfileId || newProfile.id,
      };
    });
  };

  const updateProfile = (id: string, profileData: Partial<Profile>) => {
    setState((prev) => ({
      ...prev,
      profiles: prev.profiles.map((p) => (p.id === id ? { ...p, ...profileData } : p)),
    }));
  };

  const setActiveProfile = (id: string) => {
    setState((prev) => ({ ...prev, activeProfileId: id }));
  };

  const addPrescription = (prescriptionData: Omit<Prescription, 'id' | 'dateAdded'>) => {
    setState((prev) => {
      const newPrescription: Prescription = {
        ...prescriptionData,
        id: crypto.randomUUID(),
        dateAdded: new Date().toISOString(),
      };
      return {
        ...prev,
        prescriptions: [...prev.prescriptions, newPrescription],
      };
    });
  };

  const addReminder = (reminderData: Omit<Reminder, 'id'>) => {
    setState((prev) => ({
      ...prev,
      reminders: [...prev.reminders, { ...reminderData, id: crypto.randomUUID() }],
    }));
  };

  const updateReminder = (id: string, reminderData: Partial<Reminder>) => {
    setState((prev) => ({
      ...prev,
      reminders: prev.reminders.map((r) => (r.id === id ? { ...r, ...reminderData } : r)),
    }));
  };

  const deleteReminder = (id: string) => {
    setState((prev) => ({
      ...prev,
      reminders: prev.reminders.filter((r) => r.id !== id),
    }));
  };

  const toggleReminder = (id: string) => {
    setState((prev) => ({
      ...prev,
      reminders: prev.reminders.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r)),
    }));
  };

  const deletePrescription = (id: string) => {
    setState((prev) => ({
      ...prev,
      prescriptions: prev.prescriptions.filter((p) => p.id !== id),
    }));
  };

  const deleteMedicine = (id: string) => {
    setState((prev) => ({
      ...prev,
      prescriptions: prev.prescriptions.map((p) => ({
        ...p,
        medicines: p.medicines.filter((m) => m.id !== id),
      })).filter(p => p.medicines.length > 0)
    }));
  };

  const toggleDose = (medicineId: string, date: string, timeOfDay: 'morning' | 'noon' | 'night') => {
    setState((prev) => {
      const existingLogIndex = prev.doseLogs.findIndex(
        (log) => log.medicineId === medicineId && log.date === date && log.timeOfDay === timeOfDay
      );
      
      let newLogs = [...prev.doseLogs];
      
      if (existingLogIndex >= 0) {
        // Toggle off
        newLogs[existingLogIndex] = {
          ...newLogs[existingLogIndex],
          taken: !newLogs[existingLogIndex].taken,
          takenAt: !newLogs[existingLogIndex].taken ? new Date().toISOString() : undefined,
        };
      } else {
        // Create new log (taken)
        if (!prev.activeProfileId) return prev;
        
        newLogs.push({
          id: crypto.randomUUID(),
          medicineId,
          profileId: prev.activeProfileId,
          date,
          timeOfDay,
          taken: true,
          takenAt: new Date().toISOString(),
        });
      }
      
      return { ...prev, doseLogs: newLogs };
    });
  };

  return (
    <AppContext.Provider
      value={{
        ...state,
        addProfile,
        updateProfile,
        setActiveProfile,
        addPrescription,
        toggleDose,
        addReminder,
        updateReminder,
        deleteReminder,
        toggleReminder,
        setTheme,
        setLanguage,
        setReminderSound,
        deletePrescription,
        deleteMedicine,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
`;

fs.writeFileSync('src/context/AppContext.tsx', code);
