import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { loadMedicines, saveMedicines, loadTaken, saveTaken, loadSettings, saveSettings } from '../utils/storage';
import { rescheduleAll, cancelMedicineNotifications, scheduleMedicineNotifications } from '../utils/notificationService';
import { DARK_THEME, LIGHT_THEME } from '../utils/theme';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [medicines, setMedicinesState] = useState([]);
  const [taken, setTakenState] = useState({});
  const [theme, setThemeState] = useState('dark');
  const [tutorialShown, setTutorialShown] = useState(true);
  const [loading, setLoading] = useState(true);

  const colors = theme === 'dark' ? DARK_THEME : LIGHT_THEME;

  // ── Load dữ liệu lúc khởi động ──────────────────────────────────────
  useEffect(() => {
    (async () => {
      const [meds, tk, settings] = await Promise.all([
        loadMedicines(), loadTaken(), loadSettings(),
      ]);
      setMedicinesState(meds);
      setTakenState(tk);
      setThemeState(settings.theme || 'dark');
      setTutorialShown(settings.tutorialShown || false);
      setLoading(false);
    })();
  }, []);

  // ── Medicines ─────────────────────────────────────────────────────
  const setMedicines = useCallback(async (newMeds) => {
    setMedicinesState(newMeds);
    await saveMedicines(newMeds);
    await rescheduleAll(newMeds);
  }, []);

  const addMedicine = useCallback(async (med) => {
    const newMeds = [...medicines, med];
    setMedicinesState(newMeds);
    await saveMedicines(newMeds);
    await scheduleMedicineNotifications(med);
  }, [medicines]);

  const deleteMedicine = useCallback(async (index) => {
    const med = medicines[index];
    const newMeds = medicines.filter((_, i) => i !== index);
    setMedicinesState(newMeds);
    await saveMedicines(newMeds);
    await cancelMedicineNotifications(med.name);
  }, [medicines]);

  const updateMedicineTimes = useCallback(async (index, customTimes) => {
    const newMeds = medicines.map((m, i) =>
      i === index ? { ...m, custom_times: customTimes } : m
    );
    setMedicinesState(newMeds);
    await saveMedicines(newMeds);
    await scheduleMedicineNotifications(newMeds[index]);
  }, [medicines]);

  const clearAllMedicines = useCallback(async () => {
    setMedicinesState([]);
    await saveMedicines([]);
    const { cancelAllNotifications } = await import('../utils/notificationService');
    await cancelAllNotifications();
  }, []);

  // ── Taken ────────────────────────────────────────────────────────
  const toggleTaken = useCallback(async (key) => {
    const newTaken = { ...taken };
    if (newTaken[key]) delete newTaken[key];
    else newTaken[key] = true;
    setTakenState(newTaken);
    await saveTaken(newTaken);
  }, [taken]);

  // ── Theme ────────────────────────────────────────────────────────
  const toggleTheme = useCallback(async () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setThemeState(newTheme);
    const settings = await loadSettings();
    await saveSettings({ ...settings, theme: newTheme });
  }, [theme]);

  // ── Tutorial ─────────────────────────────────────────────────────
  const markTutorialShown = useCallback(async () => {
    setTutorialShown(true);
    const settings = await loadSettings();
    await saveSettings({ ...settings, tutorialShown: true });
  }, []);

  return (
    <AppContext.Provider value={{
      medicines, addMedicine, deleteMedicine, updateMedicineTimes,
      clearAllMedicines, setMedicines,
      taken, toggleTaken,
      theme, colors, toggleTheme,
      tutorialShown, markTutorialShown,
      loading,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}
