import { state } from "./accountModel.js";
import { api } from "../api.js";

export const movementModel = {
  calculateTotalDeposit(movements) {
    return movements
      .filter((mov) => mov.type === "deposit")
      .reduce((acc, cur) => acc + cur.amount, 0);
  },

  caluclateTotalWithdrawl(movements) {
    return movements
      .filter((mov) => mov.type === "withdrawal")
      .reduce((acc, cur) => acc + cur.amount, 0);
  },

  calculateBalance(movements) {
    return movements.reduce((acc, cur) => acc + cur.amount, 0);
  },

  calculateInterest(movements, interestRate) {
    const balance = movements.reduce((acc, cur) => acc + cur.amount, 0);
    return (balance * interestRate) / 100;
  },

  getAccountSummary(account) {
    const { movements, interestRate } = account;
    return {
      totalDeposit: this.calculateTotalDeposit(movements),
      totalWithdrawal: this.caluclateTotalWithdrawl(movements),
      balance: this.calculateBalance(movements),
      interest: this.calculateInterest(movements, interestRate),
    };
  },

  sorting(movements) {
    state.sortState = !state.sortState;
    return state.sortState
      ? movements
      : [...movements].sort((a, b) => a.amount - b.amount);
  },

  transferMoney(sender, receiver, amount) {
    sender.movements.push({ amount: -Math.abs(amount), type: "withdrawal" });
    receiver.movements.push({ amount: Math.abs(amount), type: "deposit" });
  },

  loanMoney(loanUser, loanAmount) {
    loanUser.movements.push({ amount: Math.abs(loanAmount), type: "deposit" });
    return loanUser.movements;
  },

  async updateMovementsByUserId(account) {
    const { id, movements } = account;

    const transactions = movements.map((movement) => ({
      amount: movement.amount,
      type: movement.type,
    }));

    const updatedUser = await api.updateUser(id, { transactions });
    return updatedUser;
  },
};
