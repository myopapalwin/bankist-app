// =========================
// MODEL (DATA LAYER)
// =========================
import { createUserName, normalize } from "./helper.js";
import { view } from "./view.js";

export const state = {
  currentAccount: null,
  sortState: false,
  accounts: [],
};

export const model = {
  async fetchData() {
    try {
      const response = await fetch("http://localhost:3000/users");
      if (!response.ok) {
        throw new Error(`Http response: ${response.status}`);
      }
      return response.json();
    } catch (error) {
      console.error(`Network Error: ${error.message}`);
      return { result: [] };
    }
  },

  normalizeData(responseData) {
    return Array.isArray(responseData) ? responseData : [];
  },

  async getUserData() {
    const rawData = await model.fetchData();
    const users = model.normalizeData(rawData);
    const normalizeUsers = users.map((user) => {
      return {
        id: Number(user.id),
        owner: String(user.full_name).trim(),
        movements: user.transactions.map((tc) =>
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
  updateUI(account) {
    view.showMovements(account.movements);

    // calculating balance
    const balance = model.calculateBalance(account.movements);
    view.showCurrentBalance(balance);

    // calculating deposit
    const deposit = model.calculateTotalDeposit(account.movements);
    view.showTotalDeposit(deposit);

    // calculating withdraw
    const withdraw = model.calculateTotalWithdraw(account.movements);
    view.showTotalWithdraw(withdraw);

    // calculating interest
    const interest = model.calculateInterest(deposit, account.interestRate);
    view.showInterest(interest);
  },

  findAccount(userInputName) {
    const normalizeName = normalize(userInputName); // call

    // Find user name
    const findUserName = state.accounts.find((account) => {
      const userName = normalize(account.userName);
      return userName === normalizeName;
    });

    if (findUserName) return findUserName;

    // Find owner name
    const findOwnerName = state.accounts.find((account) => {
      const ownerName = normalize(account.owner);
      return ownerName.includes(normalizeName);
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
