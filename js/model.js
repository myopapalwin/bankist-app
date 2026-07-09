// =========================
// MODEL (DATA LAYER)
// =========================
import { api } from "./api.js";
import { createUserName, normalizeName, normalizeApiData } from "./helper.js";

export const state = {
  currentAccount: null,
  sortState: false,
  accounts: [],
};

export const model = {
  async createUserData(formData) {
    const rawData = {
      full_name: formData.ownername,
      transactions: [],
      interest_rate: Number(formData.rate),
      security_pin: Number(formData.password),
    };

    const newUser = await api.createUser(rawData); // Sending to api

    if (!newUser) {
      throw new Error("Cannot create user");
    }

    const normalizeUser = {
      owner: String(newUser.full_name).trim(),
      movements: (newUser.transactions ?? []).map((tc) =>
        tc.type === "deposit"
          ? { amount: Math.abs(tc.amount), type: "deposit" }
          : { amount: -Math.abs(tc.amount), type: "withdrawal" },
      ),
      userName: createUserName(newUser.full_name),
      interestRate: Number(newUser.interest_rate) || 0,
      pin: Number(newUser.security_pin),
    };

    state.accounts.push(normalizeUser); // do not return this line >> this push method output array length
    console.log(state.accounts);
    return normalizeUser;
  },

  async getUserData() {
    const rawData = await api.getUsers();
    const users = normalizeApiData(rawData);
    const normalizeUsers = users.map((user) => {
      return {
        owner: String(user.full_name).trim(),
        movements: (user.transactions ?? []).map((tc) =>
          tc.type === "deposit"
            ? { amount: Math.abs(tc.amount), type: "deposit" }
            : { amount: -Math.abs(tc.amount), type: "withdrawal" },
        ),
        userName: createUserName(user.full_name),
        interestRate: Number(user.interest_rate) || 0,
        pin: Number(user.security_pin),
      };
    });

    state.accounts = normalizeUsers.map((account) => ({
      ...account,
    }));
    return state.accounts;
  },

  findAccount(userInputName) {
    const nmName = normalizeName(userInputName); // call

    // Find user name
    const findUserName = state.accounts.find((account) => {
      const userName = normalizeName(account.userName);
      return userName === nmName;
    });

    if (findUserName) return findUserName;

    // Find owner name
    const findOwnerName = state.accounts.find((account) => {
      const ownerName = normalizeName(account.owner);
      return ownerName.includes(nmName);
    });

    return findOwnerName;
  },

  validPin(account, inputPin) {
    return account.pin === Number(inputPin);
  },

  calculateBalance(movements) {
    const sum = movements.reduce((acc, cur) => acc + cur.amount, 0);
    return sum;
  },

  // calculateInOut(movements, filterFn) {
  //   return movements.filter(filterFn).reduce((acc, cur) => acc + cur, 0);
  // },

  calculateTotalDeposit(movements) {
    return movements
      .filter((mov) => mov.type === "deposit")
      .reduce((acc, cur) => acc + cur.amount, 0);
  },

  calculateTotalWithdraw(movements) {
    return movements
      .filter((mov) => mov.type === "withdrawal")
      .reduce((acc, cur) => acc + cur.amount, 0);
  },

  transferMoney(sender, receiver, amt) {
    sender.movements.push({ amount: -Math.abs(amt), type: "withdrawal" });
    receiver.movements.push({ amount: Math.abs(amt), type: "deposit" });
  },

  loanMoney(deposit, loanAmt, acc) {
    // Bankist rule
    if (deposit >= loanAmt * 0.1) {
      acc.movements.push({ amount: loanAmt, type: "deposit" });
    }
  },

  isCurrentAccount(user, pin, currentAccount) {
    return (
      currentAccount.userName === user && pin && pin === currentAccount.pin
    );
  },

  sorting(movements) {
    return [...movements].sort((a, b) => a.amount - b.amount);
  },

  calculateInterest(deposit, rate) {
    return (deposit * rate) / 100;
  },
};
