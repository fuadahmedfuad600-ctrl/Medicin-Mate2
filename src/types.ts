export type Profile = {
  id: string;
  name: string;
  relation: string;
  avatarColor: string;
  mealTimes?: {
    breakfast: string;
    lunch: string;
    dinner: string;
  };
};

export type Medicine = {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  simplifiedFrequency: string;
  instructions: string;
  durationDays: number;
  startDate: string; // ISO string
  confidence: number;
};

export type Prescription = {
  id: string;
  profileId: string;
  dateAdded: string; // ISO string
  medicines: Medicine[];
  imageUrl?: string;
};

export type DoseLog = {
  id: string;
  medicineId: string;
  profileId: string;
  date: string; // YYYY-MM-DD format for easy querying
  timeOfDay: 'morning' | 'noon' | 'night';
  taken: boolean;
  takenAt?: string; // ISO string if taken
};

export type Reminder = {
  id: string;
  medicineId: string;
  profileId: string;
  time: string; // 'HH:mm'
  frequency: 'daily' | 'weekly';
  daysOfWeek?: number[]; // 0-6 (Sun-Sat)
  enabled: boolean;
};

// Data returned from the AI API
export type AIExtractedMedicine = Omit<Medicine, 'id' | 'startDate'>;
