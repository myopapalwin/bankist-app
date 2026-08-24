import { api } from "../api.js";
import { createUserName, normalizeName, normalizeApiData } from "../helper.js";

export const state = {
  currentAccount: null,
  sortState: true,
  accounts: [],
};

export const accountModel = {
  // Helper: normalize account
  normalizeAccount(data) {
    return {
      id: data.id,
      owner: String(data.full_name).trim(),
      movements: (data.transactions ?? []).map((tc) =>
        tc.type === "deposit"
          ? { amount: Math.abs(tc.amount), type: "deposit" }
          : { amount: -Math.abs(tc.amount), type: "withdrawal" },
      ),
      username: data.username,
      interestRate: Number(data.interest_rate) || 0,
      password: Number(data.security_pin),
    };
  },

  async createUserData(formData) {
    const rawData = {
      full_name: formData.ownerName,
      username: formData.username,
      transactions: [
        {
          amount: Number(formData.balance),
          type: "deposit",
        },
      ],
      interest_rate: Number(formData.rate),
      security_pin: Number(formData.password),
    };

    const newUser = await api.createUser(rawData); // Sending to api

    if (!newUser) {
      throw new Error("Cannot create user");
    }

    const normalizeUser = this.normalizeAccount(newUser);

    state.accounts.push(normalizeUser); // do not return this line >> this push method output array length
    return structuredClone(normalizeUser);
  },

  async loadUsers() {
    const rawData = await api.getUsers();
    const users = normalizeApiData(rawData);
    const normalizeUsers = users.map((user) => {
      return this.normalizeAccount(user);
    });

    state.accounts = normalizeUsers.map((account) => ({
      ...account,
    }));
    return state.accounts;
  },

  findAccountByUsername(userInputName) {
    return state.accounts.find((account) => {
      return normalizeName(account.username) === normalizeName(userInputName);
    });
  },

  findAccountByUserId(id) {
    const user = state.accounts.find((acc) => {
      return acc.id === id;
    });
    return user;
  },

  async deleteCurrentUser(id) {
    await api.deleteUser(id);

    state.accounts.filter((acc) => acc.id !== id);

    return state.accounts;
  },
};
