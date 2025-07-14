import { create } from "zustand";
import { healthAPI } from "../services/api";

export const useHealthStore = create((set, get) => ({
  usages: {},
  currentDate: null,
  loading: false,
  error: null,

  loadHealthLog: async (date, token) => {
    set({ loading: true, error: null, currentDate: date });
    try {
      const response = await healthAPI.getHealthLog(date, token);
      let log = null;
      if (Array.isArray(response) && response.length > 0) {
        log = response[0];
      }
      const usages = {};
      ["water", "food", "training", "supplements"].forEach((key) => {
        usages[key] = log && log[key] !== undefined ? log[key] : 0;
      });
      set({ usages, loading: false });
    } catch (err) {
      set({ usages: {}, loading: false, error: err.message });
    }
  },

  updateUsage: async (key, value, date, token) => {
    set((state) => ({
      usages: { ...state.usages, [key]: value },
    }));
    try {
      await healthAPI.updateHealthLog({ date, [key]: value }, token);
    } catch (err) {
      // Optionally handle error/rollback
    }
  },
}));
