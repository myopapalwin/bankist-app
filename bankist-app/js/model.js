// =========================
// MODEL (DATA LAYER)
// =========================
import { api } from "./api.js";
import { createUserName, normalizeName, normalizeApiData } from "./helper.js";

// export const state = {
//   currentAccount: null,
//   sortState: false,
//   accounts: [],
// };

export const model = {
  // Helper: normalize account
  // normalizeAccount(data) {
  //   return {
  //     id: data.id,
  //     owner: String(data.full_name).trim(),
  //     movements: (data.transactions ?? []).map((tc) =>
  //       tc.type === "deposit"
  //         ? { amount: Math.abs(tc.amount), type: "deposit" }
  //         : { amount: -Math.abs(tc.amount), type: "withdrawal" },
  //     ),
  //     username: data.username,
  //     interestRate: Number(data.interest_rate) || 0,
  //     pin: Number(data.security_pin),
  //   };
  // },

  // async createUserData(formData) {
  //   const rawData = {
  //     full_name: formData.ownerName,
  //     username: formData.username,
  //     transactions: [
  //       {
  //         amount: Number(formData.balance),
  //         type: "deposit",
  //       },
  //     ],
  //     interest_rate: Number(formData.rate),
  //     security_pin: Number(formData.password),
  //   };

  //   const newUser = await api.createUser(rawData); // Sending to api

  //   if (!newUser) {
  //     throw new Error("Cannot create user");
  //   }

  //   const normalizeUser = this.normalizeAccount(newUser);

  //   state.accounts.push(normalizeUser); // do not return this line >> this push method output array length
  //   return structuredClone(normalizeUser);
  // },

  // async loadUsers() {
  //   const rawData = await api.getUsers();
  //   const users = normalizeApiData(rawData);
  //   const normalizeUsers = users.map((user) => {
  //     return this.normalizeAccount(user);
  //   });

  //   state.accounts = normalizeUsers.map((account) => ({
  //     ...account,
  //   }));
  //   return state.accounts;
  // },

  // findAccountByUsername(userInputName) {
  //   return state.accounts.find((account) => {
  //     return normalizeName(account.username) === normalizeName(userInputName);
  //   });
  // },

  // findAccountByUserId(id) {
  //   const user = state.accounts.find((acc) => {
  //     return acc.id === id;
  //   });
  //   return user;
  // },

  // Summary Helper
  // calculateBalance(movements) {
  //   const sum = movements.reduce((acc, cur) => acc + cur.amount, 0);
  //   return sum;
  // },

  // calculateDeposit(movements) {
  //   return movements
  //     .filter((mov) => mov.type === "deposit")
  //     .reduce((acc, cur) => acc + cur.amount, 0);
  // },

  // calculateWithdraw(movements) {
  //   return movements
  //     .filter((mov) => mov.type === "withdrawal")
  //     .reduce((acc, cur) => acc + cur.amount, 0);
  // },

  // calculateInterest(movements, interestRate) {
  //   const deposit = movements
  //     .filter((mov) => mov.type === "deposit")
  //     .reduce((acc, cur) => acc + cur.amount, 0);

  //   return (deposit * interestRate) / 100;
  // },

  // getAccountSummary(account) {
  //   const { movements, interestRate } = account;
  //   return {
  //     balance: this.calculateBalance(movements),
  //     deposit: this.calculateDeposit(movements),
  //     withdraw: this.calculateWithdraw(movements),
  //     interest: this.calculateInterest(movements, interestRate),
  //   };
  // },

  // transferMoney(sender, receiver, amt) {
  //   sender.movements.push({ amount: -Math.abs(amt), type: "withdrawal" });
  //   receiver.movements.push({ amount: Math.abs(amt), type: "deposit" });
  // },

  // loanMoney(loanAmt, acc) {
  //   acc.movements.push({ amount: loanAmt, type: "deposit" });
  // },

  async deleteCurrentUser(id) {
    await api.deleteUser(id);

    state.accounts = state.accounts.filter((acc) => acc.id !== id);

    return state.accounts;
  },

  // async updateUserMovements(account) {
  //   const transactions = account.movements.map((movement) => ({
  //     amount: Math.abs(movement.amount),
  //     type: movement.type,
  //   }));

  //   const updatedUser = await api.updateUser(account.id, { transactions });
  //   return updatedUser;
  // },

  // sorting(movements) {
  //   return [...movements].sort((a, b) => a.amount - b.amount);
  // },
};
