import { auth } from "../helper.js";
import { accountModel, state } from "../models/accountModel.js";
import { movementModel } from "../models/movementModel.js";
import { validation } from "../validation.js";
import { dashboardView } from "../views/dashboardView.js";

const dashboardHelper = {
  updateUI(account) {
    dashboardView.renderMovements(account.movements);

    const summary = movementModel.getAccountSummary(account);
    dashboardView.renderSummary(summary);
  },
};

export const dashboardController = {
  async init() {
    await accountModel.loadUsers();
    const sessionUser = auth.loadUser();

    const latestAccount = accountModel.findAccountByUserId(sessionUser.id);
    state.currentAccount = latestAccount;

    dashboardView.showUser(latestAccount);

    dashboardView.renderMovements(latestAccount.movements);

    const summary = movementModel.getAccountSummary(latestAccount);

    dashboardView.renderSummary(summary);

    dashboardView.bindTransferEvent(this.transfer);

    dashboardView.bindLoanEvent(this.loan);

    dashboardView.bindCloseAccountEvent(this.closeAccount);

    dashboardView.bindSortingEvent(this.sortMovement);
  },

  async transfer(formData) {
    try {
      const { receiverName, amount } = formData;
      const sender = state.currentAccount;

      const balance = movementModel.calculateBalance(sender.movements);

      const validateData = {
        receiverName: receiverName,
        amount: amount,
        balance: balance,
      };

      dashboardView.clearErrors();

      const errors = validation.validateTransfer(validateData);
      console.log(errors);

      if (errors.length) {
        dashboardView.renderErrors(errors);
        return;
      }

      const receiver = accountModel.findAccountByUsername(receiverName);

      if (!receiver) {
        dashboardView.renderErrors([
          {
            field: "transfer",
            message: "Receiver account does not exist.",
          },
        ]);
        return;
      }

      if (receiver === sender) {
        dashboardView.renderErrors([
          {
            field: "transfer",
            message: "You can not transfer as your own.",
          },
        ]);
        return;
      }

      movementModel.transferMoney(sender, receiver, amount);

      await Promise.all([
        movementModel.updateMovementsByUserId(sender),
        movementModel.updateMovementsByUserId(receiver),
      ]);

      dashboardHelper.updateUI(sender);

      dashboardView.clearTransferInputs();
    } catch (error) {}
  },

  async loan(formData) {
    const loanData = {
      loanUser: state.currentAccount,
      loanAmount: formData.amount,
      deposit: movementModel.calculateTotalDeposit(
        state.currentAccount.movements,
      ),
    };

    const errors = validation.validateLoan(loanData);

    dashboardView.clearErrors();

    if (errors.length) {
      dashboardView.renderErrors(errors);
      return;
    }

    const { loanUser, loanAmount } = loanData;

    await movementModel.loanMoney(loanUser, loanAmount);

    await movementModel.updateMovementsByUserId(loanUser);

    dashboardHelper.updateUI(loanUser);

    dashboardView.clearLoanInputs();
  },

  async closeAccount(formData) {
    const { username, password } = formData;
    const currentAccount = state.currentAccount;

    console.log(username, password);
    console.log(currentAccount);
  },

  sortMovement() {
    const currentAccount = state.currentAccount;

    const sortedMovements = movementModel.sorting(currentAccount.movements);

    dashboardView.renderMovements(sortedMovements);
  },
};

dashboardController.init();
