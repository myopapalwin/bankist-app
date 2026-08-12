// =========================
// HELPER
// =========================
export const normalizeName = (str) => str.trim().toLowerCase();

export const normalizeApiData = (responseData) => {
  return Array.isArray(responseData) ? responseData : [];
};

// Create user name
export const createUserName = (name) => {
  return name
    .toLowerCase()
    .split(" ")
    .map((n) => n[0])
    .join("");
};

// Auth
const STORAGE_KEY = "account";

export const auth = {
  saveUser(account) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ id: account.id }));
  },

  loadUser() {
    const currentUser = localStorage.getItem(STORAGE_KEY);
    return JSON.parse(currentUser);
  },

  removeUser() {
    localStorage.removeItem(STORAGE_KEY);
  },
};

// Delay
export const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
