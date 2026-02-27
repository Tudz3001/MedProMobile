import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  MEDICINES: 'medpro_medicines',
  TAKEN: 'medpro_taken',
  SETTINGS: 'medpro_settings',
  TUTORIAL_SHOWN: 'medpro_tutorial_shown',
};

export async function loadMedicines() {
  try {
    const raw = await AsyncStorage.getItem(KEYS.MEDICINES);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export async function saveMedicines(medicines) {
  try {
    await AsyncStorage.setItem(KEYS.MEDICINES, JSON.stringify(medicines));
  } catch {}
}

export async function loadTaken() {
  try {
    const raw = await AsyncStorage.getItem(KEYS.TAKEN);
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}

export async function saveTaken(taken) {
  try {
    // Giữ lại chỉ 7 ngày gần nhất để không đầy bộ nhớ
    const today = new Date();
    const filtered = {};
    for (const [key, val] of Object.entries(taken)) {
      const parts = key.split('@');
      if (parts.length === 3) {
        const d = new Date(parts[2]);
        const diff = (today - d) / (1000 * 60 * 60 * 24);
        if (diff <= 7) filtered[key] = val;
      }
    }
    await AsyncStorage.setItem(KEYS.TAKEN, JSON.stringify(filtered));
  } catch {}
}

export async function loadSettings() {
  try {
    const raw = await AsyncStorage.getItem(KEYS.SETTINGS);
    return raw ? JSON.parse(raw) : { theme: 'dark', tutorialShown: false };
  } catch { return { theme: 'dark', tutorialShown: false }; }
}

export async function saveSettings(settings) {
  try {
    await AsyncStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
  } catch {}
}
