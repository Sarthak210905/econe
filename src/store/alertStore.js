import { create } from 'zustand';

const useAlertStore = create((set) => ({
  alerts: [],
  
  showAlert: (message, type = 'info', duration = 5000) => {
    const id = Date.now();
    set((state) => ({
      alerts: [...state.alerts, { id, message, type, duration }]
    }));
    
    setTimeout(() => {
      set((state) => ({
        alerts: state.alerts.filter((alert) => alert.id !== id)
      }));
    }, duration);
  },
  
  removeAlert: (id) => set((state) => ({
    alerts: state.alerts.filter((alert) => alert.id !== id)
  })),
  
  clearAlerts: () => set({ alerts: [] }),
}));

export default useAlertStore;
