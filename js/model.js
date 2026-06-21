// =========================
// MODEL (DATA LAYER)
// =========================
import { createUserName } from "./helper.js";

const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  pin: 1111,
  interestRate: 1.2,
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: "Steven Thomas Williams",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: "Sarah Smith",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

export const state = {
  currentAccount: null,
  sortState: false,
  accounts: [account1, account2, account3, account4],
};

state.accounts.forEach((account) => {
  account.userName = createUserName(account.owner);
});

export const model = {
  calculateBalance(movements) {
    const sum = movements.reduce((acc, cur) => acc + cur, 0);
    return sum;
  },

  // calculateInOut(movements, filterFn) {
  //   return movements.filter(filterFn).reduce((acc, cur) => acc + cur, 0);
  // },

  calculateTotalDeposit(movements) {
    return movements
      .filter((mov) => mov >= 0)
      .reduce((acc, cur) => acc + cur, 0);
  },

  calculateTotalWithdraw(movements) {
    return movements
      .filter((mov) => mov < 0)
      .reduce((acc, cur) => acc + cur, 0);
  },

  canTransfer(sender, receiver, bal, amt) {
    return receiver && sender && receiver != sender && amt > 0 && bal >= amt;
  },

  transferMoney(sender, receiver, amt) {
    sender.movements.push(-amt);
    receiver.movements.push(amt);
  },
  isCurrentAccount(user, pin, currentAccount) {
    return (
      currentAccount.userName === user && pin && pin === currentAccount.pin
    );
  },
  sorting(movements) {
    return [...movements].sort((a, b) => a - b);
  },
  calculateInterest(deposit, rate) {
    return (deposit * rate) / 100;
  },
};
