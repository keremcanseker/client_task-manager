import { create } from "zustand";
import { api } from "./statics";

interface UserState {
  isLoggedIn: boolean;

  setLoggedIn: (loggedIn: boolean) => void;
  initializeFromBackend: () => Promise<void>;
}
export const useLoginStore = create<UserState>((set) => {
  return {
    isLoggedIn: false, // Default to false initially
    setLoggedIn: (loggedIn) => set({ isLoggedIn: loggedIn }),

    initializeFromBackend: async () => {
      try {
        const response = await fetch(`${api}/auth/verify`, {
          method: "POST",
          credentials: "include",
        });
        if (response.status === 200) {
          set({ isLoggedIn: true });
          return;
        }
        if (response.status === 401) {
          set({ isLoggedIn: false });
          return;
        }
      } catch (e) {
        console.error(e);
      }
    },
  };
});
