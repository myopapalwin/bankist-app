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
