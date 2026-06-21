// =========================
// HELPER
// =========================
export const normalize = (str) => str.trim().toLowerCase();

// Create user name
export const createUserName = (name) => {
  return name
    .toLowerCase()
    .split(" ")
    .map((n) => n[0])
    .join("");
};
