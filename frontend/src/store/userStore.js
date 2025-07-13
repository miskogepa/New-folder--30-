import { create } from "zustand";

const getInitialToken = () => localStorage.getItem("token") || null;
const getInitialUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

export const useUserStore = create((set) => ({
  user: getInitialUser(),
  token: getInitialToken(),
  setUser: (user, token) => {
    set({ user, token });
    if (user) localStorage.setItem("user", JSON.stringify(user));
    if (token) localStorage.setItem("token", token);
  },
  logout: () => {
    set({ user: null, token: null });
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  },
}));
